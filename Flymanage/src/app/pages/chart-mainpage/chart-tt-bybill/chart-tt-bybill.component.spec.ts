import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTtBybillComponent } from './chart-tt-bybill.component';

describe('ChartTtBybillComponent', () => {
  let component: ChartTtBybillComponent;
  let fixture: ComponentFixture<ChartTtBybillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartTtBybillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartTtBybillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
