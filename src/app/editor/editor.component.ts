import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { save } from '@tauri-apps/api/dialog';
import { listen } from '@tauri-apps/api/event';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { appWindow } from '@tauri-apps/api/window';
import { FileUtilsService } from '../services/file-utils.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, OnChanges {


  formGroup: FormGroup = this.createFormGroup();
  currentPath = "";
  @Input() textData = "";

  @ViewChild("textArea", { static: false }) textArea: ElementRef<HTMLElement> | null = null;

  constructor(
    private fb: FormBuilder,
    private fileUtilsService: FileUtilsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.formGroup = this.createFormGroup();
    this.listenForWindowCloseEvent()
    this.listenForInputChanges()
    this.listenForFileEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['textData']){
      this.textDataFormControl?.setValue(this.textData);
    }
  }

  listenForFileEvents() {
    this.fileUtilsService.currentPath$.subscribe((path:string)=>{
      this.currentPath = path;
    })
  }

  listenForWindowCloseEvent() {
    appWindow.onCloseRequested(async (e) => {
      if (this.textDataFormControl.value && await this.isUnsaved()) {
        e.preventDefault();
        const save = await window.confirm("You have unsaved changes in the file, do you want to save it before exiting?")
        if (save) {
          if (this.currentPath.length)
            this.fileUtilsService.save(this.currentPath, this.textDataFormControl.value);
          else this.fileUtilsService.save("", this.textDataFormControl.value);
        }
        else {
          appWindow.close();
        }
      }
    })
  }

  listenForInputChanges() {
    this.textDataFormControl.valueChanges.subscribe(async (text) => {
      this.fileUtilsService.setEmittedTextData(text);
      if (!(await this.isUnsaved())) {
        appWindow.setTitle(await this.getTitle() + "*");
      }
      if (this.textArea) {
        this.textArea.nativeElement.style.height = "40px";
        this.textArea.nativeElement.style.height = (this.textArea.nativeElement.scrollHeight) + "px";
      }
    })
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      textData: new FormControl("")
    })
  }

  checkTabKey(event: KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      const tab = document.getElementsByTagName("textarea")[0];
      var start = tab.selectionStart;
      this.textDataFormControl.setValue(this.textDataFormControl.value.substring(0, tab.selectionStart) + "\t" + this.textDataFormControl.value.substring(tab.selectionStart));
      tab.setSelectionRange(null,null)
      tab.selectionStart = start + 1;
    }
  }

  async isUnsaved() {
    console.log("called");
    
    const title = await this.getTitle()
    return title.lastIndexOf("*") === title.length - 1
  }

  get textDataFormControl() {
    return this.formGroup?.controls['textData'];
  }

  async getTitle() {
    const title = await appWindow.title();
    return title;
  }

}
