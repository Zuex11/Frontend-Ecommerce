import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRow } from './productrow';

describe('ProductRow', () => {
  let component: ProductRow;
  let fixture: ComponentFixture<ProductRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRow],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
