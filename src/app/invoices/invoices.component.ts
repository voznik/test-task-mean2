import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Logger } from '../services/logger.service';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'invoices-table',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit, OnChanges {
  @Input() invoices: any[];
  @Input() selectedCustomer: {};
  @Output() onGenerateInvoice = new EventEmitter<{}>();
  @Output() onDeleteInvoice = new EventEmitter<{}>();

  selectedInvoice: any = {};
  availableMonths: any = [{id: 1, label: 'February'}, {id: 2, label: 'March'}];

  constructor(
              private logger: Logger,
              private invoiceService: InvoiceService,
            ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCustomer']) {
      this.selectedInvoice = {};
    }
  }

  delete(invoice: any) {
    this.logger.log('you about to delete invoice ' + invoice._id);
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.invoiceService.deleteInvoice(invoice._id).subscribe(
        () => {
          this.onDeleteInvoice.emit(invoice)
        },
        error => console.error(error)
      );
    }
    this.onDeleteInvoice.emit(invoice);
  }

  select(invoice: any) {
    this.logger.log('you selected ivoice ' + invoice._id);
    this.selectedInvoice = invoice;
  }

  generateInvoice(customer: any, month: any) {
    let query = {'customer': customer, 'month': month};
    this.invoiceService.generateInvoice(query).subscribe(
      // data => this.invoices.push(data)
      res => {
        const newInvoice = res.json();
        this.invoices.push(newInvoice);
        this.selectedInvoice = this.invoices[0];
        this.onGenerateInvoice.emit(newInvoice);
      },
      error => console.error(error)
    );
  }

}
