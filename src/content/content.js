chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  let AllScriptTags = document.querySelectorAll('script[src]');
  let AllStyleTags = document.querySelectorAll('link[rel=stylesheet][href]');

  if(msg.text == 'report_back') {
      // Call the specified callback, passing
      // the web-page's DOM content as argument
      const res = {
        AllScriptTags: [...AllScriptTags]?.map(el => {
          return {
            url: el.src,
            name: el.src?.split('/').pop(),
          }
        }), 
        AllStyleTags: [...AllStyleTags]?.map(el => {
          return {
            url: el.href,
            name: el.href?.split('/').pop(),
          }
        }),
      }
      
      sendResponse(res);
  }
});