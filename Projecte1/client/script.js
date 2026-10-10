//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////
let nom = "Pepe";
let edat = 30;

// Array con les 3 cartes simulades
let cartesSimulades = [
    {
        id: 1,
        remitent: "Carter 1",
        contingut: "Hola! Aquesta és la primera carta."
    },
    {
        id: 2,
        remitent: "Carter 2",
        contingut: "Aquesta és la segona carta."
    },
    {
        id: 3,
        remitent: "Carter 3",
        contingut: "I aquesta és la tercera carta."
    }
];


//////////////////////////
// FUNCIONS             //
//////////////////////////


function saluda() {
    alert("Hola, món!");
}




// Funció per mostrar les cartes
function renderitzarCartes(cartes) {

    const contenidor = document.querySelector("#contenidorCartes");

    // Buidem el contenidor
    contenidor.innerHTML = "";

    // Recorrem totes les cartes
    cartes.forEach(carta => {

        // Creem el div principal
        const divCarta = document.createElement("div");
        divCarta.classList.add("carta");

        // Creem el h3 amb el remitent
        const h3 = document.createElement("h3");
        h3.textContent = "De: " + carta.remitent;

        // Creem el p amb el contingut
        const p = document.createElement("p");
        p.textContent = carta.contingut;

        // Creem el span amb l'ID
        const span = document.createElement("span");
        span.textContent = "ID: " + carta.id;
        span.setAttribute("data-id", carta.id);

        //Creem el botó d'eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = carta.id;

        // Afegim l'esdeveniment al botó d'eliminar
        // Afegim els elements al div
        divCarta.appendChild(h3);
        divCarta.appendChild(p);
        divCarta.appendChild(span);
        divCarta.appendChild(btnEliminar);


        // Afegim la carta al contenidor
        contenidor.appendChild(divCarta);
    });
}


// Funció d'inicialització
function inicialitzar() {

    // Botó de saludar
    const boto = document.getElementById("btnSaluda");
    boto.addEventListener("click", saluda);


    // Títol principal
    const titol = document.querySelector("#titolPrincipal");
    titol.textContent = "📮 El Cartero Invisible – Setmana 2";
    titol.setAttribute("data-role", "banner");


    // Contenidor de cartes
    const contenidor = document.querySelector("#contenidorCartes");
    contenidor.innerHTML += "<p>Cartes pendents: 0</p>";


    // Informació
    const info = document.querySelector(".info");
    info.style.color = "#2c3e50";

    // Buzón
    const buzon = document.getElementById("buzon");
    buzon.addEventListener("click", () => {
    alert("📬 Has abierto el buzón!");
    })
};

    // Mostrar les cartes inicials
    renderitzarCartes(cartesSimulades);


    // Botó per afegir cartes
    document.querySelector("#btnAfegir").addEventListener("click", () => {

        cartesSimulades.push({
            id: cartesSimulades.length + 1,
            remitent: "Carter " + (cartesSimulades.length + 1),
            contingut: "Aquesta carta s'acaba de crear dinàmicament!"
        });
    });

        renderitzarCartes(cartesSimulades);

        const contenidorCartes = document.querySelector("#contenidorCartes");
        contenidorCartes.addEventListener("click", (event) => {

            if (event.target.classList.contains("btn-eliminar")) {
                const id = Number(event.target.dataset.id);
                cartesSimulades = cartesSimulades.filter(carta => carta.id !== id);
                renderitzarCartes(cartesSimulades);
}
    });


//FORMULARI DE CARTA
const formCarta = document.querySelector("#formCarta");

formCarta.addEventListener("submit", (event) => {

    event.preventDefault();

    const remitent = document.querySelector("#remitent").value.trim();
    const destinatari = document.querySelector("#destinatari").value.trim();
    const contingut = document.querySelector("#contingut").value.trim();
    const personatge = document.querySelector("#personatge").value.trim();

    if (!remitent || !destinatari || !contingut) {
        alert("Has d'omplir el remitent, destinatari i contingut.");
        return;
    }

    cartesSimulades.push({
        id: cartesSimulades.length + 1,
        remitent: remitent,
        destinatari: destinatari,
        contingut: contingut,
        personatge: personatge
    });

    renderitzarCartes(cartesSimulades);

    formCarta.reset();
});


//////////////////////////
// CODI                 //
//////////////////////////


// Executa-ho només si estem al navegador
// (evitant problemes a Node/Jest)
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", inicialitzar);
}


// Exporta el que necessitem per fer els tests
export { renderitzarCartes }
