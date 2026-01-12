# Message - Detail Specification

> **Module**: WS (Task from HQ)
> **Screen ID**: SCR_MESSAGE
> **Route**: `/tasks/messages`
> **Last Updated**: 2026-01-08

---

## 1. Conversation List - Detail

### 1.1 Search Bar

| Attribute | Value |
|-----------|-------|
| Type | Text input with search icon |
| Placeholder | "Search or start new chat" |
| Function | Search in Groups and Stores list |

### 1.2 Groups Section

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

## 2. Chat Area - Detail

### 2.1 Chat Header

| Component | Description | Notes |
|-----------|-------------|-------|
| Group Icon | Current chat group/store icon | Circular, pink |
| Chat Name | Chat name (e.g., "ALL STORES") | Large font, bold |
| Search Icon | Search within chat icon | Right corner |
| Menu Icon (...) | Chat options menu | Far right corner |

### 2.2 Message Area

| Component | Description | Notes |
|-----------|-------------|-------|
| Date Separator | Date separator (e.g., "Today") | Pink pill, centered |
| Message Bubble - Sent | Sent message | Pink background, right-aligned |
| Message Bubble - Received | Received message | White/gray background, left-aligned |
| Timestamp | Send time (e.g., "18:16") | Small text, bottom right corner |
| Read Receipt | Check icon or double check | Next to timestamp |

### 2.3 Message Input

| Component | Description | Notes |
|-----------|-------------|-------|
| Emoji Button | Emoji icon | Left of input |
| Text Input | Message input field | Placeholder: "Message" |
| Send Button | Send message button | Pink arrow icon, right side |

---

## 3. UI Components - Detail

### 3.1. ConversationList

- Search bar at top
- Groups section with collapsible header
- Individual store conversations
- Unread badge indicator
- Last message preview with timestamp

### 3.2. ChatHeader

- Back button (mobile)
- Group/Store avatar
- Chat name
- Search and menu icons

### 3.3. MessageBubble

- Sent messages (pink, right-aligned)
- Received messages (gray/white, left-aligned)
- Timestamp
- Read receipt icons

### 3.4. MessageInput

- Emoji picker button
- Text input field
- Send button

---

## 4. Message Styling - Detail

### 4.1 Sent Message Bubble

| Property | Value |
|----------|-------|
| Background | Pink (#C5055B) |
| Text Color | White |
| Border Radius | 16px 16px 0 16px |
| Alignment | Right |
| Max Width | 70% |

### 4.2 Received Message Bubble

| Property | Value |
|----------|-------|
| Background | White/Light Gray (#F5F5F5) |
| Text Color | Black |
| Border Radius | 16px 16px 16px 0 |
| Alignment | Left |
| Max Width | 70% |

### 4.3 Read Receipts

| Status | Icon | Color |
|--------|------|-------|
| Sent | Single check | Gray |
| Delivered | Double check | Gray |
| Read | Double check | Blue (#2196F3) |

---

## 5. API Endpoints - Detail

| Action | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| Get Conversations | GET | /api/v1/messages/conversations | Get conversation list |
| Get Messages | GET | /api/v1/messages/{conversationId} | Get messages of a conversation |
| Send Message | POST | /api/v1/messages | Send new message |
| Search Conversations | GET | /api/v1/messages/search?q={query} | Search conversations |
| Mark as Read | PUT | /api/v1/messages/{id}/read | Mark as read |

### 5.1 Get Conversations

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

### 5.2 Get Messages

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

### 5.3 Send Message

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

### 5.4 Search Conversations

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

### 5.5 Mark as Read

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

---

## 6. Schema Definitions

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

## 7. Real-time Features (PROD-ONLY)

| Feature | Description | Deploy |
|---------|-------------|--------|
| WebSocket Connection | Real-time message delivery | [PROD-ONLY] |
| Push Notifications | Notify when new message arrives | [PROD-ONLY] |
| Typing Indicator | Show when user is typing | [PROD-ONLY] |
| Online Status | Show user online/offline status | [PROD-ONLY] |

---

## 8. Files Reference

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

## 9. Test Scenarios

| Test Case | Scenario | Expected Result |
|-----------|----------|-----------------|
| Send message | Enter message → Click send | Message appears, input cleared |
| Send empty | Click send with empty input | Cannot send |
| Search conversation | Enter store name in search | Filter list correctly |
| Switch conversation | Click from ALL STORE to OCEAN PARK | Chat area loads correct conversation |
| Read receipt | Open conversation with unread messages | Badge disappears, messages marked as read |
| Long message | Send message > 500 characters | Message wraps correctly |
| Emoji | Send message with emoji | Emoji displays correctly |

---

## 10. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Desktop (>1024px) | Side-by-side layout: conversation list + chat area |
| Tablet (768-1024px) | Conversation list overlay or slide panel |
| Mobile (<768px) | Full-screen views: list → chat transition |

---

## 11. Changelog

| Date | Change |
|------|--------|
| 2025-12-31 | Initial specification created |
| 2025-12-31 | Implemented all UI components with mock data |
| 2026-01-06 | Restructured spec with Basic/Detail sections |
| 2026-01-08 | Split spec into basic and detail files |

---

## 12. Related Documents

| Document | Path |
|----------|------|
| Basic Spec | `docs/specs/basic/ws-message-basic.md` |
| Task List Basic | `docs/specs/basic/ws-task-list-basic.md` |

