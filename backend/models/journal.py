from extensions import db
from datetime import datetime

class Journal(db.Model):
    __tablename__ = 'journal'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='日记ID')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, comment='用户ID')
    score = db.Column(db.Integer, nullable=False, comment='情绪分数(1-10)')
    emotion = db.Column(db.String(20), nullable=False, comment='情绪标签')
    trigger = db.Column(db.String(200), comment='触发因素')
    content = db.Column(db.Text, comment='感想内容')
    sleep = db.Column(db.String(20), comment='睡眠情况')
    pressure = db.Column(db.String(20), comment='压力程度')
    created_at = db.Column(db.DateTime, default=datetime.now, comment='创建时间')
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, comment='更新时间')

    user = db.relationship('User', backref=db.backref('journals', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user.username if self.user else '',
            'score': self.score,
            'emotion': self.emotion,
            'trigger': self.trigger,
            'content': self.content,
            'sleep': self.sleep,
            'pressure': self.pressure,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

"""
Navicat 17 建表命令：
CREATE TABLE `journal` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '日记ID',
    `user_id` INT NOT NULL COMMENT '用户ID',
    `score` INT NOT NULL COMMENT '情绪分数(1-10)',
    `emotion` VARCHAR(20) NOT NULL COMMENT '情绪标签',
    `trigger` VARCHAR(200) DEFAULT NULL COMMENT '触发因素',
    `content` TEXT DEFAULT NULL COMMENT '感想内容',
    `sleep` VARCHAR(20) DEFAULT NULL COMMENT '睡眠情况',
    `pressure` VARCHAR(20) DEFAULT NULL COMMENT '压力程度',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `journal_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='情绪日记表';
"""
