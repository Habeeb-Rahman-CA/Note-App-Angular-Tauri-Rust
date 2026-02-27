#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::Path;

#[tauri::command]
fn save_note(content: String) -> Result<(), String> {
    fs::write("notes.json", content).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_note() -> Result<String, String> {
    if Path::new("notes.json").exists() {
        fs::read_to_string("notes.json").map_err(|e| e.to_string())
    } else {
        Ok(String::from(""))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_note, read_note])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
