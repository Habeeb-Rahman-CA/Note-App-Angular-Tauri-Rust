import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/core";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  noteContent = '';

  async ngOnInit() {
    this.noteContent = await invoke('read_note');
  }

  async saveNote() {
    await invoke('save_note', { content: this.noteContent });
    alert('Note Saved!');
  }
}
