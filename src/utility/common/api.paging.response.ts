/** 统一分页响应的数据结构 */
export interface PagingResponse<T = any> {
  /** 数据体 */
  data: T[];
  /** 总条数 */
  total: number;
}
