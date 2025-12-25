import { Component, inject, OnInit, signal } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { interval, switchMap } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-service-client',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass],
  templateUrl: './service-client.component.html',
  styleUrl: './service-client.component.scss'
})
export class ServiceClientComponent {
  chatService = inject(ChatService);
  allSessions$ = signal<{ sessionId: string; fullName: string; messages: { utilisateur: string; contenu: string }[] }[]>([]);
  allMessages$ = signal<{ [sessionId: string]: { utilisateur: string; contenu: string }[] }>({});
  newMessage = signal('');

  ngOnInit() {
    this.chatService.getAllSessions().subscribe((sessions) => {
      this.allSessions$.set(sessions);
    });

    // Rafraîchir uniquement les messages toutes les 2 secondes
    interval(2000)
      .pipe(
        switchMap(() => this.chatService.getAllMessages())
      )
      .subscribe((messagesBySession) => {
        this.allMessages$.set(messagesBySession);
      });
  }

  showMessages: boolean[] = [];

  toggleMessages(index: number) {
    // Tout fermer d'abord
    this.showMessages = [];
    // Puis ouvrir uniquement la session cliquée
    this.showMessages[index] = true;
  }

  updateMessage(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newMessage.set(input.value);
  }

  sendMessage(sessionId: string) {
    if (this.newMessage().trim()) {
      this.chatService.sendMessage(sessionId, 'Service client', this.newMessage()).subscribe(() => {
        this.newMessage.set(''); // Effacer l'input après envoi
      });
    }
  }
}
