import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { AppComponent }          from './app.component';
import { PageLoginComponent }        from './app.page-login';
import { PageProfileComponent }        from './app.page-profile';
import { PageRegisterComponent }        from './app.page-register';
import { PageEmployeesComponent }        from './app.page-employees';
import { PagePayrollComponent }        from './app.page-payroll';

const appRoutes: Routes = [
  { path: 'page-login', component: PageLoginComponent },
  { path: 'page-profile', component: PageProfileComponent },
  { path: 'page-register', component: PageRegisterComponent },
  { path: 'page-employees', component: PageEmployeesComponent },
  { path: 'page-payroll', component: PagePayrollComponent },
  { path: '', redirectTo: '/page-register', pathMatch: 'full' },
  { path: '**', component: AppComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);