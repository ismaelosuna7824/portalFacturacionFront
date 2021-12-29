import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { InicioService } from './inicio.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit  {
  foods: any[] = [
    {value: '', viewValue: 'solo fechas'},
    {value: 'ingreso', viewValue: 'Ingreso'},
    {value: 'egreso', viewValue: 'Egreso'},
  ];
  cols:number = 1;
  
  fechaIn:string = "";
  fechaFin:string = "";
  tipoC: string = "";
  loading: boolean = false;

  dataXcel: [] = [];

  displayedColumns: string[] = ['uuid', 'fechafactura', 'tipocomprobante', 'folio', 'total'];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  totalEmitidos: number = 0;
  totalRecibidos: number = 0;

  totalIngreso: number = 0;
  totalEgresos: number = 0;

  totalGeneral: number =0;


  constructor(private serviceInicio: InicioService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.screenWidth = window.innerWidth;
    // this.screenHeight = window.innerHeight;
    this.detectaPantalla(window.innerWidth)
    //this.dataSource.paginator = this.paginator;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    // this.screenWidth = window.innerWidth;
    // this.screenHeight = window.innerHeight;

    this.detectaPantalla(window.innerWidth)
  }


  detectaPantalla(dta:any){
    //console.log(dta);
      if(parseInt(dta) <= 575){
        this.cols = 1;
      }else if(parseInt(dta) >= 575 && parseInt(dta) <= 767){
        this.cols = 2;
      }else if(parseInt(dta) >= 767 && parseInt(dta) <= 991){
        this.cols = 2;
      }else if(parseInt(dta) >= 991 && parseInt(dta) <= 3000){
        this.cols = 4;
      }
  }
  buscarFactura(){
    this.totalEmitidos = 0;
    this.totalRecibidos = 0;
    this.totalIngreso = 0;
    this.totalEgresos = 0;
    this.totalGeneral =0;
    
    this.loading = true;
    try{
      let fechaI = ""; 
      let fechaF = "";
      if(this.fechaIn != "" || this.fechaFin != ""){
        fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
        fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
      }
    
    this.serviceInicio.facturas(fechaI, fechaF, this.tipoC).then((resp:any)=>{
      this.loading = false;
      //console.log(resp)
      this.dataXcel = resp;
      this.dataSource = new MatTableDataSource<any>(resp);;
      this.dataSource.paginator = this.paginator;

      this.totalEmitidos = resp.filter((x:PeriodicElement)=> x.tipoComprobante == "egreso").length;
      this.totalRecibidos = resp.filter((x:PeriodicElement)=> x.tipoComprobante == "ingreso").length;

      resp.forEach((element:PeriodicElement) => {
          if(element.tipoComprobante == "egreso"){
            this.totalEgresos += element.total;
          }else if(element.tipoComprobante == "ingreso"){
            this.totalIngreso += element.total;
          }
          this.totalGeneral+= element.total;
      });
      //this.cdr.detectChanges();
      }).catch(()=>{
      this.loading = false;
      })
    }catch(e){
      this.loading = false;
    }
  }
  exportar(){
    let tot = [];
    tot.push({
      totalEmitido: this.totalEmitidos,
      totalRecibidos: this.totalRecibidos,
      totalIngreso: this.totalIngreso,
      totalEgreso: this.totalEgresos,
      totalGeneral: this.totalGeneral
    })
    this.exportAsExcelFile(this.dataXcel, tot, "reporte");
  }

  convertir(valor:any):string{
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(valor);
  }
   exportAsExcelFile(json: any[], total:any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const worktotal: XLSX.WorkSheet = XLSX.utils.json_to_sheet(total);
    const workbook: XLSX.WorkBook = {
       Sheets: {
          'data': worksheet, 'total': worktotal
       },
       SheetNames: ['data', 'total']
    };
    const excelBuffer: any = XLSX.write(workbook, {
       bookType: 'xlsx',
       type: 'array'
    });
    //console.log(json)
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
       type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
 }
}

export interface PeriodicElement {
  idcomprobante: number
  uuid: string
  fechaTimbrado: string
  versionCFDI: string
  versionComplemento: string
  folio: string
  serie: string
  fechaFactura: string
  tipoComprobante: string
  formaPago: string
  metodoPago: string
  condicionPago: string
  moneda: string
  subtotal: number
  total: number
  descuento: number
  lugarExpedicion: string
  tipoCambio: string
}

let ELEMENT_DATA: PeriodicElement[] = [];
