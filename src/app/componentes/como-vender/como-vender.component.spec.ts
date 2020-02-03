import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComoVenderComponent } from './como-vender.component';

describe('ComoVenderComponent', () => {
  let component: ComoVenderComponent;
  let fixture: ComponentFixture<ComoVenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComoVenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoVenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
