var extensionOption = getOptions();

// 获取扩展的设置选项
function getOptions() {
  var options = {
    caseSensitive: false,
  };
  chrome.storage.sync.get(
    {
      caseSensitive: false,
    },
    function (items) {
      options.caseSensitive = items.caseSensitive;
    }
  );
  return options;
}
