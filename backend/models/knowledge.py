from extensions import db
from datetime import datetime

class KnowledgeCategory(db.Model):
    __tablename__ = 'knowledge_category'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='分类ID')
    name = db.Column(db.String(50), unique=True, nullable=False, comment='分类名称')
    description = db.Column(db.String(200), comment='分类描述')
    color = db.Column(db.String(20), comment='分类颜色')
    created_at = db.Column(db.DateTime, default=datetime.now, comment='创建时间')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'color': self.color,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

class KnowledgeArticle(db.Model):
    __tablename__ = 'knowledge_article'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, comment='文章ID')
    title = db.Column(db.String(200), nullable=False, comment='文章标题')
    category_id = db.Column(db.Integer, db.ForeignKey('knowledge_category.id'), comment='分类ID')
    cover = db.Column(db.String(200), comment='封面图片')
    content = db.Column(db.Text, comment='正文内容')
    views = db.Column(db.Integer, default=0, comment='阅读量')
    author = db.Column(db.String(50), default='系统管理员', comment='管理员作者')
    summary = db.Column(db.Text, comment='文章摘要')
    tags = db.Column(db.String(200), comment='标签')
    status = db.Column(db.String(20), default='draft', comment='状态(draft/published)')
    created_at = db.Column(db.DateTime, default=datetime.now, comment='发布时间')
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now, comment='更新时间')

    category = db.relationship('KnowledgeCategory', backref=db.backref('articles', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else '',
            'cover': self.cover,
            'content': self.content,
            'views': self.views,
            'author': self.author,
            'summary': self.summary,
            'tags': self.tags,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
        }

"""
Navicat 17 建表命令：

-- 知识库分类表
CREATE TABLE `knowledge_category` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '分类描述',
    `color` VARCHAR(20) DEFAULT NULL COMMENT '分类颜色',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识库分类表';

-- 知识库文章表
CREATE TABLE `knowledge_article` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '文章ID',
    `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
    `category_id` INT DEFAULT NULL COMMENT '分类ID',
    `cover` VARCHAR(200) DEFAULT NULL COMMENT '封面图片',
    `content` TEXT DEFAULT NULL COMMENT '正文内容',
    `views` INT DEFAULT 0 COMMENT '阅读量',
    `author` VARCHAR(50) DEFAULT '系统管理员' COMMENT '管理员作者',
    `summary` TEXT DEFAULT NULL COMMENT '文章摘要',
    `tags` VARCHAR(200) DEFAULT NULL COMMENT '标签',
    `status` VARCHAR(20) DEFAULT 'draft' COMMENT '状态(draft/published)',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `category_id` (`category_id`),
    CONSTRAINT `knowledge_article_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `knowledge_category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识库文章表';
"""
