import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '../services/logger.service';

@Component({
  selector: 'customers-table',
  templateUrl: './customers.component.html'
})
export class CustomersComponent {
  @Input() customers: any[];
  @Output() onDeleteCustomer = new EventEmitter<{}>();
  @Output() onSelectCustomer = new EventEmitter<{}>();

  constructor(
              private logger: Logger,
              // private invoiceService: InvoiceService,
            ) { }

  delete(customer: any) {
    this.logger.log('you about to delete customer ' + customer._id);
    this.onDeleteCustomer.emit(customer);
  }

  select(customer: any) {
    this.logger.log('you selected customer ' + customer._id);
    this.onSelectCustomer.emit(customer);
  }
}
