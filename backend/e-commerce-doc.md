
# 🛒 Projet E-commerce

## 🛠 Instructions d'installation et d'exécution

### Prérequis

- PHP 8.2 ou supérieur  
- Composer  
- Symfony CLI  
- MySQL 
- Serveur web (Apache/Nginx) ou utilisation du serveur intégré de Symfony  

### Installation

#### Clonez le dépôt

```bash
git clone https://github.com/votre-username/e-commerce-project.git
cd e-commerce-project/e-commerce-backend
```

#### Installez les dépendances

```bash
composer install
```

#### Configurez votre base de données dans le fichier `.env`

```plaintext
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name"
```

#### Créez la base de données et exécutez les migrations

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

#### Générez les clés JWT pour l'authentification

```bash
php bin/console lexik:jwt:generate-keypair
```

#### Chargez les fixtures (données de test)

```bash
php bin/console doctrine:fixtures:load
```

#### Lancez le serveur de développement

```bash
symfony server:start
```

---

## 🧠 Choix techniques et architecturaux

### Framework et bibliothèques

- **Symfony 6** : Framework PHP robuste et performant  
- **API Platform** : Pour créer rapidement une API RESTful avec toutes les bonnes pratiques  
- **Doctrine ORM** : Pour la gestion de la base de données et les relations entre entités  
- **Lexik JWT Authentication Bundle** : Pour l'authentification par token JWT  
- **Symfony Security** : Pour la gestion des rôles et permissions  

### Architecture

- **Architecture API REST** : Séparation claire entre le backend et le frontend  
- **Modèle MVC** : Organisation du code selon le pattern Modèle-Vue-Contrôleur  
- **Repositories** : Utilisation de repositories pour isoler la logique d'accès aux données  
- **Services** : Encapsulation de la logique métier dans des services dédiés  
- **State Processors** : Utilisation des processeurs d'état d'API Platform pour les opérations personnalisées  

### Sécurité

- **Hachage des mots de passe** : Utilisation du composant de sécurité Symfony  
- **Authentification JWT** : Tokens d'authentification pour sécuriser l'API  
- **Validation des données** : Contraintes de validation sur toutes les entités  
- **Contrôle d'accès** : Restrictions basées sur les rôles (`ROLE_USER`, `ROLE_ADMIN`)  

---

## ✅ Fonctionnalités implémentées

### Gestion des utilisateurs

- Inscription et authentification des utilisateurs  
- Profils utilisateurs avec informations personnelles  
- Différenciation des rôles (utilisateur standard, administrateur)  

### Catalogue de produits

- Gestion des catégories de produits  
- Produits avec descriptions, prix, images et stock  
- Recherche de produits par nom ou description  
- Filtrage des produits par catégorie  

### Système de commandes

- Panier d'achat via les commandes avec statut `"pending"`  
- Gestion des articles de commande (`OrderItem`)  
- Calcul automatique du montant total des commandes  
- Adresses de livraison et de facturation  

### Paiement

- Intégration avec **Stripe** pour le traitement des paiements  
- Gestion des sessions de paiement  
- Suivi du statut des paiements  
- Mise à jour automatique du statut de la commande après paiement  

### Administration

- Interface d'administration pour les utilisateurs avec le rôle `ROLE_ADMIN`  
- Gestion complète du catalogue (CRUD sur les produits et catégories)  
- Suivi des commandes récentes  

---

## 📊 Critères d'évaluation

### 🔍 Qualité du code

- Code bien structuré et organisé  
- Utilisation des bonnes pratiques de Symfony et API Platform  
- Commentaires pertinents pour les méthodes complexes  
- Nommage clair et cohérent  

### 📖 Lisibilité et clarté

- Structure de code intuitive  
- Séparation claire des responsabilités  
- Utilisation appropriée des namespaces  
- Documentation des API via les annotations API Platform  

### ✅ Respect des conventions

- Respect des conventions PSR  
- Utilisation des attributs PHP 8 pour les annotations  
- Organisation des fichiers selon les standards Symfony  
- Sérialisation cohérente des données exposées  

### 🧪 Fonctionnalité

- API RESTful complète et fonctionnelle  
- Gestion correcte des erreurs et exceptions  
- Validation des données entrantes  
- Tests unitaires et fonctionnels (si applicable)  

### 🗂 Organisation des fichiers et modularité

- Structure standard de Symfony  
- Séparation claire entre entités, repositories, controllers et services  
- Code modulaire et réutilisable  
- Injection de dépendances  

### 🧬 Gestion des données

- Modèles bien conçus avec relations appropriées  
- Utilisation efficace de Doctrine ORM  
- Groupes de sérialisation  
- Validation par contraintes  

### 💡 Fonctionnalités supplémentaires

- Système de recherche avancé  
- Intégration Stripe  
- Gestion des adresses de livraison/facturation  
- Suivi des commandes  

---

## 📝 Structure du projet

```plaintext
e-commerce-backend/
├── config/                  # Configuration de l'application
├── migrations/              # Migrations de base de données
├── public/                  # Point d'entrée de l'application
├── src/
│   ├── Controller/          # Contrôleurs pour les endpoints personnalisés
│   ├── DataFixtures/        # Données de test
│   ├── Entity/              # Modèles de données
│   ├── Repository/          # Requêtes personnalisées
│   └── State/               # Processeurs d'état API Platform
├── tests/                   # Tests unitaires et fonctionnels
└── .env                     # Configuration d'environnement
```

---

## 🚀 Endpoints API principaux

- `GET /api/products` — Liste tous les produits  
- `GET /api/products/{id}` — Détails d'un produit spécifique  
- `GET /api/categories` — Liste toutes les catégories  
- `POST /api/users` — Inscription d'un nouvel utilisateur  
- `POST /api/login_check` — Authentification et obtention du token JWT  
- `POST /api/orders` — Création d'une nouvelle commande  
- `GET /api/orders` — Liste des commandes de l'utilisateur connecté  
- `POST /api/payment/create/{id}` — Création d'une session de paiement Stripe  
