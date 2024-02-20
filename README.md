# Overview
This is a very **basic template** to install a PWA.<br>
Included is also a working example of a **push notification** that you can host
and test on a local environment.

# Requirements
For development you need to to Host the site on `localhost` or `127.0.0.1`
You can not use other IPs or domain names because localhost will have special
permissions<br>
You can host the files locally with Live Server (Plugin for Visual Studio code), apache, nginx or any other http server

Opening  file with `file://` will not work.

For a real Domain/production you need a valid TLS certificate
(host the site with `https://`)

# Service worker
The template include 2 variations of service worker. 

`sw_minimal.js` is the most basic service worker with only the neccessary functionality to install a PWA

`sw.js` includes workbox for more complex serivce workers


# Notifications
This template include example implementation for notifications. 
Notifications need a service worker and a permission to work. Browsers and 
devices will handle this different. The browser must be compatible with 
notifications and notifications also have to be activated in the OS.<br>
You can test if everything is working with the buttons provided<br>
The example has a debug log to better test mobile devices.<br>
In production you probably want to give the user a proper error Output and also
a guide to fix the problem.