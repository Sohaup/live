<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/live' , function () {
return Inertia::render('Live');
});

Route::get('/chat' , function () {
return Inertia::render('Chat' , ['user'=>Auth::user()]);
});

Route::get('/attach' , function () {
return Inertia::render('Attach');
});

Route::get('/video' , function () {
return Inertia::render('Video' , ['user'=>Auth::user()]);
}); 

Route::get('/liveVideo' , function () {
return Inertia::render('VideoCall' ); 
});
require __DIR__.'/auth.php';
