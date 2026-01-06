# Message Screen Specification

---

# BASIC SPEC

## 1. Overview

- **Module**: WS (Task from HQ)
- **Screen ID**: SCR_MESSAGE
- **Route**: `/tasks/messages`
- **Purpose**: Send messages to all stores or specific stores for task-related notifications and reminders
- **Target Users**: HQ (Headquarter) Staff

## 2. User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | HQ Staff | View all conversations | I can see ongoing chats |
| US-02 | HQ Staff | Search for conversations | I can find specific stores |
| US-03 | HQ Staff | Send messages to all stores | I can broadcast announcements |
| US-04 | HQ Staff | Send messages to specific stores | I can communicate directly |
| US-05 | HQ Staff | View message history | I can see past communications |
| US-06 | HQ Staff | See read receipts | I know if messages were read |

## 3. Screen Components Summary

| Component | Description |
|-----------|-------------|
| Conversation List | Left sidebar with Groups and individual store chats |
| Search Bar | Search conversations |
| Chat Area | Message history and input |
| Chat Header | Current conversation info |
| Message Input | Text input with emoji and send |

## 4. Screen Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────┬────────────────────────────────────────────────┐  │
│ │ Search...           │  ALL STORES              [🔍] [⋮]             │  │
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
│ │                     │  [😀] Message...                        [➤]   │  │
│ └─────────────────────┴────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

## 5. Navigation

| Action | Destination |
|--------|-------------|
| Click Sidebar "Task list HQ-Store" > "Message" | `/tasks/messages` |
| Click conversation in list | Load chat history |
| Click send button | Send message |
| Enter search text | Filter conversations |

## 6. API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/messages/conversations` | GET | Get conversation list |
| `/api/v1/messages/{conversationId}` | GET | Get messages |
| `/api/v1/messages` | POST | Send message |
| `/api/v1/messages/{id}/read` | PUT | Mark as read |

## 7. Implementation Status

| Feature | Backend | Frontend | Notes |
|---------|---------|----------|-------|
| Message Page | ⏳ Pending | ✅ Done | Mock data |
| Conversation List | ⏳ Pending | ✅ Done | Mock data |
| Chat Area | ⏳ Pending | ✅ Done | Mock data |
| Message Bubbles | - | ✅ Done | UI only |
| Message Input | ⏳ Pending | ✅ Done | Mock data |
| API Integration | ⏳ Pending | ⏳ Pending | - |

---

# DETAIL SPEC

## 8. Conversation List - Detail

### 8.1 Search Bar

| Attribute | Value |
|-----------|-------|
| Type | Text input with search icon |
| Placeholder | "Search or start new chat" |
| Function | Search in Groups and Stores list |

### 8.2 Groups Section

| Component | Description | Notes |
|-----------|-------------|-------|
| Section Header | "Groups" | Bold text, black |
| ALL STORE | Chat group with all stores | "All" icon, pink |
| Store unable to complete | Group of stores unable to complete | "U" icon, pink |
| Group Avatar | Initial letter icon or group icon | Circular, pink background |
| Last Message Preview | Last message preview | Gray text, truncated |
| Timestamp | Last message time | Format: "Dec 12, 2025" |
| Read Status | Double check icon | Blue if read |

---

## 9. Chat Area - Detail

### 9.1 Chat Header

| Component | Description | Notes |
|-----------|-------------|-------|
| Group Icon | Current chat group/store icon | Circular, pink |
| Chat Name | Chat name (e.g., "ALL STORES") | Large font, bold |
| Search Icon | Search within chat icon | Right corner |
| Menu Icon (...) | Chat options menu | Far right corner |

### 9.2 Message Area

| Component | Description | Notes |
|-----------|-------------|-------|
| Date Separator | Date separator (e.g., "Today") | Pink pill, centered |
| Message Bubble - Sent | Sent message | Pink background, right-aligned |
| Message Bubble - Received | Received message | White/gray background, left-aligned |
| Timestamp | Send time (e.g., "18:16") | Small text, bottom right corner |
| Read Receipt | Check icon or double check | Next to timestamp |

### 9.3 Message Input

| Component | Description | Notes |
|-----------|-------------|-------|
| Emoji Button | Emoji icon | Left of input |
| Text Input | Message input field | Placeholder: "Message" |
| Send Button | Send message button | Pink arrow icon, right side |

---

## 10. UI Components - Detail

### 10.1. ConversationList

- Search bar at top
- Groups section with collapsible header
- Individual store conversations
- Unread badge indicator
- Last message preview with timestamp

### 10.2. ChatHeader

- Back button (mobile)
- Group/Store avatar
- Chat name
- Search and menu icons

### 10.3. MessageBubble

- Sent messages (pink, right-aligned)
- Received messages (gray/white, left-aligned)
- Timestamp
- Read receipt icons

### 10.4. MessageInput

- Emoji picker button
- Text input field
- Send button

---

## 11. API Endpoints - Detail

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get Conversations | GET | /api/v1/messages/conversations | Get conversation list |
| Get Messages | GET | /api/v1/messages/{conversationId} | Get messages of a conversation |
| Send Message | POST | /api/v1/messages | Send new message |
| Search Conversations | GET | /api/v1/messages/search?q={query} | Search conversations |
| Mark as Read | PUT | /api/v1/messages/{id}/read | Mark as read |

### 11.1 Get Conversations

```yaml
get:
  tags:
    - WS-Messages
  summary: "Get Conversations API"
  description: |
    # Business Logic
      ## 1. Get Groups
        ### Select Columns
          - conversation_groups.id, conversation_groups.name
          - conversation_groups.type (all_stores, unable_to_complete)
          - MAX(messages.created_at) as last_message_at
          - COUNT(unread) as unread_count

        ### Search Conditions
          - conversation_groups.user_id = authenticated_user

      ## 2. Get Store Conversations
        ### Select Columns
          - stores.id, stores.name
          - last_message preview
          - unread_count

        ### Order By
          - last_message_at DESC

      ## 3. Response
        - Return groups and store conversations

  operationId: getConversations
  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              groups:
                - id: 1
                  name: "ALL STORE"
                  type: "all_stores"
                  icon: "All"
                  lastMessage: "Reminder: Complete weekly report"
                  lastMessageAt: "2025-12-12"
                  unreadCount: 0
                - id: 2
                  name: "Unable to complete"
                  type: "unable_to_complete"
                  icon: "U"
                  lastMessage: "Store XYZ cannot complete task"
                  lastMessageAt: "2025-12-11"
                  unreadCount: 3
              stores:
                - id: 1
                  name: "OCEAN PARK"
                  lastMessage: "Task completed"
                  lastMessageAt: "2025-12-10"
                  unreadCount: 0
                - id: 2
                  name: "ECO PARK"
                  lastMessage: "Need assistance"
                  lastMessageAt: "2025-12-09"
                  unreadCount: 2
```

### 11.2 Get Messages

```yaml
get:
  tags:
    - WS-Messages
  summary: "Get Messages API"
  description: |
    # Business Logic
      ## 1. Get Messages
        ### Select Columns
          - messages.id, messages.content, messages.type
          - messages.created_at, messages.is_read
          - sender.id, sender.full_name, sender.avatar_url

        ### Search Conditions
          - messages.conversation_id = {conversationId}

        ### Order By
          - messages.created_at ASC

      ## 2. Mark as Read
        - Auto mark messages as read when fetched

      ## 3. Response
        - Return messages with sender info

  operationId: getMessages
  parameters:
    - name: conversationId
      in: path
      required: true
      schema:
        type: string
      description: Conversation ID (group or store)

    - name: page
      in: query
      required: false
      schema:
        type: integer
        default: 1

    - name: per_page
      in: query
      required: false
      schema:
        type: integer
        default: 50

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              conversation:
                id: "all_stores"
                name: "ALL STORES"
                type: "group"
              messages:
                - id: 1
                  content: "Hello everyone"
                  type: "received"
                  sender:
                    id: 10
                    name: "Store Manager"
                    avatar: "/avatars/10.jpg"
                  createdAt: "2025-12-12T10:00:00Z"
                  isRead: true
                - id: 2
                  content: "Reminder for weekly task"
                  type: "sent"
                  createdAt: "2025-12-12T18:16:00Z"
                  isRead: true
                  readReceipt: "read"
            meta:
              currentPage: 1
              totalPages: 3
```

### 11.3 Send Message

```yaml
post:
  tags:
    - WS-Messages
  summary: "Send Message API"
  description: |
    # Correlation Check
      - conversation_id: Must exist
      - content: Required, non-empty

    # Business Logic
      ## 1. Validate Input
        - Check conversation exists
        - Check user has access

      ## 2. Create Message
        - Insert into messages table
        - Set sender_id = authenticated_user

      ## 3. Notify Recipients
        - Send push notification to recipients
        - Update conversation last_message_at

      ## 4. Response
        - Return created message

  operationId: sendMessage
  requestBody:
    required: true
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/SendMessageRequest"
        example:
          conversation_id: "all_stores"
          content: "Please complete the weekly report by Friday"

  responses:
    201:
      description: Created
      content:
        application/json:
          example:
            success: true
            data:
              id: 100
              content: "Please complete the weekly report by Friday"
              createdAt: "2025-12-12T18:20:00Z"
            message: "Message sent successfully"

    400:
      description: Bad Request
      content:
        application/json:
          example:
            success: false
            message: "Message content is required"
```

### 11.4 Search Conversations

```yaml
get:
  tags:
    - WS-Messages
  summary: "Search Conversations API"
  description: |
    # Business Logic
      ## 1. Search Groups
        - Search by group name

      ## 2. Search Stores
        - Search by store name

      ## 3. Response
        - Return matching conversations

  operationId: searchConversations
  parameters:
    - name: q
      in: query
      required: true
      schema:
        type: string
        minLength: 2
      description: Search query

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            data:
              groups: []
              stores:
                - id: 1
                  name: "OCEAN PARK"
                  lastMessage: "Task completed"
```

### 11.5 Mark as Read

```yaml
put:
  tags:
    - WS-Messages
  summary: "Mark Message as Read API"
  description: |
    # Business Logic
      ## 1. Update Message
        - Set is_read = true
        - Set read_at = now

      ## 2. Response
        - Return success

  operationId: markAsRead
  parameters:
    - name: id
      in: path
      required: true
      schema:
        type: integer
      description: Message ID

  responses:
    200:
      description: OK
      content:
        application/json:
          example:
            success: true
            message: "Message marked as read"
```

### 11.6 Schema Definitions

```yaml
components:
  schemas:
    SendMessageRequest:
      type: object
      required:
        - conversation_id
        - content
      properties:
        conversation_id:
          type: string
        content:
          type: string
          maxLength: 2000

    MessageResponse:
      type: object
      properties:
        id:
          type: integer
        content:
          type: string
        type:
          type: string
          enum: [sent, received]
        sender:
          type: object
          properties:
            id:
              type: integer
            name:
              type: string
            avatar:
              type: string
        createdAt:
          type: string
          format: date-time
        isRead:
          type: boolean
        readReceipt:
          type: string
          enum: [sent, delivered, read]

    ConversationResponse:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        type:
          type: string
          enum: [group, store]
        icon:
          type: string
        lastMessage:
          type: string
        lastMessageAt:
          type: string
          format: date
        unreadCount:
          type: integer
```

---

## 12. Files Reference

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

## 13. Test Scenarios

| Test Case | Scenario | Expected Result |
|-----------|----------|-----------------|
| Send message | Enter message → Click send | Message appears, input cleared |
| Send empty | Click send with empty input | Cannot send |
| Search conversation | Enter store name in search | Filter list correctly |
| Switch conversation | Click from ALL STORE to OCEAN PARK | Chat area loads correct conversation |
| Read receipt | Open conversation with unread messages | Badge disappears, messages marked as read |

---

## 14. Changelog

| Date | Change |
|------|--------|
| 2025-12-31 | Initial specification created |
| 2025-12-31 | Implemented all UI components with mock data |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
