import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarchartdatatableComponent } from './barchartdatatable.component';

describe('BarchartdatatableComponent', () => {
  let component: BarchartdatatableComponent;
  let fixture: ComponentFixture<BarchartdatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarchartdatatableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarchartdatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
