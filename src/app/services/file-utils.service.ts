import { Injectable } from '@angular/core';
import { save, open } from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { appWindow } from '@tauri-apps/api/window';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUtilsService {

  currentPath = new BehaviorSubject<string>("")
  currentPath$ = this.currentPath.asObservable();

  emittedTextData = new BehaviorSubject<string>("")
  emittedTextData$ = this.emittedTextData.asObservable();

  constructor() { }

  setCurrentPath(path: string) {
    this.currentPath.next(path);
  }

  setEmittedTextData(text: string) {
    this.emittedTextData.next(text);
  }

  onSave() {
    if (this.currentPath.value)
      this.save(this.currentPath.value, this.emittedTextData.value);
    else this.save("", this.emittedTextData.value);
  }

  onSaveAs() {
    this.save("", this.emittedTextData.value)
  }

  async onOpen() {
    appWindow.emit("openFile", await open({ multiple: false }))
  }

  async save(path: string = "", value: string) {
    let title = await appWindow.title();
    let filePath;
    if (!path.length) {
      filePath = await save({
        filters: [{
          name: 'Text Documents (*.txt)',
          extensions: ['txt']
        }]
      });
    }

    if (filePath || path) {
      await writeTextFile(filePath || path, value)
      if (title.lastIndexOf("*") === title.length - 1) {
        title = filePath || path;
        appWindow.setTitle(title);
      }
    }

  }
}
