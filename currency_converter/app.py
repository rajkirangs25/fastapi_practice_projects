from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import requests, time

app = FastAPI()

templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory = "static"), name = "static")

BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies"

def fetch_with_retry(url, retries = 3, delay = 2, timeout = 5):
    for i in range(retries):
        try:
            response = requests.get(url, timeout = timeout)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            if i < retries - 1:
                time.sleep(delay)
                continue
            else:
                raise e

@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {'request': request, 'message': "Currency Converter with FastAPI"})

@app.get('/rates/{base_currency}')
def get_rates(base_currency: str):
    url = f'{BASE_URL}/{base_currency.lower()}.json'
    response = fetch_with_retry(url)
    return response

@app.get("/convert/{base}/{target}")
def convert_currency(base: str, target: str):
    url = f"{BASE_URL}/{base.lower()}.json"
    response = fetch_with_retry(url)
    rate = response.get(base.lower(), {}).get(target.lower())
    if rate is None:
        return {"error": f"Conversion rate for {target.upper()} not found."}
    return {"base": base.upper(), "target": target.upper(), "rate": rate}