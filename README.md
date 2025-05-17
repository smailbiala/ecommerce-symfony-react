# 🛒 Projet E-commerce Symfony/React

## Screenshots

![Home Page](https://raw.githubusercontent.com/smailbiala/ecommerce-symfony-react/refs/heads/master/images/home.PNG)
![Cart Page](https://raw.githubusercontent.com/smailbiala/ecommerce-symfony-react/refs/heads/master/images/cart.PNG)
![Stripe Page](https://raw.githubusercontent.com/smailbiala/ecommerce-symfony-react/refs/heads/master/images/stripe.PNG)
![Admin Page](https://raw.githubusercontent.com/smailbiala/ecommerce-symfony-react/refs/heads/master/images/admin.PNG)

## 🛠 Instructions d'installation et d'exécution

### Prérequis

- PHP 8.2 ou supérieur
- Composer
- Symfony CLI
- MySQL

### Installation

**Accédez au dossier backend**

### Configuration des variables d'environnement

Créez un fichier `.env` dans votre dossier backend avec cette configuration :

```ini
# Application Configuration
APP_ENV=dev
APP_SECRET=

# JWT Authentication
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your_jwt_passphrase_here # Should be a long random string

# Database Configuration
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=mariadb-10.11.0"

# CORS Settings
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'

# Stripe Payment Gateway
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

### Configuration Stripe

````ini
1. **Get Stripe Keys**:
   - Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
   - Go to **Developers** → **API Keys**
   - Copy:
     - `STRIPE_PUBLIC_KEY` (starts with `pk_test_`)
     - `STRIPE_SECRET_KEY` (starts with `sk_test_`)

2. **Webhook Setup**:
   - In Stripe Dashboard, go to **Developers** → **Webhooks**
   - Click **Add endpoint** and enter:
     ```
     http://localhost:8000/api/payment/webhook
     ```
   - Select events to listen to (e.g., `payment_intent.succeeded`)
   - Copy the **Signing secret** (starts with `whsec_`) → This is your `STRIPE_WEBHOOK_SECRET`

3. **Testing**:
   - Use Stripe's test cards (e.g., `4242 4242 4242 4242` for successful payments)
````

#### Installez les dépendances

```bash
composer install
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

**Navigate to the `frontend` folder**

```bash
cd frontend
```

### Ouvrez le fichier `src/constants.js` et mettez à jour l'`API_URL` pour qu'elle corresponde à votre backend

## Sample User Logins

```
admin@example.com (Admin)
admin123

john@example.com (Customer)
password123

jane@email.com (Customer)
jane@example.com
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

### A. Front-end Ecommerce

- **Affichage d'une liste de produits** : Consultation des produits disponibles
- **Visualisation des détails d'un produit** : Fiche détaillée pour chaque article
- **Gestion d'un panier** :
  - Ajout d'articles
  - Modification des quantités
  - Suppression d'articles
- **Système de commande** : Formulaire de validation avec coordonnées client
- **Paiement en ligne** : Intégration sécurisée avec Stripe
- **Recherche & Filtres**

### B. Back-office (Administration)

- **Gestion des produits** :
  - Création de nouveaux produits
  - Édition des produits existants
  - Suppression de produits
- **Gestion des catégories** : Organisation des produits par catégories
- **Suivi des commandes** :
  - Visualisation de l'historique des commandes
  - Consultation du détail de chaque commande
