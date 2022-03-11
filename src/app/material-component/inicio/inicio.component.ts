import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { InicioService } from './inicio.service';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FullComponent } from 'src/app/layouts/full/full.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit, AfterViewInit  {
  foods: any[] = [
    {value: '', viewValue: 'Todos'},
    {value: 'I', viewValue: 'Ingreso'},
    {value: 'E', viewValue: 'Egreso'},
  ];
  cols:number = 1;
  
  fechaIn:string = "";
  fechaFin:string = "";
  tipoC: string = "";
  loading: boolean = false;

  dataXcel:any [] = [];

  displayedColumns: string[] = ['UUID', 'FECHA FACTURA', 'FORMAPAGO', 'METODOPAGO', 'RFCRECEPTOR','NOMBRERECEPTOR', 'RFCEMISOR', 'NOMBREEMISOR', 'VERSION', 'TIPORELACION', 'TIPO COMPROBANTE', 'FOLIO', 'SUBTOTAL', 'DESCUENTO', 'TOTALIMPUESTOTRASLADO','IVA', 'ISR',  'TOTAL',  'STATUS' , 'FECHACANCELACION' ];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  totalEmitidos: number = 0;
  totalRecibidos: number = 0;

  totalIngreso: number = 0;
  totalEgresos: number = 0;

  totalGeneral: number =0;

  desabilitaBoton: boolean = false;
  data:any[] = [];

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
    
    FullComponent.totalEmitidos = 0;
    FullComponent.totalRecibidos = 0;
    FullComponent.totalIngreso = 0;
    FullComponent.totalEgresos = 0;
    FullComponent.totalGeneral = 0;

    this.loading = true;
    
    this.dataXcel = [];

    FullComponent.subtotal = 0;
    FullComponent.descuento = 0;
    FullComponent.ivatraslado = 0;
    FullComponent.retencioniva = 0;
    FullComponent.retencionisr = 0;
    FullComponent.total = 0;
    FullComponent.subtotalC = 0;
    FullComponent.descuentoC = 0;
    FullComponent.ivatrasladoC = 0;
    FullComponent.retencionivaC = 0;
    FullComponent.retencionisrC = 0;
    FullComponent.totalC = 0;

      let fechaI = ""; 
      let fechaF = "";
      if(this.fechaIn == "" && this.fechaFin == "" && this.tipoC != ""){
        //alert("no hace nada")
      }else{
        
        fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
        fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
        this.serviceInicio.facturas(fechaI, fechaF, this.tipoC, 1, 1, 1).then((resp:any)=>{
      
          this.loading = false;
          console.log(resp.length)
          //this.dataXcel = resp;
          const tempE = resp.filter((x:any) => x.emitidos == 1);
          const tempR = resp.filter((x:any) => x.emitidos == 0);
          //this.dataSource = new MatTableDataSource<any>(resp);;
          //this.dataSource.paginator = this.paginator;

          this.data = resp;
    
          this.totalEmitidos = resp.length;
          FullComponent.totalEmitidos = tempE.length;
          FullComponent.totalRecibidos = tempR.length;
          //this.totalRecibidos = resp.filter((x:PeriodicElement)=> x.tipoComprobante == "I").length;
          //console.log();
          resp.forEach((element:any) => {
            //console.log(element.tipoComprobante)
              this.dataXcel.push({
                "UUID": element.uuid,
                "FECHA FACTURA": `${element.fechaTimbrado.split("T")[0]}-${element.fechaTimbrado.split("T")[1].substring(0,8)}`,
                "FORMA DE PAGO": `${element.Metadata.split('|')[0] == undefined ? '' : element.Metadata.split('|')[0]}`,
                "METODO DE PAGO": `${element.Metadata.split('|')[1] == undefined ? '' : element.Metadata.split('|')[1]}`,
                "RFC RECEPTOR": `${element.Metadata.split('|')[3] == undefined ? '' : element.Metadata.split('|')[3]}`,
                "NOMBRE RECEPTOR": `${element.Metadata.split('|')[4] == undefined ? '' : element.Metadata.split('|')[4]}`,
                "RFC EMISOR": `${element.rfcEmisor}`,
                "NOMBRE EMISOR": `${element.nombreEmisor}`,
                "VERSION": `${element.Metadata.split('|')[5] == undefined ? '' : element.Metadata.split('|')[5]}`,
                "TIPO DE RELACION": `${element.Metadata.split('|')[6] == undefined ? '' : element.Metadata.split('|')[6]}`,
                "TIPO COMPROBANTE": `${element.tipoComprobante == "I" || element.tipoComprobante == "ingreso" ? "Ingreso" : "Egreso"}`,
                "FOLIO": `${element.folio}`,
                "SUBTOTAL":element.Metadata.split('|')[2] == undefined || element.Metadata.split('|')[2] == "" ? 0 : parseFloat(element.Metadata.split('|')[2]),
                "DESCUENTO": element.descuento == undefined || element.descuento == ""  ? 0 : parseFloat(element.descuento),
                "IVA TRASLADO":element.totalImpuestoTrasladado == undefined || element.totalImpuestoTrasladado == "" ? 0 : parseFloat(element.totalImpuestoTrasladado),
                "RETENCION IVA": element.Metadata.split('|')[8] == undefined || element.Metadata.split('|')[8] == "" ? 0 : parseFloat(element.Metadata.split('|')[8]),
                "RETENCION ISR": element.Metadata.split('|')[9] == undefined || element.Metadata.split('|')[9] == "" ? 0 : parseFloat(element.Metadata.split('|')[9]),
                "TOTAL": element.total == undefined || element.total == "" ? 0 : parseFloat(element.total),  
                "STATUS":  `${element.status == 1 ? 'Activa' : 'Cancelada'}`,
                "FECHA DE CANCELACION":  `${element.fechaCancelacion == null ? '0000-00-00' : element.fechaCancelacion}`,
              });
          });

          console.log(this.dataXcel);


          resp.forEach((element:any) => {
            if(element.tipoComprobante == "E" || element.tipoComprobante == "egreso"){
              this.totalEgresos += element.total;
              FullComponent.totalEgresos += element.total;
            }else if(element.tipoComprobante == "I" || element.tipoComprobante == "ingreso"){
              this.totalIngreso += element.total;
              FullComponent.totalIngreso += element.total;
              
            }
            this.totalGeneral += element.total;
            FullComponent.totalGeneral += element.total;

            if(element.status == 1){
              FullComponent.subtotal +=  element.Metadata.split('|')[2] == undefined || element.Metadata.split('|')[2] == "" ? 0 : parseFloat(element.Metadata.split('|')[2]);
              FullComponent.descuento += element.descuento == undefined || element.descuento == ""  ? 0 : parseFloat(element.descuento);
              FullComponent.ivatraslado += element.totalImpuestoTrasladado == undefined || element.totalImpuestoTrasladado == "" ? 0 : parseFloat(element.totalImpuestoTrasladado);
              FullComponent.retencioniva += element.Metadata.split('|')[8] == undefined || element.Metadata.split('|')[8] == "" ? 0 : parseFloat(element.Metadata.split('|')[8]);
              FullComponent.retencionisr += element.Metadata.split('|')[9] == undefined || element.Metadata.split('|')[9] == "" ? 0 : parseFloat(element.Metadata.split('|')[9]);
              FullComponent.total += element.total == undefined || element.total == "" ? 0 : parseFloat(element.total);

            }else{
              FullComponent.subtotalC +=  element.Metadata.split('|')[2] == undefined || element.Metadata.split('|')[2] == "" ? 0 : parseFloat(element.Metadata.split('|')[2]);
              FullComponent.descuentoC += element.descuento == undefined || element.descuento == ""  ? 0 : parseFloat(element.descuento);
              FullComponent.ivatrasladoC += element.totalImpuestoTrasladado == undefined || element.totalImpuestoTrasladado == "" ? 0 : parseFloat(element.totalImpuestoTrasladado);
              FullComponent.retencionivaC += element.Metadata.split('|')[8] == undefined || element.Metadata.split('|')[8] == "" ? 0 : parseFloat(element.Metadata.split('|')[8]);
              FullComponent.retencionisrC += element.Metadata.split('|')[9] == undefined || element.Metadata.split('|')[9] == "" ? 0 : parseFloat(element.Metadata.split('|')[9]);
              FullComponent.totalC += element.total == undefined || element.total == "" ? 0 : parseFloat(element.total);
            }
            
          });
          //this.cdr.detectChanges();
          }).catch(()=>{
          this.loading = false;
          })
      }
    
    
    
  }
  exportar(){
    this.desabilitaBoton = true;
    let tot = [];
    tot.push({
      totalEmitido: FullComponent.totalEmitidos,
      totalRecibidos: FullComponent.totalRecibidos,
      totalIngreso: FullComponent.totalIngreso,
      totalEgreso: FullComponent.totalEgresos,
      totalGeneral: FullComponent.totalGeneral
    })
    this.exportAsExcelFile(this.dataXcel, tot, "reporte");
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

//  retencionReplace(valor: string, tipo:number):string{
//    console.log(valor.replace("Impuesto: IVA Importe:", "").trim())
//      return tipo == 8 ? valor.replace("Impuesto: IVA Importe:", "").trim() : valor.replace("Impuesto: ISR Importe:", "").trim();
//  }

  cambio(evnet:any){
    alert('hola')
    console.log(evnet.pageIndex)
  }
}

export interface PeriodicElement {
  uuid?: string
  fechaTimbrado?: string
  tipoComprobante?: string
  folio?: string
  serie?: string
  total?: number
  descuento?: number
  totalImpuestoTrasladado?: string
  totalImpuestoRetenido?: string
  rfcEmisor?: string
  nombreEmisor?: string
  Metadata?: string
}

let ELEMENT_DATA: PeriodicElement[] = [];