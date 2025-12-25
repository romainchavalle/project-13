import { Component, inject, OnInit, signal } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { interval, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  route = inject(ActivatedRoute);
  chatService = inject(ChatService); // Injection de service simplifiée
  messages$ = signal<{ fullName: string; messages: { utilisateur: string; contenu: string }[] }>({ fullName: '', messages: [] });
  newMessage = signal('');
  sessionId = String(this.route.snapshot.paramMap.get('sessionId'));

  ngOnInit() {
    // Polling toutes les 2 secondes
    interval(2000)
      .pipe(switchMap(() => this.chatService.getMessages(this.sessionId)))
      .subscribe((msgs) => this.messages$.set(msgs));
  }

  /** Met à jour le message depuis l'input */
  updateMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newMessage.set(input.value);
  }

  /** Envoie un message au service */
  sendMessage() {
    if (this.newMessage().trim()) {
      this.chatService.sendMessage(this.sessionId, '', this.newMessage()).subscribe(() => {
        this.newMessage.set(''); // Effacer l'input après envoi
      });
    }
  }
}
