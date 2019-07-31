import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Data, ICountriesData } from './models/data.model';
import { HttpClient } from '@angular/common/http';
import { ChartsService } from './services/charts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: Data[] = [];
  countriesData: ICountriesData[] = [];

  countryChart: boolean;
  vietnamChart: boolean;
  chinaChart: boolean;
  charts = [{'country': 'All Countries'}, {'country': 'China'}, {'country': 'Vietnam'}];

  constructor(private chartService: ChartsService ) {
    // this.getBarchartData();
    this.getCountriesChartData();
  }

  ngOnInit() {
    this.countryChart = true;
  }


  getBarchartData() {
    this.chartService.getBarchatData()
        .subscribe(res => {
        this.data = res;
        console.log(this.data);
      });
    }

  getCountriesChartData() {
      this.chartService.getCountriesData()
          .subscribe(res => {
          this.countriesData = res;
          // console.log('Countries Data: ', this.countriesData);
        });
  }

  navigateTo(value) {
    console.log(value);
    if (value === 'All Countries') {
        this.countryChart = true;
        this.vietnamChart = false;
        this.chinaChart = false;
        }
    if (value === 'China') {
        this.countryChart = false;
        this.chinaChart = true;
        this.vietnamChart = false;
        }
    if (value === 'Vietnam') {
        this.countryChart = false;
        this.chinaChart = false;
        this.vietnamChart = true;
        }
    // this.router.navigate(['../', value]);
}

}
