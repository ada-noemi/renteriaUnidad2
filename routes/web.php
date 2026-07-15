<?php

 use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

$frontendRoutes = [
	'/',
	'/categorias',
	'/contacto',
	'/ayuda',
	'/registrar',
	'/login',
	'/recuperacion',
	'/busqueda',
	'/mapa-del-sitio',
];

$protectedFrontendRoutes = [
	'/categorias/aves',
	'/categorias/gatos',
	'/categorias/peces',
	'/categorias/perros',
	'/categorias/reptiles',
	'/categorias/roedores',
	'/productos',
	'/buzon',
	'/chat',
];

foreach ($frontendRoutes as $path) {
	Route::view($path, 'home');
}

foreach ($protectedFrontendRoutes as $path) {
	Route::view($path, 'home')->middleware(['frontend.auth', 'user.type:cliente,admin']);
}

Route::view('/admin', 'home')->middleware(['frontend.auth', 'user.type:admin']);
Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware(['frontend.auth', 'user.type:admin']);

Route::prefix('auth')->group(function (): void {
	Route::get('/status', [AuthController::class, 'status']);
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);
	Route::post('/logout', [AuthController::class, 'logout']);
	Route::post('/recover-password', [AuthController::class, 'recoverPassword']);
});
