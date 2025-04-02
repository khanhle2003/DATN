import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMayBayComponent } from './them-may-bay.component';

describe('ThemMayBayComponent', () => {
  let component: ThemMayBayComponent;
  let fixture: ComponentFixture<ThemMayBayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemMayBayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemMayBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
