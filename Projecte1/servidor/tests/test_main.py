import json
import pytest
from httpx import ASGITransport, AsyncClient
from main import app


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/")

        assert response.status_code == 200
        assert response.json() == {"missatge": "Hola, habibi!"}


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


@pytest.mark.asyncio
async def test_get_cartes_paginades():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/cartas?limit=1&offset=0")

        assert response.status_code == 200
        assert len(response.json()) == 1


@pytest.mark.asyncio
async def test_create_carta():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        payload = {
            "remitent": "Pau",
            "destinatari": "Anna",
            "contingut": "Hola Anna!",
            "personatge": "Einstein"
        }

        response = await ac.post("/cartas", json=payload)

        assert response.status_code == 201
        assert response.json()["id"] is not None
        assert response.json()["remitent"] == "Pau"


@pytest.mark.asyncio
async def test_create_carta_invalid():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        payload = {"remitent": "Pau"}

        response = await ac.post("/cartas", json=payload)

        assert response.status_code == 422


# TEST 6: Persistència de les cartes al fitxer JSON
@pytest.mark.asyncio
async def test_persistencia_post():
    with open("cartas.json", "r") as f:
        dades_abans = json.load(f)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {"remitent": "Test", "destinatari": "Test", "contingut": "Test", "personatge": "Test"}
        await ac.post("/cartas", json=payload)

    with open("cartas.json", "r") as f:
        dades_despres = json.load(f)

    assert len(dades_despres) == len(dades_abans) + 1

@pytest.mark.asyncio
async def test_delete_carta():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.delete("/cartas/1")
        assert response.status_code == 200

    with open("cartas.json", "r") as f:
        dades = json.load(f)
    assert not any(c["id"] == 1 for c in dades)



# TEST 7: Eliminació d'una carta
@pytest.mark.asyncio
async def test_delete_carta():
    # Comprovem que la carta amb ID 1 existeix
    with open("cartas.json", "r", encoding="utf-8") as f:
        dades_abans = json.load(f)

    assert any(c["id"] == 1 for c in dades_abans)

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.delete("/cartas/1")

        assert response.status_code == 200

    # Comprovem que la carta s'ha eliminat del fitxer
    with open("cartas.json", "r", encoding="utf-8") as f:
        dades_despres = json.load(f)

    assert not any(c["id"] == 1 for c in dades_despres)