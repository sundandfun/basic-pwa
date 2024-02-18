importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js'
);

// This is your Service Worker, you can put any of your custom Service Worker
// code in this file, above the `precacheAndRoute` line.

// When widget is installed/pinned, push initial state.
self.addEventListener( 'widgetinstall', ( event ) =>
{
    event.waitUntil( updateWidget( event ) );
} );

// When widget is shown, update content to ensure it is up-to-date.
self.addEventListener( 'widgetresume', ( event ) =>
{
    event.waitUntil( updateWidget( event ) );
} );

// When the user clicks an element with an associated Action.Execute,
// handle according to the 'verb' in event.action.
self.addEventListener( 'widgetclick', ( event ) =>
{
    if ( event.action == "updateName" )
    {
        event.waitUntil( updateName( event ) );
    }
} );

// When the widget is uninstalled/unpinned, clean up any unnecessary
// periodic sync or widget-related state.
self.addEventListener( 'widgetuninstall', ( event ) => { } );

const updateWidget = async ( event ) =>
{
    // The widget definition represents the fields specified in the manifest.
    const widgetDefinition = event.widget.definition;

    // Fetch the template and data defined in the manifest to generate the payload.
    const payload = {
        template: JSON.stringify( await ( await fetch( widgetDefinition.msAcTemplate ) ).json() ),
        data: JSON.stringify( await ( await fetch( widgetDefinition.data ) ).json() ),
    };

    // Push payload to widget.
    await self.widgets.updateByInstanceId( event.instanceId, payload );
}

const updateName = async ( event ) =>
{
    const name = event.data.json().name;

    // The widget definition represents the fields specified in the manifest.
    const widgetDefinition = event.widget.definition;

    // Fetch the template and data defined in the manifest to generate the payload.
    const payload = {
        template: JSON.stringify( await ( await fetch( widgetDefinition.msAcTemplate ) ).json() ),
        data: JSON.stringify( { name } ),
    };

    // Push payload to widget.
    await self.widgets.updateByInstanceId( event.instanceId, payload );
}


self.addEventListener( 'push', function ( event )
{
    if ( !( self.Notification && self.Notification.permission === "granted" ) )
    {
        return;
    }

    const data = event.data?.json() ?? {};

    const title = data.title || "Something Has Happened";
    const body = data.body || "";
    const tag = 'sadasdasd' + Math.random(); //replace with same name
    const icon = "https://developer.mozilla.org/favicon.ico";


    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag,
        })
    );



    // self.Notification.addEventListener( "click", () =>
    // {
    //     clients.openWindow(
    //         "https://example.blog.com/2015/03/04/something-new.html",
    //     );
    // } );



    //     // Returns string
    // event.data.text()

    // // Parses data as JSON string and returns an Object
    // event.data.json()

} );







workbox.precaching.precacheAndRoute( self.__WB_MANIFEST || [] );