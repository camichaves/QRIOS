import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NgxQRCodeModule} from 'ngx-qrcode2';
import { ToastController } from '@ionic/angular';
import { BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';

import { HistorialService} from './services/historial.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import {MapaPage} from './pages/mapa/mapa.page';
import {MapaPageModule} from './pages/mapa/mapa.module';
import { Contacts } from '@ionic-native/contacts/ngx';
import { AdMobFree} from '@ionic-native/admob-free/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [ MapaPage],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxQRCodeModule,
    MapaPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ToastController,
    BarcodeScanner,
    HistorialService,
    InAppBrowser,
    Contacts,
      AdMobFree,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
