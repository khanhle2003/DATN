import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlyThanhToanComponent } from './qly-thanh-toan.component';

describe('QlyThanhToanComponent', () => {
  let component: QlyThanhToanComponent;
  let fixture: ComponentFixture<QlyThanhToanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QlyThanhToanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QlyThanhToanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
