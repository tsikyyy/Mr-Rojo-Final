<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backoffice\AuthController;
use App\Http\Controllers\Backoffice\InterventionController;

Route::get('/backoffice/login', [AuthController::class, 'showLogin'])
    ->name('backoffice.login');

Route::post('/backoffice/login', [AuthController::class, 'login'])
    ->name('backoffice.login.submit');

Route::post('/backoffice/logout', [AuthController::class, 'logout'])
    ->name('backoffice.logout');

Route::get('/backoffice/interventions', [InterventionController::class, 'index'])
    ->name('backoffice.interventions');

Route::get('/backoffice/interventions/create', [InterventionController::class, 'create'])
    ->name('backoffice.interventions.create');

Route::post('/backoffice/interventions', [InterventionController::class, 'store'])
    ->name('backoffice.interventions.store');

    // EDIT
Route::get('/backoffice/interventions/{intervention}/edit', [InterventionController::class, 'edit'])
    ->name('backoffice.interventions.edit');

// UPDATE (on reste en POST pour simplifier)
Route::post('/backoffice/interventions/{intervention}', [InterventionController::class, 'update'])
    ->name('backoffice.interventions.update');

// DELETE (POST)
Route::post('/backoffice/interventions/{intervention}/delete', [InterventionController::class, 'destroy'])
    ->name('backoffice.interventions.destroy');

// WORKFLOW STATUT (POST)
Route::post('/backoffice/interventions/{intervention}/statut', [InterventionController::class, 'updateStatut'])
    ->name('backoffice.interventions.statut');
