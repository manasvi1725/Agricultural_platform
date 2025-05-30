import pandas as pd
import json

class GovtSchemesModel:
    def __init__(self):
        self.schemes_data = None
        self.data_loaded = False
        # State mapping for frontend values to CSV values
        self.state_mapping = {
            'andhra-pradesh': 'Andhra Pradesh',
            'assam': 'Assam',
            'bihar': 'Bihar',
            'chattisgarh': 'Chattisgarh',
            'gujarat': 'Gujarat',
            'haryana': 'Haryana',
            'jharkhand': 'Jharkhand',
            'karnataka': 'Karnataka',
            'kerala': 'Kerala',
            'madhya-pradesh': 'Madhya Pradesh',
            'maharashtra': 'Maharashtra',
            'odisha': 'Odisha',
            'punjab': 'Punjab',
            'rajasthan': 'Rajasthan',
            'tamil-nadu': 'Tamil Nadu',
            'telangana': 'Telangana',
            'uttar-pradesh': 'Uttar Pradesh',
            'west-bengal': 'West Bengal'
        }
        
        # Category to landholding/type mapping
        self.category_mapping = {
            'small-marginal': 'Small and marginal',
            'women-farmers': 'All',              
            'young-farmers': 'All',  
            'organic-farmers': 'All', 
            'tribal-farmers': 'All',  
            'general': 'All'
        }
        
        # Needs to Type mapping
        self.needs_mapping = {
            'crop-insurance': 'Insurance',
            'farm-equipment': 'Subsidy',
            'irrigation': 'Irrigation',
            'credit-support': 'Financial Assistance',
            'seed-subsidy': 'Subsidy',
            'fertilizer-subsidy': 'Subsidy',
            'market-linkage': 'Market Linkage',
            'training-support': 'Multi-service Mobile App'
        }

    def load_data(self, data_path):
        try:
            if data_path.endswith('.csv'):
                self.schemes_data = pd.read_csv(data_path, encoding='ISO-8859-1')
            elif data_path.endswith('.json'):
                with open(data_path, 'r') as file:
                    self.schemes_data = pd.DataFrame(json.load(file))
            
            self.data_loaded = True
            print("Government schemes data loaded successfully")
            print(f"Columns available: {list(self.schemes_data.columns)}")
        except Exception as e:
            print(f"Error loading schemes data: {e}")

    def filter_schemes(self, filters=None):
        if not self.data_loaded:
            return {"error": "Data not loaded"}

        filtered_df = self.schemes_data.copy()
        
        if filters:
            # Filter by State
            if 'state' in filters and filters['state']:
                state_name = self.state_mapping.get(filters['state'])
                if state_name:
                    # Include both state-specific and national schemes
                    filtered_df = filtered_df[
                        (filtered_df['State'].str.contains(state_name, na=False, case=False)) |
                        (filtered_df['State'].str.contains('All', na=False, case=False))
                    ]
            
            # Filter by Category (Landholding)
            if 'category' in filters and filters['category']:
                landholding = self.category_mapping.get(filters['category'])
                if landholding and landholding != 'All':
                    filtered_df = filtered_df[
                        (filtered_df['Landholding'].str.contains(landholding, na=False, case=False)) |
                        (filtered_df['Landholding'].str.contains('All', na=False, case=False))
                    ]
            
            # Filter by Needs (Type)
            if 'needs' in filters and filters['needs']:
                scheme_type = self.needs_mapping.get(filters['needs'])
                if scheme_type:
                    filtered_df = filtered_df[
                        filtered_df['Type'].str.contains(scheme_type, na=False, case=False)
                    ]
                
                # Special handling for organic farming
                if filters['needs'] == 'organic-farmers':
                    filtered_df = filtered_df[
                        filtered_df['Description'].str.contains('organic', na=False, case=False)
                    ]

        # Return the filtered results
        schemes = []
        for _, row in filtered_df.iterrows():
            schemes.append({
                "scheme_name": row["Scheme Name"],
                "description": str(row["Description"]),
                "link": row["Link"],
                "managing_authority": row["Managing Authority"],
                "state": row["State"],
                "type": row["Type"],
                "landholding": row["Landholding"]
            })

        return {"schemes": schemes}