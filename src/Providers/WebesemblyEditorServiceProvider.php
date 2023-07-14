<?php

namespace WebesemblyEditor\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use WebesemblyEditor\View\WebesemblyComponents\Alert;
use WebesemblyEditor\View\WebesemblyComponents\Logo;
use WebesemblyEditor\View\WebesemblyComponents\Menu;
use WebesemblyEditor\View\WebesemblyComponents\SocialLinks;
use WebesemblyEditor\View\WebesemblyComponents\Text;
use WebesemblyEditor\WebesemblyEditableBladeDirectives;
use WebesemblyEditor\WebesemblyEditableManager;
use WebesemblyEditor\WebesemblyEditableTagCompiler;
use WebesemblyEditor\WebesemblyModule;
use WebesemblyEditor\WebesemblyModuleBladeDirectives;
use WebesemblyEditor\WebesemblyModuleManager;
use WebesemblyEditor\WebesemblyModuleTagCompiler;

class WebesemblyEditorServiceProvider extends ServiceProvider
{

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->registerWebesemblySingleton();
    }


    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadRoutesFrom(__DIR__.'/../routes/api.php');
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');

        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'webesembly-editor');

        $this->registerTagCompiler();

        WebesemblyModule::component('alert', Alert::class);
        WebesemblyModule::component('menu', Menu::class);
        WebesemblyModule::component('text', Text::class);
        WebesemblyModule::component('logo', Logo::class);
        WebesemblyModule::component('social-links', SocialLinks::class);

        Blade::directive('webesembly_module', [WebesemblyModuleBladeDirectives::class, 'module']);
        Blade::directive('webesembly_editable', [WebesemblyEditableBladeDirectives::class, 'editable']);

    }

    protected function registerWebesemblySingleton()
    {
        $this->app->singleton(WebesemblyModuleManager::class);
        $this->app->alias(WebesemblyModuleManager::class, 'webesembly-module');

        $this->app->singleton(WebesemblyEditableManager::class);
        $this->app->alias(WebesemblyEditableManager::class, 'webesembly-editable');
    }

    protected function registerTagCompiler()
    {
        if (method_exists($this->app['blade.compiler'], 'precompiler')) {
            $this->app['blade.compiler']->precompiler(function ($string) {
                return app(WebesemblyModuleTagCompiler::class)->compile($string);
            });
            $this->app['blade.compiler']->precompiler(function ($string) {
                return app(WebesemblyEditableTagCompiler::class)->compile($string);
            });
        }
    }
}
