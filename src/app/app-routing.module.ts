import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrganGeneralDataComponent } from './Protected/organ-general-data/organ-general-data.component';
import { ElectricityComponent } from './Protected/consumption/electricity/electricity.component';
import { HomeComponent } from './home/home.component';
import { ConsumptionComponent } from './Protected/consumption/consumption.component';
import { ConsumtionContainerScope2Component } from './Protected/consumption/consumtion-container-scope2/consumtion-container-scope2.component';
import { ControlPanelContainerComponent } from './control-panel-container/control-panel-container.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { UserManagementComponent } from './Protected/user/user-management/user-management.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'scope/:scope', component: ConsumptionComponent, canActivate: [AuthGuard] },
  { path: 'scope/:scope', component: ConsumptionComponent, canActivate: [AuthGuard] },
  { path: 'organ-gen-data', component: OrganGeneralDataComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: ControlPanelContainerComponent },
  { path: 'electricity-consumption', component: ElectricityComponent, canActivate: [AuthGuard] },
  { path: 'recover-password', component: RecoveryPasswordComponent },
  { path: '*', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
