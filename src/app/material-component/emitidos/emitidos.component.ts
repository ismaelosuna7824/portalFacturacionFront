import { AfterViewInit, Component, HostListener, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FullComponent } from 'src/app/layouts/full/full.component';
import { InicioService } from '../inicio/inicio.service';
import { pagix } from 'pagix';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-emitidos',
  templateUrl: './emitidos.component.html',
  styleUrls: ['./emitidos.component.css']
})
export class EmitidosComponent implements OnInit {
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


  numerOptions: any[] = [];
  pagination: string = "1-49999";

  arrayPagination: any[] = [];

  totalFacturas:number = 0;

  constructor(private serviceInicio: InicioService, private cdr: ChangeDetectorRef) { 

    //this.pagination = "1-49999"
  }

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
    
    // FullComponent.totalEmitidos = 0;
    // FullComponent.totalRecibidos = 0;
    // FullComponent.totalIngreso = 0;
    // FullComponent.totalEgresos = 0;
    // FullComponent.totalGeneral = 0;

    this.loading = true;
    this.dataXcel = [];
    this.totalFacturas = 0;

    // FullComponent.subtotal = 0;
    // FullComponent.descuento = 0;
    // FullComponent.ivatraslado = 0;
    // FullComponent.retencioniva = 0;
    // FullComponent.retencionisr = 0;
    // FullComponent.total = 0;
    // FullComponent.subtotalC = 0;
    // FullComponent.descuentoC = 0;
    // FullComponent.ivatrasladoC = 0;
    // FullComponent.retencionivaC = 0;
    // FullComponent.retencionisrC = 0;
    // FullComponent.totalC = 0;

    
      let fechaI = ""; 
      let fechaF = "";
      if(this.fechaIn == "" && this.fechaFin == "" && this.tipoC != ""){
        //alert("no hace nada")
      }else{

        this.conteoFactura().then((x:any)=>{
          if(parseInt(x.total) <= 50000){
            this.pagination = `1-${x.total}`;
          }else{
            this.pagination = `1-49999`;
          }
          this.totalFacturas = parseInt(x.total);

          let limitB: number = parseInt(this.pagination.split('-')[0]) == 1 ? 0 : parseInt(this.pagination.split('-')[0])
          let limitA: number = parseInt(x.total) <= 50000 ?  parseInt(x.total) : 50000;



          fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
          fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
          this.serviceInicio.facturas(fechaI, fechaF, this.tipoC, limitA, limitB, 1).then((resp:any)=>{
            
          
            //console.log(resp.length)
            //this.dataXcel = resp;
          //const temp = resp.filter((x:any) => x.emitidos === 1);
          //console.log(temp.length);
          this.dataSource = new MatTableDataSource<any>(resp);
          this.dataSource.paginator = this.paginator;
    
         

          this.serviceInicio.reporteTotal(fechaI, fechaF, this.tipoC, 1).then((tot:any)=>{
            this.loading = false;
            FullComponent.totalEmitidos = tot[0].totalRegistros;
            FullComponent.totalRecibidos = 0;
            FullComponent.totalEgresos = tot[0].totalEgresos;
            FullComponent.totalIngreso =   tot[0].totalIngresos;
            FullComponent.totalGeneral = tot[0].totalGeneral;
            FullComponent.subtotal = tot[0].subtotal;
            FullComponent.descuento = tot[0].descuento;
            FullComponent.ivatraslado = tot[0].ivatraslado;
            FullComponent.retencioniva = tot[0].retencioniva;
            FullComponent.retencionisr = tot[0].retencionisr;
            FullComponent.total = tot[0].total;
            FullComponent.subtotalC = tot[0].subtotalC;
            FullComponent.descuentoC = tot[0].descuentoC;
            FullComponent.ivatrasladoC = tot[0].ivatrasladoC;
            FullComponent.retencionivaC = tot[0].retencionivaC;
            FullComponent.retencionisrC = tot[0].retencionisrC;
            FullComponent.totalC = tot[0].totalC;

          })

          resp.forEach((element:any) => {
            
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

          
          //this.totalRecibidos = resp.filter((x:PeriodicElement)=> x.tipoComprobante == "I").length;
          //console.log();
          

         
          //this.cdr.detectChanges();
          }).catch(()=>{
          this.loading = false;
          })
        
        
        })
        
        
      }
    
    
    
  }

  exportar(){
    // let tot = [];
    // // this.desabilitaBoton = true;
    // let fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
    // let fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
    // tot.push({
    //   totalEmitido: FullComponent.totalEmitidos.toString(),
    //   totalRecibidos: FullComponent.totalRecibidos.toString(),
    //   totalIngreso: FullComponent.totalIngreso.toString(),
    //   totalEgreso: FullComponent.totalEgresos.toString(),
    //   totalGeneral: FullComponent.totalGeneral.toString()
    // })

    // if(this.fechaIn == "" && this.fechaFin == "" && this.tipoC != ""){
    //   //alert("no hace nada")
    // }else{
      
    //   this.serviceInicio.generaXml(fechaI, fechaF, this.tipoC, 1, this.arrayPagination, tot).then(resp=>{
    //     console.log(resp);
    //   })
    // }

    let tot = [];
    this.desabilitaBoton = true;
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
    
    // this.exportAsExcelFile(this.dataXcel, tot, "reporte");
    // setTimeout(() => {
    //   this.desabilitaBoton = false;
    // }, 5000);
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
    let fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
    let fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
    const data: Blob = new Blob([buffer], {
       type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, `${fileName}_${fechaI}_${fechaF}_${this.pagination}_${this.tipoC == 'I' ? 'ingreo' : this.tipoC == 'E' ? 'egreso' : 'ingreso_egreso'}.xlsx`);
    //fileName + '_' +  fechaI  +'_' + this.pagination + EXCEL_EXTENSION
 }


 cambio(data:any){
    // let data = 152678;
     let tempDta = data;
    const paginate = pagix({ records: data, limit: 50000 });
    //console.log(paginate);
    this.numerOptions= [];
    //this.pagination = `1-49999`
    for (let i = 1; i <= paginate.total; i++) {
      if (i == 1) {
        this.arrayPagination.push(`1-${data < 50000 ? data : (i - 1) * 50000 + (50000 - 1)}`)
        this.numerOptions.push({
          value: `1-${data < 50000 ? data : (i - 1) * 50000 + (50000 - 1)}`,
          viewValue:  `1-${data < 50000 ? data : (i - 1) * 50000 + (50000 - 1) }`,
        });
      } else {
        tempDta = tempDta - 50000;
        this.arrayPagination.push(`${(i - 1) * 50000}-${
          (i - 1) * 50000 + (50000 - 1) > data
            ? data
            : (i - 1) * 50000 + (50000 - 1)
        }`)

        this.numerOptions.push({
          value: `${(i - 1) * 50000}-${
            (i - 1) * 50000 + (50000 - 1) > data
              ? data
              : (i - 1) * 50000 + (50000 - 1)
          }`,
          viewValue: `${(i - 1) * 50000}-${
            (i - 1) * 50000 + (50000 - 1) > data
              ? data
              : (i - 1) * 50000 + (50000 - 1)
          }`,
        });
      }
    }
  }
conteoFactura(){ 
      return new Promise<void>((resolve, reject) => {
        let fechaI = ""; 
        let fechaF = "";
        if(this.fechaIn == "" && this.fechaFin == "" && this.tipoC != ""){
          //alert("no hace nada")
        }else{
          fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
          fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
          this.serviceInicio.facturasConteo(fechaI, fechaF, this.tipoC, 1).then((resp:any)=>{
            this.cambio(parseInt(resp.total))
            //console.log(resp);
              resolve(resp);

           })
          }
      })
    }
    ///este busca por paginacion en la db
  buscaPorPagina(){
      this.dataXcel = [];
      this.loading = true;

      let limitB: number = parseInt(this.pagination.split('-')[0]) == 1 ? 0 : parseInt(this.pagination.split('-')[0])
      let limitA: number = this.totalFacturas <= 50000 ?  this.totalFacturas : 50000;



      let fechaI = new Date(this.fechaIn).toISOString().slice(0,10);
      let fechaF = new Date(this.fechaFin).toISOString().slice(0,10);
      this.serviceInicio.facturas(fechaI, fechaF, this.tipoC, limitA, limitB, 1).then((resp:any)=>{
        
      this.dataSource = new MatTableDataSource<any>(resp);
      this.dataSource.paginator = this.paginator;

       this.loading = false;

    
     
      resp.forEach((element:any) => {
        
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
      }).catch(()=>{
      this.loading = false;
      })
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







// resp.forEach((element:any) => {

// });
