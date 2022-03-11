import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InicioService {
  loading: boolean;
  posts: any;
  private querySubscription: Subscription;
  constructor(private apollo: Apollo) { }
  facturas(fechaIn: string, fechaFin:string, tipoC:string, limitA: number, limitB:number, emitidos: number){
    const dt = new Date(fechaIn);
    let tempC = "";
    if(tipoC != "" ){
      if(dt.getUTCFullYear() == 2016 || dt.getUTCFullYear() == 2017){
        if(tipoC == "I"){
          tempC = "ingreso"
        }else{
          tempC = "egreso"
        }
    }else{
      tempC = "";
    }
    }
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
      query facturas($fechaIn: String, $fechaFi: String, $tipoComprobante: String, $limitA: Int, $limitB: Int, $emitidos: Int){
        reporteFacturas(fechaIn: $fechaIn, fechaFi: $fechaFi, tipoComprobante: $tipoComprobante, limitA: $limitA, limitB: $limitB, emitidos: $emitidos){
          uuid
          fechaTimbrado
          tipoComprobante
          folio
          total
          rfcEmisor
          Metadata
          fechaCancelacion
          status
          emitidos
          descuento
          nombreEmisor
          totalImpuestoTrasladado
        }
      }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "fechaIn": `${fechaIn}`,
        "fechaFi": `${fechaFin}`,
        "tipoComprobante": tempC == "" ? `${tipoC}` : `${tempC}`,
        "limitA": limitA,
        "limitB": limitB,
        "emitidos": emitidos
      }
    })
      .valueChanges
      .subscribe( ({ data, loading }) => {
        this.loading = loading;
        this.posts = data.reporteFacturas;
        //localStorage.setItem("token", this.posts.token)
        resolve(this.posts)
      }, error=> {
        //console.log(error);
       // console.log("entro a un error");
        resolve ([]);
      });
    });
  }
  facturasPorMeses(ano: number, status:number, emitidos:number, tipoComprobante: string){
    
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
      query reporteMes($year: Int, $status:Int, $emitidos:Int, $tipoComprobante:String){
          reporteMes(year: $year, status: $status, emitidos: $emitidos, tipoComprobante: $tipoComprobante){
            mes
            subtotal
            descuento
            ivatraslado
            retencioniva
            retencionisr
            total
          }
        }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "year": ano,
        "status": status,
        "emitidos": emitidos,
        "tipoComprobante": `${tipoComprobante}`
      }
    })
      .valueChanges
      .subscribe( ({ data, loading }) => {
        this.loading = loading;
        this.posts = data.reporteMes;
        //localStorage.setItem("token", this.posts.token)
        resolve(this.posts)
      }, error=> {
        //console.log(error);
       // console.log("entro a un error");
        resolve ([]);
      });
    });
  }


  facturasConteo(fechaIn: string, fechaFin:string, tipoC:string, emitidos: number){
    const dt = new Date(fechaIn);
    let tempC = "";
    if(tipoC != "" ){
      if(dt.getUTCFullYear() == 2016 || dt.getUTCFullYear() == 2017){
        if(tipoC == "I"){
          tempC = "ingreso"
        }else{
          tempC = "egreso"
        }
    }else{
      tempC = "";
    }
    }
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
      query conteoFacturas($fechaIn: String, $fechaFi: String, $tipoComprobante: String, $emitidos: Int){
          conteoFactura(fechaIn: $fechaIn, fechaFi: $fechaFi, tipoComprobante: $tipoComprobante, emitidos: $emitidos){
          total
          }
        }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "fechaIn": `${fechaIn}`,
        "fechaFi": `${fechaFin}`,
        "tipoComprobante": tempC == "" ? `${tipoC}` : `${tempC}`,
        "emitidos": emitidos
      }
    })
      .valueChanges
      .subscribe( ({ data, loading }) => {
        this.loading = loading;
        this.posts = data.conteoFactura;
        //localStorage.setItem("token", this.posts.token)
        resolve(this.posts)
      }, error=> {
        //console.log(error);
       // console.log("entro a un error");
        resolve ([]);
      });
    });
  }


  reporteTotal(fechaIn: string, fechaFin:string, tipoC:string, emitidos: number){
    const dt = new Date(fechaIn);
    let tempC = "";
    if(tipoC != "" ){
      if(dt.getUTCFullYear() == 2016 || dt.getUTCFullYear() == 2017){
        if(tipoC == "I"){
          tempC = "ingreso"
        }else{
          tempC = "egreso"
        }
    }else{
      tempC = "";
    }
    }
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
     query reporteTotal($fechaIn: String, $fechaFi: String, $tipoComprobante: String, $emitidos: Int, $egreso: String, $ingreso: String){
        reporteTotal(fechaIn: $fechaIn, fechaFi: $fechaFi, tipoComprobante: $tipoComprobante, emitidos: $emitidos, egreso: $egreso, ingreso: $ingreso){
          totalRegistros
          totalEgresos
          totalIngresos
          totalGeneral
          subtotal
          descuento
          ivatraslado
          retencioniva
          retencionisr
          total
          subtotalC
          descuentoC
          ivatrasladoC
          retencionivaC
          retencionisrC
          totalC
        }
      }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "fechaIn": `${fechaIn}`,
        "fechaFi": `${fechaFin}`,
        "tipoComprobante": tempC == "" ? `${tipoC}` : `${tempC}`,
        "emitidos": emitidos,
        "egreso": dt.getUTCFullYear() == 2016 || dt.getUTCFullYear() == 2017 ? 'egreso' : 'E',
        "ingreso":  dt.getUTCFullYear() == 2016 || dt.getUTCFullYear() == 2017 ? 'ingreso' : 'I',
      }
    })
      .valueChanges
      .subscribe( ({ data, loading }) => {
        this.loading = loading;
        this.posts = data.reporteTotal;
        //localStorage.setItem("token", this.posts.token)
        resolve(this.posts)
      }, error=> {
        //console.log(error);
       // console.log("entro a un error");
        resolve ([]);
      });
    });
  }

  generaXml(fechaIn: string, fechaFin:string, tipoC:string, emitidos: number, pagination:any, totales:any){
    const dt = new Date(fechaIn);
    let tempC = "";
    if(tipoC != "" ){
      if(dt.getUTCFullYear() == 2016 || dt.getUTCFullYear() == 2017){
        if(tipoC == "I"){
          tempC = "ingreso"
        }else{
          tempC = "egreso"
        }
    }else{
      tempC = "";
    }
    }
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
       query exportaurl($fechaIn: String, $fechaFi: String, $tipoComprobante: String, $emitidos: Int, $pagination: [String], $totales: [totalesT]){
      testQuery(fechaIn: $fechaIn, fechaFi: $fechaFi, tipoComprobante: $tipoComprobante, emitidos: $emitidos, pagination: $pagination, totales: $totales){
        url
      }
    }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "fechaIn": `${fechaIn}`,
        "fechaFi": `${fechaFin}`,
        "tipoComprobante": tempC == "" ? `${tipoC}` : `${tempC}`,
        "emitidos": emitidos,
        "pagination": pagination, 
        "totales": totales
      }
    })
      .valueChanges
      .subscribe( ({ data, loading }) => {
        this.loading = loading;
        this.posts = data.testQuery;
        //localStorage.setItem("token", this.posts.token)
        resolve(this.posts)
      }, error=> {
        //console.log(error);
       // console.log("entro a un error");
        resolve ([]);
      });
    });
  }


}
