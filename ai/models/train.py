# ai/models/train.py

import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)


# ============================================================
# 1. PATH CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_PATH = BASE_DIR / "ai" / "data" / "symptom_assessments.csv"

MODEL_DIR = BASE_DIR / "ai" / "models" / "saved"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "medisense_condition_model.joblib"


# ============================================================
# 2. LOAD DATASET
# ============================================================

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# ============================================================
# 3. DEFINE FEATURES AND TARGET
# ============================================================

target_column = "probable_condition_label"

# Columns that should NOT be used as ML features
excluded_columns = [
    "patient_id",
    "probable_condition_label",
    "urgency_label_demo",
]

feature_columns = [
    column for column in df.columns
    if column not in excluded_columns
]

X = df[feature_columns]
y = df[target_column]


print(f"\nNumber of features: {X.shape[1]}")
print(f"Number of target classes: {y.nunique()}")

print("\nTarget classes:")
print(y.value_counts())


# ============================================================
# 4. IDENTIFY FEATURE TYPES
# ============================================================

categorical_features = [
    "sex"
]

numeric_features = [
    column
    for column in feature_columns
    if column != "sex"
]


# ============================================================
# 5. PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features,
        ),
        (
            "numeric",
            "passthrough",
            numeric_features,
        ),
    ]
)


# ============================================================
# 6. CREATE ML MODEL
# ============================================================

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced",
    n_jobs=-1,
)


# ============================================================
# 7. CREATE COMPLETE PIPELINE
# ============================================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", model),
    ]
)


# ============================================================
# 8. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y,
)


print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 9. TRAIN MODEL
# ============================================================

print("\nTraining MediSense AI model...")

pipeline.fit(X_train, y_train)

print("Training completed successfully.")


# ============================================================
# 10. MAKE PREDICTIONS
# ============================================================

y_pred = pipeline.predict(X_test)


# ============================================================
# 11. MODEL EVALUATION
# ============================================================

accuracy = accuracy_score(y_test, y_pred)

print("\n" + "=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

print(f"\nAccuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0,
    )
)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ============================================================
# 12. SAVE TRAINED MODEL
# ============================================================

joblib.dump(
    pipeline,
    MODEL_PATH,
)

print("\n" + "=" * 60)
print("MODEL SAVED")
print("=" * 60)

print(f"Model path: {MODEL_PATH}")