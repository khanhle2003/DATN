import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFlightComponent } from './detail-flight.component';

describe('DetailFlightComponent', () => {
  let component: DetailFlightComponent;
  let fixture: ComponentFixture<DetailFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
