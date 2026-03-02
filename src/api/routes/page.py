from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Folder, Page
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


page_bp = Blueprint("page_bp", __name__)




@page_bp.route('/<int:id>', methods=['GET'])
def get_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    return jsonify(page.serialize()), 200

@page_bp.route('/<int:id>', methods=['PUT'])
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

@page_bp.route('/<int:id>', methods=['DELETE'])
def delete_page(id):
    page = Page.query.get(id)
    if not page:
        return jsonify({"error": "Page no encontrada"}), 404
    db.session.delete(page)
    db.session.commit()
    return jsonify({"message": f"Page {id} eliminada"}), 200