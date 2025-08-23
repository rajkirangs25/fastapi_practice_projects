from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import requests

app = FastAPI()

templates = Jinja2Templates(directory="templates")

BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies"

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {'request': request, 'message': "Currency Converter with FastAPI"})

@app.get('/rates/{base_currency}')
def get_rates(base_currency: str):
    url = f'{BASE_URL}/{base_currency.lower()}.json'
    response = requests.get(url).json()
    return response

@app.get("/convert/{base}/{target}")
def convert_currency(base: str, target: str):
    url = f"{BASE_URL}/{base.lower()}.json"
    response = requests.get(url).json()
    rate = response.get(base.lower(), {}).get(target.lower())
    return {"base": base.upper(), "target": target.upper(), "rate": rate}