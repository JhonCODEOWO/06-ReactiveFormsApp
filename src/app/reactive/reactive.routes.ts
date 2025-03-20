import {Routes} from '@angular/router'
import { BasicPageComponent } from './pages/basic-page/basic-page.component'
import { DynamicPageComponent } from './pages/dynamic-page/dynamic-page.component'
import { SwitchesPageComponent } from './pages/switches-page/switches-page.component'
export const authRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'basic',
                component: BasicPageComponent
            },
            {
                path: 'dynamic',
                component: DynamicPageComponent
            },
            {
                path: 'switches',
                component: SwitchesPageComponent
            },
            {
                path: '**',
                redirectTo: 'basic'
            }
        ]
    }
]