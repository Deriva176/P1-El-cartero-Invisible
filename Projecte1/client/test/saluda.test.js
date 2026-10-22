import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { renderitzarCartes } from '../script.js';
import { carregarCartes } from '../script.js';



// TEST 1: Renderitza les cartes correctament
test('renderitza les cartes correctament', () => {
    const cartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola!' },
        { id: 2, remitent: 'Joan', contingut: 'Com estàs?' }
    ];

    document.body.innerHTML = `<div id="contenidorCartes"></div>`;

    renderitzarCartes(cartes);

    const cartesElements = document.querySelectorAll('.carta'); 

    expect(cartesElements.length).toBe(2);
    expect(cartesElements[0].querySelector('h3').textContent).toBe('De: Maria');
    expect(cartesElements[0].querySelector('p').textContent).toBe('Hola!');
});

// TEST 2: El botó mostra un alert amb "Hola, món!"
test('el botó mostra un alert amb "Hola, món!"', () => {
    document.body.innerHTML = `<button id="btnSaluda">Saluda</button>`;

    window.alert = jest.fn();
    window.saluda = jest.fn(() => alert('Hola, món!'));

    const button = document.getElementById('btnSaluda');
    button.addEventListener('click', window.saluda);

    fireEvent.click(button);

    expect(window.saluda).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hola, món!');
});

// TEST 3: Canvia el text i l'estil del títol
test('canvia el text i l\'estil del títol', () => {
    document.body.innerHTML = `<h1 id="titol">El Cartero Invisible</h1>`;

    const titol = document.getElementById('titol');

    titol.textContent = '📮 El Cartero Invisible – Setmana 2';
    titol.style.color = '#2c3e50';
    titol.setAttribute('data-role', 'banner');

    expect(titol.textContent).toBe('📮 El Cartero Invisible – Setmana 2');
    expect(titol.style.color).toBe('rgb(44, 62, 80)');
    expect(titol.getAttribute('data-role')).toBe('banner');
});

// TEST 4: Delegació d'esdeveniments per eliminar una carta
test('delegació d\'events: elimina carta en clicar el botó', async () => {
    document.body.innerHTML = `
        <div id="contenidorCartes">
            <div class="carta" data-id="1">
                <button class="btn-eliminar">Eliminar</button>
            </div>
        </div>
    `;

    const contenidor = document.getElementById('contenidorCartes');

    contenidor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const carta = e.target.closest('.carta');
            carta.remove();
        }
    });

    const user = userEvent.setup();
    const btn = document.querySelector('.btn-eliminar');

    await user.click(btn);

    expect(document.querySelectorAll('.carta').length).toBe(0);
});

// TEST 5: Carrega les cartes correctament
test('carregarCartes carrega les cartes correctament', async () => {
    const mockCartes = [
        { id: 1, remitent: 'Maria', contingut: 'Hola' },
        { id: 2, remitent: 'Joan', contingut: 'Adeu'}
    ];

    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCartes,
    });

    await carregarCartes();

    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/cartas');
    const cartesElements = document.querySelectorAll('.carta')
    expect(cartesElements.length).toBe(2);
});
