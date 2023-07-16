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


            $findPages = $html->find('div[webesembly:page]');
            if (!empty($findPages)) {
                foreach ($findPages as $page) {
                    $componentName = $page->getAttribute('webesembly:page');

                    $params = [];
                    $params['data']['attributes'] = $page->attr;
                    $params['data']['html'] = $page->innertext;

                    $page->outertext = \WebesemblyEditor\WebesemblyPage::mount($componentName, $params)->html();;

                }
            }

            $findFlexGridElements = $html->find('[webesembly:flex-grid-element]');
            if (!empty($findFlexGridElements)) {
                foreach ($findFlexGridElements as $flexGridElement) {

//                    $attributesInside = '';
//                    if ($flexGridElement->hasAttribute('webesembly:editable')) {
//                        $flexGridElement->removeAttribute('webesembly:editable');
//                        $attributesInside .= ' webesembly:editable="true" ';
//                    }

                    $elementWidth = 2;
                    $elementHeight = 1;
                    if ($flexGridElement->hasAttribute('webesembly:flex-grid-element-width')) {
                        $elementWidth = $flexGridElement->getAttribute('webesembly:flex-grid-element-width');
                    }
                    if ($flexGridElement->hasAttribute('webesembly:flex-grid-element-height')) {
                        $elementHeight = $flexGridElement->getAttribute('webesembly:flex-grid-element-height');
                    }
                    $flexGridElement->setAttribute('style', 'z-index:1;grid-area: 1 / 1 / '.$elementHeight.'/ '.$elementWidth);

                    if ($flexGridElement->hasAttribute('webesembly:flex-grid-element')) {
                        $flexGridElementArea = $flexGridElement->getAttribute('webesembly:flex-grid-element');
                        if (strpos($flexGridElementArea, '/') !== false) {
                            $flexGridElement->setAttribute('style', 'z-index:1;grid-area: '.$flexGridElementArea);
                        }
                    }

                    $flexGridSetup = '
                          <div style="z-index: 5; position: relative; height: 100%; pointer-events: auto;" >
                        <div style="height: 100%; width: 100%; position: absolute; left: 0px; top: 0px;">
                            <div webesembly:flex-grid-element-content="true" style="height: 100%; width: 100%; display: flex; justify-content: center;">

                               '.$flexGridElement->innertext.'

                            </div>
                        </div>
                    </div>
                    ';

                    $flexGridElement->innertext = $flexGridSetup;
                }
            }

//            $allFindedSections = [];
//            $findSections = $html->find('section[webesembly:section]');
//            if (!empty($findSections)) {
//                foreach ($findSections as $section) {
//                    $allFindedSections[] = $section;
//                }
//            }
//
//            $findDivSections = $html->find('div[webesembly:section]');
//            if (!empty($findDivSections)) {
//                foreach ($findDivSections as $section) {
//                    $allFindedSections[] = $section;
//                }
//            }
//
//            $replaceCount = 0;
//            if (!empty($allFindedSections)) {
//                foreach ($allFindedSections as $section) {
//                    $componentName = $section->getAttribute('webesembly:section');
//                    $hasParent = $this->findFirstParentWithAttribute($section, 'webesembly:page');
//                    $params = [];
//                    $params['data']['attributes'] = $section->attr;
//                    $params['data']['html'] = $section->innertext;
//                    if ($hasParent) {
//                        $params['data']['pageName'] = $hasParent->getAttribute('webesembly:page');
//                    }
//                    $section->outertext = \WebesemblyEditor\WebesemblySection::mount($componentName, $params)->html();;
//                    $replaceCount++;
//                }
//            }

            if (!empty($findPages)) {

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
