<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TrainingsController;
use App\Http\Middleware\AdminMiddleware;
use App\Models\Training;
use App\Http\Controllers\RegistrationsController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $trainings = Training::withCount('registrations')->latest()->get();
        return Inertia::render('dashboard', [
            'trainings' => $trainings,
        ]);
    })->name('dashboard');

    Route::get('trainings', [TrainingsController::class, 'index'])->name('trainings.index');
    
    // Admin routes
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('manage-trainings', [TrainingsController::class, 'index'])->name('trainings.manage');
        Route::get('trainings/create', [TrainingsController::class, 'create'])->name('trainings.create');
        Route::post('trainings/store', [TrainingsController::class, 'store'])->name('trainings.store');
        Route::put('trainings/update/{id}', [TrainingsController::class, 'update'])->name('trainings.update');
        Route::delete('trainings/destroy/{id}', [TrainingsController::class, 'destroy'])->name('trainings.destroy');
        
        // Registration management routes
        Route::get('manage-registrations', [RegistrationsController::class, 'index'])->name('registrations.manage');
        Route::put('registrations/{id}/status', [RegistrationsController::class, 'updateStatus'])->name('registrations.update-status');
    });

    // Customer routes
    Route::get('my-trainings', [TrainingsController::class, 'userIndex'])->name('trainings.customer.edit');
    Route::post('registrations/store', [RegistrationsController::class, 'store'])->name('registrations.store');
    Route::delete('registrations/{id}', [RegistrationsController::class, 'destroy'])->name('registrations.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
;