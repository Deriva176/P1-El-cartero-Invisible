from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()


# El model Pydantic: defineix què és una carta vàlida
class Carta(BaseModel):
    remitent: str
    destinatari: str
    contingut: str
    personatge: str


# Emmagatzematge en memòria
cartes = [
    {
        "id": 1, "remitent": "Maria", "destinatari": "Joan", "contingut": "Hola Joan!", "personatge": "Einstein"
    },
    {
        "id": 2, "remitent": "Pau", "destinatari": "Anna", "contingut": "Com estàs?", "personatge": "Newton"
    },
    {
        "id": 3, "remitent": "Laura", "destinatari": "Marc", "contingut": "Ens veiem demà!", "personatge": "Einstein"
    }
]


# Crear una carta
@app.post("/cartas", status_code=201)
def crear_carta(carta: Carta):

    nova_carta = carta.model_dump()

    # Assignem un ID
    nova_carta["id"] = len(cartes) + 1

    # Guardem la carta
    cartes.append(nova_carta)

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