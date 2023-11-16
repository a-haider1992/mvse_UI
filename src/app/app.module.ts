import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { SearchedOutputComponent } from './searched-output/searched-output.component';
import { ImageBasedSearchService } from './image-based-search.service';
import { DataSharingServiceService } from './data-sharing-service.service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './error-handler.service';
import { MatDialogModule } from '@angular/material/dialog';
import { VideoDialogComponent } from './video-dialog/video-dialog.component';
import { SoundEventDialogComponent } from './sound-event-dialog/sound-event-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SearchedOutputComponent,
    VideoDialogComponent,
    SoundEventDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    FormsModule,
    MatDialogModule,
    MatSelectModule,
  ],
  providers: [ImageBasedSearchService, DataSharingServiceService, { provide: ErrorHandler, useClass: GlobalErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
