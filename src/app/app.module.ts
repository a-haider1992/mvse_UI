import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { SearchedOutputComponent } from './searched-output/searched-output.component';
import { ImageBasedSearchService } from './image-based-search.service';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SearchedOutputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [ImageBasedSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
