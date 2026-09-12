import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ordersummary } from './ordersummary';

describe('Ordersummary', () => {
  let component: Ordersummary;
  let fixture: ComponentFixture<Ordersummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ordersummary],
    }).compileComponents();

    fixture = TestBed.createComponent(Ordersummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
