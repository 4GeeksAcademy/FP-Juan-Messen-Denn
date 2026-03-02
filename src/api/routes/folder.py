from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Folder, Page
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


folder_bp = Blueprint("folder_bp", __name__)


@folder_bp.route('/folders', methods=['GET'])
def get_folders():
    folders = Folder.query.all()
    return jsonify([folder.serialize() for folder in folders]), 200

@folder_bp.route('/folders', methods=['POST'])
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

@folder_bp.route('/folders/<int:id>', methods=['GET'])
def get_folder(id):
    folder = Folder.query.get(id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    return jsonify(folder.serialize()), 200

@folder_bp.route('/<int:id>', methods=['PUT'])
def update_folder(id):
    folder = Folder.query.get(id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400
    folder = Folder.query.get(id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    if "title" in data:
        folder.title = data["title"]

    db.session.commit()
    return jsonify({
    "message": "Goal updated successfully",
    "goal": folder.serialize()}),200

@folder_bp.route('/folders/<int:id>', methods=['DELETE'])
def delete_folder(id):
    folder = Folder.query.get(id)
    if not folder:
        return jsonify({"error": "Folder no encontrado"}), 404
    db.session.delete(folder)
    db.session.commit()
    return jsonify({"message": f"Folder {id} eliminado"}), 200






