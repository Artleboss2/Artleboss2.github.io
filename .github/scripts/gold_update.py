import yfinance as yf
import os
from datetime import datetime

# Chemin demandé
path = "JustTEST/bot_test/logger.txt"

# Créer le dossier s'il n'existe pas
os.makedirs(os.path.dirname(path), exist_ok=True)

def update_gold_price():
    try:
        # Récupération du cours de l'or
        gold = yf.Ticker("XAUUSD=X")
        price = gold.history(period="1d")['Close'].iloc[-1]
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry = f"[{timestamp}] XAU/USD : {price:.2f} USD\n"
        
        # Ecriture dans le fichier
        with open(path, "a") as f:
            f.write(entry)
        print(f"Succès : {entry}")
    except Exception as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    update_gold_price()
