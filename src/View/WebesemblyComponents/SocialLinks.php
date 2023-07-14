<?php

namespace WebesemblyEditor\View\WebesemblyComponents;

use Illuminate\View\View;
use function view;

class SocialLinks extends WebesemblyComponent
{

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        $text = '';

        return view('webesembly-components.social-links.skins.' . $this->skin, [
            'text' => $text,
        ]);
    }

}
