import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrganGeneralDataComponent } from './Protected/organ-general-data/organ-general-data.component';
import { ElectricityComponent } from './Protected/consumption/electricity/electricity.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  /* { path: '', redirectTo: '/login', pathMatch: 'full' }, */
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'organ-gen-data', component: OrganGeneralDataComponent },
  { path: 'electricity-consumption', component: ElectricityComponent},
  { path: '*', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
