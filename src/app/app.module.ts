import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataService } from './services/data.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
/*  */
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/*  */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './Protected/header/header.component';
import { FooterComponent } from './Protected/footer/footer.component';
/*  */
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { CdkMenuModule } from '@angular/cdk/menu';
import { MatRadioModule } from '@angular/material/radio';
/*  */
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OrganGeneralDataComponent } from './Protected/organ-general-data/organ-general-data.component';
import { DataTableComponent } from './Protected/data-table/data-table.component';
import { ElectricityComponent } from './Protected/consumption/electricity/electricity.component';
import { FixedInstallationComponent } from './Protected/consumption/fixed-installation/fixed-installation.component';
import { HomeComponent } from './home/home.component';
import { DialogComponent } from './dialog/dialog.component';
import { ConsumtionContainerComponent } from './Protected/consumption/consumtion-container-scope1/consumtion-container.component';
import { ConsumtionContainerScope2Component } from './Protected/consumption/consumtion-container-scope2/consumtion-container-scope2.component';
import { ControlPanelContainerComponent } from './control-panel-container/control-panel-container.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MachineryVehiclesComponent } from './Protected/consumption/vehicles/vehicles.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { FugitiveGasesComponent } from './Protected/consumption/fugitive-gases/fugitive-gases.component';
import { ElectricityVehiclesComponent } from './Protected/consumption/electricity-vehicles/electricity-vehicles.component';
import { MachineryComponent } from './Protected/consumption/machinery/machinery.component';
import { HeatSteamColdCompAirComponent } from './Protected/consumption/heat-steam-cold-comp-air/heat-steam-cold-comp-air.component';
import { RailSeaAirtransportComponent } from './Protected/consumption/rail-sea-airtransport/rail-sea-airtransport.component';

// Función para cargar los archivos de traducción
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// Función para obtener el token del almacenamiento local
export function tokenGetter() {
  const token = localStorage.getItem('authToken');
  return token;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    OrganGeneralDataComponent,
    DataTableComponent,
    ElectricityComponent,
    FixedInstallationComponent,
    HomeComponent,
    DialogComponent,
    ConsumtionContainerComponent,
    ConsumtionContainerScope2Component,
    ControlPanelContainerComponent,
    PageNotFoundComponent,
    MachineryVehiclesComponent,
    RecoveryPasswordComponent,
    FugitiveGasesComponent,
    ElectricityVehiclesComponent,
    MachineryComponent,
    HeatSteamColdCompAirComponent,
    RailSeaAirtransportComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatMenuModule,
    MatTabsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    CdkMenuModule,
    MatRadioModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['*'],
        /*        disallowedRoutes: ['localhost:3000/api/auth'] */
      }
    })
  ],
  providers: [
    provideAnimationsAsync(),
    DataService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
