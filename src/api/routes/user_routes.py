from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User

user_routes_bp = Blueprint('user_routes_bp', __name__)

@user_routes_bp.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200