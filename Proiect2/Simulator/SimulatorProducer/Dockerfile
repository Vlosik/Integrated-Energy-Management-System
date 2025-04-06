# Etapa 1: Construiește aplicația
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiază fișierul pom.xml și codul sursă
COPY pom.xml .
COPY src ./src

# Execută comanda Maven pentru a curăța și a construi aplicația
RUN mvn clean package -DskipTests

# Etapa 2: Creează imaginea finală
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copiază artefactul construit din etapa anterioară
COPY --from=build /app/target/*.jar app.jar

# Expune portul pe care rulează aplicația
EXPOSE 8090

# Comanda de rulare a aplicației
ENTRYPOINT ["java", "-jar", "app.jar"]

