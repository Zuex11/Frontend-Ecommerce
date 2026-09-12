import { Routes } from '@angular/router';
import { Productslist } from './layout/productslist/productslist';
import { Layout } from './layout/layout';
import { Productdetails } from './layout/productslist/productdetails/productdetails';
import { Home } from './layout/home/home';
import { Cart } from './layout/cart/cart';
import { AdminLayout } from './admin/adminlayout/adminlayout';
import { AdminDashboard } from './admin/admindashboard/admindashboard';
import { AdminProducts } from './admin/adminproducts/adminproducts';
import { AdminOrders } from './admin/adminorders/adminorders';
import { AdminTestimonials } from './admin/admintestimonials/admintestimonials';
import { Admincategories } from './admin/admincategories/admincategories';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { Login } from './shared/login/login';
import { Signup } from './shared/signup/signup';
import { Notfound } from './shared/notfound/notfound';
import { Account } from './layout/account/account';
import { Checkout } from './layout/checkout/checkout';
import { Orders } from './layout/orders/orders';
import { Orderdetails } from './layout/orders/orderdetails/orderdetails';
import { About } from './layout/about/about';
import { Policies } from './layout/policies/policies';
import { Testimonials } from './layout/testimonials/testimonials';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'products', component: AdminProducts },
      { path: 'categories', component: Admincategories },
      { path: 'orders', component: AdminOrders },
      { path: 'testimonials', component: AdminTestimonials },
    ],
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      { path: 'products', component: Productslist },
      { path: 'products/:slug', component: Productdetails },
      { path: 'testimonials', component: Testimonials },
      { path: 'about', component: About },
      { path: 'policies', component: Policies },
      { path: 'cart', component: Cart },
      { path: 'profile', component: Account, canActivate: [authGuard] },
      { path: 'checkout', component: Checkout, canActivate: [authGuard] },
      { path: 'orders', component: Orders, canActivate: [authGuard] },
      { path: 'orders/:id', component: Orderdetails, canActivate: [authGuard] },
    ],
  },
  { path: '**', component: Notfound },
];
