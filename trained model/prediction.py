# import pickle
# # import joblib

# import pandas as pd

# # === Step 1: Load the trained model ===
# model_path = "car_mod.pkl"  # same directory as this script



# with open(model_path, "rb") as f:
#     model = pickle.load(f)

# # === Step 2: Define input questions ===
# print("Answer with 1 (yes) or 0 (no):\n")

# user_input = {
#     'past_modifications': int(input("Have you made past modifications? (1/0): ")),
#     'bodykit_spoiler': int(input("Do you like body kits or spoilers? (1/0): ")),
#     'custom_paint_or_wrap': int(input("Do you like custom paint or wraps? (1/0): ")),
#     'past_custom_paint_wrap': int(input("Have you done custom paint/wrap before? (1/0): ")),
#     'new_rims_tyre': int(input("Are you interested in new rims/tyres? (1/0): ")),
#     'past_rimstyre': int(input("Have you changed rims/tyres before? (1/0): ")),
#     'performance_enhancements': int(input("Do you like performance enhancements? (1/0): ")),
#     'smart_features': int(input("Do you like smart features? (1/0): ")),
# }

# # === Step 3: Convert input to DataFrame ===
# X_new = pd.DataFrame([user_input])

# # === Step 4: Make prediction ===
# pred = model.predict(X_new)

# # === Step 5: Display results ===
# predicted_mods = {
#     'P1_Modifications': pred[0][0],
#     'P2_Modifications': pred[0][1],
#     'P3_Modification': pred[0][2],
# }

# print("\n✅ Recommended Modifications:")
# for k, v in predicted_mods.items():
#     print(f"{k}: {'Yes' if v == 1 else 'No'}")











































import joblib
import pandas as pd

# === Step 1: Load the trained model ===
model_path = "car_mod.joblib"  # make sure this file is in the same folder as this script
model = joblib.load(model_path)
print("✅ Model loaded successfully!")

# === Step 2: Ask user for inputs ===
print("\nAnswer the following with 1 (Yes) or 0 (No):\n")

user_input = {
    'past_modifications': int(input("Have you made past modifications? (1/0): ")),
    'bodykit_spoiler': int(input("Do you like body kits or spoilers? (1/0): ")),
    'custom_paint_or_wrap': int(input("Do you like custom paint or wraps? (1/0): ")),
    'past_custom_paint_wrap': int(input("Have you done custom paint/wrap before? (1/0): ")),
    'new_rims_tyre': int(input("Are you interested in new rims/tyres? (1/0): ")),
    'past_rimstyre': int(input("Have you changed rims/tyres before? (1/0): ")),
    'performance_enhancements': int(input("Do you like performance enhancements? (1/0): ")),
    'smart_features': int(input("Do you like smart features? (1/0): ")),
}

# === Step 3: Convert input to DataFrame ===
X_new = pd.DataFrame([user_input])

# === Step 4: Make predictions ===
pred = model.predict(X_new)

# === Step 5: Display results ===
predicted_mods = {
    'P1_Modifications': int(pred[0][0]),
    'P2_Modifications': int(pred[0][1]),
    'P3_Modification': int(pred[0][2]),
}

print("\n🎯 Recommended Modifications:")
for k, v in predicted_mods.items():
    print(f"{k}: {'✅ Yes' if v == 1 else '❌ No'}")

# === Optional: Save the prediction to a CSV log for future learning ===
log_df = pd.DataFrame([{**user_input, **predicted_mods}])
log_df.to_csv("prediction_log.csv", mode='a', header=False, index=False)
print("\n🗂️ User input and predictions saved to 'prediction_log.csv'.")

