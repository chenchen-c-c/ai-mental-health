from flask import Blueprint, request
from models import KnowledgeArticle, KnowledgeCategory
from extensions import db
from utils.response import success, error, not_found
from utils.jwt import auth_required, admin_required
from sqlalchemy import or_

knowledge_bp = Blueprint('knowledge', __name__)

@knowledge_bp.route('/knowledge/categories', methods=['GET'])
def get_categories():
    categories = KnowledgeCategory.query.all()
    return success([c.to_dict() for c in categories])

@knowledge_bp.route('/knowledge/categories', methods=['POST'])
@admin_required
def create_category():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    color = data.get('color')
    
    if not name:
        return error('分类名称不能为空')
    
    if KnowledgeCategory.query.filter_by(name=name).first():
        return error('分类已存在')
    
    category = KnowledgeCategory(name=name, description=description, color=color)
    db.session.add(category)
    db.session.commit()
    
    return success(category.to_dict(), '分类创建成功')

@knowledge_bp.route('/knowledge/articles', methods=['GET'])
def get_articles():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    keyword = request.args.get('keyword')
    category_id = request.args.get('category_id')
    status = request.args.get('status')
    
    query = KnowledgeArticle.query
    
    if keyword:
        query = query.filter(or_(
            KnowledgeArticle.title.like(f'%{keyword}%'),
            KnowledgeArticle.summary.like(f'%{keyword}%'),
        ))
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if status:
        query = query.filter_by(status=status)
    
    articles = query.order_by(KnowledgeArticle.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return success({
        'list': [a.to_dict() for a in articles.items],
        'total': articles.total,
        'page': articles.page,
        'per_page': articles.per_page,
        'pages': articles.pages,
    })

@knowledge_bp.route('/knowledge/articles/<int:id>', methods=['GET'])
def get_article(id):
    article = KnowledgeArticle.query.get(id)
    
    if not article:
        return not_found('文章不存在')
    
    if article.status != 'published':
        token = request.headers.get('Authorization')
        if not token:
            return not_found('文章不存在')
    
    article.views += 1
    db.session.commit()
    
    return success(article.to_dict())

@knowledge_bp.route('/knowledge/articles', methods=['POST'])
@admin_required
def create_article():
    data = request.get_json()
    
    title = data.get('title')
    category_id = data.get('category_id')
    author = data.get('author', '系统管理员')
    summary = data.get('summary')
    tags = data.get('tags')
    cover = data.get('cover')
    content = data.get('content')
    status = data.get('status', 'draft')
    
    if not title:
        return error('文章标题不能为空')
    
    article = KnowledgeArticle(
        title=title,
        category_id=category_id,
        author=author,
        summary=summary,
        tags=tags,
        cover=cover,
        content=content,
        status=status,
    )
    
    db.session.add(article)
    db.session.commit()
    
    return success(article.to_dict(), '文章创建成功')

@knowledge_bp.route('/knowledge/articles/<int:id>', methods=['PUT'])
@admin_required
def update_article(id):
    article = KnowledgeArticle.query.get(id)
    
    if not article:
        return not_found('文章不存在')
    
    data = request.get_json()
    
    if 'title' in data:
        article.title = data['title']
    if 'category_id' in data:
        article.category_id = data['category_id']
    if 'author' in data:
        article.author = data['author']
    if 'summary' in data:
        article.summary = data['summary']
    if 'tags' in data:
        article.tags = data['tags']
    if 'cover' in data:
        article.cover = data['cover']
    if 'content' in data:
        article.content = data['content']
    if 'status' in data:
        article.status = data['status']
    
    db.session.commit()
    
    return success(article.to_dict(), '文章更新成功')

@knowledge_bp.route('/knowledge/articles/<int:id>', methods=['DELETE'])
@admin_required
def delete_article(id):
    article = KnowledgeArticle.query.get(id)
    
    if not article:
        return not_found('文章不存在')
    
    db.session.delete(article)
    db.session.commit()
    
    return success(None, '文章删除成功')