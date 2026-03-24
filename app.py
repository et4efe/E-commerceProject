from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import pickle
import pandas as pd
from pydantic import BaseModel, Field, ConfigDict
import os


app = FastAPI()

base_dir = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(base_dir, "templates")
static_path = os.path.join(base_dir, "static")
templates = Jinja2Templates(directory=template_path)
app.mount("/static", StaticFiles(directory=static_path), name="static")


with open("e-commerce_model_complete.pkl", "rb") as f:
    saved_data = pickle.load(f)
    model = saved_data["model"]
    scaler = saved_data["scaler"]

class EcommerceFeatures(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    avg_session_length: float = Field(alias="Avg. Session Length")
    time_on_app: float = Field(alias="Time on App")
    length_of_membership: float = Field(alias="Length of Membership")



@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/predict")
async def predict(features : EcommerceFeatures):
    input_data = pd.DataFrame([[
        features.avg_session_length,
        features.time_on_app,
        features.length_of_membership
    ]], columns = ["Avg. Session Length", "Time on App", "Length of Membership"])


    input_scaled = scaler.transform(input_data)

    prediction = model.predict(input_scaled)
    result = float(prediction[0])

    return {"predicted_spent": result}