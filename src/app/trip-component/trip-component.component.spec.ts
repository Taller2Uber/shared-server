import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripComponentComponent } from './trip-component.component';

describe('TripComponentComponent', () => {
  let component: TripComponentComponent;
  let fixture: ComponentFixture<TripComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
