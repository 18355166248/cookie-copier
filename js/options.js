function saveOptions() {
    var caseSensitive = document.getElementById("case-sensitive").checked;
    chrome.storage.sync.set({
        caseSensitive: caseSensitive
    }, function() {
        var status = document.getElementById("status");
        status.textContent = "选项已保存";
        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        caseSensitive: false
    }, function(items) {
        document.getElementById("case-sensitive").checked = items.caseSensitive;
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);