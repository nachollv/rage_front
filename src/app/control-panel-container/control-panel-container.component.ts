import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Chart, ChartTypeRegistry, registerables  } from 'chart.js';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ScopeOneRecordsService } from '../services/scope-one-records.service';
import { ScopeTwoRecordsService } from '../services/scope-two-records.service';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MesesService } from '../services/meses.service';
import { FuelDataService } from '../services/fuel-data.service';
import { VehiclesFuelConsumptionService } from '../services/vehicles-fuel-consumption.service';
import { EmisionesTransFerAerMarService } from '../services/emisiones-trans-feraermar.service';
import { EmisionesMachineryService } from '../services/emisiones-machinery.service';
import { LeakrefrigerantgasesService } from '../services/leakrefrigerantgases.service';
import { RegistroemisionesFugasService } from '../services/registroemisionesfugas.service';
import { EmisionesElectricaComercializadorasService } from '../services/emisiones-electricas-comercializadoras.service';

@Component({
  selector: 'app-control-panel-container',
  templateUrl: './control-panel-container.component.html',
  styleUrl: './control-panel-container.component.scss'
})

export class ControlPanelContainerComponent implements OnInit {
  filterForm!: FormGroup; // Formulario reactivo
  availableYears: number[] = [2021, 2022, 2023, 2024]; // Años disponibles
  viewUserMenu: boolean = true
  isLoggedIn: boolean = false
  isExpiredToken: boolean = false
  role: string = '' // Rol del usuario
  userName: string = '' // Nombre del usuario
  userId: number = 0 // ID del usuario
  token: string = '' // Token del usuario
  organizacionID!: number | undefined // ID de la organización
  prodCenterID!: number | undefined // ID del centro de producción
  rol!: string
  scopeOneRecords: any[] = [] // Lista de registros de Scope 1
  scopeTwoRecords: any[] = [] // Lista de registros de Scope 2
  fugitiveEmissionsRecords: any[] = []
  displayedColumnsScope1FI: string[] = ['activity Year', 'Period', 'Combustible', 'activity Data', 'total Emissions (tnCO₂eq)']
  displayedColumnsScope1RT: string[] = ['activity Year', 'Period', 'Categoria', 'Combustible', 'activity Data', 'total Emissions (tnCO₂eq)']
  displayedColumnsScope1TransFerMarAe: string[] = ['activity Year', 'Period', 'Categoria', 'Combustible', 'activity Data', 'total Emissions (tnCO₂eq)']
  displayedColumnsScope1MA: string[] = ['activity Year', 'Period', 'Categoria', 'fuelType', 'activity Data', 'total Emissions (tnCO₂eq)']
  displayedColumnsScope1FE: string[] = ['activity Year', 'Period', 'Gas/Mezcla', 'Capacidad', 'Recarga', 'total Emissions (tnCO₂eq)']

  displayedColumnsScope2: string[] = ['activity Year', 'Period', 'Comercializadora', 'activity Data', 'total Emissions (tnCO₂eq)']
  displayedColumnsScope2Steam: string[] = ['activity Year', 'Period', 'Tipo de energía adquirida', 'activity Data', 'total Emissions (tnCO₂eq)']

  fuelTypes: { id: number; Combustible: string }[] = []
  vehicleCategories: { id: number; FuelType: string; Categoria: string }[] = []
  ferMarAerCategories: { id: number; FuelType: string; Categoria: string }[] = []
  machineryCategories: { id: number; FuelType: string; Categoria: string }[] = []
  fugitiveEmissions: { id: number; Nombre: string; FormulaQuimica: string, PCA_6AR: string }[] = []
  comercializadorasElectricas: { id: number; nombreComercial: string; kg_CO2_kWh: string }[] = []
  chartInstanceFixedEmis: Chart | null = null;
  chartInstanceMachinery: Chart | null = null;
  chartInstanceHeatSteamColdCompAir: Chart | null = null;
  chartInstanceRoadTransp: Chart | null = null;
  chartInstanceRailSeaAir: Chart | null = null;
  chartInstanceElectricityBuildings: Chart | null = null;
  chartInstanceElectricityVehicles: Chart | null = null;
  chartInstanceFugitiveEmiss: Chart | null = null;

  data = [{ }]
  dataSourceScope1FixedEmis = new MatTableDataSource<any>(this.data)
  dataSourceScope1RoadTransp = new MatTableDataSource<any>(this.data)
  dataSourceScope1RailSeaAir = new MatTableDataSource<any>(this.data)
  dataSourceScope1Machinery = new MatTableDataSource<any>(this.data)
  dataSourceScope1FugitiveEmiss = new MatTableDataSource<any>(this.data)

  dataSourceScope2ElectricityBuildings = new MatTableDataSource<any>(this.data)
  dataSourceScope2ElectricityVehicles = new MatTableDataSource<any>(this.data)
  dataSourceScope2SteamColdCompAir = new MatTableDataSource<any>(this.data)

  constructor (
    private fb: FormBuilder,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private snackBar: MatSnackBar,
    private mesesService: MesesService,
    private fuelDataService: FuelDataService,
    private vehicleFuelService: VehiclesFuelConsumptionService,
    private ferMarAerService: EmisionesTransFerAerMarService,
    private machineryService: EmisionesMachineryService,
    private emisionesFugitivas: LeakrefrigerantgasesService,
    private scopeOneRecordsService: ScopeOneRecordsService,
    private scopeTwoRecordsService: ScopeTwoRecordsService,
    private fugitiveEmissionRecordsService: RegistroemisionesFugasService,
    private emisionesElectricasComercializadorasService:EmisionesElectricaComercializadorasService)

    {
      this.token = this.authService.getToken() || ''
      if (this.token) {
        this.isExpiredToken = this.jwtHelper.isTokenExpired(this.token)
       if (!this.isExpiredToken) {
        this.rol  = this.jwtHelper.decodeToken(this.token).data.rol
        if (this.rol === 'Admin') {
            this.prodCenterID = undefined
            this.organizacionID = this.jwtHelper.decodeToken(this.token).data.id_empresa
        } else {
            this.prodCenterID = this.jwtHelper.decodeToken(this.token).data.id
            this.organizacionID = undefined
        }
       }
      }
}

  async ngOnInit(): Promise<void> {

    this.filterForm = this.fb.group({
      activityYear: [new Date().getFullYear()-2], // Por defecto, el año actual menos 2
    });
    Chart.register(...registerables);
    this.getFixedFuelConsumptions(this.filterForm.value.activityYear)
    this.getFuelConsumptions(this.filterForm.value.activityYear)
    this.getferMarAerConsumtions(this.filterForm.value.activityYear)
    this.getMachineryConsumtions(this.filterForm.value.activityYear)
    this.getEmisionesFugitivas()
    this.getEmisionesComercializadoras(this.filterForm.value.activityYear)

    await this.getScopeOneRecordsFixed(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)
    await this.getScopeOneRecordsRoadTransp(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)
    await this.getScopeOneRecordsTranFerMaAer(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)
    await this.getScopeOneRecordsMachinery(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)

    await this.getScopeTwoRecords(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)
    await this.getFugitiveEmissionRecords(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)
  }

onYearFilterChange(event: any): void {
    const activityYear = event;
    this.getScopeOneRecordsFixed(activityYear, this.prodCenterID, this.organizacionID)
    this.getScopeOneRecordsRoadTransp(activityYear, this.prodCenterID, this.organizacionID)
    this.getScopeOneRecordsTranFerMaAer(activityYear, this.prodCenterID, this.organizacionID)
    this.getScopeOneRecordsMachinery(this.filterForm.value.activityYear, this.prodCenterID, this.organizacionID)

    this.getScopeTwoRecords(activityYear)
    this.getFugitiveEmissionRecords(activityYear)
}

async getScopeOneRecordsFixed(activityYear: number, prodCenterID?: number, organizationID?: number): Promise<void> {
        try {
            const response = await this.scopeOneRecordsService.getRecordsByFilters(activityYear, prodCenterID, organizationID, 'fixed').toPromise();
            this.scopeOneRecords = response.data;
            const meses = this.mesesService.getMeses();
             this.scopeOneRecords.forEach((registro: any) => {
                const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                registro['Period'] = resultado?.value || 'desconocido';
                registro['activity Data'] = registro.activityData;
                registro['activity Year'] = registro.year;
                registro['updated At'] = registro.updated_at;
                registro.edit = false;
                registro.delete = false;
                const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                const co2 = registro.activityData * parseFloat((matchedFuel as any)?.CO2_kg_ud || '0');
                const ch4 = registro.activityData * parseFloat((matchedFuel as any)?.CH4_g_ud || 0);
                const n2o = registro.activityData * parseFloat((matchedFuel as any)?.NO2_g_ud || 0);
                registro['total Emissions (tnCO₂eq)'] = (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString();
            });
    
            if (this.scopeOneRecords.length > 0) {
                this.dataSourceScope1FixedEmis = new MatTableDataSource( this.scopeOneRecords.filter((record: any) => record.activityType === 'fixed'));
                await this.fixedInstChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'fixed'));
            } else {
                this.showSnackBar('No hay registros con activityType "fixed".');
            }
        } catch (error: any) {
            if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
                this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
            } else {
                this.showSnackBar('Error al obtener registros de Alcance 1.');
            }
        }
}

async getScopeOneRecordsRoadTransp(activityYear: number, prodCenterID?: number, organizationID?: number): Promise<void> {
        try {
            const response = await this.scopeOneRecordsService.getRecordsByFilters(activityYear, prodCenterID, organizationID, 'roadTransp').toPromise();
            this.scopeOneRecords = response.data;
            const meses = this.mesesService.getMeses();
             this.scopeOneRecords.forEach((registro: any) => {
                const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                registro['Period'] = resultado?.value || 'desconocido';
                registro['activity Data'] = registro.activityData;
                registro['activity Year'] = registro.year;
                registro['updated At'] = registro.updated_at;
                registro.edit = false;
                registro.delete = false;
                const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                const co2 = registro.activityData * parseFloat((matchedFuel as any)?.CO2_kg_ud || '0');
                const ch4 = registro.activityData * parseFloat((matchedFuel as any)?.CH4_g_ud || 0);
                const n2o = registro.activityData * parseFloat((matchedFuel as any)?.NO2_g_ud || 0);
                registro['total Emissions (tnCO₂eq)'] = (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString();
            });
    
            if (this.scopeOneRecords.length > 0) {
                this.dataSourceScope1RoadTransp = new MatTableDataSource(this.scopeOneRecords);
                await this.roadTranspChart('bar', this.scopeOneRecords);
            } else {
                this.showSnackBar('No hay registros con activityType "fixed".');
            }
        } catch (error: any) {
            if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
                this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
            } else {
                this.showSnackBar('Error al obtener registros de Alcance 1.');
            }
        }
}

async getScopeOneRecordsTranFerMaAer(activityYear: number, prodCenterID?: number, organizationID?: number): Promise<void> {
        try {
            const response = await this.scopeOneRecordsService.getRecordsByFilters(activityYear, prodCenterID, organizationID, 'transferma').toPromise();
            this.scopeOneRecords = response.data;
            const meses = this.mesesService.getMeses();
             this.scopeOneRecords.forEach((registro: any) => {
                const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                registro['Period'] = resultado?.value || 'desconocido';
                registro['activity Data'] = registro.activityData;
                registro['activity Year'] = registro.year;
                registro['updated At'] = registro.updated_at;
                registro.edit = false;
                registro.delete = false;
                const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                const co2 = registro.activityData * parseFloat((matchedFuel as any)?.CO2_kg_ud || '0');
                const ch4 = registro.activityData * parseFloat((matchedFuel as any)?.CH4_g_ud || 0);
                const n2o = registro.activityData * parseFloat((matchedFuel as any)?.NO2_g_ud || 0);
                registro['total Emissions (tnCO₂eq)'] = (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString();
            });
    
            if (this.scopeOneRecords.length > 0) {
                this.dataSourceScope1RailSeaAir = new MatTableDataSource(this.scopeOneRecords)
                await this.railSeaAirChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'transferma'));
                this.machineryChart('bar', this.scopeOneRecords.filter((record: any) => record.activityType === 'machinery'));
            } else {
                this.showSnackBar('No hay registros con activityType "fixed".');
            }
        } catch (error: any) {
            if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
                this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
            } else {
                this.showSnackBar('Error al obtener registros de Alcance 1.');
            }
        }
}

async getScopeOneRecordsMachinery(activityYear: number, prodCenterID?: number, organizationID?: number): Promise<void> {
        try {
            const response = await this.scopeOneRecordsService.getRecordsByFilters(activityYear, prodCenterID, organizationID, 'machinery').toPromise();
            this.scopeOneRecords = response.data;
            const meses = this.mesesService.getMeses();
             this.scopeOneRecords.forEach((registro: any) => {
                const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
                registro['Period'] = resultado?.value || 'desconocido';
                registro['activity Data'] = registro.activityData;
                registro['activity Year'] = registro.year;
                registro['updated At'] = registro.updated_at;
                registro.edit = false;
                registro.delete = false;
                const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === registro.fuelType);
                const co2 = registro.activityData * parseFloat((matchedFuel as any)?.CO2_kg_ud || '0');
                const ch4 = registro.activityData * parseFloat((matchedFuel as any)?.CH4_g_ud || 0);
                const n2o = registro.activityData * parseFloat((matchedFuel as any)?.NO2_g_ud || 0);
                registro['total Emissions (tnCO₂eq)'] = (co2 + (ch4 / 1000) * 25 + (n2o / 1000) * 298).toFixed(3).toString();
            });
    
            if (this.scopeOneRecords.length > 0) {
                this.dataSourceScope1Machinery = new MatTableDataSource(this.scopeOneRecords)
                this.machineryChart('bar', this.scopeOneRecords);
            } else {
                this.showSnackBar('No hay registros con activityType "fixed".');
            }
        } catch (error: any) {
            if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
                this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
            } else {
                this.showSnackBar('Error al obtener registros de Alcance 1.');
            }
        }
}

getFugitiveEmissionRecords(activityYear: number, prodCenterID?: number, organizationID?: number): void {
    this.fugitiveEmissionRecordsService.getRegistroByFilters(activityYear, prodCenterID, organizationID)
      .subscribe((response: any) => {
        this.fugitiveEmissionsRecords = response.data;
        const meses = this.mesesService.getMeses();
        this.fugitiveEmissionsRecords.forEach((registro: any) => {
          const resultado = meses.find((mes) => mes.key === registro.periodoFactura)
          registro['Period'] = resultado?.value || 'desconocido'
          const matchedFE = this.fugitiveEmissions.find((fuelItem: any) => fuelItem.id === registro.nombre_gas_mezcla);
          registro['Gas/Mezcla'] = matchedFE?.Nombre
          registro['Recarga'] = registro.recarga_equipo
          registro['Capacidad'] = registro.capacidad_equipo
          registro['activity Year'] = registro.year
          registro['updated At'] = registro.updated_at
          registro.edit = false
          registro.delete = false
        });
        console.log ("this.fugitiveEmissionsRecords", this.fugitiveEmissionsRecords)
        this.dataSourceScope1FugitiveEmiss = new MatTableDataSource(this.fugitiveEmissionsRecords);
        this.fugitiveEmissChart('bar', this.fugitiveEmissionsRecords)

      });
    }
getScopeTwoRecords(activityYear: number, prodCenterID?: number, organizationID?: number): void {
    this.scopeTwoRecordsService.getRecordsByFilters(activityYear, prodCenterID, organizationID).subscribe(
      (response: any) => {
        this.scopeTwoRecords = response.data;
        const meses = this.mesesService.getMeses();

        this.scopeTwoRecords.forEach((registro: any) => {
          const resultado = meses.find((mes) => mes.key === registro.periodoFactura);
          registro['Period'] = resultado?.value || 'desconocido'
          registro['Comercializadora'] = registro.electricityTradingCompany
          registro['activity Data'] = registro.activityData
          registro['activity Year'] = registro.year
          registro['updated At'] = registro.updated_at
          registro.edit = false
          registro.delete = false
        });

        if (this.scopeTwoRecords.length > 0) {
          this.electricityBuildings('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'electricityBuildings'));
          this.electricityVehicles('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'electricityVehicles'));
          this.heatSteamColdCompAir('bar', this.scopeTwoRecords.filter((record: any) => record.activityType === 'heatSteamColdAir'));
        } else {
          this.showSnackBar('No hay registros.');
        }
      },
      (error) => {
          if (error.status === 404 && error.messages?.error === "No se encontraron registros con los parámetros proporcionados.") {
              this.showSnackBar('No se encontraron registros con los parámetros proporcionados.');
          } else {
              this.showSnackBar('Error al obtener registros de Alcance 2.');
          }
      }
    );
    }

fixedInstChart(chartType: keyof ChartTypeRegistry, scop1DataFI: any): void {
    const ctx = document.getElementById('fixedInstChart') as HTMLCanvasElement;
      scop1DataFI.forEach((dataObjectFI: any) => {
        const matchedFuel = this.fuelTypes.find((fuelItem: any) => fuelItem.id === dataObjectFI.fuelType);
        dataObjectFI['fuelType'] = matchedFuel?.Combustible || 'desconocido '+dataObjectFI['fuelType'];
      });
      // Inicializar tipos de combustible
      const fuelTypes = new Set(scop1DataFI.map((item: any) => item['fuelType']));
      const datasets: any[] = [];
  
      // Crear datos agrupados por fuelType
      fuelTypes.forEach((fuelType) => {
          const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
  
          scop1DataFI.forEach((dataObjectFI: any) => {
              if (dataObjectFI['fuelType'] === fuelType) {
                  const monthIndex = parseInt(dataObjectFI.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                  monthlyData[monthIndex] += parseFloat(dataObjectFI.activityData); // Sumar datos mensuales
              }
          });
  
          // Agregar dataset si tiene datos
          if (monthlyData.some((value) => value > 0)) {
              datasets.push({
                  label: fuelType,
                  data: monthlyData,
                  backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                  borderColor: '#696969',
                  borderWidth: 1,
              });
          }
      });
  
      if (this.chartInstanceFixedEmis) {
          this.chartInstanceFixedEmis.destroy();
      }
  
      this.chartInstanceFixedEmis = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December',
              ],
              datasets: datasets,
          },
          options: {
              plugins: {
                  legend: {
                      position: 'top',
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Fixed Installations - Emissions Grouped by Fuel Type',
                  },
              },
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
    }
roadTranspChart(chartType: keyof ChartTypeRegistry, scop1DataRD: any): void {
      const ctx = document.getElementById('roadTranspChart') as HTMLCanvasElement;
      scop1DataRD.forEach((roadTransport: any) => {
        const matchedroadTransport = this.vehicleCategories.find((item: any) => item.id === roadTransport.equipmentType)
        roadTransport['Categoría vehículo'] = matchedroadTransport?.Categoria
        roadTransport['fuelType'] = matchedroadTransport?.FuelType
      });
      // Inicializar categorías y colores
      const categories = new Set(scop1DataRD.map((item: any) => item['Categoría vehículo']));
      const fuelTypes = new Set(scop1DataRD.map((item: any) => item['fuelType']));
      const datasets: any[] = [];
      // Crear datos agrupados por Categoría vehículo y fuel Type
      categories.forEach((category) => {
          fuelTypes.forEach((fuelType) => {
              const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
  
              scop1DataRD.forEach((dataObject: any) => {
                  if (
                      dataObject['Categoría vehículo'] === category &&
                      dataObject['fuelType'] === fuelType
                  ) {
                      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Sumar datos mensuales
                  }
              });
  
              // Agregar dataset si tiene datos
              if (monthlyData.some((value) => value > 0)) {
                  datasets.push({
                      label: `${category} - ${fuelType}`,
                      data: monthlyData,
                      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                      borderColor: '#696969',
                      borderWidth: 1,
                  });
              }
          });
      });
  
      /* this.dataSourceScope1RoadTransp = new MatTableDataSource(scop1DataRD); */
  
      if (this.chartInstanceRoadTransp) {
          this.chartInstanceRoadTransp.destroy();
      }
  
      this.chartInstanceRoadTransp = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
              ],
              datasets: datasets,
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Transporte por carretera - Emissions Grouped by Vehicle Category and Fuel Type',
                  },
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
    }
railSeaAirChart(chartType: keyof ChartTypeRegistry, scop1DataRSA: any): void {
      const ctx = document.getElementById('railSeaAirChart') as HTMLCanvasElement;
      scop1DataRSA.forEach((marSeaAer: any) => {
        const matchedFerMarAer = this.ferMarAerCategories.find((item: any) => item.Categoria === marSeaAer.equipmentType)
        marSeaAer['Categoría vehículo'] = matchedFerMarAer?.Categoria
        marSeaAer['fuelType'] = matchedFerMarAer?.FuelType
      });
      // Inicializar categorías y tipos de combustible únicos
      const categories = new Set(scop1DataRSA.map((item: any) => item['Categoría vehículo']));
      const fuelTypes = new Set(scop1DataRSA.map((item: any) => item['fuelType']));
      const datasets: any[] = [];
  
      // Crear datos agrupados por Categoría vehículo y fuel Type
      categories.forEach((category) => {
          fuelTypes.forEach((fuelType) => {
              const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
  
              scop1DataRSA.forEach((dataObject: any) => {
                  if (
                      dataObject['Categoría vehículo'] === category &&
                      dataObject['fuelType'] === fuelType
                  ) {
                      const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                      monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Sumar datos mensuales
                  }
              });
  
              // Agregar dataset si tiene datos
              if (monthlyData.some((value) => value > 0)) {
                  datasets.push({
                      label: `${category} - ${fuelType}`,
                      data: monthlyData,
                      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                      borderColor: '#696969',
                      borderWidth: 1,
                  });
              }
          });
      });
  
      /* this.dataSourceScope1RailSeaAir = new MatTableDataSource(scop1DataRSA); */
  
      if (this.chartInstanceRailSeaAir) {
          this.chartInstanceRailSeaAir.destroy();
      }
  
      this.chartInstanceRailSeaAir = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December',
              ],
              datasets: datasets,
          },
          options: {
              plugins: {
                  legend: {
                      position: 'top',
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Transporte ferroviario, marítimo, aéreo - Emissions grouped by Vehicle Category and Fuel Type',
                  },
              },
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
    }
machineryChart(chartType: keyof ChartTypeRegistry, scop1DataMA: any): void {
      const ctx = document.getElementById('machineryChart') as HTMLCanvasElement;
      scop1DataMA.forEach((machineDataActiv: any) => {
        const matchedMachinery = this.machineryCategories.find((item: any) => item.id === machineDataActiv.fuelType)
        machineDataActiv['Categoría vehículo'] = machineDataActiv?.equipmentType
        machineDataActiv['fuelType'] = matchedMachinery?.FuelType
      });
      // Inicializar categorías y colores
      const categories = new Set(scop1DataMA.map((item: any) => item['equipmentType']));
      const fuelTypes = new Set(scop1DataMA.map((item: any) => item['fuelType']));
      const matchedMachinery = this.machineryCategories.find((item: any) => item.id === fuelTypes)
      const datasets: any[] = [];
  
      // Crear datos agrupados por Categoría vehículo y fuel Type
      categories.forEach((category) => {
          fuelTypes.forEach((fuelType) => {
              const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
              scop1DataMA.forEach((machineDataActiv: any) => {
                  if (
                      machineDataActiv['equipmentType'] === category &&
                      machineDataActiv['fuelType'] === fuelType
                  ) {
                      const monthIndex = parseInt(
                          machineDataActiv.periodoFactura.replace('M', '')
                      ) - 1;
                      monthlyData[monthIndex] += parseFloat(machineDataActiv.activityData); // Sumar datos mensuales
                  }
              });
  
              // Agregar dataset si tiene datos
              if (monthlyData.some((value) => value > 0)) {
                  datasets.push({
                      label: `${category} - ${fuelType}`,
                      data: monthlyData,
                      backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                      borderColor: '#696969',
                      borderWidth: 1,
                  });
              }
          });
      });
  
      if (this.chartInstanceMachinery) {
          this.chartInstanceMachinery.destroy();
      }
  
      this.chartInstanceMachinery = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
              ],
              datasets: datasets,
          },
          options: {
              responsive: true,
              plugins: {
                  legend: {
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Machinery - Emissions Grouped by Vehicle Category and Fuel Type',
                  },
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
    }
fugitiveEmissChart(chartType: keyof ChartTypeRegistry, scop1DataFE: any): void {
      const ctx = document.getElementById('fugitiveEmissChart') as HTMLCanvasElement;
      // Inicializar tipos de gases únicos
      const gasTypes = new Set(scop1DataFE.map((item: any) => item['Gas/Mezcla']));
      const datasets: any[] = [];
      // Crear datos agrupados por tipo de gas
      gasTypes.forEach((gasType) => {
          const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
          scop1DataFE.forEach((dataObject: any) => {
              if (dataObject['Gas/Mezcla'] === gasType) {
                  const monthIndex = parseInt(dataObject.PeriodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                  monthlyData[monthIndex] += parseFloat(dataObject.capacidad_equipo) - parseFloat(dataObject.recarga_equipo); // Sumar datos mensuales
              }
          });

          // Agregar dataset si tiene datos
          if (monthlyData.some((value) => value > 0)) {
              datasets.push({
                  label: gasType,
                  data: monthlyData,
                  backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Color aleatorio
                  borderColor: '#696969',
                  borderWidth: 1,
              });
          }
      });
  
     /*  this.dataSourceScope1FugitiveEmiss = new MatTableDataSource(scop1DataFE); */
  
      if (this.chartInstanceFugitiveEmiss) {
          this.chartInstanceFugitiveEmiss.destroy();
      }
  
      this.chartInstanceFugitiveEmiss = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December',
              ],
              datasets: datasets,
          },
          options: {
              plugins: {
                  legend: {
                      position: 'top',
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Fugitive gases - Emissions grouped by Gas/Mixing type',
                  },
              },
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
    }
  

electricityBuildings(chartType: keyof ChartTypeRegistry, scop2ElecBuild: any): void {
      const ctx = document.getElementById('electricityBuildings') as HTMLCanvasElement;
      scop2ElecBuild.forEach((dataObject: any) => {
        const matchedComercialiadora = this.comercializadorasElectricas.find((item: any) => item.id === dataObject.Comercializadora)
        dataObject['Comercializadora'] = matchedComercialiadora?.nombreComercial
      });
      // Inicializar comercializadoras únicas
      const comercializadoras = new Set(scop2ElecBuild.map((item: any) => item['Comercializadora']));
      const datasets: any[] = [];
  
      // Crear datos agrupados por comercializadora
      comercializadoras.forEach((comercializadora) => {
          const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
  
          scop2ElecBuild.forEach((dataObject: any) => {
              if (dataObject['Comercializadora'] === comercializadora) {
                  const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                  monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Sumar datos mensuales
              }
          });
  
          // Agregar dataset si tiene datos
          if (monthlyData.some((value) => value > 0)) {
              datasets.push({
                  label: comercializadora,
                  data: monthlyData,
                  backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                  borderColor: '#696969',
                  borderWidth: 1,
              });
          }
      });
  
      this.dataSourceScope2ElectricityBuildings = new MatTableDataSource(scop2ElecBuild);
  
      if (this.chartInstanceElectricityBuildings) {
          this.chartInstanceElectricityBuildings.destroy();
      }
  
      this.chartInstanceElectricityBuildings = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: [
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December',
              ],
              datasets: datasets,
          },
          options: {
              plugins: {
                  legend: {
                      position: 'top',
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Electrical consumption in Buildings - Emissions grouped by Comercializadora',
                  },
              },
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
  }
electricityVehicles(chartType: keyof ChartTypeRegistry, scop2DataVehicles: any): void {
      const ctx = document.getElementById('electricityVehicles') as HTMLCanvasElement;
      scop2DataVehicles.forEach((dataObject: any) => {
        const matchedComercialiadora = this.comercializadorasElectricas.find((item: any) => item.id === dataObject.Comercializadora)
        dataObject['Comercializadora'] = matchedComercialiadora?.nombreComercial
      });
      // Inicializar comercializadoras únicas
      const comercializadoras = new Set(scop2DataVehicles.map((item: any) => item['Comercializadora']));
      const datasets: any[] = [];
  
      // Crear datos agrupados por comercializadora
      comercializadoras.forEach((comercializadora) => {
          const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
  
          scop2DataVehicles.forEach((dataObject: any) => {
              if (dataObject['Comercializadora'] === comercializadora) {
                  const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                  monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Sumar datos mensuales
              }
          });
  
          // Agregar dataset si tiene datos
          if (monthlyData.some((value) => value > 0)) {
              datasets.push({
                  label: comercializadora,
                  data: monthlyData,
                  backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                  borderColor: '#696969',
                  borderWidth: 1,
              });
          }
      });
  
      this.dataSourceScope2ElectricityVehicles = new MatTableDataSource(scop2DataVehicles);
  
      if (this.chartInstanceElectricityVehicles) {
          this.chartInstanceElectricityVehicles.destroy();
      }
  
      this.chartInstanceElectricityVehicles = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
              ],
              datasets: datasets,
          },
          options: {
              plugins: {
                  legend: {
                      position: 'top',
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Electricity consumption in vehicles - Emissions Grouped by Comercializadora',
                  },
              },
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
  }
heatSteamColdCompAir(chartType: keyof ChartTypeRegistry, scop2DataSteam: any): void {
      const ctx = document.getElementById('heatSteamColdCompAir') as HTMLCanvasElement;
      scop2DataSteam.forEach((registro: any) => {
        registro['Tipo de energía adquirida'] = registro.energyType
      })
      // Inicializar tipos de energía
      const energyTypes = new Set(scop2DataSteam.map((item: any) => item['energyType']));
      const datasets: any[] = [];
  
      // Crear datos agrupados por energyType
      energyTypes.forEach((energyType) => {
          const monthlyData = new Array(12).fill(0); // Inicializar con 12 meses en 0
  
          scop2DataSteam.forEach((dataObject: any) => {
              if (dataObject['energyType'] === energyType) {
                  const monthIndex = parseInt(dataObject.periodoFactura.replace('M', '')) - 1; // Obtener índice del mes
                  monthlyData[monthIndex] += parseFloat(dataObject.activityData); // Sumar datos mensuales
              }
          });
  
          // Agregar dataset si tiene datos
          if (monthlyData.some((value) => value > 0)) {
              datasets.push({
                  label: energyType,
                  data: monthlyData,
                  backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Generar color aleatorio
                  borderColor: '#696969',
                  borderWidth: 1,
              });
          }
      });
  
      this.dataSourceScope2SteamColdCompAir = new MatTableDataSource(scop2DataSteam);
  
      if (this.chartInstanceHeatSteamColdCompAir) {
          this.chartInstanceHeatSteamColdCompAir.destroy();
      }
  
      this.chartInstanceHeatSteamColdCompAir = new Chart(ctx, {
          type: chartType,
          data: {
              labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
              ],
              datasets: datasets,
          },
          options: {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                  legend: {
                      position: 'top',
                      labels: {
                          color: '#696969',
                      },
                  },
                  title: {
                      display: true,
                      text: 'Calor, vapor, frío y aire comprimido - Emissions Grouped by Energy Type',
                  },
              },
              interaction: {
                  mode: 'index',
                  intersect: false,
              },
              scales: {
                  x: {
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
                  y: {
                      beginAtZero: true,
                      stacked: true,
                      ticks: { color: '#696969' },
                  },
              },
          },
      });
  }
  
  getFixedFuelConsumptions(year: number) {
    this.fuelDataService.getByYear(year)
    .subscribe((fuel:any) => {
      this.fuelTypes = fuel
    })
  }

  getFuelConsumptions(year: number) {
    this.vehicleFuelService.getByYear(year)
      .subscribe((category:any) => {
      this.vehicleCategories = category
      })
  }

  getferMarAerConsumtions(year: number) {
    this.ferMarAerService.getEmisionesByYear(year)
      .subscribe((item:any) => {
        this.ferMarAerCategories = item
      })
  }

  getMachineryConsumtions(year: number) {
    this.machineryService.getEmisionesByYear(year)
      .subscribe((item:any) => {
        this.machineryCategories = item
      })
  }

  getEmisionesFugitivas() {
    this.emisionesFugitivas.getAll()
      .subscribe((item:any) => {
        this.fugitiveEmissions = item
      })
  }

  getEmisionesComercializadoras(year:number) {
    this.emisionesElectricasComercializadorasService.getByYear(year)
    .subscribe((item:any) => {
      this.comercializadorasElectricas = item
    })
  }

  private showSnackBar(msg: string): void {
    this.snackBar.open(msg, 'Close', {
      duration: 15000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar'],
    });
  }
}

