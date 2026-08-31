# SafeSport Notification System - Testing Guide

## ✅ Auto-Initialization

Notifications are **automatically loaded** when any SafeSport dashboard is opened.

### How It Works

1. **Auto-load on first dashboard visit**: The `SafeSportSidebar` component automatically calls `initializeNotifications()` when mounted
2. **50+ sample notifications loaded**: Mock notifications for all 8 roles are loaded into the shared NotificationStore
3. **Persistent across navigation**: Notifications remain in memory as you navigate between dashboards
4. **Live unread counters**: Sidebar badges update automatically when notifications are marked as read

## 🎯 Testing Each Dashboard

### Test All 8 Roles

Navigate to each dashboard and verify notifications are visible:

1. **Clinician** - `/dashboard/safesport/clinician`
   - Should see "7 notifications loaded" badge
   - Sidebar shows "Notifications" with unread count (3)
   - Notifications: PPE due, AI review, incident, referral, reassessment, schedule, message

2. **Physiotherapist** - `/dashboard/safesport/physiotherapist`
   - Should see 5 notifications
   - Notifications: Screening ready, new referral, AI analysis, rehab session, appointment

3. **Coach** - `/dashboard/safesport/coach`
   - Should see 5 notifications
   - Notifications: Participation status, team event, incident ack, restriction, screening

4. **Institution** - `/dashboard/safesport/institution`
   - Should see 5 notifications
   - Notifications: PPE completion, readiness, referral status, injury trend, coverage

5. **Operations** - `/dashboard/safesport/operations`
   - Should see 5 notifications
   - Notifications: Event created, referral assignment, coverage issue, conflict, request

6. **Athlete** - `/dashboard/safesport/athlete`
   - Should see 5 notifications
   - Notifications: Assessment reminder, eligibility, rehab update, team event, message

7. **Guardian** - `/dashboard/safesport/guardian`
   - Should see 4 notifications
   - Notifications: Consent required, questionnaire, appointment, institution comm

8. **Sys Admin** - `/dashboard/safesport/sys-admin`
   - Should see 4 notifications
   - Notifications: User invitation, security alert, role change, system health

## 🔍 What to Verify

### In the Sidebar
- [ ] "Notifications" link shows unread count badge
- [ ] Badge displays correct number (varies by role)
- [ ] Badge uses SafeSport lime color (#72E34D)
- [ ] Badge disappears when all notifications are read

### In Notification Center (`/dashboard/safesport/notifications`)
- [ ] Page loads immediately (no loading spinner)
- [ ] Shows correct role-specific notifications
- [ ] Unread count displays in header
- [ ] Filter tabs work (All / Unread / Important)
- [ ] Search filters notifications
- [ ] Clicking notification marks it as read
- [ ] "Mark all as read" button works
- [ ] Unread badge updates in sidebar after marking read
- [ ] Click notification navigates to relevant page
- [ ] Empty state shows when no notifications match filters

### Privacy Boundaries
- [ ] Clinician sees full clinical notifications
- [ ] Coach only sees participation status (no medical details)
- [ ] Institution sees aggregate trends (no individual clinical data)
- [ ] Each role only sees their own notifications (no cross-role leakage)

## 🧪 Interactive Testing

### Test Marking as Read
1. Go to `/dashboard/safesport/notifications`
2. Note the unread count (e.g., "3 unread")
3. Click an unread notification (has green dot)
4. Notification should lose green dot and badge styling
5. Unread count should decrease
6. Check sidebar - badge number should decrease

### Test Mark All as Read
1. Navigate to notifications page
2. Click "Mark all as read" button
3. All notifications should lose unread styling
4. Unread count should become 0
5. Check sidebar - badge should disappear

### Test Filtering
1. Click "Unread" tab - should only show unread notifications
2. Click "Important" tab - should show important/urgent priorities
3. Click "All" tab - should show everything again

### Test Search
1. Type "Brian" in search box
2. Should show only notifications mentioning Brian Otieno
3. Clear search - should show all notifications again

## 🔄 Reset Notifications

If you need to reset to initial state:

```typescript
import { resetNotifications } from '@/features/safesport/utils/initializeNotifications';

// In browser console or code:
resetNotifications();
```

This reloads all 50+ mock notifications with original unread states.

## 📊 Notification Breakdown by Role

| Role            | Total | Unread | Categories |
|-----------------|-------|--------|------------|
| Clinician       | 7     | 3      | Assessment, AI Review, Incident, Referral, Clinical, Scheduling, Message |
| Physiotherapist | 5     | 3      | Screening, Referral, AI Review, Rehabilitation, Scheduling |
| Coach           | 5     | 3      | Eligibility (2), Team, Incident, Team |
| Institution     | 5     | 3      | Assessment, Clinical, Referral, Incident, Scheduling |
| Operations      | 5     | 3      | Scheduling (2), Referral, Scheduling, Institution |
| Athlete         | 5     | 2      | Assessment, Eligibility, Rehabilitation, Team, Message |
| Guardian        | 4     | 2      | Clinical, Assessment, Scheduling, Institution |
| Sys Admin       | 4     | 2      | Account, System (2), Account |

## 🚀 Production Notes

- **Remove Debug Badge**: Delete `NotificationDebugBadge` component and its import from `clinician/page.tsx`
- **Replace Mock Data**: Connect to real notification API endpoint
- **Add Real-time Updates**: Integrate WebSocket or Server-Sent Events
- **Persist Read State**: Save read/unread state to backend
- **Role from Auth**: Get `CURRENT_ROLE` from auth context instead of hardcoding

## 📁 Key Files

- `utils/initializeNotifications.ts` - Auto-initialization logic
- `hooks/useNotifications.ts` - Shared notification state
- `data/notifications-data.ts` - Mock notification data (50+ notifications)
- `components/notifications/` - UI components
- `app/(dashboard)/safesport/notifications/page.tsx` - Notification center

---

**Status**: ✅ All 8 dashboards auto-load sample notifications on first visit.
