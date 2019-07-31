import { Component, OnInit, Input, OnChanges, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { ICountriesData, IVietnamData, Data } from '../models/data.model';
import { HttpClient } from '@angular/common/http';
import { ChartsService } from '../services/charts.service';

@Component({
  selector: 'app-countries-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './countries-chart.component.html',
  styleUrls: ['./countries-chart.component.scss']
})
export class CountriesChartComponent implements OnInit, OnChanges {
  // @Input() countriesData: ICountriesData[];
  @ViewChild('barChart') private horizontalChartContainer: ElementRef;

    margin = { top: 20, right: 40, bottom: 50, left: 80 };
    // colors = ['#c6dbef', '#9ecae1', '#deebf7', '#9ecae1', '#6baed6', '#4292c6', '#2171b5',
    //           '#08519c', '#08306b', '#9ecae1', '#6baed6', '#4292c6', '#2171b5'];
    colors =  d3.schemeCategory10;
  
    countriesData: ICountriesData[];

    constructor(private chartService: ChartsService ) {
      this.countriesData = [
        {'Country': 'Vietnam', 'Prisoners': 349},
        {'Country': 'Myanmar', 'Prisoners': 123},
        {'Country': 'Laos', 'Prisoners': 215},
        {'Country': 'North Korea', 'Prisoners': 440},
        {'Country': 'Cambodia', 'Prisoners': 230},
        {'Country': 'China', 'Prisoners': 555}
      ];
    }

    ngOnInit() {
      console.log('Countries Data:?? ', this.countriesData);
  
      if (!this.countriesData) { return; }
      this.createCountriesChart();
      }
  
    ngOnChanges(): void {
      
    }
  
    private createCountriesChart() {
  
      const element = this.horizontalChartContainer.nativeElement;
      const data = this.countriesData;
  
      d3.select(element).select('svg').remove();
  
      const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);
  
      const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
      const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;
  
      const tooltip = d3.select(element).append('div').attr('class', 'toolTip');
  
      const yScale = d3
        .scaleBand()
        .rangeRound([contentHeight, 0])
        .padding(0.2)
        .domain(data.map(d => d.Country));
  
      const xScale = d3.scaleLinear()
        .rangeRound([0, contentWidth]) // .nice()
        .domain([0, d3.max(data, d => d.Prisoners)]);
  
      const chart = svg.append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  
      // xAxis
      const xAxis = svg.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(' + this.margin.left + ',' + (contentHeight + this.margin.top) + ')')
        .call(d3.axisBottom(xScale).ticks(10))
        
        .append('text')
        .attr('x', contentWidth - (this.margin.right * 1.5))
        .attr('y', this.margin.bottom / 1.5)
        .attr('text-anchor', 'middle')
        .text('Billet Candidate Count')
        .attr('fill', 'black');
  
      // yAxis
      const yAxis = svg.append('g')
        .attr('class', 'axis axis--y')
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -16)
        .attr('dy', '0.71em')
        // .attr('text-anchor', 'end')
        .attr('text-anchor', 'middle')
        .text('Countries')
        .attr('fill', 'black');
  
      chart.selectAll('.bar')
        .data(data)
        .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('y', d => yScale(d.Country))
          .attr('x', 0)
          .transition()
          .duration(800)
          .attr('height', yScale.bandwidth())
          .attr('width', d => xScale(d.Prisoners))
          .attr('fill', (d, i) => this.colors[i]);
        
        chart.selectAll('.bar')
          .data(data)
          .on('mousemove', function(d) {
            tooltip
              .style('left', d3.event.pageX - 50 + 'px')
              .style('top', d3.event.pageY - 70 + 'px')
              .style('display', 'inline-block')
              .html((d.Country) + ': ' + (d.Prisoners) + ' Prisoners of Conscience');
              })
          .on('mouseout', function(d) { tooltip.style('display', 'none'); } )
          .on('click', d => {
              console.log('clicked BilletId ', d);
          });
    
      // Display Text on each bar charts
        chart.selectAll('text.title')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'text')
          .attr('y', (d) => yScale(d.Country) + yScale.bandwidth() / 2 + 5)
          .attr('x', (d) => xScale(d.Prisoners) - d3.min(data, a => xScale(a.Prisoners)) / 3)
          .attr('text-anchor', 'middle')
          .text((d) => `${d.Prisoners}`);
      
          chart.selectAll('text.value')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'text2')
          .attr('y', (d) => yScale(d.Country) + yScale.bandwidth() / 2 + 5)
          .attr('x', 15)
          // .attr('text-anchor', 'middle')
          .text((d) => `${d.Country}`);
    }
  
    
    onResize(e) {
      this.createCountriesChart();
    }
  
  }
  
