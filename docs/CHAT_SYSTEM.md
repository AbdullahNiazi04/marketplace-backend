# Chat System - Technical Documentation

## Overview

This document provides a comprehensive guide to the **Buyer-Seller Chat System** implemented in the Nizron Marketplace. The system enables real-time communication between buyers and sellers using WebSocket technology while maintaining full message history in the database.

---

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           Socket.IO Server               │
                    │         (NestJS Gateway)                 │
                    └─────────────┬───────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
    ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
    │   Buyer App   │    │  Seller App   │    │   Admin App   │
    │  (WebSocket)  │    │  (WebSocket)  │    │  (WebSocket)  │
    └───────────────┘    └───────────────┘    └───────────────┘

                    ┌─────────────────────────────────────────┐
                    │              SQLite Database             │
                    │  ┌─────────────┐  ┌─────────────┐       │
                    │  │conversations│  │  messages   │       │
                    │  └─────────────┘  └─────────────┘       │
                    └─────────────────────────────────────────┘
```

---

## Database Schema

### Conversations Table

| Column | Type | Description |
|--------|------|-------------|
| `conversation_id` | TEXT (UUID) | Primary key |
| `buyer_id` | TEXT (FK) | References users |
| `seller_id` | TEXT (FK) | References users |
| `listing_id` | TEXT (FK) | Optional product link |
| `status` | ENUM | Active, Archived, Blocked |
| `last_message_preview` | TEXT | Preview for listing |
| `last_message_at` | TIMESTAMP | For sorting |
| `buyer_unread_count` | INTEGER | Unread count for buyer |
| `seller_unread_count` | INTEGER | Unread count for seller |

### Messages Table

| Column | Type | Description |
|--------|------|-------------|
| `message_id` | TEXT (UUID) | Primary key |
| `conversation_id` | TEXT (FK) | Parent conversation |
| `sender_id` | TEXT (FK) | Message sender |
| `content` | TEXT | Message content |
| `message_type` | ENUM | Text, Image, File, System |
| `attachment_url` | TEXT | For media messages |
| `status` | ENUM | Sent, Delivered, Read |
| `reply_to_message_id` | TEXT | For threading |

---

## API Endpoints

### REST API (HTTP)

Base URL: `/api/v1/chat`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/conversations` | Start or get conversation |
| `GET` | `/conversations/user/:userId` | Get user's conversations |
| `GET` | `/conversations/:id` | Get specific conversation |
| `POST` | `/conversations/:id/archive` | Archive conversation |
| `POST` | `/messages` | Send message via HTTP |
| `GET` | `/conversations/:id/messages` | Get message history |
| `POST` | `/conversations/:id/read` | Mark as read |
| `GET` | `/unread/:userId` | Get unread count |

### WebSocket API

Namespace: `/chat`

#### Client -> Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `userId: string` | Join user's room |
| `joinConversation` | `conversationId: string` | Join conversation room |
| `sendMessage` | `WsSendMessageDto` | Send a message |
| `typing` | `WsTypingDto` | Typing indicator |
| `markRead` | `WsMarkReadDto` | Mark messages read |

#### Server -> Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `newMessage` | `{ message, conversationId }` | New message received |
| `messageSent` | `{ message, conversationId }` | Confirmation |
| `userTyping` | `{ conversationId, userId, isTyping }` | Typing indicator |
| `messagesRead` | `{ conversationId, readBy }` | Read receipt |

---

## Implementation Details

### File Structure

```
src/modules/chat/
├── dto/
│   └── index.ts           # All DTOs
├── chat.module.ts         # Module definition
├── chat.controller.ts     # REST endpoints
├── chat.service.ts        # Business logic
├── chat.repository.ts     # Database access
└── chat.gateway.ts        # WebSocket gateway
```

### Key Features

1. **Real-time Messaging**: WebSocket for instant delivery
2. **Message Persistence**: All messages saved to database
3. **Unread Counts**: Tracked per-participant for efficiency
4. **Read Receipts**: Status changes emitted to senders
5. **Typing Indicators**: Broadcast to conversation participants
6. **Cursor Pagination**: Efficient loading of message history
7. **Multi-device Support**: Same user on multiple tabs/devices
8. **Product Context**: Link conversations to listings

---

## Scalability Considerations

### Current Architecture (Single Server)

- Works for small to medium traffic
- All WebSocket connections on one server
- SQLite handles read/write efficiently

### Scaling to Multiple Servers

For horizontal scaling, implement:

```typescript
// 1. Install Redis adapter
npm install @socket.io/redis-adapter redis

// 2. Configure in chat.gateway.ts
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();
this.server.adapter(createAdapter(pubClient, subClient));
```

### Database Scaling

| Level | Solution |
|-------|----------|
| **Medium** | Switch SQLite -> PostgreSQL |
| **Large** | Add read replicas |
| **Very Large** | Shard by conversation_id |

### Message Archival (Future)

For very high volume:
1. Keep recent messages (30 days) in primary table
2. Move older messages to `messages_archive` table
3. Query archive only when loading old history

---

## Client Implementation Example

### JavaScript/TypeScript

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/chat');

// Connect and join user's room
socket.on('connect', () => {
  socket.emit('join', currentUserId);
});

// Listen for new messages
socket.on('newMessage', ({ message, conversationId }) => {
  // Update UI with new message
  addMessageToChat(conversationId, message);
});

// Listen for typing indicators
socket.on('userTyping', ({ conversationId, userId, isTyping }) => {
  showTypingIndicator(conversationId, isTyping);
});

// Listen for read receipts
socket.on('messagesRead', ({ conversationId, readBy }) => {
  updateMessageStatus(conversationId, 'read');
});

// Send a message
function sendMessage(conversationId, content) {
  socket.emit('sendMessage', {
    conversationId,
    senderId: currentUserId,
    content,
  });
}

// Send typing indicator
function setTyping(conversationId, isTyping) {
  socket.emit('typing', {
    conversationId,
    userId: currentUserId,
    isTyping,
  });
}

// Mark messages as read
function markAsRead(conversationId) {
  socket.emit('markRead', {
    conversationId,
    userId: currentUserId,
  });
}
```

---

## Security Considerations

### Implemented

- Participant validation (only buyer/seller can message)
- Conversation existence checks

### Recommended for Production

1. **JWT Authentication**: Validate token on WebSocket connection
2. **Rate Limiting**: Prevent message flooding
3. **Content Moderation**: Filter inappropriate content
4. **Encryption**: TLS for transport, consider E2E for sensitive data

```typescript
// Example: JWT verification on connection
handleConnection(client: Socket) {
  const token = client.handshake.auth.token;
  try {
    const payload = this.jwtService.verify(token);
    client.data.userId = payload.sub;
  } catch {
    client.disconnect();
  }
}
```

---

## Testing

### Manual Testing with Postman/Insomnia

1. Start conversation:
```json
POST /api/v1/chat/conversations
{
  "buyerId": "buyer-uuid",
  "sellerId": "seller-uuid",
  "initialMessage": "Hi, is this still available?"
}
```

2. Get messages:
```
GET /api/v1/chat/conversations/{id}/messages?limit=20
```

### WebSocket Testing

Use Socket.IO test clients or browser console:
```javascript
const socket = io('http://localhost:3000/chat');
socket.emit('join', 'user-id');
socket.on('newMessage', console.log);
```

---

## Summary

The chat system provides a solid foundation for buyer-seller communication with:

- Real-time WebSocket messaging
- Full REST API for history and management
- Scalable database design
- Multi-device support
- Read receipts and typing indicators

For production deployment, add authentication middleware and consider Redis adapter for horizontal scaling.
