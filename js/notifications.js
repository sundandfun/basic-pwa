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


async function askPermission()
{
    const persmission = await Notification.requestPermission();

    if ( persmission === 'granted' )
    {
        subscribeToPush()
    } else
    {
        log( 'Permission denied for notifications. You have to enable notifications in browser' )
        throw new Error( 'permission denied for notifications' );
    }
}

async function revokePermission()
{
    const swRegistration = await navigator.serviceWorker.getRegistration();

    if ( !swRegistration )
    {
        log( 'to unsubscribe your need a service worker' )
        return false;
    }

    const pushSubscription = await swRegistration.pushManager.getSubscription()

    if ( !pushSubscription )
    {
        log( 'There is no subscription to revoke' )
        return false;
    }

    const unsub = await pushSubscription.unsubscribe()

    if ( unsub )
    {
        log( 'Permission to send notifications revoked' )
        await pushSubscriptionToServer( pushSubscription, false )
    }
    else
    {
        log( 'Could not unsubscribe' )
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
        log( 'Permission denied for notifications. You have to enable notifications in browser' )
        throw new Error( 'permission denied for notifications' );
    }
}


// Example of a private and public pair of VAPID Keys
// Private key is secret
// private: KaEIigInUn6APxjKwzZbQd8REJ5rN_KrNzyFkwLQv48
// public: BNmkUvSn2ITltV0cbxE8PxDpE__NMZTtRHOrHc3H75u_cybdrBzrv1ROtVu0CBiduJXKOpFNTF8IVZXrqWnsKEk
async function subscribeToPush()
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
            await pushSubscriptionToServer( pushSubscription, true )


            log( 'You will receive a test notification if everything is working' );

            // Send a notification for test
            await sendNotification();


        } )
        .catch( ( error ) =>
        {
            log(
                'Error subscribing for notifications'
            );

            if ( error.code == 'InvalidCharacterError' )
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

// Usually you will need to save the response in the Backend
// To send messages you will need the VAPID Keys, auth and endpoint
async function pushSubscriptionToServer( pushSubscription, status )
{
    const obj = pushSubscription.toJSON()

    const endpoint = obj.endpoint;
    const expirationTime = obj.expirationTime;
    const auth = obj.keys.auth;
    const p256dh = obj.keys.p256dh;

    log( 'Notifications synched to backend' );

    // await ( async () =>
    // {
    //     const rawResponse = await fetch(
    //         'http://localhost:3000', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify( {
    //             endpoint, expirationTime, auth, p256dh, status
    //         } )
    //     } );
    //     const serverResponse = await rawResponse.json();

    //     log( 'response saved to server' );
    //     log( serverResponse )
    // } )();
}