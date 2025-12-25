import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  router = inject(Router);
  chatService = inject(ChatService); // Injection de service simplifiée
  newName = signal('');

  updateName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.newName.set(input.value);
  }

  newChat() {
    this.chatService.newChat(this.newName()).subscribe((response: string) => {
      this.router.navigate(['/chat', response]);
    });
  }
}
