import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  constructor(private router: Router){

  }

  doSearch(value: string){
    console.log(`value= ${value}`);
    // handled by product list component
    this.router.navigateByUrl(`/search/${value}`);
  }
}
