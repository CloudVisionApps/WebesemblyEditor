<?php

namespace WebesemblyEditor\View\WebesemblyComponents;

use Illuminate\View\View;
use function route;
use function view;

class Menu extends WebesemblyComponent
{

   public function getMenu($menu) {

        $menuItems = [];
        $menu = \RyanChandler\FilamentNavigation\Facades\FilamentNavigation::get($menu);
        if (!empty($menu->items)) {
            foreach ($menu->items as $item) {
                $url = '';
                if (isset($item['type'])) {
                    if ($item['type'] == 'page-link') {
                        $findPage = \App\Models\Website\Page::find($item['data']['page_id']);
                        if ($findPage) {
                            $url = route('website.page', ['slug' => $findPage->slug]);
                        }
                    }
                }
                $menuItems[] = [
                    'label' => $item['label'],
                    'data'=>[
                        'url'=> $url
                    ]
                ];
            }
        }

        return $menuItems;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View
    {
        $menus = [];
        if (isset($this->params['name'])) {
            $menus = $this->getMenu($this->params['name']);
        }

        return view('webesembly-components.menu.skins.' . $this->skin, [
            'menus' => $menus,
        ]);
    }
}
