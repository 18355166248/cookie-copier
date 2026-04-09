const DEFAULT_SOURCES = [
  {
    domain: "ops.test.ximalaya.com",
    names: ["JSESSIONID", "_const_cas_ticket", "CAS-TOKEN-BUSINESS"],
  },
  {
    domain: ".ximaoa.com",
    names: ["JSESSIONID", "_const_cas_ticket", "_xmLog", "xm-page-viewid"],
  },
  {
    domain: "ad-ab.ximaoa.com",
    names: ["JSESSIONID", "_const_cas_ticket"],
  },
  {
    domain: ".ximalaya.com",
    names: null,
  },
];

function loadState() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      {
        customSources: [],
        sourceEnabled: {},
        localHost: "http://localhost:3000",
      },
      resolve,
    );
  });
}

function saveState(patch) {
  return new Promise((resolve) => chrome.storage.sync.set(patch, resolve));
}

function getCookies(domain) {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain }, (cookies) => {
      resolve(chrome.runtime.lastError ? [] : cookies);
    });
  });
}

function setCookie(cookie) {
  return new Promise((resolve) => {
    chrome.cookies.set(cookie, (result) => resolve(!!result));
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const $input = document.querySelector("#input");
  const $copyBtn = document.querySelector("#copy-cookie");
  const $status = document.querySelector("#status");
  const $sourceList = document.querySelector("#source-list");
  const $addSourceBtn = document.querySelector("#add-source-btn");
  const $addForm = document.querySelector("#add-form");
  const $formDomain = document.querySelector("#form-domain");
  const $formNames = document.querySelector("#form-names");
  const $formCancel = document.querySelector("#form-cancel");
  const $formConfirm = document.querySelector("#form-confirm");

  let state = await loadState();
  $input.value = state.localHost;
  renderSources();

  // ── 添加域名表单 ──────────────────────────────────────────

  $addSourceBtn.addEventListener("click", () => {
    $addForm.classList.add("visible");
    $addSourceBtn.style.display = "none";
    $formDomain.focus();
  });

  $formCancel.addEventListener("click", hideAddForm);

  $formConfirm.addEventListener("click", async () => {
    const domain = $formDomain.value.trim();
    if (!domain) {
      $formDomain.style.borderColor = "#e74c3c";
      return;
    }

    // 去重
    const allDomains = getAllSources().map((s) => s.domain);
    if (allDomains.includes(domain)) {
      $formDomain.style.borderColor = "#e74c3c";
      $formDomain.placeholder = "该域名已存在";
      return;
    }

    const namesStr = $formNames.value.trim();
    const names = namesStr
      ? namesStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : null;

    state.customSources = [...state.customSources, { domain, names }];
    state.sourceEnabled[domain] = true;
    await saveState({
      customSources: state.customSources,
      sourceEnabled: state.sourceEnabled,
    });

    hideAddForm();
    renderSources();
  });

  function hideAddForm() {
    $addForm.classList.remove("visible");
    $addSourceBtn.style.display = "";
    $formDomain.value = "";
    $formDomain.style.borderColor = "";
    $formDomain.placeholder = ".example.com";
    $formNames.value = "";
  }

  // ── 渲染来源列表 ──────────────────────────────────────────

  function getAllSources() {
    return [
      ...DEFAULT_SOURCES.map((s) => ({ ...s, builtin: true })),
      ...state.customSources.map((s) => ({ ...s, builtin: false })),
    ];
  }

  function isEnabled(domain) {
    return domain in state.sourceEnabled ? state.sourceEnabled[domain] : true;
  }

  function renderSources() {
    $sourceList.innerHTML = "";
    getAllSources().forEach((source) => {
      const enabled = isEnabled(source.domain);
      const item = document.createElement("div");
      item.className = "source-item" + (enabled ? "" : " disabled");

      const namesText = source.names ? source.names.join(", ") : "全量复制";

      item.innerHTML = `
        <input type="checkbox" ${enabled ? "checked" : ""} />
        <div class="source-info">
          <div class="source-domain">${source.domain}</div>
          <div class="source-names">${namesText}</div>
        </div>
        ${!source.builtin ? `<button class="source-delete" title="删除">×</button>` : ""}
      `;

      const checkbox = item.querySelector("input[type='checkbox']");

      checkbox.addEventListener("change", async () => {
        state.sourceEnabled[source.domain] = checkbox.checked;
        item.classList.toggle("disabled", !checkbox.checked);
        await saveState({ sourceEnabled: state.sourceEnabled });
      });

      // 点击整行 toggle
      item.addEventListener("click", (e) => {
        if (
          e.target === checkbox ||
          e.target.classList.contains("source-delete")
        )
          return;
        checkbox.click();
      });

      const deleteBtn = item.querySelector(".source-delete");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          state.customSources = state.customSources.filter(
            (s) => s.domain !== source.domain,
          );
          delete state.sourceEnabled[source.domain];
          await saveState({
            customSources: state.customSources,
            sourceEnabled: state.sourceEnabled,
          });
          renderSources();
        });
      }

      $sourceList.appendChild(item);
    });
  }

  // ── 复制 Cookie ───────────────────────────────────────────

  $copyBtn.addEventListener("click", async () => {
    const localHost = $input.value.trim() || "http://localhost:3000";

    if (!localHost.startsWith("http://") && !localHost.startsWith("https://")) {
      showStatus("请输入有效的 URL，例如：http://localhost:3000", "error");
      return;
    }

    await saveState({ localHost });
    state.localHost = localHost;

    const activeSources = getAllSources().filter((s) => isEnabled(s.domain));
    if (activeSources.length === 0) {
      showStatus("请至少勾选一个复制来源", "warn");
      return;
    }

    $copyBtn.disabled = true;
    showStatus("复制中…", "loading");

    let successCount = 0;
    let errorCount = 0;
    const targetDomain = new URL(localHost).hostname;
    const seen = new Set();

    for (const source of activeSources) {
      const cookies = await getCookies(source.domain);
      const filtered = source.names
        ? cookies.filter((c) => source.names.includes(c.name))
        : cookies;

      for (const cookie of filtered) {
        if (seen.has(cookie.name)) continue;
        seen.add(cookie.name);

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

    $copyBtn.disabled = false;

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
