import '@testing-library/jest-dom';
import {
    aplicarTemaGuardat, canviarTema,
    guardarUltimPersonatge, preomplirUltimPersonatge,
    guardarCartaEnProces, recuperarCartaEnProces
} from '../script.js';


beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.body.className = '';
    document.body.innerHTML = `<input id="personatge"><textarea id="contingut"></textarea>`;
});

//TEST 1: canviarTema alterna la classe i desa la preferència a localStorage

test('canviarTema alterna la classe i desa la preferència a localStorage', () => {
    canviarTema();
    expect(document.body).toHaveClass('tema-fosc');
    expect(localStorage.getItem('tema')).toBe('fosc');


    canviarTema();
    expect(document.body).not.toHaveClass('tema-fosc');
    expect(localStorage.getItem('tema')).toBe('clar');
});


//TEST 2: aplicarTemaGuardat recupera el tema fosc en carregar

test('aplicarTemaGuardat recupera el tema fosc en carregar', () => {
    localStorage.setItem('tema', 'fosc');
    aplicarTemaGuardat();
    expect(document.body).toHaveClass('tema-fosc');
});


//TEST 3: aplicarTemaGuardat recupera el tema clar en carregar  

test("l'últim personatge es desa i es preomple al formulari", () => {
    guardarUltimPersonatge('Einstein');
    preomplirUltimPersonatge();
    expect(document.querySelector('#personatge').value).toBe('Einstein');
});


//TEST 4: La carta en progrés es desa a sessionStorage i es recupera

test('la carta en progrés es desa a sessionStorage i es recupera', () => {
    guardarCartaEnProces('Estimat Einstein...');
    expect(sessionStorage.getItem('cartaEnProces')).toBe('Estimat Einstein...');
    recuperarCartaEnProces();
    expect(document.querySelector('#contingut').value).toBe('Estimat Einstein...');
});
