import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThenSanBayComponent } from './then-san-bay.component';

describe('ThenSanBayComponent', () => {
  let component: ThenSanBayComponent;
  let fixture: ComponentFixture<ThenSanBayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThenSanBayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThenSanBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
