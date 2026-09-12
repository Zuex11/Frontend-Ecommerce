import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categoriesmenu } from './categoriesmenu';

describe('Categoriesmenu', () => {
  let component: Categoriesmenu;
  let fixture: ComponentFixture<Categoriesmenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Categoriesmenu],
    }).compileComponents();

    fixture = TestBed.createComponent(Categoriesmenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
