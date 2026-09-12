import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialRow } from './testimonialrow';

describe('TestimonialRow', () => {
  let component: TestimonialRow;
  let fixture: ComponentFixture<TestimonialRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialRow],
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
