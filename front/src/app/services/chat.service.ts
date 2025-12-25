import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
   private apiUrl = 'http://localhost:8080/api/chat'; // URL du backend

  private http = inject(HttpClient); // Injection Angular 17

  newChat(fullName: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/start`, fullName);
  }

  getMessages(sessionId: string): Observable<{ fullName: string; messages: { utilisateur: string; contenu: string }[] }> {
    return this.http.get<{ fullName: string; messages: { utilisateur: string; contenu: string }[] }>(`${this.apiUrl}/${sessionId}/messages`);
  }

  sendMessage(sessionId: string, utilisateur: string, message: string): Observable<void> {
    const data = { utilisateur: utilisateur, contenu: message };
    return this.http.post<void>(`${this.apiUrl}/${sessionId}/send`, data);
  }

  getAllSessions(): Observable<{ sessionId: string; fullName: string; messages: { utilisateur: string; contenu: string }[] }[]> {
    return this.http.get<{ sessionId: string; fullName: string; messages: { utilisateur: string; contenu: string }[] }[]>(`${this.apiUrl}/service-client/messages`);
  }

  getAllMessages(): Observable<{ [sessionId: string]: { utilisateur: string; contenu: string }[] }> {
    return this.http.get<{ [sessionId: string]: { utilisateur: string; contenu: string }[] }>(`${this.apiUrl}/messages`);
  }

}
