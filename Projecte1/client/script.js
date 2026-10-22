

console.log("✅ SCRIPT.JS SE HA CARGADO");
//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////

let nom = "Derick";
let edat = 30;

// MODIFICACIO! Array esborrat amb les 3 cartes simulades



//////////////////////////
// FUNCIONS            //
//////////////////////////

function saluda() {
    alert("Hola, Derick!");
}


// NOVETAT: Funció per mostrar errors (requerida pels tests)
function mostrarError(missatge) {
    console.error(missatge);
    alert(missatge);
}


// NOVETAT: Carreguem les cartes des del servidor mitjançant GET.
async function carregarCartes() {
    try {
        const response = await fetch("http://127.0.0.1:8000/cartas");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const cartes = await response.json();

        // Mostrem les cartes rebudes.
        renderitzarCartes(cartes);

    } catch (error) {
        console.error("Error carregant cartes:", error);

        // Utilitzem la funció mostrarError perquè els tests la puguin detectar
        mostrarError("No s'han pogut carregar les cartes");
    }
}


// MODIFICACIÓ: La funció rep el paràmetre cartes.
function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");

    // Si el contenidor no existeix, no fem res.
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
        btnEliminar.type = "button";
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
    console.log("✅ LA FUNCIÓN INICIALITZAR SE HA EJECUTADO");

    // Botó per mostrar o amagar la taula
const btnMostrarTaula = document.getElementById("btnMostrarTaula");
const seccioTaula = document.getElementById("seccioTaula");

if (btnMostrarTaula && seccioTaula) {
    btnMostrarTaula.addEventListener("click", () => {

        if (seccioTaula.style.display === "none") {
            seccioTaula.style.display = "block";
            btnMostrarTaula.textContent = "Amagar taula";
        } else {
            seccioTaula.style.display = "none";
            btnMostrarTaula.textContent = "Mostrar taula";
        }

    });
}

    // Botó per afegir cartes
    const btnAfegir = document.querySelector("#btnAfegir");

    if (btnAfegir) {
        btnAfegir.type = "button";

        btnAfegir.addEventListener("click", async () => {
            console.log("S'HA PULSAT EL BOTÓ AFEGIR");

            const novaCarta = {
                remitent: "Carter de prova",
                destinatari: "Destinatari de prova",
                contingut: "Aquesta carta s'acaba de crear dinàmicament!",
                personatge: "Einstein"
            };

            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/cartas",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(novaCarta)
                    }
                );

                console.log("Respuesta del POST:", response.status);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                // Tornem a carregar les cartes reals del servidor.
                await carregarCartes();

            } catch (error) {
                console.error("Error afegint la carta de prova:", error);
                mostrarError("No s'ha pogut afegir la carta de prova.");
            }
        });
    }

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
        contenidor.innerHTML = "<p>Carregant cartes...</p>";

        // Eliminem les cartes mitjançant una petició DELETE.
        contenidor.addEventListener("click", async (event) => {
            if (event.target.classList.contains("btn-eliminar")) {
                const id = Number(event.target.dataset.id);

                try {
                    const response = await fetch(
                        `http://127.0.0.1:8000/cartas/${id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    // Actualitzem la llista després d'eliminar.
                    await carregarCartes();

                } catch (error) {
                    console.error("Error eliminant la carta:", error);
                    mostrarError("No s'ha pogut eliminar la carta.");
                }
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


    // Formulari de carta
    const formCarta = document.querySelector("#formCarta");

    if (formCarta) {

        // NOVETAT: Enviem la carta al servidor mitjançant POST.
        formCarta.addEventListener("submit", async (event) => {
            event.preventDefault();
            console.log("FORMULARIO ENVIADO");

            const remitent = document.querySelector("#remitent").value.trim();
            const destinatari = document.querySelector("#destinatari").value.trim();
            const contingut = document.querySelector("#contingut").value.trim();
            const personatge = document.querySelector("#personatge").value.trim();

            if (!remitent || !destinatari || !contingut) {
                mostrarError("Has d'omplir el remitent, destinatari i contingut.");
                return;
            }

            // Preparem les dades de la carta que enviarem al servidor.
            const novaCarta = {
                remitent: remitent,
                destinatari: destinatari,
                contingut: contingut,
                personatge: personatge
            };

            try {

                const response = await fetch(
                    "http://127.0.0.1:8000/cartas",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(novaCarta)
                    }
                );
                console.log("Respuesta del POST:", response.status);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                // NOVETAT: Netegem el formulari després d'enviar.
                formCarta.reset();

                // NOVETAT: Refresquem la llista després del POST.
                await carregarCartes();

            } catch (error) {
                console.error("Error enviant la carta:", error);
                mostrarError("No s'ha pogut enviar la carta.");
            }
        });
    }
}


//////////////////////////
// CODI D'INICIALITZACIÓ //
//////////////////////////

// NOVETAT: Quan es carrega el DOM, inicialitzem l'aplicació
// i carreguem les cartes des del servidor.
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        inicialitzar();
        carregarCartes();
    });
}


// Exportem totes les funcions necessàries per als tests de Jest.
export { renderitzarCartes, carregarCartes, mostrarError };