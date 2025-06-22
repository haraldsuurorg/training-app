Koolituste Haldusportaal
 
Eesmärk
 
Luua lihtne koolituste halduse rakendus, kus töötajad saavad registreeruda koolitustele ja admin saab neid hallata.
 
Tehnilised nõuded
 
- Back-end: Laravel  - Front-end: React  - Andmebaas: PostgreSQL või SQLite   - Koodi versioonihaldus: ei ole vajalik töö käigus
 
Andmemudelid
 
users
 
- name: string  - email: string unique  - password: string  - role: enum – admin või employee
 
trainings
 
- title: string  - description: text  - date: datetime  - location: string  - max_participants: integer
 
registrations
 
- user_id: viide kasutajale  - training_id: viide koolitusele  - Reegel: üks kasutaja saab igale koolitusele registreeruda ainult üks kord
 
Funktsionaalsus (võimalikult palju alltoodust)
 
  Admin:
 
- logib sisse  - lisab, muudab ja kustutab koolitusi  - näeb kõiki koolitusi ja registreerunuid
 
Employee:
 
- logib sisse  - näeb koolitusi  - registreerub koolitusele  - saab oma registreerumise tühistada  - ei näe teiste registreeringuid
