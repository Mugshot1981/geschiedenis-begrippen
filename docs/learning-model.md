learning-model.md
# KennisSprint – Learning Model

KennisSprint is ontworpen als een **mastery learning systeem**.  
Het doel van het platform is dat leerlingen begrippen uiteindelijk **actief uit het geheugen kunnen reproduceren**.

Het systeem combineert drie bewezen leerprincipes:

- Retrieval practice
- Spaced repetition
- Mastery learning

De applicatie is dus **geen quiz-app**, maar een trainer die leerlingen begeleidt tot volledige beheersing van de leerstof.

---

# 1 Retrieval Practice

Leerlingen moeten kennis **actief ophalen uit hun geheugen**.

Het leerproces verloopt daarom in drie fasen.

### Fase 1 – Herkenning

De leerling ziet een begrip en kiest het juiste antwoord.


Vraag: Interbellum

A periode tussen WO1 en WO2
B periode na WO2
C koude oorlog
D industrialisatie


Dit is bedoeld om de leerling kennis te laten **herkennen**.

---

### Fase 2 – Retrieval

De leerling krijgt eerst alleen het begrip te zien en moet **nadenken voordat antwoorden verschijnen**.


Interbellum

Denk eerst na…
[ toon antwoorden ]


Pas daarna verschijnen de antwoordopties.

Dit dwingt het brein om informatie actief op te halen.

---

### Fase 3 – Reproductie

De leerling typt zelf het antwoord.


Wat betekent inflatie?


De leerling geeft een kort antwoord waarna het systeem feedback geeft.

Dit is de sterkste vorm van retrieval practice.

---

# 2 Mastery Learning

Elke kaart heeft een **voortgangsniveau**.


0 nieuw
1 herkend
2 geoefend
3 bijna beheerst
4 beheerst


Een kaart bereikt **mastery bij niveau 4**.

### Regels


correct antwoord → niveau +1
fout antwoord → niveau -1 (minimaal 0)


Mastery vereist dus meerdere correcte antwoorden.

---

# 3 Spaced Repetition

Om langdurig leren te stimuleren worden kaarten herhaald met toenemende intervallen.


niveau 0 → direct
niveau 1 → 10 minuten
niveau 2 → 1 uur
niveau 3 → 1 dag
niveau 4 → 7 dagen


Dit voorkomt dat leerlingen alleen **kortetermijn geheugen** gebruiken.

Alleen kaarten waarvan het herhaalinterval verlopen is verschijnen opnieuw.

---

# 4 Vraagselectie

Een trainingssessie bevat een mix van kaarten.


60% kaarten die herhaald moeten worden
30% nieuwe kaarten
10% controlekaarten (beheerst)


Hierdoor blijft het systeem focussen op **wat de leerling nog niet beheerst**.

---

# 5 Mastery per hoofdstuk

Een hoofdstuk wordt als voltooid beschouwd wanneer alle kaarten mastery hebben bereikt.


mastered_cards / total_cards = 100%


Voorbeeld:


Hoofdstuk 1 – Inkomen en welvaart
18 / 24 kaarten beheerst


De interface toont voortgang visueel met een progressbalk.

---

# 6 Progress opslag

Per leerling per kaart wordt opgeslagen:


user_id
card_id
level
last_seen
next_review


Deze data bepaalt welke kaarten in een sessie verschijnen.

---

# 7 Kaart Moeilijkheidsalgoritme

KennisSprint berekent automatisch hoe moeilijk een kaart is.

Dit helpt om kaarten die veel leerlingen moeilijk vinden **vaker te trainen**.

### Moeilijkheidsgraad

Elke kaart krijgt een difficulty score:


difficulty = fouten / totaal pogingen


Voorbeeld:


Inflatie
pogingen: 120
fouten: 60

difficulty = 0.50


Een hoge score betekent dat een kaart moeilijk is.

---

### Gebruik van difficulty

De moeilijkheidsgraad beïnvloedt:

- hoe vaak een kaart verschijnt
- hoe snel een kaart mastery bereikt

Voor moeilijke kaarten kan bijvoorbeeld gelden:


3 correcte antwoorden nodig → mastery


in plaats van:


2 correcte antwoorden → mastery


---

# 8 Adaptieve training

Omdat difficulty per kaart bekend is kan KennisSprint:

- moeilijke begrippen vaker tonen
- makkelijke begrippen sneller afronden
- de leerervaring aanpassen aan de leerling

Dit maakt het systeem **adaptief**.

---

# 9 Competitie (optioneel)

Competitie wordt gebaseerd op **mastery**, niet op snelheid.

Leaderboard voorbeeld:


4HAVO Economie

1 Lisa 92%
2 Milan 88%
3 Noor 85%


Dit motiveert leerlingen zonder dat gokken of snelheid belangrijk wordt.

---

# 10 Samenvatting

KennisSprint combineert:

- retrieval practice
- spaced repetition
- mastery learning
- adaptieve moeilijkheid

Het doel van het systeem is dat leerlingen begrippen uiteindelijk **zelfstandig uit het geheugen kunnen reproduceren**.
