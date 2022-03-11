import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';

import * as _moment from 'moment';
import { InicioService } from '../inicio/inicio.service';
// tslint:disable-next-line:no-duplicate-imports
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  emitidosA: any[] = [
    {value: '1', viewValue: 'Emitidos'},
    {value: '0', viewValue: 'Recibidos'},
  ];

  statusMesA: any[] = [
    {value: '1', viewValue: 'Activo'},
    {value: '0', viewValue: 'Cancelado'},
  ];

  tipoCoA: any[] = [
    {value: 'I', viewValue: 'Ingreso'},
    {value: 'E', viewValue: 'Egreso'},
  ];



  cols:number = 1;
  
  fechaIn:string = "";

  emitidos: string = "1";
  status: string = "1";
  tipoC: string = "I";


  loading: boolean = false;

  dataXcel:any [] = [];

  displayedColumns: string[] = ['MES', 'SUBTOTAL', 'DESCUENTO', 'IVATRASLADO', 'RETENCIONIVA','RETENCIONISR', 'TOTAL' ];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  


  desabilitaBoton: boolean = false;

  constructor(private inicioService: InicioService) { }
  

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
    this.loading = true;
    if(this.fechaIn != ""){
      this.dataXcel = [];
      let an = new Date(this.fechaIn); 
      this.inicioService.facturasPorMeses(an.getFullYear(), parseInt(this.status), parseInt(this.emitidos), this.tipoC).then((resp:any)=>{
        this.dataSource = new MatTableDataSource<any>(resp);
        this.loading = false
        resp.forEach((element:any) => {
            this.dataXcel.push({
              mes: element.mes,
              subtotal: element.subtotal,
              descuento: element.descuento,
              ivatraslado: element.ivatraslado,
              retencioniva: element.retencioniva,
              retencionisr: element.retencionisr,
              total: element.total	
            })
        });
       
      })
    
    }
  }
  exportar(){
  
    this.desabilitaBoton = true;
  
   this.exportAsExcelFile(this.dataXcel, "reporte");
    setTimeout(() => {
      this.desabilitaBoton = false;
    }, 5000);
  }

  convertir(valor:any, cu:any):string{
    //console.log(valor)
    const v = valor == "" ? 0 : valor;
    if(cu == 1){
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
      })
      return formatter.format(parseFloat(v));
    }else{
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })
      return formatter.format(parseFloat(v));
    }
    
  }
   exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
       Sheets: {
          'data': worksheet,
       },
       SheetNames: ['data']
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
  mes?: string
  subtotal?: number
  descuento?: number
  ivatraslado?: number
  retencioniva?: number
  retencionisr?: number
  total?: number
}

let ELEMENT_DATA: PeriodicElement[] = [];