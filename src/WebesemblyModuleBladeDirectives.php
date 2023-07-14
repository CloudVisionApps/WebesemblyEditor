<?php

namespace WebesemblyEditor;

class WebesemblyModuleBladeDirectives
{
    public static function module($expression)
    {
        return <<<EOT
<?php
   echo WebesemblyEditor\WebesemblyModule::mount({$expression})->html();
?>
EOT;
    }
}
