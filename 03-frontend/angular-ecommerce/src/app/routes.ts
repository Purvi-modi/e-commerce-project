import { Route } from "@angular/router";
import { ProductListComponent } from "./components/product-list/product-list.component";

export const routes: Route[] = [
    // order of routes is important, first come first serve
    {path: 'search/:keyword',component: ProductListComponent},
    {path: 'category/:id', component: ProductListComponent},
    {path: 'category', component: ProductListComponent},
    {path: 'products', component: ProductListComponent},
    // for redirect to / is allowed before url
    {path: '', redirectTo: '/products', pathMatch:'full'},
    // wildcard, if anything doesnt match above
    {path: '**', redirectTo: '/products', pathMatch:'full'},
];