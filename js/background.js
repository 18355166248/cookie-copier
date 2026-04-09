// Manifest V3 使用 service worker
// 监听扩展图标点击事件
chrome.action.onClicked.addListener(function (tab) {
  // 如果需要在特定页面才显示，可以在这里添加条件判断
  console.log("Extension icon clicked on tab:", tab.url);
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener(function (id, info, tab) {
  // 只在特定域名下启用扩展
  const allowedDomains = [
    "test.ximalaya.com",
    "ximaoa.com",
    "ad-ab.ximaoa.com",
    "ximalaya.com",
  ];

  if (tab.url && allowedDomains.some((domain) => tab.url.includes(domain))) {
    chrome.action.enable(id);
  } else {
    chrome.action.disable(id);
  }
});
