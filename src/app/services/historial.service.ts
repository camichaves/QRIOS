import { Injectable } from '@angular/core';
import { ScanData} from '../models/scanData.model';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {ModalController, Platform, ToastController} from '@ionic/angular';
import {MapaPage} from '../pages/mapa/mapa.page';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private historial: ScanData[] = [];

  constructor( private inAppBrowser: InAppBrowser, private modalController: ModalController,
               private contacts: Contacts, private platform: Platform, private toastController: ToastController,
               private router: Router) { }
  agregarHistorial(texto: string) {
    let data = new ScanData(texto);
    this.historial.unshift(data);
    this.abrirEscaneado(0);
    console.log(this.historial);
  }
  abrirEscaneado(index: number) {
    let scanData = this.historial[index];
    switch ( scanData.tipo) {
      case 'http':
        const browser = this.inAppBrowser.create(scanData.info);
        break;
      case 'mapa':
        // abro el modal del mapa
        this.abrirModalMapa( scanData.info);
        break;
      case 'contacto':
        this.crearContacto( scanData.info);
        break;
      case 'email':
        this.sendEmail(scanData.info);
        break;
      default:
        console.error('Tipo no soportado');

    }

  }
  private  sendEmail( texto: string) {
    let url1 = texto;
    url1 = url1.replace('MATMSG:TO:', 'mailto:');
    url1 = url1.replace(';SUB:', '?Subject=');
    url1 = url1.replace(';BODY:', '&Body=');
    url1 = url1.replace(' ', '%20');
    url1 = url1.replace(';;', '');
    this.inAppBrowser.create(url1, '_systems');
  }
  private crearContacto( texto: string) {
    let campos: any = this.parse_vcard(texto);
    console.log(campos);
    let name = campos.fn;
    let tel = campos.tel[0].value[0];
    if (!this.platform.is('cordova')) {
      console.log('Estoy en la computadora, por eso no agendo')
      return;
    }
    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, name);
    contact.phoneNumbers = [new ContactField('mobile', tel)];
    contact.save().then(
        () => {console.log('Contact saved!', contact);
          this.presentToast('Contacto ' + name + ' agregado');
        },
        (error: any) => {console.error('Error saving contact.', error);
          this.presentToast('Error:' + error);
        }
    );
  }
  async presentToast( mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4500
    });
    toast.present();
    console.log(mensaje);
  }
  private parse_vcard( input: string ) {

    let Re1 = /^(version|fn|title|org):(.+)$/i;
    let Re2 = /^([^:;]+);([^:]+):(.+)$/;
    let ReKey = /item\d{1,2}\./;
    let fields = {};

    // tslint:disable-next-line:only-arrow-functions
    input.split(/\r\n|\r|\n/).forEach(function(line) {
      let results, key;

      if (Re1.test(line)) {
        results = line.match(Re1);
        key = results[1].toLowerCase();
        fields[key] = results[2];
      } else if (Re2.test(line)) {
        results = line.match(Re2);
        key = results[1].replace(ReKey, '').toLowerCase();

        let meta = {};
        results[2].split(';')
            // tslint:disable-next-line:only-arrow-functions
            .map(function(p, i) {
              let match = p.match(/([a-z]+)=(.*)/i);
              if (match) {
                return [match[1], match[2]];
              } else {
                return ['TYPE' + (i === 0 ? '' : i), p];
              }
            })
            // tslint:disable-next-line:only-arrow-functions
            .forEach(function(p) {
              meta[p[0]] = p[1];
            });

        if (!fields[key]) { fields[key] = []; }

        fields[key].push({
          meta: meta,
          value: results[3].split(';')
        });
      }
    });

    return fields;
  };
  async abrirModalMapa( info: string) {
    const modal = await this.modalController.create({
      component: MapaPage,
      componentProps: {
        coords: info
      }
    });
    await modal.present();
  }

  cargarHistorial() {
    return this.historial;
  }
}
