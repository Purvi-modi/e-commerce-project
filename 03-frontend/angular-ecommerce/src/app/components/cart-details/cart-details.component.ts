import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
	selector: 'app-cart-details',
	templateUrl: './cart-details.component.html',
	styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {


	public cartItems: CartItem[] = [];
	public totalPrice: number = 0;
	public totalQuantity: number = 0;


	constructor(private cartService: CartService) {

	}

	ngOnInit() {
		this.listCartDetails();
	}

	listCartDetails() {

		// get a handle to the cart items
		this.cartItems = this.cartService.cartItems;

		// subscribe to the cart total price
		this.cartService.totalPrice.subscribe((totalPrice: number) => {
			this.totalPrice = totalPrice;
		})

		// subscribe to the cart total quantity
		this.cartService.totalQuantity.subscribe((totalQuantity: number) => {
			this.totalQuantity = totalQuantity;
		})

		// compute total price and total quantity
		// this is called to update total price and quantity
		this.cartService.computeCartTotals();
	}

	increamentQuantity(cartItem: CartItem) {
		this.cartService.addToCart(cartItem);
	}

	decreamentQuantity(cartItem: CartItem) {
		this.cartService.decreamentQuantity(cartItem);
	}

	remove(cartItem: CartItem) {
		this.cartService.remove(cartItem);
	}


}
