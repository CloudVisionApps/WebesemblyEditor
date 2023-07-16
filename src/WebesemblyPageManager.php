<?php

namespace WebesemblyEditor;

use Illuminate\Support\Str;

class WebesemblyPageManager
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

        $htmlAttributes = '';
        if (isset($this->params['data']['attributes'])) {
            $attributes = $this->params['data']['attributes'];
            if (!empty($attributes)) {
                foreach ($attributes as $attribute => $value) {
                    $htmlAttributes .= $attribute.'="'.$value.'" ';
                }
            }
        }

        $findPage = \WebesemblyEditor\Models\WebesemblyPage::where('name', $this->componentName)
            ->first();

        if (!empty($findPage)) {
            $originalContent = $findPage->html;
            $this->id = $findPage->id;
            $htmlAttributes .= ' webesembly:page-id="'.$this->id.'"';
        }

        return '<div '.$htmlAttributes.' >

            '.$originalContent.'

        </div>';
    }

}
