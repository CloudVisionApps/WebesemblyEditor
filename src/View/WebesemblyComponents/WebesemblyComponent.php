<?php

namespace WebesemblyEditor\View\WebesemblyComponents;

use Illuminate\View\Component;

class WebesemblyComponent extends Component
{
    /**
     * @var string
     */
    public $skin = 'default';

    /**
     * @var array
     */
    public $params;

    public function setSkin($skin)
    {
        $this->skin = $skin;
    }

    public function setParams($params)
    {
        $this->params = $params;
    }

    public function render()
    {
        // TODO: Implement render() method.
    }

}
