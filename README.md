El Cartero Invisible — Setmana 1: Obrim l'Oficina de Correus

Benvingut/da al projecte El Cartero Invisible. Durant aquesta primera fase muntem els fonaments del projecte: configurem l'entorn de treball, aixequem el servidor amb FastAPI, dissenyem la façana semàntica amb HTML/CSS i donem vida a la interacció amb JavaScript.

La Metàfora del Projecte

Una oficina de correus necessita tres elements bàsics abans d'obrir al públic:

L'Edifici i la Façana (frontend/index.html + style.css): L'estructura semàntica i els rètols clars perquè el públic sàpiga on dirigir-se.

El Personal de Finestreta (frontend/script.js): El sistema nerviós que escolta les accions dels usuaris (esdeveniments com un click) i reacciona.

El Carter i el Taulell d'Atenció (backend/ amb FastAPI + Uvicorn): El servidor que rep les peticions externes, les processa i respon amb cartes (JSON).

·Arquitectura Client-Servidor

[ Client: Navegador Web ]
   │
   ├── HTML5 (Estructura semàntica: <header>, <main>, <section>, <footer>)
   ├── CSS3 (Estils visuals i pseudoclasses: :hover, :first-child)
   └── JavaScript (Gestió d'esdeveniments: addEventListener)
   │
   │  Peticions HTTP (ex: GET /)
   ▼
[ Servidor: FastAPI + Uvicorn ]
   │
   └── Endpoint GET / ──► Retorna: {"missatge": "Hola, món!"}


## Estructura del Projecte

```text
cartero-invisible/
│
├── backend/
│   ├── .venv/                  # Entorn virtual de Python
│   ├── main.py                 # Aplicació FastAPI i primer endpoint
│   ├── requirements.txt        # Dependències de Python
│   │
│   └── tests/
│       └── test_main.py        # Tests asíncrons amb pytest i httpx
│
├── frontend/
│   ├── index.html              # Estructura semàntica i botó de salutació
│   ├── style.css               # Estils bàsics i pseudoclasses
│   ├── script.js               # Lògica d'esdeveniments i salutació
│   ├── saludar.test.js         # Test unitari Jest del client
│   └── package.json            # Dependències i scripts de Node/Jest
│
└── README.md