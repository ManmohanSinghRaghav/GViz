from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Fix import path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import db

search_bp = Blueprint('search', __name__)

@search_bp.route('', methods=['GET'])
@jwt_required()
def search_content():
    query = request.args.get('q', '')
    
    if not query or len(query) < 2:
        return jsonify({"msg": "Search query must be at least 2 characters"}), 400
    
    # Mock search results - replace with real search logic
    # This structure matches what the frontend expects
    mock_results = {
        "courses": [
            {"id": 1, "title": f"Introduction to Data Visualization with {query}", "type": "course"},
            {"id": 2, "title": f"Advanced {query} Techniques", "type": "course"}
        ],
        "tutorials": [
            {"id": 1, "title": f"Creating Your First {query} Chart", "type": "tutorial"},
            {"id": 2, "title": f"How to Use {query} Effectively", "type": "tutorial"}
        ]
    }
    
    return jsonify(mock_results), 200
