import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankedList } from './rankedlist';

describe('RankedList', () => {
  let component: RankedList;
  let fixture: ComponentFixture<RankedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankedList],
    }).compileComponents();

    fixture = TestBed.createComponent(RankedList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
