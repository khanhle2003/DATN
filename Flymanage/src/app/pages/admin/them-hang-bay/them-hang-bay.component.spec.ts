import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemHangBayComponent } from './them-hang-bay.component';

describe('ThemHangBayComponent', () => {
  let component: ThemHangBayComponent;
  let fixture: ComponentFixture<ThemHangBayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemHangBayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemHangBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
