import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit{

  public totalPrice: number = 0;
  public totalQuantity: number = 0;

  constructor(private cartService: CartService) {

  }
  
  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus(){
    this.cartService.totalPrice.subscribe((totalPrice: number)=>{
      this.totalPrice = totalPrice;
    })

    this.cartService.totalQuantity.subscribe((totalQuantity: number)=>{
      this.totalQuantity = totalQuantity;
    })

  }
}
