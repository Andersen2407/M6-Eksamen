# M6-Eksamen
M6: Design af it-baserede systemer

## Beskrivelse af projekt valg
Projektet er taget fra semesterprojektet, hvor der samarbejdes med Novo Nordisk og deres warehouse (WH) afdeling. Der skal desgines og udvikles en digital løsning til at optimere deres opgavefordeling og synlighed af opgaver de får derude. Det omhandler når der skal sendes pakker ud af huset, hvor der før hen blev sendt en mail, opgaven fordeles manuelt og der kommunikeres at opgaven er fuldført via mail igen.

Der opstår typiske problemer ved at der opstår dobbeltarbejde ved dårlig kommunikation, tavs viden ift. hvem der kan specifikke opgaver og har taget en opgave, samt generelt uoverskuelig hvad der foregår derude ved disse opgaver. 

### Ideen til løsningen

Vi kalder det for en McDonaldsfisering, hvor warehouse medarbejderne skal have et dashboard ude ved dem som ville være deres nye opgavefordeler. Her ændrer vi så triggering event fra at være en mail til at være en opgave der bliver sendt ind til dashboardet. Her vil der så være nogle felter afsenderen SKAL udfylde således alt korrekt information bliver givet videre og fjerner WH medarbejdernes behov for at følge op i visse tilfælde.

Den opgave der bliver sendt ind skal så have en deadline og evt. et flag omkring DOT levering. Kunne visualiseres med grøn, gul og rød alt efter hvor meget den haster / hvor meget tid der er inden deadline. 

WH medarbejderne skal så kunne tage disse opgaver fra deres client side, som kunne forgå på mobilen. Her skal der så kun være mulighed for at tage opgaven, udføre resten af processen som den står og efterfølgende marker den som færdiggjort med mulighed for at sende en besked til afsender som f.eks. trackingnummer, fragtbrev og toldfaktura. 

På dashboardet kunne der også være en sektion med "live-tracking" af igangværende opgaver på de enkelte medarbejdere der er mødt ind så der kan hjælpes til eller lave realtids opfølgning på opgaven. Dette ville også give mulighed for at se om en syg eller fraværende medarbejder har en opgave der ikke er blevet gennemført endnu og skal følges op på af en anden. 

For at flytte en opgave tænker jeg at senior WH medarbejderen, Helle, skal have mulighed for at logge ind som admin og flytte opgaver hvis der er behov for dette.

## Udviklingsfordeling og "sprints" timeline
Deles op med frontend og backend arbejde???? på forskellige branches efter aftalt fælles design

Projektet udvikles gennem en iterativ udviklingsproces opdelt i mindre udviklingsfaser ("sprints"), hvor der løbende udvikles, testes og fælles evaluering af funktionalitet.

Udviklingen opdeles i følgende overordnede faser:

### Sprint "0" – Problemforståelse og design fra projektarbejde
- Analyse af warehouse workflow
- Identifikation af kritiske problemer i AS-IS workflowet
- Udarbejdelse af TO-BE redesign
- Mockup og visualisering af løsning

### Sprint 1 – Backend og database

### Sprint 2 – Frontend og dashboards

### Sprint 3 – Polering?


## Design og arkitektur
Selve designet / visionen for systemet er således:
![alt text](zpictures/Mockup.PNG)

Systemet bliver en serverbaseret webapplikation bestående af 4 primære klientgrænseflader:
- Login interface
- Task Creation Portal (1)
- Warehouse Dashboard (2)
- Mobile Worker Interface (3)

# Requirements
Krav som fundet i forlængelse af AS-IS og TO-BE analyse i projektarbejdet

## Novo Worker / "kunden"
- Skal kunne oprette nye warehouse opgaver
- Skal kunne angive deadline
- Skal kunne markere DOT levering
- Skal kunne videregive relevant information

## Warehouse Worker
- Skal kunne se tilgængelige opgaver
- Skal kunne tage opgaver
- Skal kunne afslutte opgaver
- Skal kunne sende tracking information ved afslutning

## Warehouse Admin & Dashboard info
- Skal kunne overvåge alle opgaver
- Skal kunne se workload overview
- Skal kunne reassigne opgaver
- Skal kunne følge live status på warehouse aktiviteter
