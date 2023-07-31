import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchedOutputComponent } from './searched-output.component';

describe('SearchedOutputComponent', () => {
  let component: SearchedOutputComponent;
  let fixture: ComponentFixture<SearchedOutputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchedOutputComponent]
    });
    fixture = TestBed.createComponent(SearchedOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
