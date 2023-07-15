<?php

namespace WebesemblyEditor;

use Illuminate\Support\Str;

class WebesemblySectionManager
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
            if (isset($this->params['data']['html'])) {
                $originalContent = $this->params['data']['html'];
            }
        }
        $findSections = \WebesemblyEditor\Models\WebesemblySection::where('name', $this->componentName)->first();
        if (!empty($findSections)) {
            $originalContent = $findSections->html;
            $this->id = $findSections->id;
        }

        return '<div webesembly:id="'.$this->id.'" webesembly:section="'.$this->componentName.'">

            '.$originalContent.'

        </div>';
    }

}
