import { Routes } from '@angular/router';
import { ThemeParkPage } from './theme-park-page';
import { THEME_PARKS } from './theme-park-config';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `parks/${THEME_PARKS[0].slug}`
  },
  {
    path: 'parks/:parkSlug',
    component: ThemeParkPage
  },
  {
    path: '**',
    redirectTo: `parks/${THEME_PARKS[0].slug}`
  }
];
