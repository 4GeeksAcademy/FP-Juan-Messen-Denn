from flask import Blueprint, jsonify, request
from api.models import db, User, Folder, Page, Goals

api = Blueprint('api', __name__)

from flask_cors import CORS
CORS(api)



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    return jsonify({"message": "Hello! I'm a message that came from the backend"}), 200



@api.route('/folders', methods=['GET'])
def get_folders():
    folders = Folder.query.all()
    return jsonify([folder.serialize() for folder in folders]), 200

@api.route('/folders', methods=['POST'])
def create_folder():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    title = data.get("title")
    if not title:
        return jsonify({"error": "title is required"}), 400
    new_folder = Folder(title=title, user_id=1)
    db.session.add(new_folder)
    db.session.commit()
    return jsonify(new_folder.serialize()), 201

@api.route('/folders/<int:id>', methods=['GET'])
def get_folder(id):
    folder = Folder.query.get(id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    return jsonify(folder.serialize()), 200

@api.route('/folders/<int:id>', methods=['PUT'])
def update_folder(id):
    folder = Folder.query.get(id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    title = data.get("title")
    if not title:
        return jsonify({"error": "title is required"}), 400
    folder.title = title
    db.session.commit()
    return jsonify(folder.serialize()), 200

@api.route('/folders/<int:id>', methods=['DELETE'])
def delete_folder(id):
    folder = Folder.query.get(id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    db.session.delete(folder)
    db.session.commit()
    return jsonify({"message": f"Folder {id} eliminado"}), 200



@api.route('/folders/<int:folder_id>/pages', methods=['GET'])
def get_pages_by_folder(folder_id):
    folder = Folder.query.get(folder_id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    pages = Page.query.filter_by(folder_id=folder_id).all()
    return jsonify([page.serialize() for page in pages]), 200

@api.route('/folders/<int:folder_id>/pages', methods=['POST'])
def create_page(folder_id):
    folder = Folder.query.get(folder_id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    title = data.get("title")
    content = data.get("content")
    if not title or not content:
        return jsonify({"error": "title and content are required"}), 400
    new_page = Page(title=title, content=content, folder_id=folder_id)
    db.session.add(new_page)
    db.session.commit()
    return jsonify(new_page.serialize()), 201

@api.route('/pages/<int:id>', methods=['GET'])
def get_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    return jsonify(page.serialize()), 200

@api.route('/pages/<int:id>', methods=['PUT'])
def update_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    title = data.get("title")
    content = data.get("content")
    if not title or not content:
        return jsonify({"error": "title and content are required"}), 400
    page.title = title
    page.content = content
    db.session.commit()
    return jsonify(page.serialize()), 200

@api.route('/pages/<int:id>', methods=['DELETE'])
def delete_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    db.session.delete(page)
    db.session.commit()
    return jsonify({"message": f"Page {id} eliminada"}), 200