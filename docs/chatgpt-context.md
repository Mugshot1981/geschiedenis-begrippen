KennisSprint – ChatGPT Context

version: 0.2
last updated: 2026-03-10

Dit document beschrijft de huidige architectuur, datastructuur en ontwikkelstatus van het project KennisSprint zodat nieuwe ChatGPT-sessies direct verder kunnen werken zonder eerdere chatcontext.

1. Projectdoel

KennisSprint is een webgebaseerde leerapp waarin leerlingen begrippen en kennis oefenen via multiple-choice quizzen.

De app is ontworpen voor:

middelbare scholieren

snelle oefensessies

mobiel en laptopgebruik

eenvoudige uitbreiding naar meerdere vakken

De app draait als statische website op GitHub Pages en gebruikt alleen:

HTML

CSS

JavaScript

Er is geen backend en geen login.

2. Hoofdstructuur van de applicatie

De app bestaat uit twee hoofdpagina’s.

index.html

Dit is het cursusselectiescherm.

De gebruiker kiest:

vak

niveau

leerjaar

Bijvoorbeeld:

geschiedenis
mavo
4

Daarna opent de app automatisch:

course.html?course=geschiedenis-mavo-4
course.html

Dit is de trainerpagina voor een specifieke cursus.

De pagina bevat:

titel van de cursus

hoofdstukselectie

keuze van oefenvorm

startknop

quizinterface

feedback popup

eindscherm

Wanneer een quiz start:

verdwijnen selectievelden

blijft alleen de quiz zichtbaar

3. Projectbestanden

De repository bevat momenteel:

index.html
course.html
app.js
style.css

Datafiles:

data.js
courseCatalog.js
courses/

In /courses/ staat één bestand per cursus.

Voorbeelden:

courses/geschiedenis-mavo-4.js
courses/geschiedenis-havo-3.js
courses/aardrijkskunde-mavo-4.js
courses/economie-mavo-4.js
4. Dataflow

De applicatie werkt als volgt:

index.html
↓ gebruiker kiest cursus
course.html?course=
↓
app.js leest courseId uit URL
↓
activeCourse wordt geladen uit courseCatalog
↓
quiz wordt gegenereerd

Belangrijk:

courseCatalog.js
↓
importeert alle cursussen
↓
dropdown vakken wordt hieruit opgebouwd

Als een cursus niet in courseCatalog staat, verschijnt het vak niet in de UI.

5. Course model

Elke cursus volgt dit model:

course = {

id
subject
level
grade
title

chapters
datasets
modes

}

Voorbeeld:

id: "geschiedenis-mavo-4"
subject: "geschiedenis"
level: "mavo"
grade: "4"

Deze velden zijn verplicht omdat de startpagina hieruit filters maakt.

6. Chapters

Hoofdstukken bepalen hoe vragen gegroepeerd worden.

Structuur:

{
 id
 subjectId
 title
}

Voorbeeld:

{
 id: "his-h1",
 subjectId: "geschiedenis",
 title: "Staatsinrichting van Nederland"
}
7. Datasets

De inhoud van een cursus staat in datasets.

datasets: {
 terms
 years
 persons
}
terms

Begrippen.

{
 id
 chapterId
 type
 prompt
 answer
}

Voorbeeld:

{
 id: "his-001",
 chapterId: "his-h1",
 type: "begrip",
 prompt: "Interbellum",
 answer: "De periode tussen de Eerste en Tweede Wereldoorlog"
}
years

Jaartallen.

{
 id
 chapterId
 year
 event
}
persons (toekomst)

Voor vragen zoals:

persoon → beschrijving
beschrijving → persoon

Structuur:

{
 id
 chapterId
 name
 description
}
8. Modes

Modes bepalen hoe datasets geoefend worden.

modes: [
 { id label dataset }
]

Voorbeelden:

term-to-answer
answer-to-term
years
event-years

Elke mode bepaalt:

welke dataset gebruikt wordt

hoe de vraag wordt opgebouwd

9. Compatibiliteit

De app ondersteunt tijdelijk oude en nieuwe datastructuren.

Oud model:

items
years

Nieuw model:

datasets.terms
datasets.years

app.js gebruikt helperfuncties:

getCourseTerms()
getCourseYears()

Dit voorkomt dat bestaande cursussen breken tijdens migratie.

10. UX-principes

Belangrijke regels voor de interface:

één scherm tegelijk

geen splitscreen layouts

quiz start → selectie verdwijnt

vraag staat los van antwoorden

feedback verschijnt in popup

Structuur van een vraag:

vraag
↓
antwoorden
↓
feedback
11. Huidige cursussen

Momenteel bestaan de volgende cursussen:

geschiedenis-mavo-4
geschiedenis-havo-3 (testdataset)
aardrijkskunde-mavo-4
economie-mavo-4

Status:

cursus	status
geschiedenis-mavo-4	volledig werkend
aardrijkskunde-mavo-4	volledig werkend
economie-mavo-4	hoofdstukken toegevoegd, dataset in opbouw
geschiedenis-havo-3	test

Datasets worden opgebouwd door begrippenpagina’s uit schoolboeken te fotograferen en om te zetten naar datasetitems.

12. Veelvoorkomende fouten

Tijdens ontwikkeling kwamen een paar typische bugs voor.

1. Syntax errors blokkeren hele app

Omdat modules worden geïmporteerd:

courseCatalog
↓
course file

zal één syntaxfout in een cursusbestand de hele app blokkeren.

Bijvoorbeeld:

chapters: [
...
],
],

Dit voorkomt dat courseCatalog laadt.

2. Ontbrekende course velden

Als een cursus deze velden mist:

id
subject
level
grade

verschijnt het vak niet in de dropdown.

3. Cursus niet in catalog

Nieuwe cursus moet altijd toegevoegd worden aan:

courseCatalog.js
13. Ontwikkelworkflow

Nieuwe cursus bouwen gebeurt zo:

inhoudspagina boek lezen

chapters array maken

cursusbestand maken

import in courseCatalog

dataset vullen via begrippenpagina’s

Datasets worden door ChatGPT gegenereerd uit foto’s.

14. Toekomstige uitbreidingen

Nieuwe datasets:

persons
images
sources
maps

Nieuwe vraagtypes:

persoon → beschrijving
afbeelding → naam
kaart herkennen
tijdlijn ordenen

Mogelijk later:

leerlingaccounts
fouten-trainer
voortgang
15. Ontwikkelprincipes

Belangrijke regels voor ontwikkeling:

Data model eerst, UI daarna.

Cursus bepaalt:

datasets
modes

app.js blijft generiek.

Nieuwe features worden eerst in de data-structuur ontworpen.

Belangrijkste regel:

Nooit aannames doen over code.
Vraag eerst het bestand.

## Nieuwe status – 2026-03-10

KennisSprint is niet langer alleen een statische quizsite zonder login.

### Nieuwe technische status
- GitHub Pages frontend blijft actief
- Supabase project is aangemaakt
- Supabase tabellen bestaan:
  - classes
  - profiles
  - cards_progress
- login.html is gekoppeld aan Supabase Auth
- magic link login werkt
- confirmatiemail van Supabase wordt ontvangen
- course.html controleert nu auth voordat de trainer geladen wordt

### Huidige architectuurrichting
KennisSprint ontwikkelt van multiple-choice quiz naar mastery learning systeem.

Doel:
leerlingen moeten begrippen uiteindelijk actief uit het geheugen kunnen reproduceren.

### Volgende stap
De volgende implementatiestap is:
1. profiel aanmaken bij eerste login
2. classcode koppelen aan profiel
3. cards_progress gebruiken voor voortgang per kaart
4. daarna mastery engine bouwen met spaced repetition

### Belangrijke ontwerpkeuze
Login blijft via Supabase magic link email.
Classcode wordt gebruikt om leerlingen aan een klas te koppelen.

### Belangrijke projectrichting
KennisSprint moet gebouwd worden als:
- mastery trainer
- retrieval-first leerapp
- progressie per leerling
- later competitie op basis van mastery, niet snelheid
