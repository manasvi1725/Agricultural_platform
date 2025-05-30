import pandas as pd
class FertilizerModel:
    def __init__(self):
        self.df = None
        self.data_loaded = False
        self.recommendations ={
            'Nitrogen': {
            'Severely Low': "Fertilizer: Urea (50–60 kg/acre), Ammonium Sulphate (100–120 kg/acre)\n"
                            "Manure: FYM (5–10 tons/acre), Neem Cake (250–300 kg/acre)\n"
                            "Dosage: Split into 3 phases - sowing, tillering, panicle initiation",
            'Moderately Low': "Fertilizer: Urea (30–40 kg/acre)\n"
                              "Manure: Compost (3–5 tons/acre)\n"
                              "Dosage: Apply in 2 splits during vegetative stage",
            'Apt': "Maintain using compost and monitor regularly.",
            'High': "Avoid nitrogenous fertilizers, use carbon-rich compost. Watch for pest outbreaks."
            },
            'Phosphorus': {
            'Severely Low': "Fertilizer: SSP (100–125 kg/acre), DAP (40–50 kg/acre)\n"
                            "Manure: Rock Phosphate (100 kg/acre), Bone Meal (50–70 kg/acre)\n"
                            "Dosage: Apply before sowing, mixed well into the soil",
            'Moderately Low': "Fertilizer: SSP (75–90 kg/acre), DAP (30–40 kg/acre)\n"
                              "Manure: Vermicompost (1–2 tons/acre)",
            'Apt': "No fertilizer needed; maintain with rock phosphate in organics.",
            'High': "Avoid DAP/SSP; consider micronutrient supplements (Zn, Fe)."
            },
            'Potassium': {
            'Severely Low': "Fertilizer: MOP (60–80 kg/acre), SOP (50–60 kg/acre)\n"
                            "Manure: Wood Ash (100–150 kg/acre), Banana Compost (2–3 tons/acre)",
            'Moderately Low': "Fertilizer: MOP (40–50 kg/acre)\n"
                              "Manure: Leafy compost (1–2 tons/acre)",
            'Apt': "No potash needed; maintain with compost and ash.",
            'High': "Avoid MOP/SOP; excess K can cause Ca/Mg deficiencies."
            },
            'pH': {
            'Severely Low': "Correction: Agricultural Lime (1–2 tons/acre), Wood Ash (100–150 kg/acre)\n"
                            "Apply once in 2–3 years, test after 6 months",
            'Moderately Low': "Apply lime or dolomite to gradually raise pH.\n"
                              "Use compost rich in ash.",
            'Apt': "pH is suitable. Maintain with organic matter.",
            'High': "Correction: Elemental Sulfur (50–100 kg/acre), Gypsum (200–300 kg/acre)\n"
                    "Apply acidic compost (e.g. pine-based)"
            }
            
        }
    def load_data(self, csv_path):
         try:
            self.df = pd.read_csv(r"C:\Users\Manasvi Mittal\Desktop\agricultural-platform\data\ideal_npk_ph_values_india.csv")
            self.df.columns = self.df.columns.str.strip()
            self.data_loaded = True
            print("Fertilizer ideal values loaded successfully")
            print("Available crops:", self.df['crop'].unique())
         except Exception as e:
            print(f"Error loading fertilizer data: {e}")


    def check_status(self, actual, ideal, nutrient):
        bulk_density = 1.3  # g/cm³
        depth_cm = 15
        actual_converted = actual * bulk_density * depth_cm * 0.1

        """Function to classify nutrient status"""
        diff = actual_converted - ideal
        if nutrient == "pH":
            if diff <= -1.0:
                return "Severely Low"
            elif diff <= -0.5:
                return "Moderately Low"
            elif diff >= 0.5:
                return "High"
            else:
                return "Adequate"
        else:
            if diff <= -30:
                return "Severely Low"
            elif diff <= -15:
                return "Moderately Low"
            elif diff >= 30:
                return "High"
            else:
                return "Adequate"

    def get_recommendation(self, nutrient, status):
        """Get fertilizer recommendation based on nutrient and status"""
        return self.recommendations.get(nutrient, {}).get(status, "No recommendation available")
    
    def parse_ph_range(self, ph_str):
        """Parse pH range like '5.5-6.5' and return average"""
        try:
            if '-' in str(ph_str):
                ph_range = str(ph_str).split('-')
                return (float(ph_range[0]) + float(ph_range[1])) / 2
            return float(str(ph_str).strip())
        except:
            raise ValueError(f"Invalid pH format: {ph_str}")

    def get_fertilizer_recommendation(self, crop_name, actual_N, actual_P, actual_K, actual_pH):
        """Main function to get fertilizer recommendations"""
        if not self.data_loaded:
            return {"error": "Data not loaded. Please load the CSV file first."}
        
        # Find ideal values for the crop
        crop_input = crop_name.strip().lower()
        ideal_row = self.df[self.df['crop'].str.lower() == crop_input]
        
        if ideal_row.empty:
            available_crops = list(self.df['crop'].unique())
            return {
                "error": f"Crop '{crop_name}' not found in dataset.",
                "available_crops": available_crops
            }
         # Extract ideal values
        ideal_N = float(ideal_row['N'].values[0])
        ideal_P = float(ideal_row['P'].values[0])
        ideal_K = float(ideal_row['K'].values[0])
        ideal_pH = self.parse_ph_range(ideal_row['ph'].values[0])
        
        # Check nutrient status
        n_status = self.check_status(actual_N, ideal_N, 'Nitrogen')
        p_status = self.check_status(actual_P, ideal_P, 'Phosphorus')
        k_status = self.check_status(actual_K, ideal_K, 'Potassium')
        ph_status = self.check_status(actual_pH, ideal_pH, 'pH')
        
        # Get recommendations
        results = {
            "crop": crop_name,
            "analysis": {
                "Nitrogen": {
                    "actual": actual_N,
                    "ideal": ideal_N,
                    "status": n_status,
                    "recommendation": self.get_recommendation('Nitrogen', n_status)
                },
                "Phosphorus": {
                    "actual": actual_P,
                    "ideal": ideal_P,
                    "status": p_status,
                    "recommendation": self.get_recommendation('Phosphorus', p_status)
                },
                "Potassium": {
                    "actual": actual_K,
                    "ideal": ideal_K,
                    "status": k_status,
                    "recommendation": self.get_recommendation('Potassium', k_status)
                },
                "pH": {
                    "actual": actual_pH,
                    "ideal": ideal_pH,
                    "status": ph_status,
                    "recommendation": f"pH is {ph_status.lower()}"
                }
            }
        }
        
        return results