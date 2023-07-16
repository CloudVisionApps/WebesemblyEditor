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

        if ($html) {

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

            $replaceCount = 0;
            if (!empty($allFindedSections)) {
                foreach ($allFindedSections as $section) {
                    $componentName = $section->getAttribute('webesembly:section');
                    $hasParent = $this->findFirstParentWithAttribute($section, 'webesembly:page');
                    $params = [];
                    $params['data']['attributes'] = $section->attr;
                    $params['data']['html'] = $section->innertext;
                    if ($hasParent) {
                        $params['data']['pageName'] = $hasParent->getAttribute('webesembly:page');
                    }
                    $section->outertext = \WebesemblyEditor\WebesemblySection::mount($componentName, $params)->html();;
                    $replaceCount++;
                }
            }

            if ($replaceCount > 0) {

                $findWebesemblyElementsCss = [];
                $getStylesheets = $html->find('link[rel="stylesheet"]');
                if (!empty($getStylesheets)) {
                    foreach ($getStylesheets as $element) {
                        if (strpos($element->getAttribute('href'), 'webesembly-elements.css') !== false) {
                            $findWebesemblyElementsCss[] = $element;
                        }
                    }
                }

                if (empty($findWebesemblyElementsCss)) {

                    $findHeadTag = $html->find('head', 0);

                    if (empty($findHeadTag)) {
                        throw new \Exception('Head tag not found. Webesembly needs a head tag to work properly.');
                    }

                    $styleSheetLink = $html->find('head', 0)->innertext;
                    $styleSheetLink .= '<link rel="stylesheet" href="{{asset(\'webesembly-editor/webesembly-elements.css\')}}" type="text/css" media="all">';
                    $styleSheetLink .= PHP_EOL;

                    $html->find('head', 0)->innertext = $styleSheetLink;
                }

                return $html->save();
            }
        }

        return $value;
    }

    protected function findFirstParentWithAttribute($element, $attributeName)
    {
        $parent = $element->parent();
        if ($parent) {
            if ($parent->hasAttribute($attributeName)) {
                return $parent;
            } else {
                return $this->findFirstParentWithAttribute($parent, $attributeName);
            }
        }

        return null;
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
