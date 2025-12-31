# MESSAGE SCREEN SPECIFICATION (SCR_MESSAGE)

---

## 1. GENERAL DESCRIPTION

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Screen Name | Message/Messenger Screen |
| 2 | Screen Code | SCR_MESSAGE |
| 3 | Target Users | HQ (Headquarter) Staff |
| 4 | Access Point | From Sidebar Menu: "Task list HQ-Store" → "Message" |

*Purpose: Screen for HQ to send messages to all stores or specific stores for task-related notifications and reminders.*

---

## 2. FUNCTIONAL SPECIFICATION

*Interface divided into 2 main areas: Left Sidebar (chat list) and Chat Area (right side).*

### A. Left Sidebar (Chat List)

#### A.1. Search Bar

| No | Attribute | Value |
|----|-----------|-------|
| 1 | Type | Text input with search icon |
| 2 | Placeholder | "Search or start new chat" |
| 3 | Function | Search in Groups and Stores list |

#### A.2. Groups Section

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Section Header | "Groups" | Bold text, black |
| 2 | ALL STORE | Chat group with all stores | "All" icon, pink |
| 3 | Store unable to complete | Group of stores unable to complete | "U" icon, pink |
| 4 | Group Avatar | Initial letter icon or group icon | Circular, pink background |
| 5 | Last Message Preview | Last message preview | Gray text, truncated |
| 6 | Timestamp | Last message time | Format: "Dec 12, 2025" |
| 7 | Read Status | Double check icon | Blue if read |

### B. Chat Area

#### B.1. Chat Header

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Group Icon | Current chat group/store icon | Circular, pink |
| 2 | Chat Name | Chat name (e.g., "ALL STORES") | Large font, bold |
| 3 | Search Icon | Search within chat icon | Right corner |
| 4 | Menu Icon (...) | Chat options menu | Far right corner |

#### B.2. Message Area

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Date Separator | Date separator (e.g., "Today") | Pink pill, centered |
| 2 | Message Bubble - Sent | Sent message | Pink background, right-aligned |
| 3 | Message Bubble - Received | Received message | White/gray background, left-aligned |
| 4 | Timestamp | Send time (e.g., "18:16") | Small text, bottom right corner |
| 5 | Read Receipt | Check icon or double check | Next to timestamp |

#### B.3. Message Input

| No | Component | Description | Notes |
|----|-----------|-------------|-------|
| 1 | Emoji Button | Emoji icon | Left of input |
| 2 | Text Input | Message input field | Placeholder: "Message" |
| 3 | Send Button | Send message button | Pink arrow icon, right side |

---

## 3. API INTEGRATION

| No | Action | Method | Endpoint | Description |
|----|--------|--------|----------|-------------|
| 1 | Get Conversations | GET | /api/v1/messages/conversations | Get conversation list |
| 2 | Get Messages | GET | /api/v1/messages/{conversationId} | Get messages of a conversation |
| 3 | Send Message | POST | /api/v1/messages | Send new message |
| 4 | Search Conversations | GET | /api/v1/messages/search?q={query} | Search conversations |
| 5 | Mark as Read | PUT | /api/v1/messages/{id}/read | Mark as read |

---

## 4. TEST SCENARIOS

| No | Test Case | Scenario | Expected Result |
|----|-----------|----------|-----------------|
| 1 | Send message | Enter message → Click send | Message appears, input cleared |
| 2 | Send empty | Click send with empty input | Cannot send |
| 3 | Search conversation | Enter store name in search | Filter list correctly |
| 4 | Switch conversation | Click from ALL STORE to OCEAN PARK | Chat area loads correct conversation |
| 5 | Read receipt | Open conversation with unread messages | Badge disappears, messages marked as read |

---

## 5. UI COMPONENTS

### 5.1. ConversationList
- Search bar at top
- Groups section with collapsible header
- Individual store conversations
- Unread badge indicator
- Last message preview with timestamp

### 5.2. ChatHeader
- Back button (mobile)
- Group/Store avatar
- Chat name
- Search and menu icons

### 5.3. MessageBubble
- Sent messages (pink, right-aligned)
- Received messages (gray/white, left-aligned)
- Timestamp
- Read receipt icons

### 5.4. MessageInput
- Emoji picker button
- Text input field
- Send button

---

## 6. FILE STRUCTURE

```
frontend/src/
├── app/
│   └── tasks/
│       └── messages/
│           └── page.tsx
├── components/
│   └── messages/
│       ├── ConversationList.tsx
│       ├── ConversationItem.tsx
│       ├── ChatArea.tsx
│       ├── ChatHeader.tsx
│       ├── MessageBubble.tsx
│       ├── MessageInput.tsx
│       └── DateSeparator.tsx
├── types/
│   └── messages.ts
└── data/
    └── mockMessages.ts
```

---

## CHANGELOG

| Date | Change |
|------|--------|
| 2025-12-31 | Initial specification created |
| 2025-12-31 | Implemented all UI components with mock data |
