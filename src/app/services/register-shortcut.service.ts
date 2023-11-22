import { HostListener, Injectable } from '@angular/core';
import { register, unregisterAll, isRegistered } from '@tauri-apps/api/globalShortcut';
import { FileUtilsService } from './file-utils.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterShortcutService {

  constructor(
    private fileService: FileUtilsService
  ) { }

  // shortCutsToFnMap: any = {
  //   "CommandOrControl+O": this.fileService.onOpen,
  //   "CommandOrControl+S": this.fileService.onSave,
  //   "CommandOrControl+Shift+S": this.fileService.onSaveAs
  // }

  // async registerShortCuts() {
  //   for (const key in this.shortCutsToFnMap) {
  //     const isRegisteredBool = await isRegistered(key);
  //     console.log(key);
  //     console.log(isRegisteredBool);
  //     if (!isRegisteredBool) {
  //       await register(key, () => {
  //         this.shortCutsToFnMap[key]();
  //         console.log(key + " called");
  //       });
  //     }
  //   }
  // }
  // async deResgisterAllShortcuts() {
  //   await unregisterAll();
  // }

  @HostListener("window:keydown.control.s", ['$event'])
  onSave(e: KeyboardEvent) {
    console.log("save");
    
    this.fileService.onSave()
  }

  @HostListener("window:keydown.control.shift.s", ['$event'])
  onSaveAs(e: KeyboardEvent) {
    this.fileService.onSaveAs()
  }

  @HostListener("keydown.control.o", ['$event'])
  async onOpen(e: KeyboardEvent) {
    this.fileService.onOpen()
  }

}
