import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
	providedIn: 'root'
})
export class CartService {

	// use behavior subject to provide value to new subscribers that are in components newly initilized after value was changed
	public totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	public cartItems: CartItem[] = [];

	constructor() { }

	addToCart(cartItem: CartItem) {

		let alreadyExistsInCart: Boolean = false;
		// if Item exists, increase quanityt
		if (this.cartItems.length > 0) {

			this.cartItems.forEach((item) => {
				if (item.id === cartItem.id) {
					item.quantity += 1;  // simpler and correct
					alreadyExistsInCart = true;
				}
			});

		}

		// if not, add item
		if (!alreadyExistsInCart) {
			this.cartItems.push(cartItem);
		}

		this.cartItems.forEach((item) => {
			console.log(`name: ${item.name}, quantity: ${item.quantity}`)
		});

		// calculate the total price and quantity
		this.computeCartTotals();
	}

	decreamentQuantity(cartItem: CartItem) {

		cartItem.quantity--;

		if (cartItem.quantity == 0) {
			this.remove(cartItem);
		} else {
			this.computeCartTotals();
		}
	}

	remove(cartItem: CartItem) {

		// get index of item in the array
		const itemIndex = this.cartItems.findIndex((item) => item.id == cartItem.id);

		// if found, remove the item from the array at the given index
		if (itemIndex > -1) {
			this.cartItems.splice(itemIndex, 1);

			this.computeCartTotals();
		}
	}

	computeCartTotals() {

		let totalPrice = 0;
		let totalQuantity = 0;
		// iterate over cart items
		for (let cartItem of this.cartItems) {

			// add quantiy * unit price
			totalPrice += cartItem.unitPrice * cartItem.quantity;

			// add to total price
			totalQuantity += cartItem.quantity;

		}

		this.totalPrice.next(totalPrice);
		this.totalQuantity.next(totalQuantity);
	}

}
