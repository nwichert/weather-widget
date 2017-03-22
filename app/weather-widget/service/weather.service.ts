import { Injectable } from '@angular/core'; // always the first line in creating services
import { Jsonp, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { FORECAST_KEY, FORECAST_ROOT, GOOGLE_KEY, GOOGLE_ROOT } from '../constants/constants';

@Injectable() // always add for each service even if you don't use it
export class WeatherService {

  constructor(private jsonp: Jsonp, private http: Http) { }

  getCurrentLocation(): Observable<any> { // Tuples are an array that only stores 2 elements
    if (navigator.geolocation) {
      return Observable.create(observer => {
        navigator.geolocation.getCurrentPosition(pos => {
          observer.next(pos);
        }),
          err => {
            return Observable.throw(err);
          }
      });
    } else {
      return Observable.throw("Geolocation is not available on this browser, sorry!");
    }
  }

  getCurrentWeather(lat: number, long: number): Observable<any> {
    const url = FORECAST_ROOT + FORECAST_KEY + "/" + lat + "," + long; // constants are inmutable (let is a variable and can be changed)
    const queryParams = "?callback=JSONP_CALLBACK"; // parts of data you pass in at the end of the url, always start with "?"

    return this.jsonp.get(url + queryParams)
      .map(data => data.json())
      .catch(err => {
        console.error("Unable to get weather data - ", err);
        return Observable.throw(err.json());
      });
  }

  getLocationName(lat: number, long: number): Observable<any> {
    const url = GOOGLE_ROOT;
    const queryParams = "?latlng=" + lat + "," + long + "&key=" + GOOGLE_KEY;

    return this.http.get(url + queryParams)
      .map(loc => loc.json())
      .catch(err => {
        console.error("Unable to get location - ", err);
        return Observable.throw.apply(err);
      });
  }
}
