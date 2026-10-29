import { jest } from '@jest/globals';
import { actualitzarCarta, eliminarCarta } from '../script.js';

global.fetch = jest.fn();
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
});

// TEST: 1 PETICIO PUT
test('actualitzarCarta fa una petició PUT amb les capçaleres i cos correctes', async () => {
    const dades = {
        remitent: 'Nou',
        destinatari: 'Nou',
        contingut: 'Nou',
        personatge: 'Nou'
    };

    global.fetch
        .mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ ...dades, id: 1 })
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [{ ...dades, id: 1 }]
        });

    await actualitzarCarta(1, dades);

    expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/cartas/1',
        expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(dades),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    );
});


// TEST 2: PETICIO DELETE
test('eliminarCarta fa una petició DELETE a la URL correcta', async () => {
    global.fetch
        .mockResolvedValueOnce({
            ok: true,
            status: 204
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

    await eliminarCarta(5);

    expect(global.fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/cartas/5',
        expect.objectContaining({
            method: 'DELETE'
        })
    );
});


// TEST 3: ACTUALITZAR CARTA GESTIO DE ERROR 404
test('actualitzarCarta gestiona un error si el servidor respon 404', async () => {
    global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
    });

    const resultat = await actualitzarCarta(999, {});

    expect(resultat).toBe(false);

    expect(global.alert).toHaveBeenCalledWith(
        "No s'ha pogut actualitzar la carta."
    );
});