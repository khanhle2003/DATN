import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFlightDetailComponent } from './all-flight-detail.component';

describe('AllFlightDetailComponent', () => {
  let component: AllFlightDetailComponent;
  let fixture: ComponentFixture<AllFlightDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllFlightDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllFlightDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
