<?php

namespace WebesemblyEditor;

use Illuminate\Support\Facades\Facade;

/**
 * @method static void component($alias, $viewClass)
 *
 * @see
 */
class WebesemblySection extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'webesembly-section';
    }
}
