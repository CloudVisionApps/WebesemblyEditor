<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;

include('helpers/simple_html_dom.php');

class WebesemblyEditableTagCompiler extends ComponentTagCompiler
{
    public function compile($value)
    {
        $html = str_get_html($value);
        $findEditableFields = $html->find('div[webesembly:editable]');
        if (!empty($findEditableFields)) {
            foreach ($findEditableFields as $editableField) {
                $editableField->outertext = $this->componentString(
                    "'".$editableField->getAttribute('webesembly:editable')."'", [
                    'data'=>"'".json_encode(['html'=>$editableField->innertext])."'"
                ]);
            }
        }

        $html->save();

        return $html->outertext;
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
