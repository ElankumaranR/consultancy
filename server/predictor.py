from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
CORS(app)

@app.route("/predict-sales", methods=["POST"])
def predict_sales():
    data = request.json
    sales_data = data["sales"]  # [{month: "2024-01", quantity: 120}, ...]

    df = pd.DataFrame(sales_data)
    df["month"] = pd.to_datetime(df["month"])
    df["month_num"] = (df["month"].dt.year - df["month"].dt.year.min()) * 12 + df["month"].dt.month

    X = df[["month_num"]]
    y = df["quantity"]

    model = LinearRegression()
    model.fit(X, y)

    year = data["year"]
    future_months = pd.date_range(start=f"{year}-01-01", end=f"{year}-12-01", freq="MS")
    future_month_nums = (future_months.year - df["month"].dt.year.min()) * 12 + future_months.month

    predictions = model.predict(future_month_nums.reshape(-1, 1))

    return jsonify({
        "predictions": [
            {"month": str(m.strftime("%Y-%m")), "quantity": round(qty)}
            for m, qty in zip(future_months, predictions)
        ]
    })

if __name__ == "__main__":
    app.run(port=5001)
