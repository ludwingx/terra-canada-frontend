import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { I18nService } from '../../../services/i18n.service';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Injectable()
export class AiChatService {
  private i18n = inject(I18nService);
  private messagesSubject: BehaviorSubject<ChatMessage[]>;

  private readonly botResponseKeys: string[] = [
    'aiChatResponse1',
    'aiChatResponse2',
    'aiChatResponse3',
    'aiChatResponse4'
  ];

  constructor() {
    this.messagesSubject = new BehaviorSubject<ChatMessage[]>([this.createWelcomeMessage()]);
  }

  public get messages$(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  addMessage(text: string, sender: 'user' | 'bot'): void {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);

    // Simular respuesta del bot después de 1 segundo
    if (sender === 'user') {
      setTimeout(() => {
        this.addBotResponse();
      }, 1000);
    }
  }

  private addBotResponse(): void {
    const randomKey =
      this.botResponseKeys[Math.floor(Math.random() * this.botResponseKeys.length)];
    const randomResponse = this.i18n.t(randomKey);
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: randomResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  clearMessages(): void {
    this.messagesSubject.next([this.createWelcomeMessage()]);
  }

  private createWelcomeMessage(): ChatMessage {
    return {
      id: '1',
      text: this.i18n.t('aiChatWelcome'),
      sender: 'bot',
      timestamp: new Date()
    };
  }
}
