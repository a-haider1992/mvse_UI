import { TestBed } from '@angular/core/testing';

import { ImageBasedSearchService } from './image-based-search.service';

describe('ImageBasedSearchService', () => {
  let service: ImageBasedSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageBasedSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
