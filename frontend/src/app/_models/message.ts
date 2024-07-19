export interface Message {
  id: number;
  content: string;
  senderUsername: string;
  recipientUsername: string;
  dateRead: Date;
  messageSent: Date;
  senderDeleted: boolean;
  recipientDeleted: boolean;
  senderId: number;
  recipientId: number;
  senderProfilePicture: string;
  recipientProfilePicture: string;
}
