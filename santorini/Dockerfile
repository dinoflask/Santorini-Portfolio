FROM maven:3.9.7-eclipse-temurin-17
WORKDIR /app

COPY pom.xml .
COPY src ./src

# Build (optional but nice to fail early)
RUN mvn clean package -DskipTests

# Render sets PORT; default to 8080
ENV PORT=8080
EXPOSE 8080

CMD ["mvn", "exec:java"]
