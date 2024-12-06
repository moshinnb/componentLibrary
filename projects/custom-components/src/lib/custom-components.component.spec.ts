import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomComponentsComponent } from './custom-components.component';

describe('CustomComponentsComponent', () => {
  let component: CustomComponentsComponent;
  let fixture: ComponentFixture<CustomComponentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomComponentsComponent]
    });
    fixture = TestBed.createComponent(CustomComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
