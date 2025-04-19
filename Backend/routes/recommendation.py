from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import database
from gemini import generate_recommendation
import logging

logger = logging.getLogger(__name__)
recommendation_bp = Blueprint('recommendation', __name__)

@recommendation_bp.route('/job', methods=['GET'])
@jwt_required()
def get_job_recommendations():
    try:
        current_user_id = get_jwt_identity()
        user = database.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        # Get job recommendations based on user skills and interests
        skills = user.get('skills', [])
        job_interests = user.get('job_interests', [])
        
        prompt = f"""
        Provide job recommendations for a person with the following skills:
        {', '.join(skills) if skills else 'No skills provided'}
        
        Their job interests are:
        {', '.join(job_interests) if job_interests else 'No interests provided'}
        
        Format your response as a JSON array with objects containing:
        1. job_title - the name of the job
        2. company - an example company offering this role
        3. description - a brief job description
        4. match_score - a percentage (70-98) indicating how well the job matches their profile
        5. required_skills - an array of 3-5 key skills for this job
        
        Return exactly 3 job recommendations.
        """
        
        recommendations = generate_recommendation(prompt)
        return jsonify(recommendations), 200
    except Exception as e:
        logger.error(f"Error generating job recommendations: {e}")
        return jsonify({"msg": f"Error generating recommendations: {str(e)}"}), 500

@recommendation_bp.route('/skill', methods=['GET'])
@jwt_required()
def get_skill_recommendations():
    try:
        current_user_id = get_jwt_identity()
        user = database.get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        # Get skill recommendations based on user's existing skills and job interests
        skills = user.get('skills', [])
        job_interests = user.get('job_interests', [])
        
        prompt = f"""
        Provide skill improvement recommendations for a person with the following skills:
        {', '.join(skills) if skills else 'No skills provided'}
        
        Their job interests are:
        {', '.join(job_interests) if job_interests else 'No interests provided'}
        
        Format your response as a JSON array with objects containing:
        1. skill_name - the name of the skill to learn
        2. importance - a rating from 1-10 of how important this skill is
        3. reason - why this skill would be valuable
        4. resources - an array of 2-3 resources for learning this skill
        
        Return exactly 5 skill recommendations that would complement their existing skills.
        """
        
        recommendations = generate_recommendation(prompt)
        return jsonify(recommendations), 200
    except Exception as e:
        logger.error(f"Error generating skill recommendations: {e}")
        return jsonify({"msg": f"Error generating recommendations: {str(e)}"}), 500
