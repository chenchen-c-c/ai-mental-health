from flask import Blueprint, request
from models import Journal
from extensions import db
from utils.response import success, error, not_found
from utils.jwt import auth_required, admin_required

journal_bp = Blueprint('journal', __name__)

@journal_bp.route('/journal/', methods=['GET'])
@auth_required
def get_journals():
    user = request.user
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    
    if user.role == 1:
        query = Journal.query
    else:
        query = Journal.query.filter_by(user_id=user.id)
    
    journals = query.order_by(Journal.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return success({
        'list': [j.to_dict() for j in journals.items],
        'total': journals.total,
        'page': journals.page,
        'per_page': journals.per_page,
        'pages': journals.pages,
    })

@journal_bp.route('/journal/<int:id>', methods=['GET'])
@auth_required
def get_journal(id):
    user = request.user
    journal = Journal.query.get(id)
    
    if not journal:
        return not_found('日记不存在')
    
    if user.role != 1 and journal.user_id != user.id:
        return error('无权查看该日记', 403)
    
    return success(journal.to_dict())

@journal_bp.route('/journal/', methods=['POST'])
@auth_required
def create_journal():
    user = request.user
    data = request.get_json()
    
    score = data.get('score')
    emotion = data.get('emotion')
    content = data.get('content')
    
    if not score or not emotion:
        return error('情绪评分和情绪标签不能为空')
    
    new_journal = Journal(
        user_id=user.id,
        score=score,
        emotion=emotion,
        content=content,
    )
    
    db.session.add(new_journal)
    db.session.commit()
    
    return success(new_journal.to_dict(), '日记创建成功')

@journal_bp.route('/journal/<int:id>', methods=['PUT'])
@auth_required
def update_journal(id):
    user = request.user
    journal = Journal.query.get(id)
    
    if not journal:
        return not_found('日记不存在')
    
    if user.role != 1 and journal.user_id != user.id:
        return error('无权修改该日记', 403)
    
    data = request.get_json()
    
    if 'score' in data:
        journal.score = data['score']
    if 'emotion' in data:
        journal.emotion = data['emotion']
    if 'content' in data:
        journal.content = data['content']
    
    db.session.commit()
    
    return success(journal.to_dict(), '日记更新成功')

@journal_bp.route('/journal/<int:id>', methods=['DELETE'])
@auth_required
def delete_journal(id):
    user = request.user
    journal = Journal.query.get(id)
    
    if not journal:
        return not_found('日记不存在')
    
    if user.role != 1 and journal.user_id != user.id:
        return error('无权删除该日记', 403)
    
    db.session.delete(journal)
    db.session.commit()
    
    return success(None, '日记删除成功')