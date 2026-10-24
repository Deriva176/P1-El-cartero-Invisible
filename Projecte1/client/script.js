console.log("✅ SCRIPT.JS SE HA CARGADO");

//////////////////////////
// VARIABLES GLOBALS    //
//////////////////////////

let nom = "Derick";
let edat = 30;

// Array de cartes simulades eliminat.


//////////////////////////
// FUNCIONS             //
//////////////////////////

function saluda() {
    alert("Hola, Derick!");
}


// Funció per mostrar errors
function mostrarError(missatge) {
    console.error(missatge);
    alert(missatge);
}


// Carregar les cartes des del servidor
async function carregarCartes() {
    try {
        const response = await fetch("http://127.0.0.1:8000/cartas");

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const cartes = await response.json();

        renderitzarCartes(cartes);
        renderitzarTaula(cartes);

    } catch (error) {
        console.error("Error carregant cartes:", error);
        mostrarError("No s'han pogut carregar les cartes");
    }
}


// Mostrar o amagar l'indicador de càrrega
function mostrarCarrega(mostrar) {
    const indicador = document.getElementById("indicadorCarrega");

        if (indicador) {
        indicador.style.display = mostrar ? "block" : "none";
    }

    document.querySelectorAll("button").forEach(boto => {
        boto.disabled = mostrar;
    });
}


// Renderitzar les cartes
function renderitzarCartes(cartes) {
    const contenidor = document.querySelector("#contenidorCartes");

    if (!contenidor) return;

    contenidor.innerHTML = "";

    cartes.forEach(carta => {
        const divCarta = document.createElement("div");
        divCarta.classList.add("carta");

        const h3 = document.createElement("h3");
        h3.textContent = "De: " + carta.remitent;

        const pDestinatari = document.createElement("p");
        pDestinatari.textContent = "Per a: " + carta.destinatari;

        const pContingut = document.createElement("p");
        pContingut.textContent = carta.contingut;

        const pPersonatge = document.createElement("p");
        pPersonatge.textContent =
            "Personatge: " + (carta.personatge || "No especificat");

        const span = document.createElement("span");
        span.textContent = "ID: " + carta.id;

        // Botó Editar
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.textContent = "Editar";
        btnEditar.className = "btn-editar";
        btnEditar.dataset.id = carta.id;

        // Botó Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = carta.id;

        divCarta.appendChild(h3);
        divCarta.appendChild(pDestinatari);
        divCarta.appendChild(pContingut);
        divCarta.appendChild(pPersonatge);
        divCarta.appendChild(span);
        divCarta.appendChild(document.createElement("br"));
        divCarta.appendChild(btnEditar);
        divCarta.appendChild(btnEliminar);

        contenidor.appendChild(divCarta);
    });
}


// Actualitzar una carta
async function actualitzarCarta(id, dades) {
    try {
        mostrarCarrega(true);

        const response = await fetch(
            `http://127.0.0.1:8000/cartas/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dades)
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        await carregarCartes();

        return true;

    } catch (error) {
        console.error("Error actualitzant la carta:", error);
        mostrarError("No s'ha pogut actualitzar la carta.");
        return false;

    } finally {
        mostrarCarrega(false);
    }
}


// Eliminar una carta
async function eliminarCarta(id) {
    const confirmacio = confirm(
        "Segur que vols eliminar aquesta carta?"
    );

    if (!confirmacio) return;

    try {
        mostrarCarrega(true);

        const response = await fetch(
            `http://127.0.0.1:8000/cartas/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        await carregarCartes();

    } catch (error) {
        console.error("Error eliminant la carta:", error);
        mostrarError("No s'ha pogut eliminar la carta.");

    } finally {
        mostrarCarrega(false);
    }
}


// Renderitzar la taula de cartes
function renderitzarTaula(cartes) {
    const cosTaula = document.getElementById("cosTaula");

    if (!cosTaula) return;

    cosTaula.innerHTML = "";

    cartes.forEach(carta => {
        const fila = document.createElement("tr");

        // ID
        const tdId = document.createElement("td");
        tdId.textContent = carta.id;
        fila.appendChild(tdId);

        // Remitent
        const tdRemitent = document.createElement("td");
        tdRemitent.textContent = carta.remitent;
        fila.appendChild(tdRemitent);

        // Destinatari
        const tdDestinatari = document.createElement("td");
        tdDestinatari.textContent = carta.destinatari;
        fila.appendChild(tdDestinatari);

        // Contingut
        const tdContingut = document.createElement("td");
        const contingut = carta.contingut || "";

        tdContingut.textContent = contingut.length > 50
            ? contingut.substring(0, 50) + "..."
            : contingut;

        fila.appendChild(tdContingut);

        // Personatge
        const tdPersonatge = document.createElement("td");
        tdPersonatge.textContent = carta.personatge || "No especificat";
        fila.appendChild(tdPersonatge);

        // Accions
        const tdAccions = document.createElement("td");

        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.dataset.id = carta.id;

        tdAccions.appendChild(btnEliminar);
        fila.appendChild(tdAccions);

        cosTaula.appendChild(fila);
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


    // Botó per afegir cartes de prova
    const btnAfegir = document.querySelector("#btnAfegirCarta");

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


    // Gestionar els botons Editar i Eliminar
    const contenidorCartes = document.getElementById("contenidorCartes");

    if (contenidorCartes) {
        contenidorCartes.addEventListener("click", async event => {

            const botoPremut = event.target.closest("button");

            if (!botoPremut) return;


            // EDITAR
            if (botoPremut.classList.contains("btn-editar")) {
                const id = Number(botoPremut.dataset.id);

                try {
                    mostrarCarrega(true);

                    const response = await fetch(
                        `http://127.0.0.1:8000/cartas/${id}`
                    );

                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    const carta = await response.json();

                    document.getElementById("editarId").value = carta.id;

                    document.getElementById("editarRemitent").value =
                        carta.remitent || "";

                    document.getElementById("editarDestinatari").value =
                        carta.destinatari || "";

                    document.getElementById("editarContingut").value =
                        carta.contingut || "";

                    document.getElementById("editarPersonatge").value =
                        carta.personatge || "";

                    // CORRECCIÓ: utilitzem modalEditar, no seccioEditar
                    const modalEditar = document.getElementById("modalEditar");

                    if (!modalEditar) {
                        throw new Error(
                            "No s'ha trobat la finestra d'edició."
                        );
                    }

                    modalEditar.style.display = "flex";

                } catch (error) {
                    console.error("Error carregant la carta:", error);
                    mostrarError(
                        "No s'han pogut carregar les dades de la carta."
                    );

                } finally {
                    mostrarCarrega(false);
                }
            }


            // ELIMINAR
            if (botoPremut.classList.contains("btn-eliminar")) {
                const id = Number(botoPremut.dataset.id);
                await eliminarCarta(id);
            }
        });
    }


    // Informació
    const info = document.querySelector(".info");

    if (info) {
        info.style.color = "#2c3e50";
    }


    // Bústia
    const buzon = document.getElementById("buzon");

    if (buzon) {
        buzon.addEventListener("click", () => {
            alert("📬 Has abierto el buzón!");
        });
    }


    // Formulari per crear una carta
    const formCarta = document.querySelector("#formCarta");

    if (formCarta) {
        formCarta.addEventListener("submit", async event => {
            event.preventDefault();

            console.log("FORMULARIO ENVIADO");

            const remitent = document.querySelector("#remitent").value.trim();
            const destinatari = document.querySelector("#destinatari").value.trim();
            const contingut = document.querySelector("#contingut").value.trim();
            const personatge = document.querySelector("#personatge").value.trim();

            if (!remitent || !destinatari || !contingut) {
                mostrarError(
                    "Has d'omplir el remitent, destinatari i contingut."
                );
                return;
            }

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

                formCarta.reset();

                await carregarCartes();

            } catch (error) {
                console.error("Error enviant la carta:", error);
                mostrarError("No s'ha pogut enviar la carta.");
            }
        });
    }


    // Formulari d'edició
    const formEditar = document.getElementById("formEditar");

    if (formEditar) {
        formEditar.addEventListener("submit", async event => {
            event.preventDefault();

            const id = Number(
                document.getElementById("editarId").value
            );

            const dades = {
                remitent: document.getElementById("editarRemitent").value.trim(),
                destinatari: document.getElementById("editarDestinatari").value.trim(),
                contingut: document.getElementById("editarContingut").value.trim(),
                personatge: document.getElementById("editarPersonatge").value.trim()
            };

            // Validació
            if (
                !dades.remitent ||
                !dades.destinatari ||
                !dades.contingut
            ) {
                mostrarError(
                    "Has d'omplir el remitent, el destinatari i el contingut."
                );
                return;
            }

            const btnDesar = document.getElementById("btnDesarEdicio");

            if (btnDesar) {
                btnDesar.disabled = true;
            }

            try {
                const correcte = await actualitzarCarta(id, dades);

                if (correcte) {
                    formEditar.reset();

                    const modalEditar = document.getElementById("modalEditar");

                    if (modalEditar) {
                        modalEditar.style.display = "none";
                    }
                }

            } finally {
                if (btnDesar) {
                    btnDesar.disabled = false;
                }
            }
        });
    }


    // Cancel·lar edició
    const btnCancelEditar = document.getElementById("btnCancelEditar");

    if (btnCancelEditar) {
        btnCancelEditar.addEventListener("click", () => {
            if (formEditar) {
                formEditar.reset();
            }

            const modalEditar = document.getElementById("modalEditar");

            if (modalEditar) {
                modalEditar.style.display = "none";
            }
        });
    }


    // Botó X per tancar el modal
    const btnTancarModal = document.getElementById("btnTancarModal");

    if (btnTancarModal) {
        btnTancarModal.addEventListener("click", () => {
            const modalEditar = document.getElementById("modalEditar");

            if (modalEditar) {
                modalEditar.style.display = "none";
            }
        });
    }


    // Tancar el modal en clicar fora del contingut
    const modalEditar = document.getElementById("modalEditar");

    if (modalEditar) {
        modalEditar.addEventListener("click", event => {
            if (event.target === modalEditar) {
                modalEditar.style.display = "none";
            }
        });
    }
}


//////////////////////////
// CODI D'INICIALITZACIÓ //
//////////////////////////

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        inicialitzar();
        carregarCartes();
    });
}


// Exportar les funcions necessàries per als tests de Jest
export { renderitzarCartes, carregarCartes, mostrarError };