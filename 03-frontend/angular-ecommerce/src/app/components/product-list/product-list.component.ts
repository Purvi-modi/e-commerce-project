import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  //templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;
  constructor(private productService:ProductService,
    private route: ActivatedRoute
  ){

  }

  ngOnInit(){
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
    
  }

  listProducts(){

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){

    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data
      }
    );
  }

  handleListProducts(){

    /*
      this.route => use the activated route
      snapshot => route state at this given moment in time
      paramMap => map of all route parameters
      hasCategoryId - check if id parameter is available
    */
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId) {
      // get the id parameter, convert it to number using the + symbol, ! to tell compiler that value is not null
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // if no category id found, default to category 1
      this.currentCategoryId = 1;
    }

    // get product list for current category
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data
      }
    )
  }
}
