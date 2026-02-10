<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VoitureController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\InterventionController;
use App\Http\Controllers\TypeReparationController;
use App\Http\Controllers\SlotGarageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes publiques pour les catégories (lecture)
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/categories/{id}', [CategorieController::class, 'show']);

// Routes publiques pour les interventions (lecture)
Route::get('/interventions', [InterventionController::class, 'index']);
Route::get('/interventions/{id}', [InterventionController::class, 'show']);

// Routes publiques pour les voitures (lecture)
Route::get('/voitures', [VoitureController::class, 'index']);
Route::get('/voitures/{id}', [VoitureController::class, 'show']);

// Routes publiques pour les types de réparation (lecture)
Route::get('/types-reparation', [TypeReparationController::class, 'index']);
Route::get('/types-reparation/{id}', [TypeReparationController::class, 'show']);

// Routes publiques pour les slots de garage (lecture)
Route::get('/slots', [SlotGarageController::class, 'index']);
Route::get('/slots/{id}', [SlotGarageController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/voitures', [VoitureController::class, 'store']);
    Route::put('/voitures/{id}', [VoitureController::class, 'update']);
    Route::delete('/voitures/{id}', [VoitureController::class, 'destroy']);

    // Routes protégées pour les types de réparation (écriture - admin)
    Route::post('/types-reparation', [TypeReparationController::class, 'store']);
    Route::put('/types-reparation/{id}', [TypeReparationController::class, 'update']);
    Route::delete('/types-reparation/{id}', [TypeReparationController::class, 'destroy']);

    // Routes protégées pour les slots de garage (écriture - admin)
    Route::post('/slots', [SlotGarageController::class, 'store']);
    Route::put('/slots/{id}', [SlotGarageController::class, 'update']);
    Route::delete('/slots/{id}', [SlotGarageController::class, 'destroy']);

    // Routes protégées pour les catégories (écriture - admin)
    Route::post('/categories', [CategorieController::class, 'store']);
    Route::put('/categories/{id}', [CategorieController::class, 'update']);
    Route::delete('/categories/{id}', [CategorieController::class, 'destroy']);

    // Routes protégées pour les interventions (écriture - admin)
    Route::post('/interventions', [InterventionController::class, 'store']);
    Route::put('/interventions/{id}', [InterventionController::class, 'update']);
    Route::delete('/interventions/{id}', [InterventionController::class, 'destroy']);
    Route::patch('/interventions/{id}/status', [InterventionController::class, 'updateStatus']);
});
