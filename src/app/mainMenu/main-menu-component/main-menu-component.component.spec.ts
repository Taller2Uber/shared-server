import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuComponentComponent } from './main-menu-component.component';

describe('MainMenuComponentComponent', () => {
  let component: MainMenuComponentComponent;
  let fixture: ComponentFixture<MainMenuComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMenuComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
