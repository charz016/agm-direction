import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {



  constructor() { }

  public getPosition(): Observable<Position> {
    return Observable.create(observer => {
      if("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  observer.next(position);
                  observer.complete();
              },
              (error) => observer.error(error)
          );
      } else {
          observer.error('Unsupported Browser');
      }
  });
  }
}