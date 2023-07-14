<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;
use function collect;

class WebesemblyEditableTagCompiler extends ComponentTagCompiler
{
    public function compile($value)
    {
        return $this->compileEditableSelfClosingTags($value);
    }

    protected function compileEditableSelfClosingTags($value)
    {
        $pattern = "/
            <div
                \s*
                webesembly:editable=(['\"])([\w\-\:\.]*)(['\"])
                \s*
                (?<attributes>
                    (?:
                        \s+
                        [\w\-:.@]+
                        (
                            =
                            (?:
                                \\\"[^\\\"]*\\\"
                                |
                                \'[^\']*\'
                                |
                                [^\'\\\"=<>]+
                            )
                        )?
                    )*
                    \s*
                )
            \/?>([^\r]+)<\/div>
        /x";

        return preg_replace_callback($pattern, function (array $matches) use ($value) {

            $attributes = $this->getAttributesFromAttributeString($matches['attributes']);
            $attributes = collect($attributes)->mapWithKeys(function ($value, $key) {

                if (str($key)->contains('_')) return [$key => $value];

                return [(string) str($key)->trim() => $value];
            })->toArray();

            preg_match("/webesembly:editable=(['\"])([\w\-\:\.]*)(['\"]) /", $matches[0], $matchTypeOfModule);

            $component = '';
            if (isset($matchTypeOfModule[2])) {
                $component = "'{$matchTypeOfModule[2]}'";;
            }

            $output = $this->componentString($component, $attributes);

            return $output;
        }, $value);
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
