import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidetopbarComponent } from './sidetopbar.component';

describe('SidetopbarComponent', () => {
  let component: SidetopbarComponent;
  let fixture: ComponentFixture<SidetopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidetopbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidetopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
