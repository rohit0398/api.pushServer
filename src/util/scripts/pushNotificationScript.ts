function askForNotificationPermission() {
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // Subscription logic here
        window.location.href = PUSH_DATA?.PUSH_REDIRECTION_URL_SUCCESS as string;
      } else if (permission === 'denied') {
        window.location.href = PUSH_DATA?.PUSH_REDIRECTION_URL_DECLINE as string;
      }
    });
  }
}

// Add event listener to the button
const pushNotificationButton = document.getElementById('pushNotificationButton');
if (pushNotificationButton) {
  pushNotificationButton.addEventListener(
    'click',
    askForNotificationPermission,
  );
} else console.log('notification button not found');
