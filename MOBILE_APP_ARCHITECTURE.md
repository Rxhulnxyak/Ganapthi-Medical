# 📱 Ganapathi Medical - Mobile App Architecture & Design

This document outlines the architecture, design principles, and technical stack of the Ganapathi Medical Flutter application.

## 🏗️ 1. Technical Stack
- **Framework**: Flutter (Cross-platform)
- **State Management**: Provider (Simple & Scalable)
- **Backend Service**: Supabase (Auth, Real-time Database, Storage)
- **Design System**: Material 3 with Custom Premium Theme
- **Animations**: `animate_do`, `lottie`
- **Networking**: `http` & `supabase_flutter`

## 🎨 2. Design Principles
The app follows a **"Premium Medical"** aesthetic:
- **Cleanliness**: Heavy use of white/slate-50 backgrounds to feel clinical yet modern.
- **Trust**: Using `primaryBlue` (#2563EB) as the core brand color to evoke professionalism and reliability.
- **Micro-interactions**: Subtle entries and transitions (FadeIn, SlideIn) using `animate_do`.
- **Typography**: `GoogleFonts.outfit` for a clear, modern, and friendly tone.

## 📂 3. Folder Structure
```
mobile/
├── lib/
│   ├── core/           # Constants, App Themes, Global Config
│   ├── services/       # API, Supabase, Local Storage
│   ├── models/         # Data structures (Medicine, Order, User)
│   ├── screens/        # UI Views (Splash, Login, Home, etc.)
│   ├── widgets/        # Reusable UI components (Custom Buttons, Cards)
│   └── providers/      # State management logic
```

## 🔐 4. Core Features
### **A. Secure Authentication**
- Handled via `SupabaseService`.
- Persistent session: App checks for existing session on Splash Screen.
- Protected routes within the Flutter Navigator.

### **B. Medical Dashboard**
- Personalized greeting based on User Profile.
- Quick search for medicines.
- **Prescription Upload**: Direct camera/gallery integration for faster ordering.
- Categorized browsing for easy navigation.

### **C. Real-time Synchronization**
- Live updates for order status using Supabase Realtime.
- Instant feedback on stock levels.

## 🚀 5. Development & Build
### **Running Locally**
1.  Navigate to `mobile/`
2.  `flutter pub get`
3.  `flutter run`

### **Building for Android**
```bash
flutter build apk --debug  # For testing
flutter build apk --release # For production
```

### **Building for iOS**
```bash
flutter build ios
```

---
**Status**: Core Architecture implemented. UI screens for Auth and Home initialized with premium styles.
