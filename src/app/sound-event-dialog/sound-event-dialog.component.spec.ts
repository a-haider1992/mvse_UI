import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoundEventDialogComponent } from './sound-event-dialog.component';

describe('SoundEventDialogComponent', () => {
  let component: SoundEventDialogComponent;
  let fixture: ComponentFixture<SoundEventDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoundEventDialogComponent]
    });
    fixture = TestBed.createComponent(SoundEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
