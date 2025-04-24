import { Routes } from '@angular/router';
import { NG_DOC_ROUTING } from '@ng-doc/generated';

export const routes: Routes = [
  ...NG_DOC_ROUTING,
  {
    path: '**',
    redirectTo: 'getting-started/introduction',
    pathMatch: 'full',
  },
];
