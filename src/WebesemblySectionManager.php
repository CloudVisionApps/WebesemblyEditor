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

        $pageId = 0;
        $idAttribute = '';
        $findSections = \WebesemblyEditor\Models\WebesemblySection::where('name', $this->componentName)
            ->where('page_id', $pageId)
            ->first();

        if (!empty($findSections)) {
            $originalContent = $findSections->html;
            $this->id = $findSections->id;
            $idAttribute = 'id="'.$this->id.'"';
        }

        return '<div '.$idAttribute.' webesembly:section="'.$this->componentName.'">

            '.$originalContent.'

        </div>';
    }

}
