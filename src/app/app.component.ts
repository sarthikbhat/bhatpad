import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { appWindow, WebviewWindow, WindowManager, TitleBarStyle } from '@tauri-apps/api/window'
// import { appWindow, WebviewWindow, WindowManager, TitleBarStyle } from '@tauri-apps/api/window'
import { listen } from '@tauri-apps/api/event'
import { readTextFile } from '@tauri-apps/api/fs'
import { open } from '@tauri-apps/api/dialog';
import { FileUtilsService } from "./services/file-utils.service";
import { Store } from "tauri-plugin-store-api";
import { register } from '@tauri-apps/api/globalShortcut';
import { RegisterShortcutService } from "./services/register-shortcut.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {

  textData = ""

  constructor(
    private fileUtilsService: FileUtilsService,
    private cdRef: ChangeDetectorRef,
    private registerShortcutService: RegisterShortcutService,
  ) { }

  ngOnInit(): void {
    appWindow.setTitle("Bhatpad :: Untitled*");
    this.listenToOpenFileEvent();
    this.setStore();
    // appWindow.
    // const oo = new WebviewWindow().titl

  }

  ngOnDestroy(): void {

  }

  @HostListener("window:keydown.control.s", ['$event'])
  onSave(e: KeyboardEvent) {
    console.log("save");

    this.fileUtilsService.onSave()
  }

  @HostListener("window:keydown.control.shift.s", ['$event'])
  onSaveAs(e: KeyboardEvent) {
    this.fileUtilsService.onSaveAs()
  }

  @HostListener("keydown.control.o", ['$event'])
  async onOpen(e: KeyboardEvent) {
    this.fileUtilsService.onOpen()
  }

  async setStore() {
    // const store = new Store(".settings.json");
    // await store.set("app-theme", "dark");
    // await store.save();
    // console.log(store);
    // const theme = await store.get("app-theme");
    // console.log(theme);
  }

  async listenToOpenFileEvent() {
    listen('openFile', async (event) => {
      const currentPath = event.payload as string;
      this.fileUtilsService.setCurrentPath(currentPath);
      this.textData = await readTextFile(currentPath);
      this.cdRef.detectChanges();
      this.fileUtilsService.setEmittedTextData(this.textData);
      const title = "Bhatpad :: " + currentPath;
      appWindow.setTitle(title);
    })
  }
}
