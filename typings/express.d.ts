export {};

declare module 'express' {
  interface Request {
    user: {
      /** 用户id */
      id: number;
      /** 用户名 */
      name: string;
      /** 电话号码 */
      phone: string;
      /** 角色id */
      roleId: number;
      /** 角色名称 */
      roleName: string;
      /** 唯一标识 */
      uuid: string;
    };
  }
}
