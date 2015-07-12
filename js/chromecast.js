var applicationID = 'B07518FC';
var namespace = 'urn:x-cast:com.google.cast.sample.helloworld';
var session = null;

/**
 * Call initialization for Cast
 */
window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
  if (loaded) {
    initializeCastApi();
  } else {
    console.log(errorInfo);
  }
}

/**
 * initialization
 */
function initializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};

/**
 * initialization success callback
 */
function onInitSuccess() {
  console.log("onInitSuccess");
}

/**
 * initialization error callback
 */
function onError(message) {
  console.log("onError: "+JSON.stringify(message));
}

/**
 * generic success callback
 */
function onSuccess(message) {
  consol.log("onSuccess: "+message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
  console.log('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
  console.log('New session ID:' + e.sessionId);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(namespace, receiverMessage);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive) {
  var message = isAlive ? 'Session Updated' : 'Session Removed';
  message += ': ' + session.sessionId;
  console.log(message);
  if (!isAlive) {
    session = null;
  }
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
  console.log("receiverMessage: "+namespace+", "+message);
};

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
  if( e === 'available' ) {
    console.log("receiver found");
  }
  else {
    console.log("receiver list empty");
  }
}

/**
 * stop app/session
 */
function stopApp() {
  session.stop(onStopAppSuccess, onError);
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage() {
  var message = $(".current").text();
  if (session!=null) {
    session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
  }
  else {
    chrome.cast.requestSession(function(e) {
        session = e;
        session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
      }, onError);
  }
}
