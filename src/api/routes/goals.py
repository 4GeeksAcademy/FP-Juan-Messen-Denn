from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Goals
from api.utils import generate_sitemap, APIException
from flask_cors import CORS


goals_bp = Blueprint("goals_bp", __name__)



@goals_bp.route('/goals', methods=['GET'])
def get_goals():
    goals = Goals.query.all()
    if not goals:
        return jsonify({"error": "goals no exist"}), 404
    response = [goal.serialize() for goal in goals]
    return jsonify(response), 200

@goals_bp.route('/goals/<int:goals_id>', methods=['GET'])
def get_single_goal(goals_id):
    goal = Goals.query.get(goals_id)
    if not goal:
        return jsonify({"error": "goal no exist"}), 404
    return jsonify(goal.serialize()), 200

@goals_bp.route('/', methods=['POST'])
def create_goal():
    data = request.get_json()
    if not data: 
        return jsonify({"error": "Request body is required"}), 400
    title = data.get("title")
    content = data.get("content")
    user_id = data.get("user_id")

    if not title or not content or not user_id:
        return jsonify({"error": "title, content and user_id are required"}), 400
    
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    new_goal = Goals(
        title=title,
        content=content,
        user_id=user_id
    )

    db.session.add(new_goal)
    db.session.commit()
    return jsonify({"msg": "Goal created successfully", "goal": new_goal.serialize()}), 201

@goals_bp.route('/<int:goal_id>', methods=['PUT'])
def update_goal(goal_id):
    data = request.get_json()
    if not data: 
        return jsonify({"error": "Request body is required"}), 400
    
    goal = db.session.get(Goals, goal_id)

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    if "title" in data:
        goal.title = data["title"]

    if "content" in data:
        goal.content = data["content"]

    if "status" in data:
        goal.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Goal updated successfully",
        "goal": goal.serialize()
    }), 200

@goals_bp.route('/goals/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    
    goal = db.session.get(Goals, goal_id)
    if not goal:
        return jsonify({"error": "Goal not found"}), 404
    
    db.session.delete(goal)
    db.session.commit()

    return jsonify({
        "message": "Goal delete successfully"}), 200

@goals_bp.route('/goals', methods=['DELETE'])
def delete_all_goals():

    goals = Goals.query.all()

    if not goals:
        return jsonify({"message": "No goals to delete"}), 200

    for goal in goals:
        db.session.delete(goal)

    db.session.commit()

    return jsonify({
        "message": f"{len(goals)} goals deleted successfully"
    }), 200