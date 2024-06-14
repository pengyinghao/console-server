import { sm2 } from 'sm-crypto';

const publicKey = '0454b5e66a44c10149858ae4601dc53bd8deb70d48e70d7f60f7c951df356283208d8240324435a14ad1655425f0f8a06b351ccf4f23b8140f85924fb4289e09d4';
const privateKey = '591f92e2dba2dd6f5897be5b9f135cfc453f2168ddb05c4810ea2a6c3941df84';

/** 加密 */
export const encrypt = (data: string | object) => {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data);
    } catch (error) {
      throw new Error(`encrypt error：${error}`);
    }
  }
  const res = sm2.doEncrypt(data, publicKey);
  return res;
};

/** 解密 */
export const decrypt = (str: string) => {
  const res = sm2.doDecrypt(str, privateKey);
  return res;
};
