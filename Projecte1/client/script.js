function saluda() {
  alert("Hola, món!");
}

const boto = document.getElementById("btnSaluda");
boto.addEventListener("click", saluda);

// frontend/script.js — la manipulació d'aquesta setmana
const titol = document.querySelector("#titolPrincipal");
titol.textContent = "📮 El Cartero Invisible – Setmana 2";
titol.setAttribute("data-role", "banner");

const contenidor = document.querySelector("#contenidorCartes");
contenidor.innerHTML += "<p>Cartes pendents: 0</p>";

const info = document.querySelector(".info");
info.style.color = "#2c3e50";

