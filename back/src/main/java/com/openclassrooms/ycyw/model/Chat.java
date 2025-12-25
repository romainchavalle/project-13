package com.openclassrooms.ycyw.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Chat {

  private String fullName;
  private List<Message> messages;

  public Chat(String fullName) {
    this.fullName = fullName;
    this.messages = new ArrayList<>();
  }

  public void addMessage(String utilisateur, String contenu) {
    messages.add(new Message(utilisateur, contenu));
  }

}