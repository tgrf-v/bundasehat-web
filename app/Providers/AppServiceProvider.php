<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

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
        Vite::prefetch(concurrency: 3);

        if (
            $this->app->environment('production') ||
            env('APP_ENV') === 'production' ||
            str_starts_with((string) config('app.url'), 'https://') ||
            (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
        ) {
            URL::forceScheme('https');
        }

        if (!file_exists(public_path('storage'))) {
            @symlink(storage_path('app/public'), public_path('storage'));
        }
    }
}
