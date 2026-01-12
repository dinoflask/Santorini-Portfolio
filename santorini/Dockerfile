# --- Build stage ---
FROM maven:3.9.7-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom and sources
COPY pom.xml .
COPY src ./src

# Build the jar (skip tests to speed up CI)
RUN mvn clean package -DskipTests

# --- Run stage ---
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/santorini-1.0-SNAPSHOT.jar app.jar

# Render will set PORT; default to 8080 if not set
ENV PORT=8080

EXPOSE 8080

# Start your NanoHTTPD server
CMD ["java", "-jar", "app.jar"]
