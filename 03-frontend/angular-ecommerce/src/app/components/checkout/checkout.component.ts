import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { every, first, last } from 'rxjs';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{


  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private checkoutFormService: CheckoutFormService,
    private cartService: CartService,
    private router: Router,
    private checkOutService: CheckoutService
  ) {

  }

  ngOnInit(): void {
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                            [Validators.required, 
                             CustomValidators.notOnlyWhitespace, 
                             Validators.minLength(2)]),

        lastName: new FormControl('', 
                            [Validators.required,
                             CustomValidators.notOnlyWhitespace, 
                             Validators.minLength(2)]),

        email: new FormControl('', 
                              [Validators.required, 
                              // ^ - string start $ - string end , match alpha, num, special chars, between 2 and 4 letters at end
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                [Validators.required,
                                  CustomValidators.notOnlyWhitespace, 
                                  Validators.minLength(2)]),

        city: new FormControl('', 
                            [Validators.required,
                             CustomValidators.notOnlyWhitespace, 
                             Validators.minLength(2)]),

        state: new FormControl('', Validators.required),

        country: new FormControl('', Validators.required),

        zipCode: new FormControl('', 
                            [Validators.required,
                             CustomValidators.notOnlyWhitespace,
                            Validators.minLength(2)])
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', 
                                [Validators.required,
                                  CustomValidators.notOnlyWhitespace, 
                                  Validators.minLength(2)]),

        city: new FormControl('', 
                            [Validators.required,
                             CustomValidators.notOnlyWhitespace, 
                             Validators.minLength(2)]),

        state: new FormControl('', Validators.required),

        country: new FormControl('', Validators.required),

        zipCode: new FormControl('', 
                            [Validators.required,
                             CustomValidators.notOnlyWhitespace,
                            Validators.minLength(2)])
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('', Validators.required),

        nameOnCard: new FormControl('', 
                            [Validators.required,
                             CustomValidators.notOnlyWhitespace, 
                             Validators.minLength(2)]),
        cardNumber: new FormControl('', 
                            [Validators.required,
                             Validators.pattern('^\\d{16}$')]),
        securityCode: new FormControl('', 
                            [Validators.required,
                             Validators.pattern('^\\d{3}$')]),
        expirationMonth: [''],
        expirationYear: [''],
      }),

    });

    this.reviewCartDetails();

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrieved credit card months: ", JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.checkoutFormService.getCretditCardYears().subscribe(
      data => {
        console.log("retrieved credit card years:", JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    //populate countries
    this.checkoutFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries data: ",JSON.stringify(data))
        this.countries = data;
      }
    )
  }

  reviewCartDetails(){

    this.cartService.totalPrice.subscribe(
      price =>{
        this.totalPrice = price;
      }
    );

    this.cartService.totalQuantity.subscribe(
      quantity => {
        this.totalQuantity = quantity;
      }
    )
  }


  onSubmit() {
    console.log("handling the submit button");

    if(this.checkoutFormGroup.invalid){
      // to show errors if nay on all fields
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    

    // set up order
    let order = new Order()   
    order.totalPrice= this.totalPrice,
    order.totalQuantity= this.totalQuantity

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create order items from cart items
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.state = shippingState.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.state = billingState.name;

    // populate purchase - order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via CheckoutService
    this.checkOutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been recieved. \n Order tracking numer: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`There was an error ${err.message}`);
        }
      }
    );
  }

  resetCart() {
    // reset cart data 
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset form data
    this.checkoutFormGroup.reset();

    // naviagte back to products page
    this.router.navigateByUrl("/products");
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyShippingAddressToBillingAddress(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

        this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number;

    // if current year equals selected year, then start woth current month
    if(currentYear == selectedYear){
      startMonth = new Date().getMonth();
    }
    else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("retrieved credit card months: ", JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country code: ${countryName}`);

    this.checkoutFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName == 'shippingAddress'){
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0])
      }
    )
  }

}
