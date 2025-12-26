# OptiChain Mobile App

Flutter mobile application for OptiChain WS & DWS system (iOS & Android).

## Tech Stack

- **Framework**: Flutter 3.16+
- **Language**: Dart 3.0+
- **State Management**: Riverpod
- **HTTP Client**: Dio
- **Navigation**: GoRouter
- **Storage**: SharedPreferences

## Project Structure

```
mobile/
├── lib/
│   ├── screens/         # App screens/pages
│   ├── widgets/         # Reusable widgets
│   ├── models/          # Data models
│   ├── services/        # API services
│   ├── utils/           # Utilities and helpers
│   └── main.dart        # App entry point
├── assets/
│   ├── images/          # Image assets
│   └── fonts/           # Font files
└── pubspec.yaml         # Dependencies
```

## Setup

### 1. Install Flutter

Follow the official Flutter installation guide:
https://flutter.dev/docs/get-started/install

### 2. Install Dependencies

```bash
cd mobile
flutter pub get
```

### 3. Configuration

Create a config file for API endpoint:

```dart
// lib/utils/config.dart
class Config {
  static const String apiUrl = 'http://localhost:8000/api/v1';
  // For Android emulator use: http://10.0.2.2:8000/api/v1
  // For iOS simulator use: http://localhost:8000/api/v1
}
```

## Running the App

### Android

```bash
flutter run -d android
```

### iOS

```bash
flutter run -d ios
```

### Web (for testing)

```bash
flutter run -d chrome
```

## Building for Production

### Android APK

```bash
flutter build apk --release
```

### Android App Bundle

```bash
flutter build appbundle --release
```

### iOS

```bash
flutter build ios --release
```

## Features (Planned)

### WS - Work Schedule
- Task list and details
- Checklist management
- Push notifications
- Task completion tracking
- File/image upload

### DWS - Dispatch Work Schedule
- Shift calendar view
- Staff schedule overview
- Shift registration
- Schedule notifications

## Screens Structure

```
screens/
├── auth/            # Login, Register
├── home/            # Dashboard
├── tasks/           # Task management
├── shifts/          # Shift management
├── staff/           # Staff profile
└── settings/        # App settings
```

## State Management

Using Riverpod for state management:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final taskProvider = StateNotifierProvider<TaskNotifier, TaskState>((ref) {
  return TaskNotifier();
});
```

## API Integration

Using Dio for HTTP requests:

```dart
import 'package:dio/dio.dart';

final dio = Dio(BaseOptions(
  baseUrl: Config.apiUrl,
  headers: {'Content-Type': 'application/json'},
));
```

## Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage
```

## License

Proprietary - Aoi Sora Project
