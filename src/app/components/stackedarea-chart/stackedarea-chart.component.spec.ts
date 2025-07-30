import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedareaChartComponent } from './stackedarea-chart.component';

describe('StackedareaChartComponent', () => {
  let component: StackedareaChartComponent;
  let fixture: ComponentFixture<StackedareaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackedareaChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StackedareaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
