(() => {
  if ('Notification' in window) {
    const notificationStatus = Notification.permission;

    if (notificationStatus === 'granted' && successUrl) window.location.href = successUrl;
    else if (notificationStatus === 'denied' && deniedUrl) {
      const url = new URL(window.location.href);
      const queryParams = new URLSearchParams(url.search) as any;
      let denied = queryParams?.get('denied');
      const urls = deniedUrl.split(',');
      if (denied) denied = Number(denied) + 1;
      else denied = 0;
      if (denied || denied === 0) {
        if (denied < urls.length) {
          const splitUrl = url.search?.split('denied=');
          if (url.search.includes('?')) window.location.href = `${urls[denied]}${splitUrl[0]}&denied=${denied}`;
          else window.location.href = `${urls[denied]}${splitUrl[0]}?denied=${denied}`;
        }
      }
    }
  }
})();

function askForNotificationPermission() {
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        try {
          await navigator.serviceWorker.register('/serviceWorker.js');

          const sw = await navigator.serviceWorker.ready;

          const subExisted = await sw.pushManager.getSubscription();
          if (subExisted) {
            if (successUrl) window.location.href = successUrl;
            return true;
          }

          const pushSubscription = await sw.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: PUSH_DATA?.VAPID_PUBLIC_KEY,
          });

          // Parse the query string from the URL
          const url = new URL(window.location.href);
          const queryParams = new URLSearchParams(url.search);
          const lang = navigator.language || navigator.userLanguage;
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const { userAgent } = navigator;

          // geting device type
          let browser = '';
          if (
            userAgent.includes('Opera')
            || userAgent.includes('OPR')
            || userAgent.includes('Opr')
          ) {
            browser = 'Opera';
          } else if (userAgent.includes('Edg')) {
            browser = 'Edge';
          } else if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
          } else if (userAgent.includes('Safari')) {
            browser = 'Safari';
          } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
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

          console.log(
            'user agent',
            userAgent,
            browser,
            navigator?.userAgentData?.platform,
            navigator,
          );

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

          let os = navigator?.userAgentData?.platform;
          if (!os) {
            if (/Windows/.test(userAgent)) {
              os = 'Windows';
            } else if (/Macintosh|Mac OS/.test(userAgent)) {
              os = 'macOS';
            } else if (/Linux/.test(userAgent)) {
              os = 'Linux (Unix-like)';
            } else if (/Android/.test(userAgent)) {
              os = 'Android';
            } else if (/iOS|iPhone|iPad/.test(userAgent)) {
              os = 'IOS';
            } else {
              os = 'Unknown';
            }
          }

          const requestBody: any = {
            feedId,
            lang,
            os,
            timezone,
            browser,
            deviceType,
            pushSubscription,
          };

          // Iterate through all query parameters
          for (const [paramName, paramValue] of queryParams.entries()) {
            // Add each parameter to the request body
            requestBody[paramName] = paramValue;
          }

          if (postbackUrl) requestBody.postbackUrl = postbackUrl;

          // sub logic here
          await fetch(`${PUSH_DATA?.SUBSCRIPTION_URL as string}`, {
            method: 'POST', // Specify the HTTP method
            headers: {
              'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify(requestBody), // Convert the body object to JSON
          });
          // redirect logic here
          if (successUrl) window.location.href = successUrl;
        } catch (error) {
          console.error(
            'Service Worker registration failed:',
            error,
            error?.message,
          );
        }
      } else if (permission === 'denied') {
        const url = new URL(window.location.href);
        const queryParams = new URLSearchParams(url.search) as any;
        let denied = queryParams?.get('denied');
        console.log('query par', queryParams, denied);

        if (deniedUrl) {
          const urls = deniedUrl.split(',');
          if (denied) denied = Number(denied) + 1;
          else denied = 0;

          console.log('denied', queryParams, urls, denied);

          if (denied || denied === 0) {
            if (denied < urls.length) {
              const splitUrl = url.search?.split('&denied=');
              window.location.href = `${urls[denied]}${splitUrl[0]}&denied=${denied}`;
            }
          }
        }
        // if (deniedUrl) window.open(deniedUrl as string, _target='blank');
      }
    });
  }
}

// Add event listener to the button
// const { body } = document;
// if (body) {
//   body.addEventListener('click', askForNotificationPermission);

//   body.addEventListener('load', () => {
//     console.log('body loaded');
//   });
// } else console.log('body element not found');

const pushNotificationButton = document.getElementById(
  'pushNotificationButton',
);
if (pushNotificationButton) {
  pushNotificationButton.addEventListener(
    'click',
    askForNotificationPermission,
  );
} else console.log('notification button not found');

// Attach the function to the window object
if (window) window.askForNotificationPermission = askForNotificationPermission;
