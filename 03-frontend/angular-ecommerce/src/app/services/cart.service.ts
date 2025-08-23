import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public totalPrice: Subject<number> = new Subject<number>();
  public totalQuantity: Subject<number> = new Subject<number>();
  public cartItems: CartItem[] = [];

  constructor() { }

  addToCart(cartItem: CartItem){

    let alreadyExistsInCart: Boolean = false;
    // if Item exists, increase quanityt
    if(this.cartItems.length > 0){

      this.cartItems.forEach((item) => {
        if (item.id === cartItem.id) {
          item.quantity += 1;  // simpler and correct
          alreadyExistsInCart = true;
        }
      });

    }

    // if not, add item
    if(!alreadyExistsInCart){
      this.cartItems.push(cartItem);
    }

    this.cartItems.forEach((item) => {
        console.log(`name: ${item.name}, quantity: ${item.quantity}`)
      });

    // calculate the total price and quantity
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPrice = 0;
    let totalQuantity = 0;
    // iterate over cart items
    for(let cartItem of this.cartItems){
        
        // add quantiy * unit price
        totalPrice += cartItem.unitPrice * cartItem.quantity;

        // add to total price
        totalQuantity += cartItem.quantity;

        // add quantuy to total quantity
        
        // send signal for total price and total quantuty
        
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }
}
