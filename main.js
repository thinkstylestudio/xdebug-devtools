// Utilities
function log(...s) {
  var string = JSON.stringify(s);
  chrome.devtools.inspectedWindow.eval('console.log(' + string + ')');
};

let created = false;
let checkCount = 0;

// chrome.devtools.network.onNavigated.addListener(createPanelIfHasXdebug);
const checkXdebugInterval = setInterval(createPanelIfHasXdebug, 1000);
createPanelIfHasXdebug();

function createPanelIfHasXdebug() {
  if (created || checkCount++ > 10) {
    return;
  }
  chrome.devtools.inspectedWindow.eval(
    "!!(document.querySelectorAll('.xdebug-error').length)",
    function(hasXdebug) {
      if (!hasXdebug || created) {
        return;
      }
      clearInterval(checkXdebugInterval);
      created = true;
      chrome.devtools.panels.create('Xdebug', '', 'panel.html', function(panel) {
        var _window;
        var backgroundPageConnection = chrome.runtime.connect();
        backgroundPageConnection.onMessage.addListener(function(message) {
          // Handle responses from the background page, if any
          // log(message.type);
        });
        panel.onShown.addListener(function(window) {
          _window = window;
        });
        panel.onHidden.addListener(function() {
          // xdebug panel is unfocused
        });
      });
    }
  )
}