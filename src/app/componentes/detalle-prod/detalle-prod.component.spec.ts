import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProdComponent } from './detalle-prod.component';

describe('DetalleProdComponent', () => {
  let component: DetalleProdComponent;
  let fixture: ComponentFixture<DetalleProdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleProdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
