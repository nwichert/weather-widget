import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../service/weather.service';

import { Weather } from '../model/weather';

@Component({
  moduleId: module.id,
  selector: 'weather-widget',
  templateUrl: 'weather.component.html',
  styleUrls: ['weather.component.css'],
  providers: [WeatherService]
})
export class WeatherComponent implements OnInit {
  pos: Position;
  weatherData = new Weather(null, null, null, null, null);
  currentSpeedUnit = "kph";
  currenTempUnit = "fahrenheit";
  currentLocation = "";

  constructor(private service: WeatherService) { } // this is dependency injection
  // constructor initializes class; creates a copy of it
  // keep logic minimal in any constructor

  ngOnInit() {
    this.getCurrentLocation();
  }

  getCurrentLocation() {
    this.service.getCurrentLocation()
      .subscribe(position => {
        this.pos = position;
        this.getCurrentWeather();
        this.getLocationName();
      },
      err => console.error(err));
  }

  getCurrentWeather() {
    this.service.getCurrentWeather(this.pos.coords.latitude, this.pos.coords.longitude)
      .subscribe(weather => {
        this.weatherData.temp = weather["currently"]["temperature"],
        this.weatherData.summary = weather["currently"]["summary"],
        this.weatherData.wind = weather["currently"]["windSpeed"],
        this.weatherData.humidity = weather["currently"]["humidity"],
        this.weatherData.icon = weather["currently"]["icon"]
        console.log("Weather: ", this.weatherData); // TODO REMOVE
      },
      err => console.error(err));
  }

  getLocationName() {
    this.service.getLocationName(this.pos.coords.latitude, this.pos.coords.longitude)
      .subscribe(location => {
        console.log(location); // TODO REMOVE
        this.currentLocation = location["results"][1]['formatted_address'];
        console.log("Name: ", this.currentLocation); // TODO: REMOVE
      });
  }
}