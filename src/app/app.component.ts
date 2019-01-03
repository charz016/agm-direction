import { Component, ElementRef, NgZone, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'google-maps';
import { MapsAPILoader } from '@agm/core';
import { GeoLocationService } from './services/geo-location.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  origin: {};
  destination: {};
  searchControl: FormControl;
  subscription: Subscription;
  status: string = 'Seleccione el destino y click para comenzar';
  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private geoLocationService: GeoLocationService
  ) { }

  public renderOptions = {
    suppressMarkers: true,

  }

  public markerOptions = {
    origin: {
      icon: 'https://a.fsdn.com/allura/p/vsms-codeigniter/icon?1497042495',
      infoWindow: ``

    },
    destination: {
      icon: 'https://cdn4.iconfinder.com/data/icons/cc_mono_icon_set/blacks/48x48/round.png',
    },
  }

  ngOnInit() {
    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        componentRestrictions: { country: 'mx' }
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude 
          this.destination = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }

        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.origin = { lat: position.coords.latitude, lng: position.coords.longitude }
      });
    }
  }

  startTravel() {
    this.subscription = timer(0, 10000).pipe(
      switchMap(() => this.geoLocationService.getPosition())
    ).subscribe(pos => {
      this.origin = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      let service = new google.maps.DistanceMatrixService;
      this.status ='en camino'
      service.getDistanceMatrix({
        origins: [this.origin],
        destinations: [this.destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response, status) => {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          this.status = `Error was: ${status}`
        } else {
          this.status = `El paquete se encuentra a ${response.rows[0].elements[0].distance.text} 
          llegara aproximadamente en ${response.rows[0].elements[0].duration.text}`
        }
      })

      this.markerOptions = {
        origin: {
          icon: 'https://a.fsdn.com/allura/p/vsms-codeigniter/icon?1497042495',
          infoWindow: `${this.status}`

        },
        destination: {
          icon: 'https://cdn4.iconfinder.com/data/icons/cc_mono_icon_set/blacks/48x48/round.png',
        },
      }

      if (JSON.stringify(this.origin) === JSON.stringify(this.destination)) {
        this.subscription.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
