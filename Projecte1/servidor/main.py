from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import json
import os

app = FastAPI()

# Fitxer on es guardaran les cartes
DATA_FILE = "cartas.json"


# Funció per carregar les cartes del fitxer JSON
def cargar_cartes():
    if not os.path.exists(DATA_FILE):
        return [
            {
                "id": 1,
                "remitent": "Maria",
                "destinatari": "Joan",
                "contingut": "Hola Joan!",
                "personatge": "Einstein"
            },
            {
                "id": 2,
                "remitent": "Pau",
                "destinatari": "Anna",
                "contingut": "Com estàs?",
                "personatge": "Newton"
            },
            {
                "id": 3,
                "remitent": "Laura",
                "destinatari": "Marc",
                "contingut": "Ens veiem demà!",
                "personatge": "Einstein"
            }
        ]

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as fitxer:
            return json.load(fitxer)
    except (json.JSONDecodeError, OSError):
        return []


# Funció per guardar les cartes al fitxer JSON
def guardar_cartes(cartes):
    with open(DATA_FILE, "w", encoding="utf-8") as fitxer:
        json.dump(cartes, fitxer, ensure_ascii=False, indent=4)



# El model Pydantic: defineix què és una carta vàlida
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str


# Emmagatzematge en memòria
cartes = cargar_cartes()


# Crear una carta
@app.post("/cartas", status_code=201)
def crear_carta(carta: Carta):

    nova_carta = carta.model_dump()

    # Assignem un ID
    nova_carta["id"] = len(cartes) + 1

    # Guardem la carta
    cartes.append(nova_carta)

    # Guardem les cartes al fitxer JSON
    guardar_cartes(cartes)

    # Retornem la carta creada
    return nova_carta


# Ruta principal
@app.get("/")
def root():
    return {"missatge": "Hola, habibi!"}


# Obtenir una carta per ID
@app.get("/cartas/{id}")
def obtenir_carta(id: int):

    for c in cartes:
        if c["id"] == id:
            return c

    raise HTTPException(
        status_code=404,
        detail="Carta no trobada"
    )

@app.delete("/cartas/{id}")
def eliminar_carta(id: int):
    global cartes
    for c in cartes:
        if c["id"] == id:
            cartes.remove(c)
            guardar_cartes(cartes)
            return {"missatge": "Carta eliminada"}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Carta no trobada"
    )



# Llistar cartes amb limit, offset i filtre per personatge
@app.get("/cartas")
def llistar_cartes(limit: int = 10, offset: int = 0, personatge: str = None):

    if personatge:
        cartesFiltrades = [
            c for c in cartes
            if c["remitent"] == personatge
        ]
    else:
        cartesFiltrades = cartes

    return cartesFiltrades[offset:offset + limit]