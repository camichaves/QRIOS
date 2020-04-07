import {AfterContentInit, Component, OnInit} from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import { BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import { HistorialService} from '../services/historial.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private barcodeScanner: BarcodeScanner , private toastController: ToastController,
              private platform: Platform, private historialService: HistorialService,
              private admobFree: AdMobFree) {}


  scannedcode = '' ;
  elementType = '';
  ngOnInit(): void {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-5184253830411416/7979409982',
      isTesting: false,
      autoShow: true,
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
        .then(() => {
          // banner Ad is ready
          this.admobFree.banner.show();

        })
        .catch(e => console.log(e));
  }

  anuncio(){
      this.finPrepare();
      const interstitialConfig: AdMobFreeInterstitialConfig = {
          // id: 'ca-app-pub-5184253830411416/4688963862',
          isTesting: true,
          autoShow: true,
      };
      this.admobFree.interstitial.config(interstitialConfig);

      this.admobFree.interstitial.prepare()
          .then(() => {
              // banner Ad is ready
              this.admobFree.interstitial.show();


          })
          .catch(e => console.log(e));
  }
  escanear() {
    if (! this.platform.is('cordova')) {
      // this.scannedcode = 'MATMSG:TO:camichavesthg@gmail.com;SUB:Holis;BODY:Tkm bebe;;';
      // this.elementType = 'mapa';
      //   this.scannedcode = 'geo:-31.539989700000003,-68.53237502563692'
      this.scannedcode = 'ERROR';
      this.elementType = 'No usable en web';
      this.historialService.agregarHistorial(this.scannedcode);
      this.presentToast();
      return;
    }
    this.barcodeScanner.scan().then(
        barcoData => {
          this.scannedcode = barcoData.text;
          this.elementType = barcoData.format;
          if (!barcoData.cancelled && barcoData.text != null) {
            this.historialService.agregarHistorial(barcoData.text);
          }
          this.presentToast();
        }
    );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Scan: ' + this.scannedcode.toString() + '.- Formato: ' + this.elementType,
      duration: 2500
    });
    toast.present();
    console.log(' Escaneado: ' + this.scannedcode + '.- Formato: ' + this.elementType);
  }
  async finPrepare() {
    const toast = await this.toastController.create({
      message: 'Abriendo anuncio',
      duration: 2500
    });
    toast.present();
  }
}
