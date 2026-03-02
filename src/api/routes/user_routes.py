from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import create_access_token
from api.models import db, User

user_routes_bp = Blueprint('user_routes_bp', __name__)

@user_routes_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = db.session.execute(db.select(User).where(User.email == email)).scalar_one_or_none()
    
    if user is None:
        return jsonify({"message": "Invalid email or password"}), 400
    
    if user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({"message": "Login successful", "token": access_token}), 200
    else:        
        return jsonify({"message": "Invalid email or password"}), 400
    

@user_routes_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    existing_user = db.session.execute(db.select(User).where(User.email == email)).scalar_one_or_none()
    
    if existing_user:
        return jsonify({"message": "Email already registered"}), 400
    
    new_user = User(email=email)
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201




@user_routes_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [{"id": user.id, "email": user.email} for user in users]
    return jsonify(users_list), 200



@user_routes_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({"id": user.id, "email": user.email}), 200
    else:
        return jsonify({"message": "User not found"}), 404
    


@user_routes_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404
    


    
@user_routes_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    else:
        return jsonify({"message": "User not found"}), 404


#codigo de la academia:
@user_routes_bp.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200