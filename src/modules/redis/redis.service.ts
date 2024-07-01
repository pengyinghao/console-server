import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  public readonly redis: Redis;
  private readonly proxy: Redis;

  constructor(@InjectRedis() redis: Redis) {
    this.redis = redis;
    this.proxy = new Proxy(this, {
      get: (target, prop, receiver) => {
        // 如果RedisService有这个方法，优先使用
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }
        // 否则尝试从 this.redis 上获取
        if (prop in this.redis) {
          const redisMethod = Reflect.get(this.redis, prop);
          if (typeof redisMethod === 'function') {
            return redisMethod.bind(this.redis);
          }
          return redisMethod;
        }
        return undefined;
      }
    }) as any;
  }

  get instance() {
    return this.proxy;
  }

  /**
   * 设置锁
   * @param key 存储key值
   * @param seconds 可选，过期时间，单位秒，默认30分钟
   */
  lock(key: string, seconds: number | string = 30 * 60) {
    return this.redis.multi().setnx(key, new Date().getTime()).expire(key, seconds).exec();
  }

  /** 取消锁 */
  unlock(key: string) {
    return this.delete(key);
  }

  /**
   * 通过key 存储集合
   * @param key 存储key值
   * @param val 存储key对应的值
   */
  sadd(key: string, val: string) {
    return this.redis.sadd(key, val);
  }

  /**
   * 移出集合中 存储的 某项值
   * @param key  存储key值
   * @param val  需要移出的 val值
   */
  srem(key: string, val: any) {
    return this.redis.srem(key, val);
  }

  /** 获取集合中的所有成员 */
  smembers(key: string) {
    return this.redis.smembers(key);
  }

  /**
   *
   * @param key 存储key值
   * @param val 存储key对应的值
   * @param milliseconds 可选，过期时间，单位毫秒
   */
  set(key: string, val: any, milliseconds?: number) {
    const data = JSON.stringify(val);
    if (!milliseconds) return this.redis.set(key, data);
    return this.redis.set(key, data, 'PX', milliseconds);
  }

  /** 通过key获取数据 */
  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (value) return JSON.parse(value) as T;
    return null;
  }

  /** 通过key删除数据 */
  delete(key: string) {
    return this.redis.del(key);
  }

  /** 获取所有以给定前缀开头的键 */
  async getKeysByPrefix(prefix: string): Promise<string[]> {
    if (!prefix || prefix === '*') return null;
    const keys = await this.redis.keys(`${prefix}*`); // 使用 * 作为通配符
    return keys;
  }

  /** 通过存储key获取数据集合 */
  async getInfos<T = any>(key?: string): Promise<T[] | null> {
    try {
      const keys = await this.getKeysByPrefix(key);
      if (keys.length === 0) return [];
      const values = await this.redis.mget(...keys);
      const parsedValues = values.map((item: string) => JSON.parse(item));
      return parsedValues as T[];
    } catch (e) {
      return [];
    }
  }
}
