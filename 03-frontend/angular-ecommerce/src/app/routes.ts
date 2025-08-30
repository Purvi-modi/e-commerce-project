import { Route } from "@angular/router";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductDetailsComponent } from "./components/product-details/product-details.component";
import { CartDetailsComponent } from "./components/cart-details/cart-details.component";
import { CheckoutComponent } from "./components/checkout/checkout.component";

export const routes: Route[] = [
    // order of routes is important, first come first serve
    {path: 'products/:id',component: ProductDetailsComponent},
    {path: 'search/:keyword',component: ProductListComponent},
    {path: 'category/:id', component: ProductListComponent},
    {path: 'category', component: ProductListComponent},
    {path: 'products', component: ProductListComponent},
    {path:  "cart-details", component: CartDetailsComponent},
    {path:  "checkout", component: CheckoutComponent},
    // for redirect to / is allowed before url
    {path:  '', redirectTo: '/products', pathMatch:'full'},
    // wildcard, if anything doesnt match above
    {path:  '**', redirectTo: '/products', pathMatch:'full'},

];