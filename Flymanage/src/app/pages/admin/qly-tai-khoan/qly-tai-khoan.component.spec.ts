import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlyTaiKhoanComponent } from './qly-tai-khoan.component';

describe('QlyTaiKhoanComponent', () => {
  let component: QlyTaiKhoanComponent;
  let fixture: ComponentFixture<QlyTaiKhoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QlyTaiKhoanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QlyTaiKhoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
