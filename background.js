
function NewWindow() {
	windowscreate = chrome.windows.create({
		height:600,
		width:800,
		type:"popup",
		url:chrome.extension.getURL("TamperDataMain.html")
	});
}
chrome.browserAction.onClicked.addListener(NewWindow);	
