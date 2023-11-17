import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sound-event-dialog',
  templateUrl: './sound-event-dialog.component.html',
  styleUrls: ['./sound-event-dialog.component.scss']
})
export class SoundEventDialogComponent implements OnInit {

  msg: string = 'Default message!';

  constructor(
    public dialogRef: MatDialogRef<SoundEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.msg = this.data["msg"];
  }

}
