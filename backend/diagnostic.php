#!/usr/bin/env php
<?php

/**
 * Script de diagnostic complet - Étapes 2 et 3
 * 
 * Vérifie que les étapes 2 (Docker + Laravel) et 3 (Firebase) sont correctement configurées
 */

echo "\n";
echo "╔════════════════════════════════════════════════════════════════╗\n";
echo "║           DIAGNOSTIC - ÉTAPES 2 ET 3                          ║\n";
echo "║     Setup Docker + Laravel + Firebase Configuration           ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

$checks = [
    'étape_2' => [],
    'étape_3' => []
];

// ============================================================
// ÉTAPE 2 - DOCKER + LARAVEL
// ============================================================

echo "🔍 ÉTAPE 2 : Setup Docker + Laravel\n";
echo str_repeat("─", 60) . "\n";

// 1. Vérifier les fichiers essentiels
$essential_files = [
    'docker-compose.yml' => 'Fichier Docker Compose',
    '.env' => 'Fichier de configuration .env',
    'bootstrap/app.php' => 'Bootstrap Laravel',
    'public/index.php' => 'Point d\'entrée public',
    'app/Models/User.php' => 'Modèle User',
    'database/init/base_minimale.sql' => 'Fichier SQL initial',
];

// Le script est dans /var/www/html/diagnostic.php (dans le conteneur)
// Les fichiers Laravel sont aussi dans /var/www/html/
$base_path = __DIR__;

foreach ($essential_files as $file => $description) {
    $full_path = $base_path . '/' . $file;
    $exists = file_exists($full_path);
    $checks['étape_2'][$description] = $exists;
    $icon = $exists ? '✅' : '❌';
    echo $icon . " " . $description . " ... " . ($exists ? "OK" : "MANQUANT") . "\n";
}

// 2. Vérifier les configurations critiques
echo "\n📋 Vérification des configurations:\n";

// Vérifier .env
$env_content = file_get_contents($base_path . '/.env');
$env_checks = [
    'DB_CONNECTION=mysql' => 'MySQL configuré',
    'DB_HOST=db' => 'Host Docker',
    'DB_DATABASE=garage_db' => 'Database correcte',
    'FIREBASE_CREDENTIALS=' => 'Firebase credentials path',
];

foreach ($env_checks as $needle => $description) {
    $found = strpos($env_content, $needle) !== false;
    $icon = $found ? '✅' : '❌';
    echo $icon . " " . $description . "\n";
}

// 3. Vérifier bootstrap/app.php
echo "\n📝 Vérification du bootstrap:\n";
$bootstrap_content = file_get_contents($base_path . '/bootstrap/app.php');
$bootstrap_checks = [
    'Application::configure' => 'Configuration Application',
    'withRouting' => 'Routing configuré',
    'web.php' => 'Routes web',
    'api.php' => 'Routes API',
];

foreach ($bootstrap_checks as $needle => $description) {
    $found = strpos($bootstrap_content, $needle) !== false;
    $icon = $found ? '✅' : '❌';
    echo $icon . " " . $description . "\n";
}

// ============================================================
// ÉTAPE 3 - FIREBASE
// ============================================================

echo "\n\n🔍 ÉTAPE 3 : Configuration Firebase\n";
echo str_repeat("─", 60) . "\n";

// 1. Vérifier les fichiers Firebase
$firebase_files = [
    'config/firebase.php' => 'Configuration Firebase',
    'config/firebase-credentials.json' => 'Credentials Service Account',
    'app/Services/FirebaseService.php' => 'Service Firebase centralisé',
    'app/Http/Controllers/FirebaseTestController.php' => 'Controller de test',
    'app/Http/Controllers/FirebaseDemoController.php' => 'Controller de démo',
];

foreach ($firebase_files as $file => $description) {
    $full_path = $base_path . '/' . $file;
    $exists = file_exists($full_path);
    $checks['étape_3'][$description] = $exists;
    $icon = $exists ? '✅' : '❌';
    echo $icon . " " . $description . "\n";
}

// 2. Vérifier composer.json
echo "\n📦 Vérification des dépendances:\n";
$composer_content = file_get_contents($base_path . '/composer.json');
$composer_checks = [
    '"kreait/firebase-php"' => 'Firebase PHP SDK',
    '"laravel/framework"' => 'Laravel Framework',
    '"laravel/sanctum"' => 'Sanctum (API Auth)',
];

foreach ($composer_checks as $needle => $description) {
    $found = strpos($composer_content, $needle) !== false;
    $icon = $found ? '✅' : '❌';
    echo $icon . " " . $description . "\n";
}

// 3. Vérifier la configuration Firebase
echo "\n⚙️  Vérification de la configuration Firebase:\n";
$firebase_config = file_get_contents($base_path . '/config/firebase.php');
$firebase_config_checks = [
    'credentials_file' => 'Chemin des credentials',
    'database_url' => 'URL database (optionnel)',
];

foreach ($firebase_config_checks as $needle => $description) {
    $found = strpos($firebase_config, $needle) !== false;
    $icon = $found ? '✅' : '❌';
    echo $icon . " " . $description . "\n";
}

// 4. Vérifier Firebase credentials JSON
echo "\n🔐 Vérification des credentials Firebase:\n";
$creds_path = $base_path . '/config/firebase-credentials.json';
if (file_exists($creds_path)) {
    $creds = json_decode(file_get_contents($creds_path), true);
    
    $creds_checks = [
        'type' => 'Type',
        'project_id' => 'Project ID',
        'private_key' => 'Private Key',
        'client_email' => 'Client Email',
    ];
    
    foreach ($creds_checks as $key => $description) {
        $exists = isset($creds[$key]) && !empty($creds[$key]);
        $icon = $exists ? '✅' : '❌';
        $value = $exists ? (strlen($creds[$key]) > 40 ? substr($creds[$key], 0, 40) . '...' : $creds[$key]) : 'MANQUANT';
        echo $icon . " " . $description . ": " . $value . "\n";
    }
} else {
    echo "❌ Fichier credentials non trouvé\n";
}

// ============================================================
// RÉSUMÉ
// ============================================================

echo "\n\n";
echo "╔════════════════════════════════════════════════════════════════╗\n";
echo "║                     RÉSUMÉ DU DIAGNOSTIC                      ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

$total_checks = array_sum(array_map('count', $checks));
$passed_checks = array_sum(array_map(function($items) {
    return array_sum(array_map(function($v) { return $v ? 1 : 0; }, $items));
}, $checks));

echo "Étape 2 (Docker + Laravel): " . count(array_filter($checks['étape_2'])) . "/" . count($checks['étape_2']) . " ✅\n";
echo "Étape 3 (Firebase):         " . count(array_filter($checks['étape_3'])) . "/" . count($checks['étape_3']) . " ✅\n";
echo "\nTotal: " . $passed_checks . "/" . $total_checks . " vérifications réussies\n\n";

$percentage = ($passed_checks / $total_checks) * 100;

if ($percentage === 100) {
    echo "🎉 STATUS: ✅ TOUT EST EN ORDRE - 100% CONFORME\n";
} elseif ($percentage >= 90) {
    echo "⚠️  STATUS: ⚠️  PRESQUE OK - " . round($percentage) . "% conforme\n";
} else {
    echo "❌ STATUS: ❌ PROBLÈMES DÉTECTÉS - " . round($percentage) . "% conforme\n";
}

echo "\n";
echo "═════════════════════════════════════════════════════════════════\n";
echo "Pour plus de détails, consultez:\n";
echo "  - FIREBASE_CONFIG.md (guide Firebase)\n";
echo "  - VALIDATION_ETAPE3.md (checklist complète)\n";
echo "  - FIREBASE_DIAGNOSTIC.md (diagnostic complet)\n";
echo "═════════════════════════════════════════════════════════════════\n\n";

exit(0);
