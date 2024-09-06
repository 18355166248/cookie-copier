// listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
  chrome.pageAction.show(id);
  chrome.pageAction.setPopup({
    tabId: id,
    popup: 'popup.html',
  });
});
