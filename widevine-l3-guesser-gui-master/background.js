var listeners = {};
var mpdurl = "";
var sourcedomain = "https://*";
chrome.tabs.onActivated.addListener( function(info) {
	var tabId = info.tabId;
	if (Object.keys(listeners).length === 0) {
		chrome.tabs.query({active: true,  currentWindow: true}, function(tabs) {
			var mytab = tabs[0]; 
			var currenturl = mytab.url;
			if(currenturl){
				var domain = (new URL(currenturl));
				sourcedomain = domain.origin;
			}
			//console.log(mytab);
		});
		listeners[tabId] = function(details) {
			//console.info("URL :" + details.url);
            if(details.url.indexOf(".mpd") != -1){
			   console.info("URL :" + details.url);
			   mpdurl = details.url;
			   chrome.cookies.set({ url: sourcedomain, name: "last_mpd", value: mpdurl });
			}
        };
        chrome.webRequest.onCompleted.addListener(listeners[tabId], {
            urls: ['<all_urls>'],
            tabId: tabId
        }, []);        
    }
});

chrome.tabs.onActiveChanged.addListener( function(tabId, info) {
	for (var x in listeners){
		if(!listeners[x].hasOwnProperty(tabId)){
			chrome.webRequest.onCompleted.removeListener(listeners[x]);
			delete listeners[x];
		} else{
			chrome.tabs.query({active: true,  currentWindow: true}, function(tabs) {
				var mytab = tabs[0]; 
				var currenturl = mytab.url;
				if(currenturl){
					var domain = (new URL(currenturl));
					sourcedomain = domain.origin;
				}
				//console.log(mytab);
			});
			listeners[tabId] = function(details) {
				//console.info("URL :" + details.url);
				if(details.url.indexOf(".mpd") != -1){
				   console.info("URL :" + details.url);
				   mpdurl = details.url;
				   chrome.cookies.set({ url: sourcedomain, name: "last_mpd", value: mpdurl });
				}
			};
			chrome.webRequest.onCompleted.addListener(listeners[tabId], {
				urls: ['<all_urls>'],
				tabId: tabId
			}, []);
		}
	}
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    if (listeners[tabId]) {
        chrome.webRequest.onCompleted.removeListener(listeners[tabId]);
        delete listeners[tabId];
    }
});