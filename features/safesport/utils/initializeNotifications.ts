// SafeSport™ Notification Initialization Utility
// Auto-loads mock notifications for prototype testing

import { NotificationStore } from "../hooks/useNotifications";
import { mockNotifications } from "../data/notifications-data";

let initialized = false;

/**
 * Initialize notification store with mock data
 * Called automatically on first access to ensure all dashboards have test data
 */
export function initializeNotifications() {
  if (!initialized && typeof window !== "undefined") {
    if (NotificationStore.getAll().length === 0) {
      NotificationStore.setNotifications(mockNotifications);
      initialized = true;
      console.log("✓ SafeSport notifications initialized:", mockNotifications.length, "notifications loaded");
    }
  }
}

/**
 * Reset notifications (useful for testing)
 */
export function resetNotifications() {
  NotificationStore.setNotifications(mockNotifications);
  console.log("✓ SafeSport notifications reset");
}

// Auto-initialize on module load
if (typeof window !== "undefined") {
  initializeNotifications();
}
