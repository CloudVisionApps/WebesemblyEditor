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
        $pageName = null;
        $originalContent = '';
        if (isset($this->params['data'])) {
            if (isset($this->params['data']['html'])) {
                $originalContent = $this->params['data']['html'];
            }
            if (isset($this->params['data']['pageName'])) {
                $pageName = $this->params['data']['pageName'];
            }
        }

        $pageId = 0;

        if (!empty($pageName)) {
            $findPage = \WebesemblyEditor\Models\WebesemblyPage::where('name', $pageName)->first();
            if (!empty($findPage)) {
                $pageId = $findPage->id;
            }
        }

        $htmlAttributes = '';
        if (isset($this->params['data']['attributes'])) {
            $attributes = $this->params['data']['attributes'];
            if (!empty($attributes)) {
                foreach ($attributes as $attribute => $value) {
                    $htmlAttributes .= $attribute.'="'.$value.'" ';
                }
            }
        }

        $findSections = \WebesemblyEditor\Models\WebesemblySection::where('name', $this->componentName)
            ->where('page_id', $pageId)
            ->first();

        if (!empty($findSections)) {
            $originalContent = $findSections->html;
            $this->id = $findSections->id;
            $htmlAttributes .= ' webesembly:section-id="'.$this->id.'"';
        }

        return '<div '.$htmlAttributes.' >

            '.$originalContent.'

        </div>';
    }


}
