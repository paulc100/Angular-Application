import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }    from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { PageLoginComponent } from './app.page-login';
import { PageProfileComponent } from './app.page-profile';
import { PageRegisterComponent } from './app.page-register';
import { PageEmployeesComponent } from './app.page-employees';
import { PagePayrollComponent } from './app.page-payroll';
import { routing }        from './app.routing';

@NgModule({
  imports: [
    BrowserModule, routing, FormsModule, HttpClientModule
  ],
  declarations: [
    AppComponent, PageLoginComponent, PageProfileComponent, PageRegisterComponent, PageEmployeesComponent, PagePayrollComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
