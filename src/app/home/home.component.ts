import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

// import {Observable} from 'rxjs/Rx';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';

import { CustomersComponent } from '../customers/customers.component';
import { InvoicesComponent } from '../invoices/invoices.component';
import { ToastComponent } from '../shared/toast/toast.component';
import { DropdownComponent } from '../shared/dropdown/dropdown.component';
import { TableComponent } from '../shared/table/table.component';
import { DataService } from '../services/data.service';
import { InvoiceService } from '../services/invoice.service';
import { Logger } from '../services/logger.service';

const noop = () => {};
const dropdown = [{
  text: 'Generate Invoice',
  click: 'deleteCustomer(customer)'
}, {
  text: 'Delete Invoice',
  click: 'deleteCustomer(customer)'
}]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [Logger]
})
export class HomeComponent implements OnInit {

  customers = [];
  isLoading = true;

  customer = {};
  // selectedCustomer: Observable<any>;
  selectedCustomer: any = {};
  isEditing = false;

  addCustomerForm: FormGroup;
  name = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);
  premium = new FormControl('', Validators.required);

  dropdown: any = [];
  customesTableSettings: any = {};
  invoicesTableSettings: any = {};
  parkingTableSettings: any = {};

  customInput: string = '<input type="checkbox">';

  // parkingData: LocalDataSource;
  invoices: any = [];

  constructor(private http: Http,
              private logger: Logger,
              private dataService: DataService,
              private invoiceService: InvoiceService,
              public toast: ToastComponent,
              // public drop: DropdownComponent,
              private datePipe: DatePipe,
              private currencyPipe: CurrencyPipe,
              private formBuilder: FormBuilder,
              private _sanitizer: DomSanitizer
            ) { }

  ngOnInit() {
    this.getCustomers();

    this.addCustomerForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      premium: this.premium
    });

    this.dropdown = dropdown;

    // this.customerColumns = [ { display: 'Name', variable: 'name' }, { display: 'Email', variable: 'email' }, { display: 'Premium', variable: 'premium' }];

    this.customesTableSettings = {
      actions: {
        position: 'right'
      },
      delete: {
        confirmDelete: true
      },
      columns: {
        name: {
          title: 'Name'
        },
        email: {
          title: 'Email'
        },
        premium: {
          title: 'Premium',
          // type: 'html',
          type: 'text',
          filter: false,
          valuePrepareFunction: (value) => {
            return value ? 'Yes' : 'No'
            // var html = '<i class="fa ' + (value ? 'fa-plus-square text-success' : 'fa-minus-square text-danger') + '></i>';
            // return this._sanitizer.bypassSecurityTrustHtml(html);
          },
        },
      }
    };

    this.parkingTableSettings = {
      // actions: false,
      columns: {
        timeIn: {
          title: 'Time In',
          filter: false,
          valuePrepareFunction: (value) => {
            return this.datePipe.transform(value, 'yyyy-MM-dd');
          }
        },
        timeOut: {
          title: 'Time Out',
          filter: false,
          editable: false,
          valuePrepareFunction: (value) => {
            return moment(value).format('YYYY-MM-DD');
          }
        },
        totalMinutes: {
          title: 'Minutes',
          filter: false
        },
        totalCost: {
          title: 'Cost',
          filter: false,
          valuePrepareFunction: (value) => {
            return value ? this.currencyPipe.transform(value, 'EUR') : '';
          }
        },
      }
    };

  }

  ngAfterContentInit() {
    // this.drop.setLink(dropdown);
  }

  importCustomers() {
    if (window.confirm('Are you sure you want to import random customers?')) {
      this.dataService.importDemoCustomers({'doImport': true}).subscribe(
        res => {
          this.getCustomers(),
          this.toast.setMessage('imported successfully.', 'success')
        },
        error => console.log(error)
      );
    }
  }

  getCustomers() {
    this.dataService.getCustomers().subscribe(
      data => this.customers = data,
      error => console.log(error),
      () => {
        this.isLoading = false,
        this.customers.length ? this.onSelectCustomer(this.customers[0]) : void noop
      }
    );
  }

  onSelectCustomer(obj) {
    this.selectedCustomer = obj.hasOwnProperty('data') ? obj.data : obj;
    // this.logger.log('you selected customer ' + this.selectedCustomer._id);
    // let req = {'customerId': this.selectedCustomer._id};
    this.invoiceService.getInvoices(this.selectedCustomer._id).subscribe(
      data => this.invoices = data.invoices, //new LocalDataSource(data)
      error => console.log(error),
      () => {
        this.isLoading = false,
        this.toast.setMessage('selected ' + this.invoices.length + ' invoices for ' + this.selectedCustomer._id , 'info');
      }
    );
  }

  onDeleteCustomer(customer) { // event.data = customer
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.dataService.deleteCustomer(customer).subscribe(
        res => {
          // event.confirm.resolve();
          const pos = this.customers.map(elem => { return elem._id; }).indexOf(customer._id);
          this.customers.splice(pos, 1);
          this.customers.length ? this.onSelectCustomer(this.customers[0]) : (this.selectedCustomer = {});
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    } else {
      // event.confirm.reject();
    }
  }

  onDeleteInvoice(invoice) {
    this.toast.setMessage('invoice for' + invoice._id + ' deleted successfully.', 'success');
  }

  onGenerateInvoice(invoice) {
    this.toast.setMessage('invoice for' + invoice._id + ' generated successfully.', 'success');
  }

  deleteAllCustomers() {
    if (window.confirm('Are you sure you want to permanently delete ALL DATA?')) {
      this.dataService.deleteAllData().subscribe(
        () => {
          this.selectedCustomer = {};
          this.customers = [];
          this.toast.setMessage('ALL DATA deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
