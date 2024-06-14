export {};
declare global {
  namespace Express {
    export interface Request {
      /** 用户信息 */
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
      };
    }
  }
}
