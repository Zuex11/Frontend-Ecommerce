import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cartitem } from './cartitem';

describe('Cartitem', () => {
  let component: Cartitem;
  let fixture: ComponentFixture<Cartitem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cartitem],
    }).compileComponents();

    fixture = TestBed.createComponent(Cartitem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
