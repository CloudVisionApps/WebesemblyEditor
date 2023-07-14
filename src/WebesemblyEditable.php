<?php

namespace WebesemblyEditor;

use Illuminate\Support\Facades\Facade;

/**
 * @method static void component($alias, $viewClass)
 *
 * @see
 */
class WebesemblyEditable extends Facade
{
    public static function getFacadeAccessor()
    {
        return 'webesembly-editable';
    }
}
