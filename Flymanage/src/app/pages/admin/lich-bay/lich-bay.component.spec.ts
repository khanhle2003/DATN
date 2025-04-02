import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichBayComponent } from './lich-bay.component';

describe('LichBayComponent', () => {
  let component: LichBayComponent;
  let fixture: ComponentFixture<LichBayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LichBayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LichBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
