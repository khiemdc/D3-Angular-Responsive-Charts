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

  margin = { top: 20, right: 20, bottom: 50, left: 40 };
  colors = ['#9ecae1', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5',
            '#08519c', '#08306b', '#9ecae1', '#6baed6', '#4292c6', '#2171b5'];
  // d3.schemeBlues[0 , 9];

  constructor() { }

  ngOnInit() { }

  ngOnChanges(): void {
    console.log('Chart Data: ', this.data);
    if (!this.data) { return; }

    // this.createChart();
    this.createHorizontalBarchart();
  }

  private createChart(): void {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data;

    d3.select(element).select('svg').remove();

    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const tooltip = d3.select(element).append('div').attr('class', 'toolTip');

    const xScale = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.2)
      .domain(data.map(d => d.Month));

    const yScale = d3
      .scaleLinear()
      .rangeRound([contentHeight, 0]).nice()
      .domain([0, d3.max(data, d => d.Candidates)]);

    const chart = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // xAxis
    const xAxis = svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(' + this.margin.left + ',' + (contentHeight + this.margin.top) + ')')
      .call(d3.axisBottom(xScale))
      
      .append('text')
      // .attr('dy', '0.5em')
      .attr('font-size', '1.5em')
      .attr('x', contentWidth / 2)
      .attr('y', this.margin.bottom)
      .attr('text-anchor', 'middle')
      .text('Security Cleanance Levels')
      .attr('fill', 'black');

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
      .text('Employees')
      .attr('fill', 'black');

    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.Month))
      .attr('y', contentHeight)
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.Candidates))
      .attr('width', xScale.bandwidth())
      .attr('height', d => contentHeight - yScale(d.Candidates))
      .attr('fill', (d, i) => this.colors[i]);
      
    chart.selectAll('.bar')
      .data(data)
      .on('mousemove', function(d) {
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .style('display', 'inline-block')
          .html((d.Month) + ': ' + (d.Candidates) + ' candidates');
          })
      .on('mouseout', function(d) { tooltip.style('display', 'none'); })
      .on('click', d => {
        console.log('clicked on: ', d);
      });

    
      // svg.append('text')
      //   .attr('x', contentWidth / 2 + this.margin.left)
      //   .attr('y', contentHeight + this.margin.bottom + this.margin.top)
      //   .attr('text-anchor', 'middle')
      //   .text('Chart of Candidates in 2018 - 2019');

    // Display Text on each bar charts
    chart.selectAll('.text')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'text')
        // .text(d => d.Candidates)
        .attr('x', (a) => xScale(a.Month) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.Candidates) - 3)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.Candidates}`)

  }

  onResize() {
    this.createChart();
  }

  // D3 - Horizontal Bar Chart
  createHorizontalBarchart() {

    const element = this.chartContainer.nativeElement;
    const data = this.data;

    d3.select(element).select('svg').remove();

    const canvas = d3.select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const bars = canvas.selectAll('rect')
                  .data(data)
                  .enter()
                    .append('rect')
                    .attr('width', d => d.Candidates * 2)
                    .attr('height', 50 )
                    .attr('y', (d, i) => i * 80);
                    
  }

}
