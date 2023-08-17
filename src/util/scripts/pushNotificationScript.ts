function askForNotificationPermission() {
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        // Parse the query string from the URL
        const url = new URL(window.location.href);
        const queryParams = new URLSearchParams(url.search);
        const lang = navigator.language || navigator.userLanguage;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const { userAgent } = navigator;

        // geting device type
        let browser = '';
        if (userAgent.includes('Firefox')) {
          browser = 'Firefox';
        } else if (userAgent.includes('Chrome')) {
          browser = 'Chrome';
        } else if (userAgent.includes('Safari')) {
          browser = 'Safari';
        } else if (userAgent.includes('Edge')) {
          browser = 'Edge';
        } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
          browser = 'Opera';
        } else if (userAgent.includes('Mozilla')) {
          browser = 'Mozilla';
        } else if (userAgent.includes('Samsung')) {
          browser = 'Samsung';
        } else if (userAgent.includes('Android')) {
          browser = 'Android';
        } else if (userAgent.includes('UCBrowser')) {
          browser = 'UCBrowser';
        } else {
          browser = 'Unknown';
        }

        // getting device type
        const userAgentLowerCase = userAgent.toLowerCase();
        const isMobile = /iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(
          userAgentLowerCase,
        );
        const isTablet = /ipad|android|kindle/i.test(userAgentLowerCase);
        const isSmarttv = /smarttv|appletv|googletv|hbbtv|pov_tv|netcast|webos|roku|dlnadoc|roku|viera|boxee|kylo|yabrowser|kaltura/i.test(
          userAgentLowerCase,
        );
        const isConsole = /xbox|playstation/i.test(userAgentLowerCase);
        const isWearable = /android|ipod|iphone|symbian|blackberry|smartwatch/i.test(
          userAgentLowerCase,
        );
        const isEmbedded = /automotive|phantom/i.test(userAgentLowerCase);

        let deviceType = 'Desktop'; // Default to Desktop
        if (isMobile) {
          deviceType = 'Mobile';
        } else if (isTablet) {
          deviceType = 'Tablet';
        } else if (isSmarttv) {
          deviceType = 'Smarttv';
        } else if (isConsole) {
          deviceType = 'Console';
        } else if (isWearable) {
          deviceType = 'Wearable';
        } else if (isEmbedded) {
          deviceType = 'Embedded';
        }

        const os = navigator?.userAgentData?.platform;

        const requestBody: any = {
          feedId,
          lang,
          os,
          timezone,
          browser,
          deviceType,
        };

        // Iterate through all query parameters
        for (const [paramName, paramValue] of queryParams.entries()) {
          // Add each parameter to the request body
          requestBody[paramName] = paramValue;
        }

        // sub logic here
        fetch(`${PUSH_DATA?.SUBSCRIPTION_URL as string}`, {
          method: 'POST', // Specify the HTTP method
          headers: {
            Authorization: 'UPDATE_TOKEN',
            'Custom-Header': 'UPDATE_CUSTOM_VALUE',
            'Content-Type': 'application/json', // Specify the content type
          },
          body: JSON.stringify(requestBody), // Convert the body object to JSON
        }).catch((er) => {
          console.log(er);
        });
        // redirect logic here
        window.location.href = successUrl as string;
      } else if (permission === 'denied') {
        window.location.href = updateDeniedUrl as string;
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
