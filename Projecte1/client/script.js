//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////

let nom = "Derick";
let edat = 30;

// Array amb les 3 cartes simulades
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
    alert("Hola, Derick!");
}


// Funció per mostrar les cartes
function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");

    // Si el contenidor no existeix, no fem res
    if (!contenidor) return;

    contenidor.innerHTML = "";

    cartes.forEach(carta => {
        const divCarta = document.createElement("div");
        divCarta.classList.add("carta");

        const h3 = document.createElement("h3");
        h3.textContent = "De: " + carta.remitent;

        const p = document.createElement("p");
        p.textContent = carta.contingut;

        const span = document.createElement("span");
        span.textContent = "ID: " + carta.id;
        span.setAttribute("data-id", carta.id);

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = carta.id;

        divCarta.appendChild(h3);
        divCarta.appendChild(p);
        divCarta.appendChild(span);
        divCarta.appendChild(btnEliminar);

        contenidor.appendChild(divCarta);
    });
}


// Funció d'inicialització
function inicialitzar() {

    // Botó de saludar
    const boto = document.getElementById("btnSaluda");

    if (boto) {
        boto.addEventListener("click", saluda);
    }

    // Títol principal
    const titol = document.querySelector("#titolPrincipal");

    if (titol) {
        titol.textContent = "📮 El Cartero Invisible – Setmana 2";
        titol.setAttribute("data-role", "banner");
    }

    // Contenidor de cartes
    const contenidor = document.querySelector("#contenidorCartes");

    if (contenidor) {
        contenidor.innerHTML = "<p>Cartes pendents: 0</p>";

        // Mostrar les cartes inicials
        renderitzarCartes(cartesSimulades);

        // Delegació d'esdeveniments per eliminar cartes
        contenidor.addEventListener("click", (event) => {
            if (event.target.classList.contains("btn-eliminar")) {
                const id = Number(event.target.dataset.id);

                cartesSimulades = cartesSimulades.filter(
                    carta => carta.id !== id
                );

                renderitzarCartes(cartesSimulades);
            }
        });
    }

    // Informació
    const info = document.querySelector(".info");

    if (info) {
        info.style.color = "#2c3e50";
    }

    // Buzón
    const buzon = document.getElementById("buzon");

    if (buzon) {
        buzon.addEventListener("click", () => {
            alert("📬 Has abierto el buzón!");
        });
    }

    // Botó per afegir cartes
    const btnAfegir = document.querySelector("#btnAfegir");

    if (btnAfegir) {
        btnAfegir.addEventListener("click", () => {
            const nouId = Math.max(
                0,
                ...cartesSimulades.map(carta => carta.id)
            ) + 1;

            cartesSimulades.push({
                id: nouId,
                remitent: "Carter " + nouId,
                contingut: "Aquesta carta s'acaba de crear dinàmicament!"
            });

            renderitzarCartes(cartesSimulades);
        });
    }

    // Formulari de carta
    const formCarta = document.querySelector("#formCarta");

    if (formCarta) {
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

            const nouId = Math.max(
                0,
                ...cartesSimulades.map(carta => carta.id)
            ) + 1;

            cartesSimulades.push({
                id: nouId,
                remitent: remitent,
                destinatari: destinatari,
                contingut: contingut,
                personatge: personatge
            });

            renderitzarCartes(cartesSimulades);
            formCarta.reset();
        });
    }
}


////////////////
// CODI       //
////////////////

// No inicialitzem automàticament l'aplicació durant els tests de Jest
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", inicialitzar);
}


// Exportem la funció per als tests
export { renderitzarCartes };
