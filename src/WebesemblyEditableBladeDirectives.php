<?php

namespace WebesemblyEditor;

class WebesemblyEditableBladeDirectives
{
    public static function editable($expression)
    {
        return <<<EOT
<?php
   echo \WebesemblyEditor\WebesemblyEditable::mount({$expression})->html();
?>
EOT;
    }
}
