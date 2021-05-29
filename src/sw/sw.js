/**
 * Author https://github.com/freelance-solutions Tweeter @blueitserver
 * Service Worker will handle all the client requests and messages to and from the application
 *
 */
/*******************************************************************************/

const OFFLINE_VERSION = 1;
const CACHE_NAME = 'pinoydesk-client';
const website_base_url = 'https://client.pinoydesk.com';

// Customize this with a different URL if needed.
const CACHE_URLS = ['/','/about','/contact','/dashboard'];
// ***********************************************************************************************//
// Global Variable to hold the value of the authorization token
let auth_token = "";

let mem_store  ={
    _cache_store : [],
    init : function(){
        // initialize the store
        this.sync_from_storage(CACHE_NAME).catch(response => {
            response.forEach(cache_item => {
                this.add_to_store(cache_item.url,cache_item.response).then(response => {
                    console.log("created new storage item ", response)
                    // TODO- add mem
                })
            })
        }).catch(error => {
            console.log("error catching from storage :", error.message);
        })
    },
    is_in_store: async function( url){
        return this._cache_store.findIndex(store => store.url === url);
    },

    add_to_store: async function(url,response){
        this.is_in_store(url).then(index => {
            if (index < 0){
                this._cache_store.push({url,response})
            }
        })
    },

    fetch_from_store: async function( url){
        this.is_in_store(url).then(index => {
            if (index > 0){
                return this._cache_store[index]
            }
            return ""
        })
    },

    sync_to_storage: async function(){
        // TODO- finish up storage sync
    },
    sync_from_storage: async function(cache){
        // TODO finish up storage sync
    },
}

mem_store.init();
let cache = self.caches;
// NOTE: Installing Service worker
self.addEventListener('install',  (event) => {
    event.waitUntil((async () => {
        try {
            cache = await cache.open(CACHE_NAME);
            await cache.addAll(CACHE_URLS);
        } catch (e) {
            console.log('error caching urls', e.message);
        }
    })());
});

// Activating Worker
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            try {await self.registration.navigationPreload.enable();}catch(e){console.log(e.message)}
        }
    })());

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim().then(response => {
        console.log("all client URL claimed")
    })
});

// Listening to fetch events to handle requests and Authorization
// TODO- consider using the fetch event handler to dispatch messages back to the page triggering the events
self.addEventListener('fetch', (event) => {
    // Checks if the request is included in our cache if yes returns the cached request
    let check_cache_hit = async event => {
        let matched_response = cache.match(event.request);
        if (matched_response){return matched_response}else{await cache.add(event.request); return false}
    }
    // handling fetch events
    let request_url = String(event.request.url);
    // console.log('request url', request_url);

    if (event.request.method === "POST"){
        // NOTE- This handles adding auth headers to request
        return event.respondWith( (async () => await fetch(event.request))())
    }
    if  (event.request.method === "DELETE"){
        // NOTE- This handles adding auth headers to request
        return event.respondWith( (async () => await fetch(event.request))())
    }
    if (event.request.method === "PUT"){
        // NOTE- This handles adding auth headers to request
        return event.respondWith( (async () => await fetch(event.request))())
    }
    // if its service worker request fetch a fresh copy
    if  ((event.request.method === "GET") && (request_url.includes('sw.js'))) {
        return event.respondWith( (async () => await fetch(event.request))())
    }
    // if its for static assets fetch first from cache if failed fetch fresh copy
    if ((event.request.method === "GET") && (request_url.includes('static'))){
        return event.respondWith((async () => {return  await event.preloadResponse || await check_cache_hit(event) || await fetch(event.request)})())
    }
    // if its a GET request to another domain fetch a fresh copy
    // if its service worker request fetch a fresh copy
    if ((event.request.method === "GET") && (!request_url.includes(website_base_url))){
        return event.respondWith( (async () => await fetch(event.request))())
    }
    // all other requests fetch securely from backend
    return event.respondWith((async () => {return  await handle_auth_headers(event)})())
});
// NOTE: This is where i actually insert auth headers
let handle_auth_headers = async event => {
    let headers = new Headers();
    event.request.headers.forEach((val, key) => {
        headers.append(key, val);
    });
    // Add ID token to header.
    headers.append("x-access-token", auth_token);
    console.log("Auth-Token Inserted on Headers : ", auth_token);
    // always user cors in order to enable headers modification
    let request = new Request(event.request.url, {
        method: event.request.method,
        headers: headers,
        mode: "cors",
        credentials: event.request.credentials,
        cache: event.request.cache,
        redirect:event.request.redirect,
        referrer: event.request.referrer,
        body: event.request.body,
        bodyUsed: event.request.bodyUsed,
        context: event.request.context
    });
    console.log("fetching this request securely", request.url);
    return await fetch(request);
}
//********************************************************************************************* */
// Message Dispatcher
async function fetch_site_secret(){
    let init_post = {
        method: "POST",
        mode:"cors",
        credentials: "same-origin",
        headers: new Headers({'content-type':'application/json'})
    }
    let request = new Request("/site-secret",init_post)
    let response = await fetch(request)
    let json_data = await response.json()
    return json_data['secret']
}
let messaging = {
    // This handler should handle all communication from the app to the
    // service worker -> from the service worker to the outside world
    messages_handler : async function(e){
        this.dispatch_message_to_sender = function(e, message){e.source.postMessage(message)};
        let temp_auth;
        if (e.data && e.data.type === "auth-token") {
            // console.log("setting token", e.data.token);
            temp_auth = e.data.token;
            if ((temp_auth !== "") && (temp_auth !== null) && (temp_auth !== "undefined") && (temp_auth !== "null")) {
                auth_token = temp_auth;
                console.log('Auth token', auth_token)
                this.dispatch_message_to_sender(e, {type: "auth-token", message: "Token-Received"});
                this.dispatch_message_to_sender(e, {type: "auth-status", status: "logged-in", token: auth_token});
            } else {
                auth_token = "";
                this.dispatch_message_to_sender(e, {type: "auth-token", message: "Not-Logged-IN"})
            }
        }
        if (e.data && e.data.type === "auth-status"){
            if (e.data.status === "sign-out"){
                auth_token = "";
                this.dispatch_message_to_sender(e,{type: "auth-status", status: "logged-out"})
            }
        }
        if(e.data && e.data.type === "user-messages"){
            const process_request = async request => {
                let response = await fetch(request)
                if (response.ok){
                    let response_data = await response.json()
                    let visitors = parseInt(response_data['payload']['visitors'])
                    let return_visitors = parseInt(response_data['payload']['return_visitors'])

                    this.dispatch_message_to_sender(e,{
                        type:"user-messages",
                        status: "counted",
                        unique_visitors: visitors,
                        return_visitors: return_visitors
                    })
                }
            }
            switch(e.data.status){
                case "count-unique":{
                    let secret = await fetch_site_secret()
                    let headers = new Headers({'x-secret-token': secret})
                    let init_get = {
                        method:"GET",
                        headers: headers
                    }
                    let request = new Request('/unique-visitor',init_get)
                    process_request(request).then()
                } break;
                case "count-return":{
                    let secret = await fetch_site_secret()
                    let headers = new Headers({'x-secret-token': secret})
                    let init_get = {
                        method:"GET",
                        headers: headers
                    }
                    let request = new Request('/return-visitor',init_get)
                    let response = await fetch(request)
                    process_request(request).then()
                }break;

                case "page-view":{
                    let secret = await fetch_site_secret()
                    let headers = new Headers({'x-secret-token': secret})
                    let init_get = {
                        method:"GET",
                        headers: headers
                    }
                    let request = new Request('/page-view',init_get)
                    let response = await fetch(request)
                    if (response.ok){
                        let response_data = await response.json()
                        let page_views = parseInt(response_data['page_views'])
                        this.dispatch_message_to_sender(e, {
                            type: "user-messages",
                            status:"page-view",
                            page_views: page_views
                        })
                    }
                }
            }
        }
    },
    //**********************************************************************************************//
    // PUSH Messages Handler
    push_handler : function(e){
        console.log("push dispatching here");
        // let json_message = e.data.json();
        // let blob_data = e.data.blob();
        let text_message = e.data.text();
        // console.log("json", json_message);
        // console.log("blob", blob_data);
        console.log('text message', text_message);
    },

    // TODO- dispatch PUSH Messages to App.js push message handler
    // The handler should decipher the message and decide as to where its destined
    //********************************************************************************************* */
    // Sync messages handlers
    sync_handler : function(e){
        console.log("SYNC DISPATCHER", e);
    },
    init : function(){
        self.addEventListener('message', this.messages_handler);
        self.addEventListener('sync', this.sync_handler);
        self.addEventListener('push', this.push_handler);
    }
}

messaging.init();
