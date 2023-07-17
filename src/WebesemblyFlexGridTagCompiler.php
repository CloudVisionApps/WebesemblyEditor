<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;
use Symfony\Component\DomCrawler\Crawler;


class WebesemblyFlexGridTagCompiler extends ComponentTagCompiler
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
                    $flexGridElement->setAttribute('style', 'z-index:1;grid-area: 1 / 1 / ' . $elementHeight . '/ ' . $elementWidth);

                    if ($flexGridElement->hasAttribute('webesembly:flex-grid-element')) {
                        $flexGridElementArea = $flexGridElement->getAttribute('webesembly:flex-grid-element');
                        if (strpos($flexGridElementArea, '/') !== false) {
                            $flexGridElement->setAttribute('style', 'z-index:1;grid-area: ' . $flexGridElementArea);
                        }
                    }

                    $flexGridSetup = '
                          <div webesembly:flex-grid-element-relative="true" style="z-index: 5; position: relative; height: 100%; pointer-events: auto;" >
                        <div webesembly:flex-grid-element-absolute="true" style="height: 100%; width: 100%; position: absolute; left: 0px; top: 0px;">
                            <div webesembly:flex-grid-element-content="true" style="height: 100%; width: 100%; display: flex; justify-content: center;">

                               ' . $flexGridElement->innertext . '

                            </div>
                        </div>
                    </div>
                    ';

                    $flexGridElement->innertext = $flexGridSetup;
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
