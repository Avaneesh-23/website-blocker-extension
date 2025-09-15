let blockedSites = [];

chrome.storage.local.get(["blocked"], (result) => {
  if (result.blocked) {
    blockedSites = result.blocked;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = new URL(details.url);
    if (blockedSites.includes(url.hostname)) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);


chrome.storage.onChanged.addListener((changes) => {
  if (changes.blocked) {
    blockedSites = changes.blocked.newValue;
  }
});
