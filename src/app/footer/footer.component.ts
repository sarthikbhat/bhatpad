import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FileUtilsService } from '../services/file-utils.service';
import { appWindow, Theme } from '@tauri-apps/api/window';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  lineNumber = 1;
  columnNumber = 1;
  textarea = document.createElement("textarea");
  textData = ""
  currentTheme = ""

  constructor(
    private fileService: FileUtilsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initialise();
    this.themeSetter();
    this.fileService.emittedTextData$.subscribe((text: string) => {
      // this.lineNumber = thiconsole.log(text.split("\n"));
      this.textData = text
    })
  }

  async themeSetter() {
    this.currentTheme = await appWindow.theme() || ""
    appWindow.onThemeChanged(theme => {
      this.currentTheme = theme.payload;
    })
  }

  initialise() {
    this.textarea = document.getElementsByTagName('textarea')[0];
    this.textarea.addEventListener('keydown', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('mousedown', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('touchstart', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('input', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('paste', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('cut', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('mouseup', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('select', this.checkNewPosition.bind(this));
    this.textarea.addEventListener('selectstart', this.checkNewPosition.bind(this));
  }

  checkNewPosition(e: any) {
    this.lineNumber = this.textarea
      .value.substring(0, this.textarea.selectionEnd).split("\n").length;
    this.columnNumber = this.textarea.selectionEnd + 1;
    this.cdRef.detectChanges();
  }

  get getIcon() {
    return this.currentTheme === "dark" ? "dark_mode" : "light_mode";
  }

}
