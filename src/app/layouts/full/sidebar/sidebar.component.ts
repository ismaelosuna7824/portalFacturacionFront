import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { FullComponent } from '../full.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

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

  limpia(){
    FullComponent.totalEmitidos = 0;
    FullComponent.totalRecibidos = 0;
    FullComponent.totalIngreso = 0;
    FullComponent.totalEgresos = 0;
    FullComponent.totalGeneral = 0;
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
  }
}
