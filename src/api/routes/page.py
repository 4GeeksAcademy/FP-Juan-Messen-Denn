from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Folder, Page
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


page_bp = Blueprint("page_bp", __name__)


@page_bp.route('/folders/<int:folder_id>/pages', methods=['GET'])
def get_pages_by_folder(folder_id):
    folder = Folder.query.get(folder_id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    pages = Page.query.filter_by(folder_id=folder_id).all()
    return jsonify([page.serialize() for page in pages]), 200

@page_bp.route('/folders/<int:folder_id>/pages', methods=['POST'])
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

@page_bp.route('/pages/<int:id>', methods=['GET'])
def get_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    return jsonify(page.serialize()), 200

@page_bp.route('/pages/<int:id>', methods=['PUT'])
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

@page_bp.route('/pages/<int:id>', methods=['DELETE'])
def delete_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    db.session.delete(page)
    db.session.commit()
    return jsonify({"message": f"Page {id} eliminada"}), 200


@page_bp.route('/pages', methods=['GET'])

def hola():
    return jsonify({"msg":"hola"})