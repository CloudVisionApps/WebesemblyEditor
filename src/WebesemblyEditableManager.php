<?php

namespace WebesemblyEditor;

use Illuminate\Support\Str;

class WebesemblyEditableManager
{
    /**
     * @var string
     */
    public $id;

    /**
     * @var string
     */
    public $componentName;

    /**
     * @var
     */
    public $params;

    /**
     * The array of class component aliases and their class names.
     *
     * @var array
     */
    protected $classComponentAliases = [];

    public function mount($componentName, $params = [])
    {
        $this->componentName = $componentName;
        $this->id = str()->random(20);
        $this->params = $params;

        return $this;
    }

    public function html()
    {
        $originalContent = '';
        if (isset($this->params['data'])) {
            $decodedData = json_decode($this->params['data'], true);
            if (isset($decodedData['html'])) {
                $originalContent = $decodedData['html'];
            }
        }

        return '<div webesembly:id="'.$this->id.'" webesembly:editable="'.$this->componentName.'">

            '.$originalContent.'

        </div>';
    }

}
