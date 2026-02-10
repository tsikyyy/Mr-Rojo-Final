-- BASE DE DONNÉES MINIMALE : GARAGE_SIMULATION (version stricte)

DROP TABLE IF EXISTS progres_reparation;
DROP TABLE IF EXISTS interventions;
DROP TABLE IF EXISTS slots_garage;
DROP TABLE IF EXISTS voitures;
DROP TABLE IF EXISTS types_reparation;
DROP TABLE IF EXISTS utilisateurs;
DROP TABLE IF EXISTS logs_sync_firebase;

-- TABLE 1 : utilisateurs (clients + admin)
CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role ENUM('client', 'administrateur') DEFAULT 'client',
    token_firebase TEXT COMMENT 'Pour notifications',
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- TABLE 2 : types_reparation (les 8 fixes)
CREATE TABLE types_reparation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) UNIQUE NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    duree_secondes INT NOT NULL
) ENGINE=InnoDB;

-- TABLE 3 : voitures
CREATE TABLE voitures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    marque VARCHAR(100) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    immatriculation VARCHAR(20) UNIQUE NOT NULL,
    description_panne TEXT,
    statut ENUM('en_attente', 'en_reparation', 'terminee', 'payee') DEFAULT 'en_attente',
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABLE 4 : interventions (réparations par voiture)
CREATE TABLE interventions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voiture_id INT NOT NULL,
    type_reparation_id INT NOT NULL,
    slot_id INT NULL,
    statut ENUM('en_attente', 'en_cours', 'terminee') DEFAULT 'en_attente',
    date_debut TIMESTAMP NULL,
    date_fin TIMESTAMP NULL,
    FOREIGN KEY (voiture_id) REFERENCES voitures(id) ON DELETE CASCADE,
    FOREIGN KEY (type_reparation_id) REFERENCES types_reparation(id)
) ENGINE=InnoDB;

-- TABLE 5 : slots_garage (2 réparation + 1 attente)
CREATE TABLE slots_garage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT UNIQUE NOT NULL, -- 1,2 (réparation), 99 (attente)
    type ENUM('reparation', 'attente') NOT NULL,
    statut ENUM('libre', 'occupe') DEFAULT 'libre',
    voiture_id INT NULL,
    FOREIGN KEY (voiture_id) REFERENCES voitures(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- TABLE 6 : progression (pour barre dans le jeu)
CREATE TABLE progres_reparation (
    intervention_id INT PRIMARY KEY,
    pourcentage INT DEFAULT 0,
    derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (intervention_id) REFERENCES interventions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TABLE 7 : logs sync Firebase (obligatoire pour la sync)
CREATE TABLE logs_sync_firebase (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_entite ENUM('voiture', 'intervention', 'paiement') NOT NULL,
    entite_id INT NOT NULL,
    statut_sync ENUM('en_attente', 'synchronise', 'erreur') DEFAULT 'en_attente',
    id_firebase VARCHAR(255),
    date_tentative TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- DONNÉES INITIALES
INSERT INTO types_reparation (nom, prix, duree_secondes) VALUES
('Frein', 50.00, 1800),
('Vidange', 30.00, 1200),
('Filtre', 20.00, 900),
('Batterie', 25.00, 600),
('Amortisseurs', 80.00, 3600),
('Embrayage', 120.00, 5400),
('Pneus', 40.00, 2400),
('Système de refroidissement', 60.00, 3000);

INSERT INTO slots_garage (numero, type, statut) VALUES
(1, 'reparation', 'libre'),
(2, 'reparation', 'libre'),
(99, 'attente', 'libre');

INSERT INTO utilisateurs (email, mot_de_passe, nom, prenom, role) VALUES
('admin@garage.com', '$2y$10$...hashed...', 'Admin', 'Admin', 'administrateur'); -- change le hash !