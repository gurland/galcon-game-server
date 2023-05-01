// Chat Protocol (/ws/room/{roomId}/chat):
// Client emits & server broadcasts

interface ChatMessageEvent {
  authorName: string;
  text: string;
}
