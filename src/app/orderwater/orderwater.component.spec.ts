import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderwaterComponent } from './orderwater.component';

describe('OrderwaterComponent', () => {
  let component: OrderwaterComponent;
  let fixture: ComponentFixture<OrderwaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderwaterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderwaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
