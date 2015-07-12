//http://blog.matthewdfuller.com/2014/05/chromecast-development-tutorial-your.html

var session = null;

function initializeCastApi() {
  var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
    sessionListener,
    receiverListener);
  chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
}

function sessionListener(e) {
  session = e;
  console.log('New session');
  if (session.media.length != 0) {
    console.log('Found ' + session.media.length + ' sessions.');
  }
}

function receiverListener(e) {
  if (e === 'available') {
    console.log("Chromecast was found on the network.");
  } else {
    console.log("There are no Chromecasts available.");
  }
}

function onInitSuccess() {
  console.log("Initialization succeeded");
}

function onInitError() {
  console.log("Initialization failed");
}


function launchApp() {
  console.log("Launching the Chromecast App...");
  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) {
  console.log("Successfully created session: " + e.sessionId);
  session = e;
}

function onLaunchError() {
  console.log("Error connecting to the Chromecast.");
}

//media stuff

function onRequestSessionSuccess(e) {
  console.log("Successfully created session: " + e.sessionId);
  session = e;
  loadMedia();
}

function loadMedia() {
  if (!session) {
    console.log("No session.");
    return;
  }

  var mediaInfo = new
  chrome.cast.media.MediaInfo('http://i.imgur.com/mOnvOJG.png');
  mediaInfo.contentType = 'image/png';

  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.autoplay = true;

  session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess() {
  console.log('Successfully loaded image.');
}

function onLoadError() {
  console.log('Failed to load image.');
}

//stop
function stopApp() {
  console.log('attempting to stop');
  session.stop(onStopAppSuccess, onStopAppError);
}

function onStopAppSuccess() {
  console.log('Successfully stopped app.');
}

function onStopAppError() {
  console.log('Error stopping app.');
}
