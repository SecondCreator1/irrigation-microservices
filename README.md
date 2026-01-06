# 🌱 Irrigation Microservices

Application d’irrigation basée sur une **architecture microservices**, composée d’un **frontend Angular** et de plusieurs **microservices Spring Boot**, avec **Spring Cloud**, **MySQL** et un **déploiement Kubernetes (Docker Desktop)**.

---

## 📐 Architecture globale

### 🔹 Composants

- **Frontend** : Angular + Nginx  
- **API Gateway** : Spring Cloud Gateway (port `9094`)  
- **Meteo Service** : gestion des prévisions météo (port `8081`)  
- **Arrosage Service** : gestion des programmes d’arrosage (port `8082`)  
- **Eureka Server** : service discovery (port `8761`)  
- **Config Server** : configuration centralisée (port `8888`)  
- **Base de données** : MySQL  
  - Base : `irrigation`  
  - Schémas : `meteoservice`, `arrosageservice`  

### 📌 Communication des microservices

- Découverte des services via **Eureka**
- Configuration centralisée via **Config Server**
- Accès MySQL via le hostname Kubernetes `mysql`

---

## 🧰 Prérequis

- Docker Desktop avec Kubernetes activé  
- Contexte Kubernetes : `docker-desktop`  
- `kubectl` installé  
- Node.js & npm (pour builder le frontend si nécessaire)  
- Java 17 + Maven ou Gradle (pour builder les microservices)

---

## 🐳 Build des images Docker

Depuis la **racine du projet** :

### Backend

```bash
docker build -t irrigation-microservices-eureka-server:latest ./backend/eureka-server
docker build -t irrigation-microservices-config-server:latest ./backend/config-server
docker build -t irrigation-microservices-meteo-service:latest ./backend/meteo-service
docker build -t irrigation-microservices-arrosage-service:latest ./backend/arrosage-service
docker build -t irrigation-microservices-gateway:latest ./backend/Gateway
```

### Frontend

```bash
docker build -t irrigation-microservices-frontend:latest \
-f ./frontend/irrigation-frontend/Dockerfile.frontend \
./frontend/irrigation-frontend
```

📌 Avec Docker Desktop Kubernetes, **aucun registry externe n’est requis**.

---

## ☸️ Déploiement Kubernetes

Les manifests Kubernetes sont situés dans le dossier `k8s/` :

```text
k8s/
 ├─ namespace.yaml
 ├─ mysql.yaml
 ├─ eureka-server.yaml
 ├─ config-server.yaml
 ├─ meteo-service.yaml
 ├─ arrosage-service.yaml
 ├─ gateway.yaml
 └─ frontend.yaml
```

### Ordre de déploiement

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/eureka-server.yaml
kubectl apply -f k8s/config-server.yaml
kubectl apply -f k8s/meteo-service.yaml
kubectl apply -f k8s/arrosage-service.yaml
kubectl apply -f k8s/gateway.yaml
kubectl apply -f k8s/frontend.yaml
```

### Vérification

```bash
kubectl get pods -n irrigation
kubectl get svc -n irrigation
```

---

## 🌐 Accès aux services

### Frontend

Accès local via **port-forward** :

```bash
kubectl port-forward -n irrigation deployment/frontend 4200:80
```

➡️ http://localhost:4200/

---

### API Gateway

```bash
kubectl port-forward -n irrigation deployment/gateway 9094:9094
```

#### Exemples de routes

```text
GET http://localhost:9094/meteo/stations
GET http://localhost:9094/arrosage/programmes
```

#### Routage Gateway

```text
/meteo/**     → lb://meteo-service
/arrosage/**  → lb://arrosage-service
```

---

## ⚙️ Configuration Spring & MySQL

### Config Server

Les microservices récupèrent leur configuration depuis le dépôt GitLab :

🔗 https://gitlab.com/springboot3545046/irrigation-config-repo

---

### Connexion MySQL (dans le cluster)

```properties
spring.datasource.url=jdbc:mysql://mysql:3306/meteoservice?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

📌 Même configuration pour `arrosageservice` (en changeant le nom du schéma).

---

## 🎨 Frontend – Fonctionnalités clés

### 📊 Météo
- Formulaire de prévision météo
- Validation Angular Material :
  - date
  - températures
  - pluie
  - vent

### 💧 Programmes d’arrosage
- Champs obligatoires :
  - parcelle
  - date
  - durée
  - volume
  - statut
- Dropdown **statut** (exclut `TERMINE`)

### 📈 Dashboard
- KPIs :
  - nombre de stations
  - nombre de programmes
  - programmes actifs
  - volume total prévu
- Graphiques :
  - températures + pluie (par station)
  - doughnut : répartition des programmes par statut

---

## 🔧 Configuration Frontend

L’URL de l’API Gateway doit être définie dans :

- `environment.ts`
- `environment.prod.ts`

Exemple (local avec port-forward) :

```ts
apiUrl: 'http://localhost:9094'
```

---

## ✅ Stack technique

- Angular + Angular Material  
- Spring Boot  
- Spring Cloud (Gateway, Eureka, Config)  
- MySQL  
- Docker  
- Kubernetes (Docker Desktop)
