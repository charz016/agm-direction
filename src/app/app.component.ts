import { Component } from '@angular/core';
import { from, pipe, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  origin = { lat: 18.847242, lng: -97.106183 }
  destination = { lat: 18.846841, lng: -97.101203 }
  localization = [
    { lat: 18.846541, long: -97.105738, time: "5 min" },
    { lat: 18.845566, long: -97.105405, time: "4 min" },
    { lat: 18.846039, long: -97.103371, time: "3 min" },
    { lat: 18.846425, long: -97.102287, time: "2 min" },
    { lat: 18.846604, long: -97.101871, time: "1 min" },
    { lat: 18.846841, long: -97.101203, time: "Paquete entregado" }
  ]

  public renderOptions = {
    suppressMarkers: true,
  }

  public markerOptions = {
    origin: {
      icon: 'https://a.fsdn.com/allura/p/vsms-codeigniter/icon?1497042495',
    },
    destination: {
      icon: 'https://cdn4.iconfinder.com/data/icons/cc_mono_icon_set/blacks/48x48/round.png',
      infoWindow: ``
    },
  }

  go() {
    interval(3000)
      .pipe(
        take(this.localization.length),
        map(i => this.localization[i]))
      .subscribe((data) => {
        this.origin = { lat: data.lat, lng: data.long };
        this.markerOptions = {
          origin: {
            icon: 'https://a.fsdn.com/allura/p/vsms-codeigniter/icon?1497042495',
          },
          destination: {
            icon: 'https://cdn4.iconfinder.com/data/icons/cc_mono_icon_set/blacks/48x48/round.png',
            infoWindow: `
              <h4>Status<h4>
              <p>${data.time}</p>
              `
          }
        }
      });
  }
}
