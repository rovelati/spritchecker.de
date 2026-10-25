# SpritChecker.de 🇩🇪⛽

> **Günstig tanken in Deutschland — Aktuelle Benzin- & Dieselpreise in Echtzeit.**  
> Sito programmatico ad alte prestazioni per il mercato tedesco (DACH), basato sui dati ufficiali della **Markttransparenzstelle für Kraftstoffe (MTS-K)** del **Bundeskartellamt** via Tankerkönig.

---

## 1. Obiettivo Economico & Business Model
* **Nicho**: Prezzi Carburanti Germania (Super E5, Super E10, Diesel).
* **RPM AdSense Stimato**: **18 € – 28 €** (tra i più alti d'Europa).
* **Target Iniziale**: **+2,00 € / giorno** (~60 €/mese passivi con sole 100-150 visite al giorno).
* **Scalabilità**: Più di 11.000 comuni tedeschi e 15.000 stazioni di servizio.

---

## 2. Dati SEMrush & Keyword Blueprint (salvati in `data/`)
Dati estratti dalla sessione live SEMrush del competitor `clever-tanken.de` (2.8M visite/mese, valore $1.5M/mo):
* `clever tanken`: **1.500.000** ricerche/mese
* `spritpreise`: **201.000** ricerche/mese
* `billiger tanken`: **165.000** ricerche/mese
* `benzinpreise in der nähe`: **165.000** ricerche/mese
* `dieselpreis`: **90.500** ricerche/mese
* Query locali per città (`spritpreise berlin`, `benzinpreise münchen`, `spritpreis köln`) con KD < 25.

---

## 3. Configurazione & Credenziali (salvate in `config/`)
* **Dominio**: `spritchecker.de`
* **Registrar**: GoDaddy
* **Cloudflare Account ID**: `383050c9ba92a1ab1144bc18d44f586c`
* **Cloudflare Email**: `romolo.velati@gmail.com`
* **AdSense Publisher ID**: `ca-pub-2168172914069272`
* **ads.txt**: `google.com, pub-2168172914069272, DIRECT, f08c47fec0942fa0`
* **UniConsent CMP ID**: `b039ba7539` (IAB TCF v2.2)
* **Google Consent Mode v2**: denial by default (GDPR / DSGVO compliant)
* **Email Ufficiale**: `info@spritchecker.de`

---

## 4. API Dati Carburante (Germania)
* **Fornitore**: Tankerkönig / Bundeskartellamt MTS-K
* **Registrazione API Gratuita**: [https://creativecommons.tankerkoenig.de/#register](https://creativecommons.tankerkoenig.de/#register)
* **Endpoint Lista Stazioni & Prezzi**: `https://creativecommons.tankerkoenig.de/json/list.php`
* **Demo Key per sviluppo**: `00000000-0000-0000-0000-000000000002`

---

## 5. Struttura del Progetto
```
spritchecker.de/
├── config/
│   ├── apis.json             # Endpoint e chiavi Tankerkönig
│   ├── cloudflare.json       # Configurazione Cloudflare Pages & DNS
│   └── monetization.json     # AdSense, CMP UniConsent, ads.txt
├── data/
│   ├── bundeslaender.json    # 16 stati federali tedeschi con coordinate
│   ├── top_cities.json       # 30 città principali per programmatic SEO
│   └── germany_fuel_clever_tanken.json # Intelligence SEMrush
├── public/
│   ├── ads.txt               # Record Google AdSense
│   ├── favicon.svg           # Icona distributore emerald
│   └── robots.txt            # Regole crawler + sitemap
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Layout tedesco con CMP, AdSense e Schema WebSite
│   ├── pages/
│   │   ├── index.astro       # Radar interattivo mappa OSM + ricerca PLZ + FAQ
│   │   ├── impressum.astro   # Impressum obbligatorio per legge tedesca (§ 5 TMG)
│   │   └── datenschutz.astro # Privacy policy DSGVO con riapertura cookie modal
│   └── styles/
│       └── global.css        # Tailwind v4 e stili mappa Leaflet
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 6. Comandi di Sviluppo & Build
```bash
# Entra nella directory
cd /Users/romolovelati/Desktop/spritchecker.de

# Installa le dipendenze
npm install

# Avvia il server di sviluppo locale
npm run dev

# Compila la build di produzione per Cloudflare Pages
npm run build
```
