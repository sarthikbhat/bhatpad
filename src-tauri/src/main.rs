// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    api::dialog, AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowMenuEvent,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn menu_event_handler(event: WindowMenuEvent) {
    let window = event.window();
    let window_name = window.label().to_string();
    let app = window.app_handle();
    match event.menu_item_id() {
        "open_file" => {
            dialog::FileDialogBuilder::default().pick_file(move |path_buf| {
                // Some(p) => {
                app.windows()[window_name.as_str()]
                    .emit_all("openFile", path_buf)
                    .unwrap();
                // }
            })
        }
        _ => {}
    }
}

fn file_menu() -> tauri::Submenu {
    let file_sub_menu = Menu::new()
        .add_item(CustomMenuItem::new("open_file", "Open File"))
        .add_item(CustomMenuItem::new("save_file", "Save"))
        .add_item(CustomMenuItem::new("save_as_file", "Save As"))
        .add_native_item(MenuItem::Quit);
    return Submenu::new("File", file_sub_menu);
}

fn edit_menu() -> tauri::Submenu {
    let edit_sub_menu = Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste);
    return Submenu::new("Edit", edit_sub_menu);
}

fn selection_menu() -> tauri::Submenu {
    let selection_sub_menu = Menu::new().add_native_item(MenuItem::SelectAll);
    return Submenu::new("Selection", selection_sub_menu);
}

fn view_menu() -> tauri::Submenu {
    let view_sub_menu = Menu::new().add_native_item(MenuItem::Zoom);
    return Submenu::new("View", view_sub_menu);
}
fn help_menu() -> tauri::Submenu {
    let help_sub_menu = Menu::new().add_native_item(MenuItem::About(
        "Bhatpad".to_string(),
        AboutMetadata::version(AboutMetadata::new(), "0.0.0"),
    ));
    return Submenu::new("Help", help_sub_menu);
}

fn main() {
    let menu = Menu::new()
        .add_submenu(file_menu())
        .add_submenu(edit_menu())
        .add_submenu(selection_menu())
        .add_submenu(view_menu())
        .add_submenu(help_menu());
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])
        .menu(menu)
        .on_menu_event(menu_event_handler)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
