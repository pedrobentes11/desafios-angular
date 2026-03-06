import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'quest',
    loadComponent: () =>
      import('./pages/quest/quest').then((m) => m.QuestComponent),
  },
  {
    path: 'bugs',
    loadComponent: () =>
      import('./pages/bugs/bugs').then((m) => m.BugsComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
