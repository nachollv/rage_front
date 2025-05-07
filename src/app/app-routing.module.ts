import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrganGeneralDataComponent } from './Protected/organ-general-data/organ-general-data.component';
import { ElectricityComponent } from './Protected/consumption/electricity/electricity.component';
import { HomeComponent } from './home/home.component';
import { ConsumptionComponent } from './Protected/consumption/consumption.component';
import { ControlPanelContainerComponent } from './control-panel-container/control-panel-container.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { UserManagementComponent } from './Protected/user/user-management/user-management.component';
import { RaquingsByProductionCenterComponent } from './Protected/raquings-by-production-center/raquings-by-production-center.component';
import { EmissionFactorMaintenanceComponent } from './Protected/emission-factor/emission-factor-maintenance/emission-factor-maintenance.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: RegisterComponent },
  { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard] },
  { path: 'scope/:scope', component: ConsumptionComponent, canActivate: [AuthGuard] },
  { path: 'scope/:scope', component: ConsumptionComponent, canActivate: [AuthGuard] },
  { path: 'organ-gen-data', component: OrganGeneralDataComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: ControlPanelContainerComponent },
  { path: 'ranquing', component: RaquingsByProductionCenterComponent },
  { path: 'electricity-consumption', component: ElectricityComponent, canActivate: [AuthGuard] },
  { path: 'recover-password', component: RecoveryPasswordComponent },
  { path: 'emission-factor-maintenance', component: EmissionFactorMaintenanceComponent, canActivate: [AuthGuard] },
  { path: '*', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
