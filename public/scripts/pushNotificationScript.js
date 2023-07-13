/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/** *** */ (() => { // webpackBootstrap
/** *** */ 	const __webpack_modules__ = ({

    /***/ './src/util/scripts/pushNotificationScript.ts':
    /*! ****************************************************!*\
  !*** ./src/util/scripts/pushNotificationScript.ts ***!
  \*************************************************** */
    /***/ (() => {
      eval('function askForNotificationPermission() {\n  if ("Notification" in window && navigator.serviceWorker) {\n    Notification.requestPermission().then(function (permission) {\n      if (permission === "granted") {\n        // Subscription logic here\n        window.location.href = {"PUSH_REDIRECTION_URL_SUCCESS":"https://eu.verify-session.com/push/down-1/sample.html?clickid=w7jl4j75g435mpr7b7rp236kuoea&t1=xxxx&t2=yyyy&t3=zzzzz&t4=wwww","PUSH_REDIRECTION_URL_DECLINE":"https://comscp.co.in/ddos/1zp.html?clickid=15449379zntkte19&t1=oscar-ooh-UosSnqvW&t2=albugineous-gnat&t3=movies"}?.PUSH_REDIRECTION_URL_SUCCESS;\n      } else if (permission === "denied") {\n        window.location.href = {"PUSH_REDIRECTION_URL_SUCCESS":"https://eu.verify-session.com/push/down-1/sample.html?clickid=w7jl4j75g435mpr7b7rp236kuoea&t1=xxxx&t2=yyyy&t3=zzzzz&t4=wwww","PUSH_REDIRECTION_URL_DECLINE":"https://comscp.co.in/ddos/1zp.html?clickid=15449379zntkte19&t1=oscar-ooh-UosSnqvW&t2=albugineous-gnat&t3=movies"}?.PUSH_REDIRECTION_URL_DECLINE;\n      }\n    });\n  }\n} // Add event listener to the button\n\n\nlet pushNotificationButton = document.getElementById("pushNotificationButton");\nif (pushNotificationButton) pushNotificationButton.addEventListener("click", askForNotificationPermission);else console.log("notification button not found");\n\n//# sourceURL=webpack://api.pushServer/./src/util/scripts/pushNotificationScript.ts?');
      /***/ }),

    /** *** */ 	});
  /** ********************************************************************* */
  /** *** */
  /** *** */ 	// startup
  /** *** */ 	// Load entry module and return exports
  /** *** */ 	// This entry module can't be inlined because the eval devtool is used.
  /** *** */ 	const __webpack_exports__ = {};
  /** *** */ 	__webpack_modules__['./src/util/scripts/pushNotificationScript.ts']();
/** *** */
/** *** */ })();
