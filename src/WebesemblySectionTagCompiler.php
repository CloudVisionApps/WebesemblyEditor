<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;
use Symfony\Component\DomCrawler\Crawler;

class WebesemblySectionTagCompiler extends ComponentTagCompiler
{
    public function parseHtml($value) {

            $html = str_get_html($value,
                $lowercase=false,
                $forceTagsClosed=false,
                $target_charset = DEFAULT_TARGET_CHARSET,
                $stripRN=false,
                $defaultBRText=DEFAULT_BR_TEXT,
                $defaultSpanText=DEFAULT_SPAN_TEXT);

            return $html;
    }

    public function compile($value)
    {
        $html = $this->parseHtml($value);
        if ($html) {

            $pageIsFinded = false;
            $findPages = $html->find('div[webesembly:page]');
            if (!empty($findPages)) {
                foreach ($findPages as $page) {
                    $componentName = $page->getAttribute('webesembly:page');

                    $params = [];
                    $params['data']['attributes'] = $page->attr;
                    $params['data']['html'] = $page->innertext;

                    $mountPage = \WebesemblyEditor\WebesemblyPage::mount($componentName, $params)->html();
                    if (!empty($mountPage)) {
                        $page->outertext = $mountPage;
                        $pageIsFinded = true;
                    }
                }
                $html = $this->parseHtml($html->save());
            }

            if ($pageIsFinded) {
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
                        $section->outertext = \WebesemblyEditor\WebesemblySection::mount($componentName, $params)->html();
                        $replaceCount++;
                    }
                    $html = $this->parseHtml($html->save());
                }

            }


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
                $findWebesemblyHeadLinks = $html->find('link[webesembly:head-links]', 0);
                if (!empty($findWebesemblyHeadLinks)) {
                    $findWebesemblyHeadLinks = $html->find('link[webesembly:head-links]', 0);
                    $findWebesemblyHeadLinks->outertext = '<link rel="stylesheet" href="{{asset(\'webesembly-editor/webesembly-elements.css\')}}" type="text/css" media="all">';
                }
            }

            return $html->save();

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
