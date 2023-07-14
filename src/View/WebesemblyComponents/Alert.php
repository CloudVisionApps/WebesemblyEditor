<?php

namespace WebesemblyEditor\View\WebesemblyComponents;

use Illuminate\View\View;
use function view;

class Alert extends WebesemblyComponent
{
    /**
     * Create the component instance.
     */
    public function __construct(
        public string $type = 'success',
        public string $message = 'Your message here'
    ) {}

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        return view('webesembly-components.alert', [
            'type' => $this->type,
            'message' => $this->message,
        ]);
    }
}
