import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, ViewEncapsulation } from '@angular/core';
import { Data } from '../models/data.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'
]
})
export class BarChartComponent implements OnInit, OnChanges {
  @ViewChild('barChart') private chartContainer: ElementRef;

  @Input() data: Data[];

  margin = { top: 20, right: 20, bottom: 30, left: 40 };
  colors = ['#9ecae1', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5',
            '#08519c', '#08306b', '#9ecae1', '#6baed6', '#4292c6', '#2171b5'];
  // d3.schemeBlues[0 , 9];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(): void {
    if (!this.data) { return; }

    this.createChart();
  }

    private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const data = this.data;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const xScale = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.Month));

    const yScale = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0]).nice()
      .domain([0, d3.max(data, d => d.Candidates)]);

    const g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // xAxis
    const xAxis = svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(' + this.margin.left + ',' + (contentHeight + this.margin.top) + ')')
      .call(d3.axisBottom(xScale));

    // yAxis
    const yAxis = svg.append('g')
      .attr('class', 'axis axis--y')
      .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      // .attr('text-anchor', 'end')
      .attr('text-anchor', 'middle')
      .text('Candidates')
      .attr('fill', 'black');

    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.Month))
      .attr('y', d => yScale(d.Candidates))
      .attr('width', xScale.bandwidth())
      .attr('height', d => contentHeight - yScale(d.Candidates))
      .attr('fill', (d, i) => this.colors[i]);

    g.selectAll('.text')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'text')
      .text(d => d.Candidates)
      .attr('x', (d, i) => i * (contentWidth / data.length) + (contentWidth / data.length - this.margin.left))
      .attr('y', d => yScale(d.Candidates) - 5 );

  }

  onResize() {
    this.createChart();
  }

}
