import { ChangeDetectionStrategy, Component } from '@angular/core';
import { reactiveRoutes } from '../../../reactive/reactive.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  route: string;
}

const reactiveItems = reactiveRoutes[0].children ?? [];

@Component({
  selector: 'app-side-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  //Obtener todos las rutas de reactive.routes.ts y asignarlas a un arreglo MenuItem
  reactiveMenu: MenuItem[] = reactiveItems
  .filter((item) => item.path != '**')
  .map((item)=> {
    return {
      title: `${item.title}`,
      route: `reactive/${item.path}`,
    }
  })

  authMenu: MenuItem[] = [{
    title: 'Registro', route: './auth'
  }]
  countryMenu: MenuItem[] = [{
    title: 'Country', route: './country'
  }]
}
