import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { every, first, last } from 'rxjs';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';

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

  constructor(private formBuilder: FormBuilder, private checkoutFormService: CheckoutFormService) {

  }

  ngOnInit(): void {
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),


      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),

    });

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
  }

  onSubmit() {
    console.log("handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')!.value);
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const input = event.target as HTMLInputElement;
    if(input.checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
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

}
