<?php

 use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

$frontendRoutes = [
	'/',
	'/categorias',
	'/categorias/aves',
	'/categorias/gatos',
	'/categorias/peces',
	'/categorias/perros',
	'/categorias/reptiles',
	'/categorias/roedores',
	'/productos',
	'/promociones',
	'/mas-vendidos',
	'/contacto',
	'/ayuda',
	'/registrar',
	'/buzon',
	'/login',
	'/recuperacion',
	'/chat',
	'/carrito',
	'/busqueda',
	'/mapa-del-sitio',
];

foreach ($frontendRoutes as $path) {
	Route::view($path, 'home');
}

Route::prefix('auth')->group(function (): void {
	Route::get('/status', [AuthController::class, 'status']);
	Route::post('/register', [AuthController::class, 'register']);
	Route::post('/login', [AuthController::class, 'login']);
	Route::post('/logout', [AuthController::class, 'logout']);
});
