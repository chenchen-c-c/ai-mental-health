from extensions import db
from datetime import datetime

class ChatSession(db.Model):
    __tablename__ = 'chat_session'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='会话ID')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, comment='用户ID')
    emotion = db.Column(db.String(20), default='neutral', comment='情绪标签')
    preview = db.Column(db.String(200), comment='消息预览')
    message_count = db.Column(db.Integer, default=0, comment='消息数量')
    created_at = db.Column(db.DateTime, default=datetime.now, comment='创建时间')
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, comment='更新时间')

    user = db.relationship('User', backref=db.backref('chat_sessions', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.username if self.user else '',
            'emotion': self.emotion,
            'preview': self.preview,
            'message_count': self.message_count,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

class ChatMessage(db.Model):
    __tablename__ = 'chat_message'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='消息ID')
    session_id = db.Column(db.Integer, db.ForeignKey('chat_session.id'), nullable=False, comment='会话ID')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, comment='用户ID')
    type = db.Column(db.String(10), nullable=False, comment='消息类型(user/ai)')
    content = db.Column(db.Text, nullable=False, comment='消息内容')
    timestamp = db.Column(db.DateTime, default=datetime.now, comment='发送时间')

    session = db.relationship('ChatSession', backref=db.backref('messages', lazy=True))
    user = db.relationship('User', backref=db.backref('chat_messages', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'user_id': self.user_id,
            'user_name': self.user.username if self.user else '',
            'type': self.type,
            'content': self.content,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        }

"""
Navicat 17 建表命令：

-- 聊天会话表
CREATE TABLE `chat_session` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '会话ID',
    `user_id` INT NOT NULL COMMENT '用户ID',
    `emotion` VARCHAR(20) DEFAULT 'neutral' COMMENT '情绪标签',
    `preview` VARCHAR(200) DEFAULT NULL COMMENT '消息预览',
    `message_count` INT DEFAULT 0 COMMENT '消息数量',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `chat_session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI聊天会话表';

-- 聊天消息表
CREATE TABLE `chat_message` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '消息ID',
    `session_id` INT NOT NULL COMMENT '会话ID',
    `user_id` INT NOT NULL COMMENT '用户ID',
    `type` VARCHAR(10) NOT NULL COMMENT '消息类型(user/ai)',
    `content` TEXT NOT NULL COMMENT '消息内容',
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
    PRIMARY KEY (`id`),
    KEY `session_id` (`session_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `chat_message_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_session` (`id`) ON DELETE CASCADE,
    CONSTRAINT `chat_message_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI聊天消息表';
"""
