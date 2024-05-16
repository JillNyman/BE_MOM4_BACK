Applikation för registrering och inloggning, ett REST API byggt med Express. API:et hanterar en tabell med användarnamn och lösenord. Lösenorden hashas automatiskt när ny användare läggs till.

Databas API:et använder sqlite3 som databas. Klona ner källkodsfilerna, kör kommando npm install för att installera nödvändiga npm-paket. Kör installations-skriptet install.js. Installations-skriptet skapar med kommandot npm install en tabell enligt nedanstående:

`CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`


Användning För att nå API:et, använd "http://127.0.0.1:3550/api".
Routes
logga in användare: "/login" (POST)
skapa ny användare: "/register" (POST)
nå skyddad route: "/protected" (GET)

Koden till klientsidan finns här:
https://github.com/JillNyman/BE_MOM4_FRONT
