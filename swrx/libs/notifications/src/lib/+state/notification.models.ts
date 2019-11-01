/**
 * Interface for the 'Notifications' data
 */
export interface Notification {
  id: string;
  message: string;
  createUser?: string;
  targetUser?: string;
  created?: string;
  read?: string;
}
