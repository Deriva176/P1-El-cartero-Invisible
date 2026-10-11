import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { renderitzarCartes } from '../script.js';


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


test('el botó mostra un alert amb "Hola, món!"', () => {
    document.body.innerHTML = `<button id="btnSaluda">Saluda</button>`;

    // Mock de window.alert per poder-lo verificar
    window.alert = jest.fn();
    window.saluda = jest.fn(() => alert('Hola, món!'));

    const button = document.getElementById('btnSaluda');
    button.addEventListener('click', window.saluda);

    fireEvent.click(button);

    expect(window.saluda).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hola, món!');
});


test('canvia el text i l\'estil del títol', () => {
    document.body.innerHTML = `<h1 id="titol">El Cartero Invisible</h1>`;

    const titol = document.getElementById('titol');

    // Simula l'execució del teu codi
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

    // Simulem la delegació d'esdeveniments
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


// TEST 5: Validació del formulari
test('validació del formulari: no permet enviar camps buits', () => {
    document.body.innerHTML = `
        <form id="formCarta">
            <input type="text" id="remitent" required>
            <input type="text" id="destinatari" required>
            <textarea id="contingut" required></textarea>
            <button type="submit">Enviar carta</button>
        </form>
    `;

    const formulari = document.getElementById('formCarta');
    let enviat = false;

    formulari.addEventListener('submit', (event) => {
        event.preventDefault();

        const remitent = document.getElementById('remitent').value.trim();
        const destinatari = document.getElementById('destinatari').value.trim();
        const contingut = document.getElementById('contingut').value.trim();

        if (!remitent || !destinatari || !contingut) {
            return;
        }

        enviat = true;
    });

    // Simulem l'enviament del formulari
    fireEvent.submit(formulari);

    expect(enviat).toBe(false);
});