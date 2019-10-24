import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBtnComponent } from './notification-btn.component';

describe('NotificationBtnComponent', () => {
  let component: NotificationBtnComponent;
  let fixture: ComponentFixture<NotificationBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
