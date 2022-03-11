import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component,OnDestroy,AfterViewInit} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';


/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  static totalEmitidos:any = 0;
  static totalRecibidos: any = 0;

  static totalIngreso: number = 0;
  static totalEgresos: number = 0;

  static totalGeneral: number =0;

  static subtotal: number = 0;
  static descuento: number = 0;
  static ivatraslado: number = 0;
  static retencioniva: number = 0;
  static retencionisr: number = 0;
  static total: number = 0;
  static subtotalC: number = 0;
  static descuentoC: number = 0;
  static ivatrasladoC: number = 0;
  static retencionivaC: number = 0;
  static retencionisrC: number = 0;
  static totalC: number = 0;


  
  public classReference  = FullComponent;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}

  convertir(valor:any, cu:any):string{
    
    if(cu == 1){
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
      })
      return formatter.format(parseFloat(valor));
    }else{
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      })
      return formatter.format(parseFloat(valor));
    }
    
  }

  convertir2(valor:any){
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0
    })

    return formatter.format(valor)
  }
}
