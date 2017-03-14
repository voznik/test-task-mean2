import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';

import { MomentModule } from 'angular2-moment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DataService } from './services/data.service';
import { InvoiceService } from './services/invoice.service';

import { CustomersComponent } from './customers/customers.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ToastComponent } from './shared/toast/toast.component';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { TableComponent } from './shared/table/table.component';
import { SumPipe } from './shared/pipes/sum.pipe';

const routing = RouterModule.forRoot([
    { path: '',      component: HomeComponent },
    { path: 'about', component: AboutComponent }
]);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomersComponent,
    InvoicesComponent,
    AboutComponent,
    ToastComponent,
    DropdownComponent,
    TableComponent,
    SumPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    MomentModule,
    NgbModule.forRoot(),
    // Ng2SmartTableModule
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    DataService,
    ToastComponent,
    DropdownComponent,
    TableComponent,
    InvoiceService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
