package com.openclassrooms.ycyw.controller;

import com.openclassrooms.ycyw.model.Chat;
import com.openclassrooms.ycyw.model.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

  private final Map<String, Chat> chatSessions = new HashMap<>();

  /** Démarre une nouvelle session de chat pour un utilisateur */
  @PostMapping("/start")
  public ResponseEntity<Map<String, String>> newChat(@RequestBody String fullName) {
    String sessionId = UUID.randomUUID().toString(); // Générer un ID unique
    Chat session = new Chat(fullName);

    chatSessions.put(sessionId, session); // Associer l'ID à la session
    Map<String, String> response = new HashMap<>();
    response.put("sessionId", sessionId);
    return ResponseEntity.ok(response);
  }
  /** Récupère les messages d'une session */
  @GetMapping("/{sessionId}/messages")
  public ResponseEntity<Chat> getMessages(@PathVariable String sessionId) {
    Chat session = chatSessions.get(sessionId);
    if (session == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(session);
  }

  /** Envoie un message dans une session */
  @PostMapping("/{sessionId}/send")
  public ResponseEntity<Void> sendMessage(@PathVariable String sessionId, @RequestBody Message request) {
    Chat session = chatSessions.get(sessionId);
    if (session == null) {
      return ResponseEntity.notFound().build();
    }

    String utilisateur = request.getUtilisateur();
    if (utilisateur == null || utilisateur.isBlank()) {
      utilisateur = session.getFullName();
    }

    session.addMessage(utilisateur, request.getContenu());
    return ResponseEntity.ok().build();
  }

  /** Récupère les messages de toutes les sessions */
  @GetMapping("/service-client/messages")
  public ResponseEntity<List<Map<String, Object>>> getAllSessions() {
    List<Map<String, Object>> allSessions = chatSessions.entrySet().stream().map(entry -> {
      Map<String, Object> sessionData = new HashMap<>();
      sessionData.put("sessionId", entry.getKey());
      sessionData.put("fullName", entry.getValue().getFullName());
      sessionData.put("messages", entry.getValue().getMessages());
      return sessionData;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(allSessions);
  }

  @GetMapping("/messages")
  public ResponseEntity<Map<String, List<Message>>> getAllMessages() {
    Map<String, List<Message>> messagesBySession = new HashMap<>();
    chatSessions.forEach((sessionId, chat) -> {
      messagesBySession.put(sessionId, chat.getMessages());
    });
    return ResponseEntity.ok(messagesBySession);
  }

}

