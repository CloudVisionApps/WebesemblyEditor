<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;
use Symfony\Component\DomCrawler\Crawler;

include('helpers/simple_html_dom.php');

class WebesemblySectionTagCompiler extends ComponentTagCompiler
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

        $allFindedSections = [];
        $findSections = $html->find('section[webesembly:section]');
        if (!empty($findSections)) {
            foreach ($findSections as $section) {
                $allFindedSections[] = $section;
            }
        }

        $findDivSections = $html->find('div[webesembly:section]');
        if (!empty($findDivSections)) {
            foreach ($findDivSections as $section) {
                $allFindedSections[] = $section;
            }
        }

        if (!empty($allFindedSections)) {
            foreach ($allFindedSections as $section) {
                $componentName = $section->getAttribute('webesembly:section');
                $params = [];
                $params['data']['html'] = $section->innertext;

                $section->outertext = \WebesemblyEditor\WebesemblySection::mount($componentName, $params)->html();;
            }
        }

        return $html->save();
    }

    protected function componentString(string $component, array $attributes)
    {
        return "@webesembly_section({$component}, [".$this->attributesToString($attributes, $escapeBound = false).'])';
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
