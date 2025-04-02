import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CamOnComponent } from './cam-on.component';

describe('CamOnComponent', () => {
  let component: CamOnComponent;
  let fixture: ComponentFixture<CamOnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CamOnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CamOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
