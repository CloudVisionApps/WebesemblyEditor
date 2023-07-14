<?php

namespace WebesemblyEditor\View\WebesemblyComponents;

use Illuminate\View\View;
use function view;

class Logo extends WebesemblyComponent
{

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        $logo = '';

        return view('webesembly-components.logo.skins.' . $this->skin, [
            'logo' => $logo,
        ]);
    }
}
