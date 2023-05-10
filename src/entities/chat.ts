export class Chat {
  private _messages: Message[];

  public addMessage(authorName: string, text: string) {
    this._messages.push(new Message(authorName, text));
  }

  toJson() {
    return {
      messages: this._messages
    }
  }
}

class Message {
  private _authorName: string;
  private _text: string;

  constructor(authorName: string, text: string) {
    this._authorName = authorName;
    this._text = text;
  }

  toJson() {
    return {
      authorName: this._authorName,
      text: this._text
    }
  }
}
