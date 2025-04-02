import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemChuyenBayComponent } from './them-chuyen-bay.component';

describe('ThemChuyenBayComponent', () => {
  let component: ThemChuyenBayComponent;
  let fixture: ComponentFixture<ThemChuyenBayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemChuyenBayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemChuyenBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
