<?php
namespace WebesemblyEditor;

use Illuminate\View\Compilers\ComponentTagCompiler;
use function collect;

class WebesemblyModuleTagCompiler extends ComponentTagCompiler
{
    public function compile($value)
    {
        return $this->compileModuleSelfClosingTags($value);
    }

    protected function compileModuleSelfClosingTags($value)
    {
        $pattern = "/
            <div
                \s*
                webesembly:module=(['\"])([\w\-\:\.]*)(['\"])
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
            \/?>
        /x";

        return preg_replace_callback($pattern, function (array $matches) use ($value) {

            $attributes = $this->getAttributesFromAttributeString($matches['attributes']);
            $attributes = collect($attributes)->mapWithKeys(function ($value, $key) {

                if (str($key)->contains('_')) return [$key => $value];

                return [(string) str($key)->trim() => $value];
            })->toArray();

            preg_match("/webesembly:module=(['\"])([\w\-\:\.]*)(['\"]) /", $matches[0], $matchTypeOfModule);

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
        return "@webesembly_module({$component}, [".$this->attributesToString($attributes, $escapeBound = false).'])';
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
