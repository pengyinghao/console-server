import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() public readonly redis: Redis) {}

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
