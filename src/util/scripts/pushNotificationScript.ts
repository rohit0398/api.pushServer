function askForNotificationPermission() {
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        const options = {
          title: 'UPDATE_TITLE',
          body: 'UPDATE_BODY',
        };

        new Notification(options.title, options);

        // sub logic here
        // Make a GET request with custom headers
        fetch('UPDATE_POSTBACK_URL', {
          headers: {
            Authorization: 'UPDATE_TOKEN',
            'Custom-Header': 'UPDATE_CUSTOM_VALUE',
          },
        })
          .catch((error) => {
            console.error('Fetch error:', error);
          });

        // redirect logic here
        window.location.href = 'UPDATE_SUCCESS_URL' as string;
      } else if (permission === 'denied') {
        window.location.href = 'UPDATE_DENIED_URL' as string;
      }
    });
  }
}

// Add event listener to the button
const pushNotificationButton = document.getElementById(
  'pushNotificationButton',
);
if (pushNotificationButton) {
  pushNotificationButton.addEventListener(
    'click',
    askForNotificationPermission,
  );
} else console.log('notification button not found');
