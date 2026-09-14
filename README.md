# Chronos Scheduler — Professional React Native App (Pure TypeScript)

A modern, high-performance mobile application designed for seamless daily scheduling, task tracking, and real-time reminders. Built with **React Native**, **Expo**, **React Navigation**, and **Pure TypeScript**.

---

## 🌟 Key Features

### 1. 📊 Dashboard Section
- **Metric Cards**: Real-time stats showing today's total activities, pending tasks, completion rate %, and high-priority items.
- **7-Day Interactive Selector**: Seamlessly jump between days of the week.
- **Interactive Schedule Timeline**: Vertical chronologically sorted timeline with color-coded nodes and instant one-tap completion toggle.
- **High-Priority Task Focus**: Highlights urgent/high-priority items for fast focus.
- **Category Breakdown Visualizer**: Visual distribution bar across work, meetings, health, study, finance, and personal tasks.

### 2. ✍️ Add New Activities Section
- **Form Inputs**: Title with validation, multi-line notes & agenda, custom location/link field.
- **Category Selector**: 7 predefined categories with dedicated icon and brand colors (`Work`, `Meeting`, `Study`, `Health`, `Personal`, `Finance`, `Other`).
- **Priority Selector**: 4 priority tiers (`Low`, `Medium`, `High`, `Urgent`) with color indicators.
- **Time & Date Range**: 24-hour start and end time inputs with automatic duration calculation.
- **Custom Tag Palette**: Color selection for customizable visual grouping.
- **Automated Notifications**: Toggling reminder automatically pushes an alert into the notifications center.

### 3. 📋 List All Activities Section
- **Live Search**: Instant keyword filtering across titles, notes, locations, and categories.
- **Quick Filters**: Filter by `All`, `Today`, `Upcoming`, `High Priority`, or `Completed`.
- **Full Activity Cards**: Display status, category badge, priority tag, scheduled date, 12-hour formatted time range, duration, location, and reminder icon.
- **In-Place Actions**:
  - Direct toggle status (Pending ↔ Completed).
  - In-place **Edit Activity Modal** for updating activity details on the fly.
  - Delete action with confirmation prompt.

### 4. 🔔 Top-Left Notifications Page
- **Quick Access**: Top-left bell button on headers with a live red unread counter badge.
- **Dedicated Notifications Center**:
  - Filter by `All` vs. `Unread`.
  - Batch actions: **Mark All as Read** and **Clear All**.
  - Categorized alert cards with relative timestamps (e.g. `15m ago`, `Just now`).
  - Delete individual notification items.

---

## 📁 Page-Wise File & App Structure

```
Adaptathon/
├── App.tsx                        # Main application container & theme provider
├── app.json                       # Expo configuration
├── index.ts                       # Expo root registration
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # Strict TypeScript configuration
└── src/
    ├── types/                     # Central TypeScript Interfaces
    │   ├── activity.ts            # Activity, Category, Priority, Metrics types
    │   ├── notification.ts        # AppNotification, NotificationType
    │   └── navigation.ts          # RootStackParamList, MainTabParamList
    ├── theme/                     # Design System & Styling Tokens
    │   ├── colors.ts              # Modern dark palette (Slate, Indigo, Cyan, Emerald)
    │   ├── typography.ts          # Font scale & weight tokens
    │   ├── spacing.ts             # Spacing, border radius, and glowing shadows
    │   └── theme.ts               # Theme aggregation
    ├── context/                   # Global State & Persistence
    │   ├── ActivityContext.tsx    # Activities CRUD, date queries, metric calculations
    │   └── NotificationContext.tsx# Notification queue, unread counters, batch actions
    ├── navigation/                # Navigation Layer
    │   ├── RootNavigator.tsx      # Native Stack (Tabs, Notifications, Detail view)
    │   ├── BottomTabNavigator.tsx # Custom styled 3-tab bottom navigation bar
    │   └── HeaderButtons.tsx      # Top-left Notification icon with live badge
    ├── screens/                   # Page-Wise Screens & Components
    │   ├── Dashboard/
    │   │   ├── DashboardScreen.tsx
    │   │   ├── components/
    │   │   │   ├── MetricCard.tsx
    │   │   │   ├── TodayScheduleTimeline.tsx
    │   │   │   ├── UpcomingActivitiesList.tsx
    │   │   │   └── CategoryDistribution.tsx
    │   │   └── styles.ts
    │   ├── AddActivity/
    │   │   ├── AddActivityScreen.tsx
    │   │   ├── components/
    │   │   │   ├── CategorySelector.tsx
    │   │   │   ├── PrioritySelector.tsx
    │   │   │   └── TagColorPicker.tsx
    │   │   └── styles.ts
    │   ├── ActivityList/
    │   │   ├── ActivityListScreen.tsx
    │   │   ├── components/
    │   │   │   ├── ActivityCard.tsx
    │   │   │   ├── FilterChips.tsx
    │   │   │   ├── SearchInput.tsx
    │   │   │   └── EditActivityModal.tsx
    │   │   └── styles.ts
    │   ├── Notifications/
    │   │   ├── NotificationsScreen.tsx
    │   │   ├── components/
    │   │   │   ├── NotificationItem.tsx
    │   │   │   └── EmptyNotifications.tsx
    │   │   └── styles.ts
    │   └── ActivityDetail/
    │       └── ActivityDetailScreen.tsx
    └── utils/
        ├── dateHelpers.ts         # Formatting, 12h conversion, duration, relative time
        ├── storage.ts             # AsyncStorage wrapper for offline persistence
        └── mockData.ts            # Realistic starter data for first launch
```

---

## 🚀 Getting Started

### 1. Start Development Server
```bash
npx expo start
```
- Press `i` to open in iOS Simulator (macOS).
- Press `a` to open in Android Emulator.
- Press `w` to open web preview.
- Or scan the QR code with **Expo Go** on your physical iOS/Android device.

### 2. Type Checking
```bash
npm run type-check
```
Ensures 100% type safety with pure TypeScript compiler.