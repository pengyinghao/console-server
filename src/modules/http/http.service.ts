import { Inject, Injectable } from '@nestjs/common';
import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as iconv from 'iconv-lite';
import { RedisService } from '../redis/redis.service';
import { Cache } from 'src/utility/enums';
import * as ms from 'ms';
import { City } from './entities/City';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  @Inject(AxiosHttpService)
  private httpService: AxiosHttpService;

  @Inject()
  configService: ConfigService;

  @Inject()
  redisService: RedisService;

  axiosRef(url: string, config?: AxiosRequestConfig<any>) {
    return this.httpService.axiosRef(url, config);
  }
  request<T = any>(config: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.request<T>(config).subscribe((res) => {
        resolve(res);
      });
    });
  }
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.get<T>(url, config).subscribe((res) => {
        resolve(res);
      });
    });
  }
  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.delete<T>(url, config).subscribe((res) => {
        resolve(res);
      });
    });
  }
  head<T = any>(url: string, config?: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.head<T>(url, config).subscribe((res) => {
        resolve(res);
      });
    });
  }
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.post<T>(url, data, config).subscribe((res) => {
        resolve(res);
      });
    });
  }
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.put<T>(url, data, config).subscribe((res) => {
        resolve(res);
      });
    });
  }
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return new Promise<AxiosResponse<T>>((resolve) => {
      this.httpService.patch<T>(url, data, config).subscribe((res) => {
        resolve(res);
      });
    });
  }

  /**
   * ip转地址
   * @param ip
   * @returns
   */
  async ipToCity(ip: string): Promise<City> {
    if (ip.includes('127.0.0.1')) {
      ip = ip.replace(/^.*:/, '');
    }
    const redisName = `${Cache.IP_TO_CITY}${ip}`;
    const info = await this.redisService.get(redisName);
    if (info) return info;

    const response = await this.httpService.axiosRef(this.configService.get('ipToCityUrl'), {
      params: {
        ip: ip,
        json: true
      },
      method: 'get',
      responseType: 'arraybuffer',
      transformResponse: [
        function (data) {
          const str = iconv.decode(data, 'gbk');
          return JSON.parse(str);
        }
      ]
    });

    // 缓存半小时
    this.redisService.set(redisName, response.data, ms('30min'));
    return response.data;
  }
}
