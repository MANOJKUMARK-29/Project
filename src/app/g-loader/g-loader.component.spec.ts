import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GLoaderComponent } from './g-loader.component';

describe('GLoaderComponent', () => {
  let component: GLoaderComponent;
  let fixture: ComponentFixture<GLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
