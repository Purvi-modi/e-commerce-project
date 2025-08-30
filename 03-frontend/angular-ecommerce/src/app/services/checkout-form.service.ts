import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  constructor() { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] =[];

    // build an arrya for "Month" dropdown list
    // start at current month and loop until

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }

  getCretditCardYears(): Observable<number[]> {
    let data: number[] = [];

    // build an array for year drop down list
    // start at current and loop until 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}
