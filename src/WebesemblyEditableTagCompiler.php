<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;
use Symfony\Component\DomCrawler\Crawler;

include('helpers/simple_html_dom.php');

class WebesemblyEditableTagCompiler extends ComponentTagCompiler
{
    public function compile($value)
    {
        $html = str_get_html($value,
            $lowercase=false,
            $forceTagsClosed=false,
            $target_charset = DEFAULT_TARGET_CHARSET,
            $stripRN=false,
            $defaultBRText=DEFAULT_BR_TEXT,
            $defaultSpanText=DEFAULT_SPAN_TEXT);

        $findEditableFields = $html->find('div[webesembly:editable]');
        if (!empty($findEditableFields)) {
            foreach ($findEditableFields as $editableField) {

                $componentName = $editableField->getAttribute('webesembly:editable');
                $params = [];
                $params['data']['html'] = $editableField->innertext;

                $editableField->outertext = \WebesemblyEditor\WebesemblyEditable::mount($componentName, $params)->html();;
            }
        }

        return $html->save();
    }

    protected function componentString(string $component, array $attributes)
    {
        return "@webesembly_editable({$component}, [".$this->attributesToString($attributes, $escapeBound = false).'])';
    }

    protected function attributesToString(array $attributes, $escapeBound = true)
    {
        return collect($attributes)
            ->map(function (string $value, string $attribute) use ($escapeBound) {
                return $escapeBound && isset($this->boundAttributes[$attribute]) && $value !== 'true' && ! is_numeric($value)
                    ? "'{$attribute}' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute({$value})"
                    : "'{$attribute}' => {$value}";
            })
            ->implode(',');
    }
}
