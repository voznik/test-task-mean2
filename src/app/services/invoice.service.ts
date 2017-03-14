import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions/*, URLSearchParams */} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class InvoiceService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }


  getInvoices(customerId): Observable<any> {
    return this.http.get(`/invoices/${customerId}`).map(res => res.json());
  }

  generateInvoice(query): Observable<any> {
    return this.http.post('/invoice', JSON.stringify(query), this.options);
  }

  deleteInvoice(customerId): Observable<any> {
    return this.http.delete(`/invoices/${customerId}`, this.options);
  }

}
