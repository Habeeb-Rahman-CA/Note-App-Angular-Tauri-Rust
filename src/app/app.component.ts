import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/core";
import { FormsModule } from '@angular/forms';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { debounceTime, Subject } from 'rxjs';


interface Note {
  id: number;
  content: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  notes: Note[] = [];
  newNote = '';

  saveTrigger = new Subject<void>();

  async ngOnInit() {
    const data = await invoke<string>('read_notes');
    this.notes = JSON.parse(data);

    this.saveTrigger
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.saveNotes();
      });
  }

  async saveNotes() {
    await invoke('save_notes', {
      content: JSON.stringify(this.notes),
    });
  }

  async addNote() {
    if (!this.newNote.trim()) return;

    const note: Note = {
      id: Date.now(),
      content: this.newNote,
    };

    this.notes.push(note);
    this.newNote = '';
    this.saveTrigger.next();
  }

  async deleteNote(id: number) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveTrigger.next();
  }

  async minimize() {
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  }

  async maximize() {
    const appWindow = getCurrentWindow();
    await appWindow.toggleMaximize();
  }

  async close() {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  }
}
