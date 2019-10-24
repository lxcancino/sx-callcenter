import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepositoComponent } from './add-deposito.component';

describe('AddDepositoComponent', () => {
  let component: AddDepositoComponent;
  let fixture: ComponentFixture<AddDepositoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDepositoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepositoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
