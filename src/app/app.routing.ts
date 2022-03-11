import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';

export const AppRoutes: Routes = [
  {
    path: 'adm',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/inicio',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(
    AppRoutes, {
        useHash: true,
        relativeLinkResolution: 'legacy' 
        }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }



