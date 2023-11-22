import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from "@angular/forms";
import { EditorComponent } from './editor/editor.component';
import { FileUtilsService } from "./services/file-utils.service";
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [AppComponent, EditorComponent, FooterComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, MatIconModule, MatTooltipModule],
  providers: [FileUtilsService],
  bootstrap: [AppComponent],
})
export class AppModule { }
