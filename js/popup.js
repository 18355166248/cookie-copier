const COOKIE_SOURCES = [
  {
    domain: "ops.test.ximalaya.com",
    names: ["JSESSIONID", "_const_cas_ticket", "CAS-TOKEN-BUSINESS"],
  },
  {
    domain: ".ximaoa.com",
    names: ["JSESSIONID", "_const_cas_ticket"],
  },
  {
    domain: "ad-ab.ximaoa.com",
    names: ["JSESSIONID", "_const_cas_ticket"],
  },
  {
    domain: ".ximalaya.com",
    names: null, // 全量复制
  },
];

function getCookies(domain) {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain }, (cookies) => {
      if (chrome.runtime.lastError) {
        console.error("获取cookies失败:", chrome.runtime.lastError);
        resolve([]);
      } else {
        resolve(cookies);
      }
    });
  });
}

function setCookie(cookie) {
  return new Promise((resolve) => {
    chrome.cookies.set(cookie, (result) => resolve(!!result));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const $input = document.querySelector("#input");
  const $btn = document.querySelector("#copy-cookie");
  const $status = document.querySelector("#status");

  $input.value = localStorage.localHost || "http://localhost:3000";

  $btn.addEventListener("click", async () => {
    const localHost = $input.value.trim() || "http://localhost:3000";

    if (!localHost.startsWith("http://") && !localHost.startsWith("https://")) {
      showStatus("请输入有效的 URL，例如：http://localhost:3000", "error");
      return;
    }

    localStorage.localHost = localHost;
    $btn.disabled = true;
    showStatus("复制中…", "loading");

    let successCount = 0;
    let errorCount = 0;
    const targetDomain = new URL(localHost).hostname;
    // 用 key 去重，避免多个 source 重复写同一个 cookie
    const seen = new Set();

    for (const source of COOKIE_SOURCES) {
      const cookies = await getCookies(source.domain);
      const filtered = source.names
        ? cookies.filter((c) => source.names.includes(c.name))
        : cookies;

      for (const cookie of filtered) {
        const key = cookie.name;
        if (seen.has(key)) continue;
        seen.add(key);

        const ok = await setCookie({
          name: cookie.name,
          value: cookie.value,
          path: "/",
          url: localHost,
          domain: targetDomain,
        });
        ok ? successCount++ : errorCount++;
      }
    }

    $btn.disabled = false;

    if (successCount === 0 && errorCount === 0) {
      showStatus("未找到可复制的 Cookie，请先登录对应环境", "warn");
    } else if (errorCount > 0) {
      showStatus(
        `完成：成功 ${successCount} 个，失败 ${errorCount} 个`,
        "error",
      );
    } else {
      showStatus(`复制成功 ${successCount} 个 o(￣▽￣)ｄ`, "success");
    }
  });

  function showStatus(msg, type) {
    $status.textContent = msg;
    $status.className = "status " + type;
  }
});
