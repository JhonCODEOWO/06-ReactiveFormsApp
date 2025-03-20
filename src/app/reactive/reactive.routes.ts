import {Routes} from '@angular/router'
import { BasicPageComponent } from './pages/basic-page/basic-page.component'
import { DynamicPageComponent } from './pages/dynamic-page/dynamic-page.component'
import { SwitchesPageComponent } from './pages/switches-page/switches-page.component'
export const reactiveRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'basic',
                component: BasicPageComponent,
                title: 'Basic',
            },
            {
                path: 'dynamic',
                component: DynamicPageComponent,
                title: 'Dynamic'
            },
            {
                path: 'switches',
                component: SwitchesPageComponent,
                title: 'Switches'
            },
            {
                path: '**',
                redirectTo: 'basic'
            }
        ]
    }
]