import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MembershipComponent } from './membership/membership.component';
import { PolicyComponent } from './policy/policy.component';
import { RegisterComponent } from './register/register.component';
import { TermsComponent } from './terms/terms.component';

const routes: Routes = [
  {
    path:'login',component:LoginComponent,
  },
  {path:'terms',component:TermsComponent},
  {path:'policy',component:PolicyComponent},
  {path:'membership',component:MembershipComponent},
  {path:'',component:HomeComponent},
  {path:'home',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {
    path:'user',
    loadChildren:()=>import('./user/user.module').then(x=>x.UserModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
