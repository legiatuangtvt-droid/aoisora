# Message - Basic Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_MESSAGE
> **Route**: `/tasks/messages`
> **Last Updated**: 2026-01-08

---

## 1. Overview

| Field | Value |
|-------|-------|
| **Purpose** | Send messages to all stores or specific stores for task-related notifications and reminders |
| **Target Users** | HQ (Headquarter) Staff |
| **Entry Points** | Sidebar "Task list HQ-Store" > "Message" |

---

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View all conversations | I can see ongoing chats |
| US-02 | HQ Staff | Search for conversations | I can find specific stores |
| US-03 | HQ Staff | Send messages to all stores | I can broadcast announcements |
| US-04 | HQ Staff | Send messages to specific stores | I can communicate directly |
| US-05 | HQ Staff | View message history | I can see past communications |
| US-06 | HQ Staff | See read receipts | I know if messages were read |

---

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Conversation List | Left sidebar with Groups and individual store chats |
| Search Bar | Search conversations |
| Chat Area | Message history and input |
| Chat Header | Current conversation info |
| Message Input | Text input with emoji and send |

---

## 4. Screen Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────┬────────────────────────────────────────────────┐  │
│ │ Search...           │  ALL STORES              [Search] [Menu]       │  │
│ ├─────────────────────┼────────────────────────────────────────────────┤  │
│ │ Groups              │                                                │  │
│ │ ├─ ALL STORE        │                   Today                       │  │
│ │ └─ Unable to...     │  ┌──────────────────────────────────────┐      │  │
│ │                     │  │    Received message                  │      │  │
│ │ Stores              │  └──────────────────────────────────────┘      │  │
│ │ ├─ OCEAN PARK       │                                                │  │
│ │ ├─ ECO PARK         │  ┌──────────────────────────────────────┐      │  │
│ │ └─ HA NOI CENTER    │  │    Sent message              18:16 ✓✓│      │  │
│ │                     │  └──────────────────────────────────────┘      │  │
│ ├─────────────────────┼────────────────────────────────────────────────┤  │
│ │                     │  [Emoji] Message...                     [Send] │  │
│ └─────────────────────┴────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Navigation

| Action | Destination | Description |
|--------|-------------|-------------|
| Click Sidebar "Message" | `/tasks/messages` | Open Message screen |
| Click conversation in list | - | Load chat history |
| Click send button | - | Send message |
| Enter search text | - | Filter conversations |

---

## 6. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/messages/conversations` | Get conversation list |
| GET | `/api/v1/messages/{conversationId}` | Get messages |
| POST | `/api/v1/messages` | Send message |
| GET | `/api/v1/messages/search` | Search conversations |
| PUT | `/api/v1/messages/{id}/read` | Mark as read |

---

## 7. Implementation Status

| Feature | Backend | Frontend | Deploy | Notes |
|---------|---------|----------|--------|-------|
| Message Page | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Conversation List | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Chat Area | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Message Bubbles | - | ✅ Done | [DEMO] | UI only |
| Message Input | ⏳ Pending | ✅ Done | [DEMO] | Mock data |
| Real-time Updates | ⏳ Pending | ⏳ Pending | [PROD-ONLY] | WebSocket needed |
| Push Notifications | ⏳ Pending | ⏳ Pending | [PROD-ONLY] | - |
| API Integration | ⏳ Pending | ⏳ Pending | [DEMO] | - |

---

## 8. Message Types

| Type | Description |
|------|-------------|
| Groups | ALL STORE, Unable to complete |
| Stores | Individual store conversations |

---

## 9. Related Documents

| Document | Path |
|----------|------|
| Detail Spec | `docs/specs/ws/message-detail.md` |
| Task List Basic | `docs/specs/ws/task-list-basic.md` |
