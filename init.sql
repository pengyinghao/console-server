/*
 Navicat Premium Data Transfer

 Source Server         : mysql-localhost
 Source Server Type    : MySQL
 Source Server Version : 80033 (8.0.33)
 Source Host           : localhost:3306
 Source Schema         : manage

 Target Server Type    : MySQL
 Target Server Version : 80033 (8.0.33)
 File Encoding         : 65001

 Date: 14/06/2024 15:22:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dict
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '字典名称',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(0:禁用,1:启用 )',
  `value` varchar(20) NOT NULL COMMENT '字典值',
  `sort` int NOT NULL COMMENT '显示顺序',
  `type_id` int NOT NULL COMMENT '字典类型id',
  `remark` varchar(100) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典信息';

-- ----------------------------
-- Records of sys_dict
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict` (`id`, `name`, `status`, `value`, `sort`, `type_id`, `remark`) VALUES (1, '启用', 1, 'enable', 1, 1, NULL);
INSERT INTO `sys_dict` (`id`, `name`, `status`, `value`, `sort`, `type_id`, `remark`) VALUES (2, '禁用', 1, 'disabled', 1, 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `no` varchar(20) NOT NULL COMMENT '编号',
  `name` varchar(20) NOT NULL COMMENT '类型名称',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(0:禁用,1:启用 )',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字典类型';

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
BEGIN;
INSERT INTO `sys_dict_type` (`id`, `no`, `name`, `status`, `remark`) VALUES (1, 'status', '状态', 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_job
-- ----------------------------
DROP TABLE IF EXISTS `sys_job`;
CREATE TABLE `sys_job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '任务名称',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '状态(0:停止,1:运行中 )',
  `service` varchar(100) NOT NULL COMMENT '调用服务',
  `immediate` tinyint NOT NULL DEFAULT '0' COMMENT '是否立即执行（0:否，1:是）',
  `cron` varchar(50) NOT NULL COMMENT '任务表达式',
  `params` text COMMENT '定时表达式执行参数',
  `remark` varchar(200) DEFAULT NULL COMMENT '任务描述',
  `start_time` timestamp NULL DEFAULT NULL COMMENT '任务开始时间',
  `end_time` timestamp NULL DEFAULT NULL COMMENT '任务结束时间',
  `last_exec_time` timestamp NULL DEFAULT NULL COMMENT '最后执行时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='定时任务';

-- ----------------------------
-- Records of sys_job
-- ----------------------------
BEGIN;
INSERT INTO `sys_job` (`id`, `name`, `status`, `service`, `immediate`, `cron`, `params`, `remark`, `start_time`, `end_time`, `last_exec_time`) VALUES (1, '测试', 1, 'TestJob.test', 0, '0 0/10 * * * ? ', NULL, NULL, NULL, NULL, '2024-06-14 15:20:00');
INSERT INTO `sys_job` (`id`, `name`, `status`, `service`, `immediate`, `cron`, `params`, `remark`, `start_time`, `end_time`, `last_exec_time`) VALUES (2, '访问百度', 0, 'baiduJob.handle', 0, '0 0/5 * * * ? ', '{\n    \"url\": \"https://www.baidu.com\",\n    \"method\": \"get\"\n}', NULL, NULL, NULL, '2024-06-14 11:00:00');
INSERT INTO `sys_job` (`id`, `name`, `status`, `service`, `immediate`, `cron`, `params`, `remark`, `start_time`, `end_time`, `last_exec_time`) VALUES (3, '测试2', 1, 'Test2Job.test', 0, '0 0/2 * * * ? ', NULL, NULL, NULL, NULL, '2024-06-14 15:22:00');
COMMIT;

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(0:禁用,1:启用 )',
  `name` varchar(20) NOT NULL COMMENT '菜单名称',
  `icon` varchar(50) DEFAULT NULL COMMENT '菜单图标',
  `type` tinyint NOT NULL DEFAULT '1' COMMENT '菜单类型(0：目录，1：菜单，2：按钮)',
  `code` varchar(50) DEFAULT NULL COMMENT '功能代码',
  `open_type` tinyint NOT NULL DEFAULT '0' COMMENT '打开方式 (0：路由，1：内嵌，2：链接)',
  `sort` int NOT NULL COMMENT '显示顺序',
  `parent_id` int DEFAULT '0' COMMENT '上级菜单id',
  `component` varchar(100) DEFAULT NULL COMMENT '组件地址',
  `url` varchar(100) DEFAULT NULL COMMENT '页面地址',
  `display` tinyint NOT NULL COMMENT '显示状态(0：显示，1：隐藏)',
  `params` varchar(200) DEFAULT NULL COMMENT '路由参数',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单信息';

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (1, 1, '仪表盘', 'icon-park-outline:dashboard', 0, '', 0, 1, NULL, '', NULL, 0, NULL, '2024-05-17 16:38:06.767098', '2024-06-13 07:29:45.602681', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (2, 1, '分析页', NULL, 1, '', 0, 1, 1, 'dashboard/analysis/analysis', '/dashboard/analysis', 0, NULL, '2024-05-17 16:38:32.067642', '2024-05-17 16:38:32.067642', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (3, 1, '工作台', NULL, 1, '', 0, 1, 1, 'dashboard/workbench/workbench', '/dashboard/workbench', 0, NULL, '2024-05-17 16:38:56.948231', '2024-05-17 16:38:56.948231', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (4, 1, '系统设计', NULL, 1, '', 0, 2, NULL, '', NULL, 0, NULL, '2024-05-17 16:39:18.520247', '2024-05-23 09:54:44.000000', '2024-05-23 09:54:44.000000');
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (5, 1, '系统管理', 'icon-park-outline:system', 0, '', 0, 3, NULL, '', NULL, 0, NULL, '2024-05-17 16:39:41.587614', '2024-06-13 07:30:10.948997', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (6, 1, '用户管理', NULL, 1, '', 0, 1, 5, 'system/userInfo/user/user', '/system/user', 0, NULL, '2024-05-17 16:40:06.881755', '2024-05-24 08:30:46.158014', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (7, 1, '角色管理', NULL, 1, '', 0, 2, 5, 'system/role/role', '/system/role', 0, NULL, '2024-05-17 16:40:50.247010', '2024-05-25 09:06:31.730883', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (8, 1, '字典管理', NULL, 1, '', 0, 5, 5, 'system/dictionary/dictionary', '/system/dictionary', 0, NULL, '2024-05-17 16:44:47.513441', '2024-05-24 08:30:50.093249', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (9, 1, '菜单管理', NULL, 1, '', 0, 3, 5, 'system/menu/menu', '/system/menu', 0, NULL, '2024-05-17 16:45:35.692249', '2024-05-25 09:06:33.237383', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (11, 1, '页面按钮管理', NULL, 1, '', 0, 6, 5, 'system/pageButton/pageButton', '/system/pageButton', 0, NULL, '2024-05-17 16:50:21.413775', '2024-05-24 08:30:57.828947', '2024-05-24 08:21:55.000000');
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (12, 1, '参数管理', NULL, 1, '', 0, 7, 5, 'system/param/param', '/system/param', 0, NULL, '2024-05-18 09:18:11.062930', '2024-05-24 08:31:01.073054', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (13, 1, '外链', 'icon-park-outline:link-cloud', 1, '', 0, 4, NULL, '', 'https://www.baidu.com', 0, '1231232', '2024-05-18 12:35:27.466372', '2024-06-06 07:14:48.782623', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (14, 1, '文件管理', NULL, 1, '', 0, 8, 5, 'system/upload/upload', '/system/upload', 0, NULL, '2024-05-22 06:13:45.192851', '2024-05-24 08:31:02.606634', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (16, 1, '新增', NULL, 2, 'system_user_add', 0, 1, 6, '', NULL, 0, NULL, '2024-05-23 08:21:21.613498', '2024-06-13 07:29:27.243739', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (17, 1, '修改', NULL, 2, 'system_user_edit', 0, 2, 6, '', NULL, 0, NULL, '2024-05-23 08:21:52.829040', '2024-06-13 07:29:28.557274', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (18, 1, '删除', NULL, 2, 'system_user_delete', 0, 3, 6, '', NULL, 0, NULL, '2024-05-23 08:22:36.653128', '2024-06-13 07:29:29.974378', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (19, 1, '启用', NULL, 2, 'system_user_enable', 0, 4, 6, '', NULL, 0, NULL, '2024-05-23 08:22:52.472665', '2024-06-13 07:29:31.278979', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (20, 1, '禁用', NULL, 2, 'system_user_disabled', 0, 5, 6, '', NULL, 0, NULL, '2024-05-23 08:23:06.828931', '2024-06-13 07:29:32.977466', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (21, 1, '操作日志', NULL, 1, NULL, 0, 1, 24, 'system/log/actionLog/actionLog', '/system/log/action', 0, NULL, '2024-05-29 02:46:38.708595', '2024-06-04 07:45:31.985138', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (22, 1, '定时任务', NULL, 1, NULL, 0, 2, 25, 'monitor/job/job', '/monitor/job', 0, NULL, '2024-06-03 06:21:13.242523', '2024-06-13 06:40:43.548521', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (23, 1, '登录日志', NULL, 1, NULL, 0, 2, 24, 'system/log/loginLog/loginLog', '/system/log/login', 0, NULL, '2024-06-03 08:43:22.264235', '2024-06-04 07:45:20.719103', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (24, 1, '日志管理', NULL, 0, NULL, 0, 10, 5, '', '', 0, NULL, '2024-06-04 07:29:54.811301', '2024-06-13 07:30:23.621333', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (25, 1, '监控管理', 'icon-park-outline:trend', 0, NULL, 0, 2, NULL, '', NULL, 0, NULL, '2024-06-04 09:29:12.580864', '2024-06-13 07:29:57.589823', NULL);
INSERT INTO `sys_menu` (`id`, `status`, `name`, `icon`, `type`, `code`, `open_type`, `sort`, `parent_id`, `component`, `url`, `display`, `params`, `create_time`, `update_time`, `delete_time`) VALUES (26, 1, '在线用户', NULL, 1, NULL, 0, 1, 25, 'monitor/online/online', '/monitor/online', 0, NULL, '2024-06-04 09:29:47.214958', '2024-06-04 09:29:47.214958', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_param
-- ----------------------------
DROP TABLE IF EXISTS `sys_param`;
CREATE TABLE `sys_param` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '参数名称',
  `label` varchar(50) NOT NULL COMMENT '参数键',
  `value` varchar(50) NOT NULL COMMENT '参数值',
  `sys` tinyint NOT NULL DEFAULT '1' COMMENT '是否系统内置(0：是,1：否)',
  `remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='参数设置';

-- ----------------------------
-- Records of sys_param
-- ----------------------------
BEGIN;
INSERT INTO `sys_param` (`id`, `name`, `label`, `value`, `sys`, `remark`, `create_time`, `update_time`, `delete_time`) VALUES (4, '文件上传大小', 'file.size', '10485760', 1, '文件大小（单位：byte）', '2024-05-21 10:03:33.891176', '2024-05-24 08:21:23.000000', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '角色名称',
  `code` varchar(50) NOT NULL COMMENT '角色标识',
  `defaultNavigate` varchar(100) DEFAULT NULL COMMENT '默认导航地址',
  `type` enum('system','custom') NOT NULL DEFAULT 'custom' COMMENT '类型',
  `remark` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色信息';

-- ----------------------------
-- Records of sys_role
-- ----------------------------
BEGIN;
INSERT INTO `sys_role` (`id`, `name`, `code`, `defaultNavigate`, `type`, `remark`, `create_time`, `update_time`) VALUES (1, '超级管理员', 'ADMIN', '/dashboard/analysis', 'system', '系统内置角色，不可删除', '2024-05-22 10:02:09.540686', '2024-06-14 07:09:38.000000');
INSERT INTO `sys_role` (`id`, `name`, `code`, `defaultNavigate`, `type`, `remark`, `create_time`, `update_time`) VALUES (2, '普通用户', 'OPERATION_USER', '/dashboard/analysis', 'system', '系统内置角色，不可删除', '2024-05-22 10:02:50.000000', '2024-06-14 07:10:02.000000');
COMMIT;

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL DEFAULT '0' COMMENT '角色id',
  `menu_id` int NOT NULL DEFAULT '0' COMMENT '菜单id',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色菜单授权';

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (35, 1, 1, '2024-06-14 07:09:38.938712');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (36, 1, 2, '2024-06-14 07:09:38.945718');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (37, 1, 3, '2024-06-14 07:09:38.956028');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (38, 1, 25, '2024-06-14 07:09:38.964892');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (39, 1, 26, '2024-06-14 07:09:38.972650');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (40, 1, 22, '2024-06-14 07:09:38.980163');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (41, 1, 5, '2024-06-14 07:09:38.990584');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (42, 1, 6, '2024-06-14 07:09:38.999853');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (43, 1, 16, '2024-06-14 07:09:39.008409');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (44, 1, 17, '2024-06-14 07:09:39.014127');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (45, 1, 18, '2024-06-14 07:09:39.021107');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (46, 1, 19, '2024-06-14 07:09:39.027250');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (47, 1, 20, '2024-06-14 07:09:39.034923');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (48, 1, 7, '2024-06-14 07:09:39.042074');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (49, 1, 9, '2024-06-14 07:09:39.049394');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (50, 1, 8, '2024-06-14 07:09:39.056232');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (51, 1, 12, '2024-06-14 07:09:39.062200');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (52, 1, 14, '2024-06-14 07:09:39.069296');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (53, 1, 24, '2024-06-14 07:09:39.077931');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (54, 1, 21, '2024-06-14 07:09:39.087580');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (55, 1, 23, '2024-06-14 07:09:39.094809');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (56, 2, 1, '2024-06-14 07:09:53.175294');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (57, 2, 2, '2024-06-14 07:09:53.183597');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (58, 2, 3, '2024-06-14 07:09:53.192337');
INSERT INTO `sys_role_menu` (`id`, `role_id`, `menu_id`, `create_time`) VALUES (59, 2, 13, '2024-06-14 07:09:53.198562');
COMMIT;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态(0:禁用,1:启用 )',
  `no` varchar(20) NOT NULL COMMENT '编号',
  `name` varchar(20) NOT NULL COMMENT '姓名',
  `account` varchar(20) NOT NULL COMMENT '账号',
  `password` varchar(300) NOT NULL COMMENT '密码',
  `phone` varchar(11) DEFAULT NULL COMMENT '手机号码',
  `freeze` tinyint NOT NULL DEFAULT '0' COMMENT '是否冻结（0：未冻结,1：冻结）',
  `sys_user` tinyint NOT NULL DEFAULT '1' COMMENT '是否系统用户（0：是,1：否）',
  `email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `address` varchar(200) DEFAULT NULL COMMENT '地址',
  `avatar` varchar(200) DEFAULT NULL COMMENT '头像',
  `roleId` int NOT NULL DEFAULT '0' COMMENT '角色id',
  `roleName` varchar(20) NOT NULL COMMENT '角色名称',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `update_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `delete_time` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息';

-- ----------------------------
-- Records of sys_user
-- ----------------------------
BEGIN;
INSERT INTO `sys_user` (`id`, `status`, `no`, `name`, `account`, `password`, `phone`, `freeze`, `sys_user`, `email`, `address`, `avatar`, `roleId`, `roleName`, `create_time`, `update_time`, `delete_time`) VALUES (1, 1, 'sys', '超级管理员', 'admin', '9deccac5b9b136aa167e32f94223d51928bb5bd6b191502445b2c002d628b1cf0b31a754ac2d3dcfc0f20f70a4914e40299ad9d31adc5d42326872a1d91250c970165be607faccedb8da4a38568786296fa6ca1b30e3bf0f3bdff41c21afe8c4575e310759c2', '13212341253', 0, 1, '729220650@qq.com', '1235', '', 1, '超级管理员', '2024-05-13 11:37:05.000000', '2024-06-14 06:49:13.667536', NULL);
INSERT INTO `sys_user` (`id`, `status`, `no`, `name`, `account`, `password`, `phone`, `freeze`, `sys_user`, `email`, `address`, `avatar`, `roleId`, `roleName`, `create_time`, `update_time`, `delete_time`) VALUES (23, 1, 'cszh', '测试账号', 'cszh1', 'ef190f451818adfa7ab29593419d2f2e958f2d7dd6585bdd2731a8b0e9f9f49b52aa442399742a25a7f4d8f1cf6112a2712414d6342c2fbf0996a24fbafa2f69bc5087c65aa47af5f3217e43f5a8164f2cc63f3eca3f97724b65f8ded9f67512fb4384cb8ad7ec65c5fa', '13212341254', 0, 1, NULL, NULL, NULL, 2, '普通用户', '2024-05-24 07:59:51.398387', '2024-06-14 06:50:08.542271', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
