/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VietnamChartComponent } from './vietnam-chart.component';

describe('VietnamChartComponent', () => {
  let component: VietnamChartComponent;
  let fixture: ComponentFixture<VietnamChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VietnamChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VietnamChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
