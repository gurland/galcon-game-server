export class Chat {
  private _messages: Message[];

  constructor() {
    this._messages = []
  }

  public addMessage(authorName: string, text: string) {
    this._messages.push(new Message(`${authorName}: ${text}`));
  }

  toJSON() {
    return this._messages
  }
}

class Message {
  private readonly _text: string;

  constructor(text: string) {
    this._text = text;
  }

  toJSON() {
    return {
      text: this._text
    }
  }
}
