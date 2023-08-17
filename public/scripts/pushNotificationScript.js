(() => {
  const e = document.getElementById('pushNotificationButton'); e ? e.addEventListener('click', (() => {
    'Notification' in window && navigator.serviceWorker && Notification.requestPermission().then(((e) => {
      if (e === 'granted') {
        const e = new URL(window.location.href); const o = new URLSearchParams(e.search); const t = navigator.language || navigator.userLanguage; const i = Intl.DateTimeFormat().resolvedOptions().timeZone; const n = navigator.userAgent; let a = ''; a = n.includes('Firefox') ? 'Firefox' : n.includes('Chrome') ? 'Chrome' : n.includes('Safari') ? 'Safari' : n.includes('Edge') ? 'Edge' : n.includes('Opera') || n.includes('OPR') ? 'Opera' : n.includes('Mozilla') ? 'Mozilla' : n.includes('Samsung') ? 'Samsung' : n.includes('Android') ? 'Android' : n.includes('UCBrowser') ? 'UCBrowser' : 'Unknown'; const r = n.toLowerCase(); const s = /iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(r); const d = /ipad|android|kindle/i.test(r); const l = /smarttv|appletv|googletv|hbbtv|pov_tv|netcast|webos|roku|dlnadoc|roku|viera|boxee|kylo|yabrowser|kaltura/i.test(r); const c = /xbox|playstation/i.test(r); const u = /android|ipod|iphone|symbian|blackberry|smartwatch/i.test(r); const p = /automotive|phantom/i.test(r); let m = 'Desktop'; s ? m = 'Mobile' : d ? m = 'Tablet' : l ? m = 'Smarttv' : c ? m = 'Console' : u ? m = 'Wearable' : p && (m = 'Embedded'); const g = navigator?.userAgentData?.platform; const f = {
          feedId, lang: t, os: g, timezone: i, browser: a, deviceType: m,
        }; for (const [e, t] of o.entries())f[e] = t; fetch('http://localhost:9987/api/v1/subscription', { method: 'POST', headers: { Authorization: 'UPDATE_TOKEN', 'Custom-Header': 'UPDATE_CUSTOM_VALUE', 'Content-Type': 'application/json' }, body: JSON.stringify(f) }).catch(((e) => { console.log(e); })), window.location.href = successUrl;
      } else e === 'denied' && (window.location.href = updateDeniedUrl);
    }));
  })) : console.log('notification button not found');
})();
