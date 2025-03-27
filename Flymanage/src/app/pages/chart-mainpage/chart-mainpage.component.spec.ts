import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMainpageComponent } from './chart-mainpage.component';

describe('ChartMainpageComponent', () => {
  let component: ChartMainpageComponent;
  let fixture: ComponentFixture<ChartMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartMainpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
