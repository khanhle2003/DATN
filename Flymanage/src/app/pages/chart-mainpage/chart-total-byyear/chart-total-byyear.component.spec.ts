import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTotalByyearComponent } from './chart-total-byyear.component';

describe('ChartTotalByyearComponent', () => {
  let component: ChartTotalByyearComponent;
  let fixture: ComponentFixture<ChartTotalByyearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartTotalByyearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartTotalByyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
