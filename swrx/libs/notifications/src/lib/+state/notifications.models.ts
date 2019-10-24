/**
 * Interface for the 'Notifications' data
 */
export interface Notification {
  id: string | number;
  message: string;
  createUser?: string;
  targetUser?: string;
  created?: string;
  read?: string;
}
