function log( text )
{
    var div = document.getElementById( 'log' );
    div.innerHTML += text;
    div.innerHTML += '<hr>';
}


function registerServiceWorker()
{
    if ( 'serviceWorker' in navigator )
    {
        const swOptions = { scope: "./", updateViaCache: 'none' }

        navigator.serviceWorker.register( '/sw.js', swOptions )
            .then( function ( registration )
            {
                log( 'Service worker successfully registered.' );

                return registration;
            } )
            .catch( function ( err )
            {
                log( 'Unable to register service worker.' )
                log( err )
            } );
    }
}


async function askPermission( registration )
{
    const persmission = await Notification.requestPermission();

    if ( persmission === 'granted' )
    {
        subscribeToPush( registration )
    } else
    {
        log( 'Permission denied for notifications. You have to enable notifications in browser' )
        throw new Error( 'permission denied for notifications' );
    }
}

async function sendNotification()
{
    if ( Notification.permission === "granted" )
    {

        const swRegistration
            = await navigator.serviceWorker.getRegistration();

        swRegistration.showNotification(
            'Notifications are working', {
            body: "This is an automatic test notification",
            icon: "icons/64x64.png",
            image: "icons/400x200.png"
        } );
        log( 'a test notification was sent' )
    }
    else
    {
        log( 'Permission for notifications are not granted' )
    }
}


// Example of a private and public pair of VAPID Keys
// Private key is secret
// private: KaEIigInUn6APxjKwzZbQd8REJ5rN_KrNzyFkwLQv48
// public: BNmkUvSn2ITltV0cbxE8PxDpE__NMZTtRHOrHc3H75u_cybdrBzrv1ROtVu0CBiduJXKOpFNTF8IVZXrqWnsKEk
async function subscribeToPush( registration )
{
    registerServiceWorker();

    const swRegistration
        = await navigator.serviceWorker.getRegistration();

    if ( !swRegistration )
    {
        log( 'Push notifications need Serviceworker' )
        throw new Error( 'Service worker must be registered before sending push notifications' );
    };

    const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: '<public key>',
    };

    swRegistration.pushManager

        .subscribe( subscribeOptions )
        .then( async ( pushSubscription ) =>
        {
            const obj = pushSubscription.toJSON()

            const endpoint = obj.endpoint;
            const expirationTime = obj.expirationTime;
            const auth = obj.keys.auth;
            const p256dh = obj.keys.p256dh;

            log( 'Notifications permission granted' );

            log( 'You will receive a test notification if everything is working' );

            // Send a notification for test
            await sendNotification();

            // Usually you will need to save the response in the Backend
            // To send messages you will need the VAPID Keys, auth and endpoint
            // (async () => {
            //   const rawResponse = await fetch(
            //   'http://127.0.0.1:3000', {
            //     method: 'POST',
            //     headers: {
            //       'Accept': 'application/json',
            //       'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //       endpoint, expirationTime, auth, p256dh
            //     })
            //   });
            //   const content = await rawResponse.json();

            //   log('Subscibed to Notifications');
            // })();
        } )
        .catch( ( error ) =>
        {
            log(
                'Error subscribing for notifications'
            );

            if ( error.code = 'InvalidCharacterError' )
            {
                log( 'Your public applicationServerKey is not in the right format' )
            }
            else 
            {
                log( error )
            }

            throw new Error( error );
        } )
}