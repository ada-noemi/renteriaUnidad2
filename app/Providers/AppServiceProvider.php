<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Forzar HTTPS
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Habilitar logging de queries SQL en desarrollo para detectar inyecciones
        if ($this->app->environment('local')) {
            DB::listen(function ($query) {
                \Log::debug('SQL Query: ' . $query->sql, $query->bindings);
            });
        }

        // Establecer configuración de sesión más segura
        config(['session.secure' => true]);
        config(['session.http_only' => true]);
        config(['session.same_site' => 'strict']);
    }
}
