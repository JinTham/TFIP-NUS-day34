import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Weather } from './models';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs/internal/Subscription';

const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const WEATHER_API_KEY = '18d19c57e8616b76696499ab4515334e'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'day34';

  form!:FormGroup
  weather$!:Subscription
  result:Weather[] = []

  constructor (private fb:FormBuilder, private http:HttpClient) {}

  ngOnInit(): void {
      this.form = this.fb.group({
        city: this.fb.control('',[Validators.required])
      })
  }

  ngOnDestroy(): void {
      this.weather$.unsubscribe()
  }

  getWeather() {
    const city = this.form.value['city']
    console.info(city)

    // create query param
    const params = new HttpParams()
        .set('q',city)
        .set('appid',WEATHER_API_KEY)

    // .get returns an Observable
    this.weather$ = this.http.get<Weather[]>(WEATHER_URL,{ params })
        .pipe(
          map((v:any) => {
            // .main.temp
            const temp = v['main']['temp']
            // .weather
            const weather = v['weather'] as any[]
            return weather.map(w => {
              return {
                main: w['main'],
                description: w['description'],
                icon: w['icon'],
                temperature: temp
              } as Weather
            })
          })
        )
        .subscribe({
          next: v => {
            console.info('---------NEXT') 
            console.info(v)
            this.result = v},
          error: err => {console.error('--------ERROR: ',err)},
          complete: () => {console.info('----------COMPLETE: ')}
        })
  
  }
  
}
