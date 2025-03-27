import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhuongChamComponent } from './phuong-cham.component';

describe('PhuongChamComponent', () => {
  let component: PhuongChamComponent;
  let fixture: ComponentFixture<PhuongChamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhuongChamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhuongChamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
