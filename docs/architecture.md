KennisSprint – Architectuur

Pagina's
index.html
  cursus selectie (vak / niveau / jaar)

course.html
  trainer voor gekozen cursus

Data flow
index.html → ?course=ID → course.html

Code
app.js
  centrale quiz engine

data.js
  alle cursussen

Datastructuur

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

datasets
  terms
  years
  persons (future)

modes
  {id,label,dataset}

  ## Learning Model (Mastery Training)

KennisSprint is geen quiz-app maar een mastery trainer.

Doel:
een leerling moet begrippen uiteindelijk **actief uit het geheugen kunnen reproduceren**.

Daarom volgt elke kaart een trainingscyclus gebaseerd op:

- retrieval practice
- spaced repetition
- mastery learning

### Kaartniveaus

Elke kaart heeft een voortgangsniveau.

0 = nieuw  
1 = herkend  
2 = geoefend  
3 = bijna beheerst  
4 = beheerst  

Een kaart is **voltooid bij niveau 4**.

### Mastery regel

Een kaart bereikt niveau 4 wanneer een leerling meerdere keren correct antwoordt
in retrieval-modus.

Correct antwoord → niveau +1  
Fout antwoord → niveau -1 (minimaal 0)

### Spaced repetition

Herhalingsinterval groeit per niveau.

niveau 0 → direct  
niveau 1 → 10 minuten  
niveau 2 → 1 uur  
niveau 3 → 1 dag  
niveau 4 → 1 week

Alleen kaarten waarvan het herhaalinterval verlopen is verschijnen opnieuw.

### Trainingsfasen

KennisSprint gebruikt drie trainingsfasen.

Fase 1 – herkenning  
Multiple choice om eerste kennismaking te ondersteunen.

Fase 2 – retrieval  
Leerling moet eerst nadenken voordat antwoordopties verschijnen.

Fase 3 – reproductie  
Leerling typt zelf het antwoord (kort tekstveld).

### Mastery doel

Een hoofdstuk is voltooid wanneer:

