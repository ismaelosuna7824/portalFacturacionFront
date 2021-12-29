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
  facturas(fechaIn: string, fechaFin:string, tipoC:string){
    return new Promise((resolve, reject)=>{
      const GET_POST = gql`
      query facturas($fechaIn: String, $fechaFi: String, $tipoComprobante: String){
        reporteFacturas(fechaIn: $fechaIn, fechaFi: $fechaFi, tipoComprobante: $tipoComprobante){
          idcomprobante
          uuid
          fechaTimbrado
          versionCFDI
          versionComplemento
          folio
          serie
          fechaFactura
          tipoComprobante
          formaPago
          metodoPago
          condicionPago
          moneda
          subtotal
          total
          descuento
          lugarExpedicion
          tipoCambio
        }
      }
    `;
    this.querySubscription = this.apollo.watchQuery<any>({
      query: GET_POST,
      fetchPolicy: 'network-only',
      variables: {
        "fechaIn": `${fechaIn}`,
        "fechaFi": `${fechaFin}`,
        "tipoComprobante": `${tipoC}`
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
}
