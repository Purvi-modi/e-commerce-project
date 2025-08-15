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
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

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

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
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


    // Check if we have a different category than previous
    // Note: Angular will resuse a component if it is currently being viewed
    
    // if we have a different catgegory id than the previous 
    // then we reset the page number back to 1
    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCatgeoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // get product list for current category
    this.productService.getProductListPaginate(
      this.thePageNumber - 1,  // in spring pages begin from 0
      this.thePageSize, 
      this.currentCategoryId
    ).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    )
  }
}
