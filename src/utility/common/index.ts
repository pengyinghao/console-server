import { v4 as uuidv4 } from 'uuid';

/**
 * 获取查询数据 范围
 * @param pageNo 页码
 * @param pageSize 每页条数
 * @returns
 */
export const getPaginationRange = (dto: { pageNo: number; pageSize: number }): { skip: number; take: number } => {
  // 确保pageNo和pageSize是正整数，并且pageNo至少为1
  const safePageNo = Math.max(1, Math.floor(dto.pageNo));
  const safePageSize = Math.max(1, Math.floor(dto.pageSize));

  // 计算起始索引（基于0的索引）
  const startIndex = (safePageNo - 1) * safePageSize;

  // 返回索引范围
  return {
    skip: startIndex,
    take: dto.pageSize
  };
};

/**
 * 平面数据转换为树形结构
 * @param data  数据源
 * @param parentIdField 上级节点字段
 * @param idField  节点id字段
 * @returns
 */
export const dataToTree = <T extends { id: number; parentId?: number; children?: T[] }, K extends keyof T>(
  data: T[],
  parentIdField: K,
  idField: K = 'id' as K
): T[] => {
  if (!data || data.length === 0) return [];

  const map = new Map<T[K], T>();

  // 将所有节点放入 map 中
  data.forEach((item) => {
    map.set(item[idField], { ...item, children: [] });
  });

  const roots: T[] = [];
  const parentIds = new Set<T[K]>();

  // 遍历数据，构建树结构
  data.forEach((item) => {
    const parentId = item[parentIdField];
    const node = map.get(item[idField]);

    if (parentId !== undefined && parentId !== null) {
      const parent = map.get(parentId);
      if (parent) {
        parent.children.push(node);
        parentIds.add(parentId);
      }
    } else {
      roots.push(node);
    }
  });

  // 查找是否有数据的 parentId 在树中没有找到对应的父节点
  data.forEach((item) => {
    const parentId = item[parentIdField];
    if (parentId !== undefined && parentId !== null && !parentIds.has(parentId)) {
      const obj = map.get(item[idField]);
      if (obj) {
        roots.push(obj);
      }
    }
  });

  return roots;
};

/** 生成uuid */
export const generateUUID = () => {
  const uuid = uuidv4();
  return uuid.replace(/-/g, '');
};

export * from './api.exception';
export * from './data.result';
export * from './rule.helper';
export * from './api.paging.response';
export * from './dto/paging.dto';
export * from './dto/update-status.dto';
