# Integrated Energy Management System

Acest proiect este o aplicatie complexa structurata in trei parti, care simuleaza si gestioneaza un sistem energetic inteligent, cu functionalitati precum autentificare, vizualizarea utilizatorilor si dispozitivelor, masuratori energetice si comunicare in timp real.

---

## Structura proiectului

### Partea 1 – Aplicatie de baza pentru gestionarea utilizatorilor si dispozitivelor

**Locatie:** `Proiect1/`  
**Documentatie:** [Documentatie.pdf](Documentatie.pdf)

Aceasta parte include:

- 2 microservicii Spring Boot (unul pentru utilizatori, unul pentru dispozitive)
- Interfata React impartita pe 3 pachete: Home, Utilizator, Admin
- Functionalitati CRUD pentru utilizatori si dispozitive
- Management complet prin Docker (fisiere Dockerfile si docker-compose)

---

### Partea 2 – Monitorizarea consumului energetic si notificari in timp real

**Locatie:** `Proiect2/`  
**Documentatie:** [P3.pdf](P3.pdf)

Aceasta parte extinde aplicatia cu:

- Microserviciu de monitoring care proceseaza date de masuratori trimise prin RabbitMQ
- Notificari live prin WebSocket cand consumul depaseste limita
- Simulator Spring Boot care trimite mesaje JSON dintr-un CSV (`sensor.csv`)
- Afisare grafica a consumului energetic pe zile selectate
- Integrare completa cu Docker si retea dedicata

---

### Partea 3 – Autentificare si sistem de chat

**Locatie:** `Proiect2/`  
**Documentatie:** [P3.pdf](P3.pdf)

Ultima parte include:

- Autentificare si autorizare cu JWT
- Backend securizat care verifica token-ul la fiecare cerere
- Sistem de chat real-time intre utilizatori prin WebSocket
- Mesajele sunt persistate in baza de date si sunt asociate cu timestamp si utilizator
- Orchestrare completa cu Docker si docker-compose

---

## Tehnologii utilizate

- Spring Boot (Java)
- React (JavaScript)
- MySQL
- RabbitMQ
- WebSocket
- JWT
- Docker & Docker Compose

---
