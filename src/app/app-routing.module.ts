import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrganGeneralDataComponent } from './Protected/organ-general-data/organ-general-data.component';
import { ElectricityComponent } from './Protected/consumption/electricity/electricity.component';
import { HomeComponent } from './home/home.component';
import { ConsumtionContainerComponent } from './Protected/consumption/consumtion-container-scope1/consumtion-container.component';
import { ConsumtionContainerScope2Component } from './Protected/consumption/consumtion-container-scope2/consumtion-container-scope2.component';
import { ControlPanelContainerComponent } from './control-panel-container/control-panel-container.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'scope-one', component: ConsumtionContainerComponent },
  { path: 'scope-two', component: ConsumtionContainerScope2Component },
  { path: 'organ-gen-data', component: OrganGeneralDataComponent },
  { path: 'control-panel-container', component: ControlPanelContainerComponent },
  { path: 'electricity-consumption', component: ElectricityComponent },
  /* { path: '*', component: HomeComponent } */
  { path: '*', redirectTo: '/login', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
