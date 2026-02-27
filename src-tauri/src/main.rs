#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[tauri::command]
fn save_notes(app_handle: tauri::AppHandle, content: String) -> Result<(), String> {
    let mut path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    fs::create_dir_all(&path).map_err(|e| e.to_string())?;

    path.push("notes.json");

    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn read_notes(app_handle: tauri::AppHandle) -> Result<String, String> {
    let mut path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    path.push("notes.json");

    if path.exists() {
        fs::read_to_string(path).map_err(|e| e.to_string())
    } else {
        Ok(String::from("[]"))
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_notes, read_notes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
