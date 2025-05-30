# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import sys
# import xgboost as xgb
# # Add models directory to path
# sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

# from disease_detection.model_handler import DiseaseDetectionModel
# from crop_recommendation.crop_model import CropRecommendationModel
# from fertilization.fertilizer_model import FertilizerModel
# from govt_schemes.schemes_handler import GovtSchemesModel

# app = Flask(__name__)
# CORS(app)

# # Initialize models
# disease_model = DiseaseDetectionModel()
# crop_model = CropRecommendationModel()
# fertilizer_model = FertilizerModel()
# schemes_model = GovtSchemesModel()

# # Load models on startup
# # @app.before_request
# def load_models():
#     try:
#         # Load your actual model files
#         disease_model.load_model(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\models\model.h5')
#         crop_model.load_model(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\models\label_encoder.pkl')
#         fertilizer_model.load_data(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\data\ideal_npk_ph_values_india.csv')
#         schemes_model.load_data(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\data\farmer_schemes_dataset.csv')
#         print("Models loaded successfully!")

#     except Exception as e:
#         print(f"Error loading models: {e}")


# # Basic route
# @app.route('/')
# def home():
#     return jsonify({"message": "Agricultural Platform API is running!"})

# # Disease Detection API
# @app.route('/api/disease-detection', methods=['POST'])
# def detect_disease():
#     try:
#         if 'image' not in request.files:
#             return jsonify({"error": "No image uploaded"}), 400
        
#         image = request.files['image']
#         if image.filename == '':
#             return jsonify({"error": "No image selected"}), 400
        
#         # Save uploaded image temporarily
#         image_path = f"uploads/{image.filename}"
#         os.makedirs("uploads", exist_ok=True)
#         image.save(image_path)
        
#         # Get prediction from model
#         result = disease_model.predict(image_path)
        
#         # Clean up uploaded file
#         os.remove(image_path)
        
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Crop Recommendation API
# @app.route('/api/crop-recommendation', methods=['POST'])
# def recommend_crop():
#     try:
#         data = request.get_json()
        
#         # Extract soil features from request
#         soil_features = [
#             data.get('N', 0),
#             data.get('P', 0),
#             data.get('K', 0),
#             data.get('temperature', 0),
#             data.get('humidity', 0),
#             data.get('ph', 0),
#             data.get('rainfall', 0)
#         ]
        
#         result = crop_model.predict_crop(soil_features)
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Fertilizer Recommendation API
# @app.route('/api/fertilizer-recommendation', methods=['POST'])
# def recommend_fertilizer():
#     try:
#         data = request.get_json()
        
#         # Extract required parameters
#         crop_name = data.get('crop')
#         actual_N = float(data.get('N'))
#         actual_P = float(data.get('P'))
#         actual_K = float(data.get('K'))
#         actual_pH = float(data.get('pH'))
        
#         result = fertilizer_model.get_fertilizer_recommendation(
#             crop_name, actual_N, actual_P, actual_K, actual_pH
#         )
        
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # Government Schemes API
# @app.route('/api/govt-schemes', methods=['POST'])
# def get_govt_schemes():
#     try:
#         data = request.get_json()
#         print(f"Received: {data}")  # Debug log
        
#         # For now, return test data to confirm it works
#         return jsonify({
#             "schemes": [
#                 {
#                     "scheme_name": f"Test Scheme for {data.get('state', 'Unknown')}",
#                     "description": f"This is a test scheme for {data.get('category', 'unknown')} farmers",
#                     "managing_authority": "Test Authority",
#                     "state": data.get('state', 'Unknown'),
#                     "type": data.get('needs', 'Unknown'),
#                     "link": "https://example.com"
#                 }
#             ]
#         })
#     except Exception as e:
#         print(f"Error: {e}")
#         return jsonify({"error": str(e)}), 500

# # Test fertilizer API with sample data
# @app.route('/api/test-fertilizer', methods=['GET'])
# def test_fertilizer():
#     try:
#         # Test with sample data
#         result = fertilizer_model.get_fertilizer_recommendation(
#             "Rice", 70, 10, 20, 7.0
#         )
#         return jsonify(result)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)



from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import xgboost as xgb
# Add models directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'models'))

from disease_detection.model_handler import DiseaseDetectionModel
from crop_recommendation.crop_model import CropRecommendationModel
from fertilization.fertilizer_model import FertilizerModel
from govt_schemes.schemes_handler import GovtSchemesModel

app = Flask(__name__)
CORS(app)

# Initialize models
disease_model = DiseaseDetectionModel()
crop_model = CropRecommendationModel()
fertilizer_model = FertilizerModel()
schemes_model = GovtSchemesModel()

# Load models once on startup - REMOVE @app.before_request
def load_models():
    try:
        print("Loading models...")
        # Load your actual model files
        disease_model.load_model(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\models\model.h5')
        crop_model.load_model(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\models\label_encoder.pkl')
        fertilizer_model.load_data(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\data\ideal_npk_ph_values_india.csv')
        schemes_model.load_data(r'C:\Users\Manasvi Mittal\Desktop\agricultural-platform\data\farmer_schemes_dataset.csv')
        print("Models loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

# Basic route
@app.route('/')
def home():
    return jsonify({"message": "Agricultural Platform API is running!"})

# Disease Detection API
@app.route('/api/disease-detection', methods=['POST'])
def detect_disease():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400
        
        image = request.files['image']
        if image.filename == '':
            return jsonify({"error": "No image selected"}), 400
        
        # Save uploaded image temporarily
        image_path = f"uploads/{image.filename}"
        os.makedirs("uploads", exist_ok=True)
        image.save(image_path)
        
        # Get prediction from model
        result = disease_model.predict(image_path)
        
        # Clean up uploaded file
        os.remove(image_path)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Crop Recommendation API
@app.route('/api/crop-recommendation', methods=['POST'])
def recommend_crop():
    try:
        data = request.get_json()
        
        # Extract soil features from request
        soil_features = [
            data.get('N', 0),
            data.get('P', 0),
            data.get('K', 0),
            data.get('temperature', 0),
            data.get('humidity', 0),
            data.get('ph', 0),
            data.get('rainfall', 0)
        ]
        
        result = crop_model.predict_crop(soil_features)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fertilizer Recommendation API
@app.route('/api/fertilizer-recommendation', methods=['POST'])
def recommend_fertilizer():
    try:
        data = request.get_json()
        
        crop_name = data.get('crop')
        actual_N = float(data.get('N'))
        actual_P = float(data.get('P'))
        actual_K = float(data.get('K'))
        actual_pH = float(data.get('pH'))
        
        result = fertilizer_model.get_fertilizer_recommendation(
            crop_name, actual_N, actual_P, actual_K, actual_pH
        )
        
        if "error" in result:
            return jsonify({"success": False, "error": result["error"]}), 400
        
        # Extract detailed recommendations from your model
        analysis = result["analysis"]
        
        # Get the primary fertilizer recommendation (from the most deficient nutrient)
        primary_fertilizer = "NPK Fertilizer"  # Default
        primary_dosage = "Apply as per soil test"
        
        # Extract specific recommendations
        n_rec = analysis["Nitrogen"]["recommendation"]
        p_rec = analysis["Phosphorus"]["recommendation"]
        k_rec = analysis["Potassium"]["recommendation"]
        ph_rec = analysis["pH"]["recommendation"]
        
        # Create adjustments list from recommendations
        adjustments = []
        if analysis["Nitrogen"]["status"] != "Adequate":
            adjustments.append(f"Nitrogen: {n_rec}")
        if analysis["Phosphorus"]["status"] != "Adequate":
            adjustments.append(f"Phosphorus: {p_rec}")
        if analysis["Potassium"]["status"] != "Adequate":
            adjustments.append(f"Potassium: {k_rec}")
        
        # Transform the response to match frontend expectations
        transformed_result = {
            "fertilizer": primary_fertilizer,
            "dosage": primary_dosage,
            "timing": "Apply based on crop growth stage",
            "nutrient_status": {
                "N": analysis["Nitrogen"]["status"].lower().replace(" ", "_"),
                "P": analysis["Phosphorus"]["status"].lower().replace(" ", "_"),
                "K": analysis["Potassium"]["status"].lower().replace(" ", "_")
            },
            "adjustments": adjustments if adjustments else ["No adjustments needed - optimal nutrient balance!"],
            "ph_advice": ph_rec,
            "soil_analysis": f"N: {actual_N}, P: {actual_P}, K: {actual_K}, pH: {actual_pH}",
            "detailed_recommendations": {
                "nitrogen": n_rec,
                "phosphorus": p_rec,
                "potassium": k_rec,
                "ph": ph_rec
            }
        }
        
        return jsonify({"success": True, "recommendation": transformed_result})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
@app.route('/api/govt-schemes', methods=['POST'])
def get_govt_schemes():
    try:
        data = request.get_json()
        print(f"Received govt schemes request: {data}")  # Debug log
        
        # Extract parameters
        state = data.get('state', '').lower()
        category = data.get('category', '')
        needs = data.get('needs', '')
        
        filters = {'state': state, 'category': category, 'needs': needs}
        result = schemes_model.filter_schemes(filters)
        
        # If the model doesn't work, return test data
        if not result or 'schemes' not in result:
            result = {
                "schemes": [
                    {
                        "scheme_name": f"Pradhan Mantri Kisan Samman Nidhi - {state.title()}",
                        "description": f"Direct income support scheme for {category} in {state.title()}",
                        "managing_authority": "Ministry of Agriculture & Farmers Welfare",
                        "state": state.title(),
                        "type": needs,
                        "benefits": "₹6000 per year in three installments",
                        "eligibility": "Small and marginal farmers",
                        "link": "https://pmkisan.gov.in"
                    },
                    {
                        "scheme_name": f"Kisan Credit Card - {state.title()}",
                        "description": f"Credit facility for farmers in {state.title()} for {needs}",
                        "managing_authority": "Banks & Financial Institutions",
                        "state": state.title(),
                        "type": needs,
                        "benefits": "Flexible credit limit, low interest rate",
                        "eligibility": "All farmers",
                        "link": "https://kcc.gov.in"
                    }
                ]
            }
        
        return jsonify(result)
    except Exception as e:
        print(f"Error in govt schemes: {e}")
        return jsonify({"error": str(e)}), 500

# Test fertilizer API with sample data
@app.route('/api/test-fertilizer', methods=['OPTIONS'])
def test_fertilizer():
    try:
        # Test with sample data
        result = fertilizer_model.get_fertilizer_recommendation(
            "Rice", 70, 10, 20, 7.0
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "models_loaded": True,
        "endpoints": [
            "/api/disease-detection",
            "/api/crop-recommendation", 
            "/api/fertilizer-recommendation",
            "/api/govt-schemes"
        ]
    })

if __name__ == '__main__':
    # Load models once when starting the server
    models_loaded = load_models()
    if not models_loaded:
        print("Warning: Some models failed to load, but server will still start")
    
    print("Starting Flask server on port 5000...")
    app.run(debug=True, port=5000)