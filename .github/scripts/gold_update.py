import urllib.request
import json
import os
import time
from datetime import datetime

# Configuration du chemin
path = "JustTEST/bot_test/logger.txt"
os.makedirs(os.path.dirname(path), exist_ok=True)

def get_gold_price():
    # Symbole pour l'Or (XAUUSD=X)
    url = "https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X?interval=1m&range=1d"
    
    # CRITIQUE : Yahoo bloque les scripts qui n'ont pas de "User-Agent" (identité de navigateur)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            # Extraction précise du dernier prix de clôture
            price = data['chart']['result'][0]['meta']['regularMarketPrice']
            return f"{price:.2f}"
    except Exception as e:
        print(f"Erreur lors de la récupération : {e}")
        return None

# Execution
price = get_gold_price()
if price:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    with open(path, "a") as f:
        f.write(f"[{timestamp}] XAU/USD : {price} USD\n")
    print(f"Mise à jour réussie : {price}")
else:
    print("Impossible de récupérer le prix.")
