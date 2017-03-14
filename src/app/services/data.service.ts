import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) { }

  getCustomers(): Observable<any> {
    return this.http.get('/customers').map(res => res.json());
  }

  deleteCustomer(customer): Observable<any> {
    return this.http.delete(`/customer/${customer._id}`, this.options);
  }

  importDemoCustomers(doImport): Observable<any> {
    return this.http.post('/customers/import', doImport, this.options);
  }

  deleteAllData(): Observable<any> {
    return this.http.post('/customers/purge', {}, this.options);
  }

}
