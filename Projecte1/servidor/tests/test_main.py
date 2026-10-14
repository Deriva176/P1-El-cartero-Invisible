import json
import pytest
import main
from main import app
from httpx import ASGITransport, AsyncClient


CARTES_INICIALS = [
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

# TEST 1: Comprueba que la ruta principal funciona correctamente.
@pytest.fixture(autouse=True)
def reiniciar_cartes(tmp_path, monkeypatch):
    fitxer_test = tmp_path / "cartas.json"

    fitxer_test.write_text(
        json.dumps(CARTES_INICIALS, ensure_ascii=False, indent=4),
        encoding="utf-8"
    )

    monkeypatch.setattr(main, "DATA_FILE", str(fitxer_test))
    main.cartes = [c.copy() for c in CARTES_INICIALS]


# TEST 2: Comprueba que se puede obtener una carta por su ID.
@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/")

    assert response.status_code == 200
    assert response.json() == {"missatge": "Hola, habibi!"}


# TEST 3: Comprueba que se pueden listar las cartas con paginación.
@pytest.mark.asyncio
async def test_get_carta_by_id():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartas/1")
        assert response.status_code == 200
        assert response.json()["id"] == 1

        response = await ac.get("/cartas/999")
        assert response.status_code == 404


# TEST 4: Comprueba que se puede crear una carta nueva.
@pytest.mark.asyncio
async def test_get_cartes_paginades():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartas?limit=1&offset=0")

    assert response.status_code == 200
    assert len(response.json()) == 1


# TEST 5: Comprueba que no se puede crear una carta con datos incompletos.
@pytest.mark.asyncio
async def test_create_carta():
    payload = {
        "remitent": "Pau",
        "destinatari": "Anna",
        "contingut": "Hola Anna!",
        "personatge": "Einstein"
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/cartas", json=payload)

    assert response.status_code == 201
    assert response.json()["id"] == 4
    assert response.json()["remitent"] == "Pau"


# TEST 6: Comprueba que las cartas creadas se guardan en el archivo JSON.
@pytest.mark.asyncio
async def test_create_carta_invalid():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/cartas",
            json={"remitent": "Pau"}
        )

    assert response.status_code == 422


# 6 Test de persistencia 
@pytest.mark.asyncio
async def test_persistencia_post():
    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades_abans = json.load(f)

    payload = {
        "remitent": "Test",
        "destinatari": "Test",
        "contingut": "Test",
        "personatge": "Test"
    }

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.post("/cartas", json=payload)

    assert response.status_code == 201

    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades_despres = json.load(f)

    assert len(dades_despres) == len(dades_abans) + 1


# TEST 7: Comprueba que se puede eliminar una carta por su ID.
@pytest.mark.asyncio
async def test_delete_carta():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.delete("/cartas/1")

    assert response.status_code == 200

    with open(main.DATA_FILE, "r", encoding="utf-8") as f:
        dades = json.load(f)

    assert not any(c["id"] == 1 for c in dades)