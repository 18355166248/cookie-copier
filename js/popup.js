const $hostInput = document.querySelector("#input");
$hostInput.value = localStorage.localHost || "http://localhost:3000";

document.querySelector("#copy-cookie").addEventListener("click", function () {
  const localHost = $hostInput.value || "http://localhost:3000";

  // 验证输入的URL格式
  if (!localHost.startsWith("http://") && !localHost.startsWith("https://")) {
    alert("请输入有效的URL地址，例如：http://localhost:3000");
    return;
  }

  localStorage.localHost = localHost;

  let successCount = 0;
  let errorCount = 0;

  // 复制 ops.test.ximalaya.com 的 cookies
  chrome.cookies.getAll(
    { domain: "ops.test.ximalaya.com" },
    function (allCookies) {
      if (chrome.runtime.lastError) {
        console.error("获取cookies失败:", chrome.runtime.lastError);
        errorCount++;
        return;
      }

      allCookies.forEach((cookie) => {
        if (
          cookie.name !== "JSESSIONID" &&
          cookie.name !== "_const_cas_ticket" &&
          cookie.name !== "CAS-TOKEN-BUSINESS"
        ) {
          return;
        }
        const newCookie = {
          name: cookie.name,
          path: cookie.path,
          value: cookie.value,
          url: localHost,
          domain: "localhost",
        };
        chrome.cookies.set(newCookie, function (err) {
          if (err) {
            console.log("设置cookie失败:", err);
            errorCount++;
          } else {
            successCount++;
          }
        });
      });
    }
  );

  // 复制 .ximaoa.com 的 cookies
  chrome.cookies.getAll({ domain: ".ximaoa.com" }, function (allCookies) {
    if (chrome.runtime.lastError) {
      console.error("获取cookies失败:", chrome.runtime.lastError);
      errorCount++;
      return;
    }

    allCookies.forEach((cookie) => {
      if (cookie.name !== "JSESSIONID" && cookie.name !== "_const_cas_ticket") {
        return;
      }

      const newCookie = {
        name: cookie.name,
        path: cookie.path,
        value: cookie.value,
        url: localHost,
        domain: "localhost",
      };
      chrome.cookies.set(newCookie, function (err) {
        if (err) {
          console.log("设置cookie失败:", err);
          errorCount++;
        } else {
          successCount++;
        }
      });
    });
  });

  // 复制 .ximalaya.com 的 cookies
  chrome.cookies.getAll({ domain: ".ximalaya.com" }, function (allCookies) {
    if (chrome.runtime.lastError) {
      console.error("获取cookies失败:", chrome.runtime.lastError);
      errorCount++;
      return;
    }

    allCookies.forEach((cookie) => {
      if (cookie.name !== "4&_token") {
        return;
      }
      const cookieValue = cookie.value;
      const newCookie = {
        name: "4&_token",
        path: "/",
        value: cookieValue,
        url: localHost,
        domain: "localhost",
      };
      chrome.cookies.set(newCookie, function (err) {
        if (err) {
          console.log("设置cookie失败:", err);
          errorCount++;
        } else {
          successCount++;
        }
      });
    });
  });

  // 延迟显示结果，确保所有操作完成
  setTimeout(() => {
    if (errorCount > 0) {
      alert(`复制完成！成功: ${successCount} 个，失败: ${errorCount} 个`);
    } else {
      alert("复制成功 o(￣▽￣)ｄ");
    }
  }, 1000);
});
