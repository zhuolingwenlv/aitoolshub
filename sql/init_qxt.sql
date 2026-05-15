-- ============================================================
-- 启信通 MySQL 建表脚本（云托管 MySQL 5.7 + utf8 字符集）
-- 执行方式：云托管控制台 → 数据库 → SQL操作 → 粘贴执行
-- ============================================================

-- ① 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `openid`      VARCHAR(128) NOT NULL UNIQUE COMMENT '微信 openid',
  `unionid`     VARCHAR(128) DEFAULT NULL COMMENT '微信 unionid',
  `phone`       VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
  `nickname`    VARCHAR(64)  DEFAULT '' COMMENT '昵称',
  `avatar`      VARCHAR(512) DEFAULT '' COMMENT '头像URL',
  `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status`      TINYINT      DEFAULT 1 COMMENT '1=正常 0=禁用',
  INDEX `idx_openid`    (`openid`),
  INDEX `idx_phone`     (`phone`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息表';

-- ② 梳理档案表
CREATE TABLE IF NOT EXISTS `drafts` (
  `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT 'users.id',
  `report_id`       VARCHAR(64)  NOT NULL UNIQUE COMMENT '报告唯一ID',
  `scene`           VARCHAR(32)  NOT NULL COMMENT '场景编号 01~16',
  `sub_type`        VARCHAR(64)  DEFAULT '' COMMENT '子类型',
  `amount`          VARCHAR(64)  DEFAULT '' COMMENT '涉及金额',
  `focus`           TEXT         DEFAULT NULL COMMENT '争议焦点(JSON数组)',
  `status`          VARCHAR(32)  NOT NULL COMMENT '当前状态',
  `evidence`        TEXT         DEFAULT NULL COMMENT '已上传证据(JSON数组)',
  `member_level`    TINYINT      DEFAULT 0 COMMENT '用户会员等级 0~3',
  `report_data`     LONGTEXT      DEFAULT NULL COMMENT '完整报告内容(JSON)',
  `report_locked`   TINYINT      DEFAULT 1 COMMENT '0=已解锁 1=锁定',
  `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `expires_at`      DATETIME     DEFAULT NULL COMMENT '报告过期时间',
  INDEX `idx_user_id`     (`user_id`),
  INDEX `idx_report_id`   (`report_id`),
  INDEX `idx_scene`       (`scene`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='梳理档案表';

-- ③ 订单表
CREATE TABLE IF NOT EXISTS `orders` (
  `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id`        VARCHAR(64)  NOT NULL UNIQUE COMMENT '内部订单号',
  `user_id`         BIGINT UNSIGNED NOT NULL COMMENT 'users.id',
  `plan_id`         VARCHAR(32)  NOT NULL COMMENT '会员计划ID',
  `plan_name`       VARCHAR(64)  NOT NULL COMMENT '计划名称',
  `plan_level`      TINYINT      NOT NULL COMMENT '会员等级 0~3',
  `amount`          INT UNSIGNED NOT NULL COMMENT '金额(分)',
  `pay_status`      VARCHAR(16)  DEFAULT 'pending' COMMENT 'pending/success/failed/closed',
  `pay_channel`     VARCHAR(16)  DEFAULT 'wechat' COMMENT 'wechat/alipay',
  `wechat_trade_no` VARCHAR(64)  DEFAULT '' COMMENT '微信支付交易单号',
  `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `pay_time`        DATETIME     DEFAULT NULL COMMENT '支付完成时间',
  `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id`      (`user_id`),
  INDEX `idx_order_id`     (`order_id`),
  INDEX `idx_wechat_trade` (`wechat_trade_no`),
  INDEX `idx_pay_status`   (`pay_status`),
  INDEX `idx_create_time`  (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='订单记录表';

-- ④ 会员状态表
CREATE TABLE IF NOT EXISTS `members` (
  `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`         BIGINT UNSIGNED NOT NULL UNIQUE COMMENT 'users.id',
  `level`           TINYINT      NOT NULL DEFAULT 0 COMMENT '会员等级 0=无 1=季VIP 2=半年SVIP 3=黑金年卡',
  `plan_id`         VARCHAR(32)  DEFAULT '' COMMENT '当前计划ID',
  `plan_name`       VARCHAR(64)  DEFAULT '' COMMENT '当前计划名称',
  `total_times`     INT UNSIGNED DEFAULT 0 COMMENT '累计诊断次数',
  `remain_times`    INT UNSIGNED DEFAULT 0 COMMENT '剩余诊断次数',
  `expire_time`     DATETIME     DEFAULT NULL COMMENT '会员到期时间',
  `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id`    (`user_id`),
  INDEX `idx_level`      (`level`),
  INDEX `idx_expire_time` (`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='会员状态表';
