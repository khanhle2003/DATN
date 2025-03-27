import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QlyDatChoComponent } from './qly-dat-cho.component';

describe('QlyDatChoComponent', () => {
  let component: QlyDatChoComponent;
  let fixture: ComponentFixture<QlyDatChoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QlyDatChoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QlyDatChoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
