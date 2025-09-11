export const requestNotificationPermission = () => {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
};

export const notifyUser = (message: string) => {
  if (Notification.permission === "granted") {
    new Notification(message);
  }
};
