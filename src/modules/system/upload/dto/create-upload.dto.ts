export class CreateUploadDto {
  /** 文件大小 */
  size: number;
  /** 原文件名 */
  originalname: string;
  /** 文件名 */
  fileName: string;
  /** 文件地址 */
  url: string;
  /** 拓展名 */
  ext: string;
}
