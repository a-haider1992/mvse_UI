import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { SearchedOutputComponent } from './searched-output/searched-output.component';
import { ImageBasedSearchService } from './image-based-search.service';
import { DataSharingServiceService } from './data-sharing-service.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SearchedOutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ImageBasedSearchService, DataSharingServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
