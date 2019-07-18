import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Data } from './models/data.model';
import { HttpClient } from '@angular/common/http';
import { ChartsService } from './services/charts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  data: Data[] = [];

  constructor(private chartService: ChartsService ) {
    this.getBarchartData();
  }

  getBarchartData() {
    this.chartService.getBarchatData()
        .subscribe(res => {
        this.data = res;
        console.log(this.data);
      });
    }

}
