const input = document.getElementById("website");
const addBtn = document.getElementById("addBtn");
const blockedList = document.getElementById("blockedList");


function renderBlockedSites(rules) {
  blockedList.innerHTML = "";
  rules.forEach(rule => {
    const site = rule.condition.urlFilter;

    const li = document.createElement("li");
    li.textContent = site;

    const btn = document.createElement("button");
    btn.textContent = "Unblock";
    btn.style.marginLeft = "10px";

    btn.onclick = () => {
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [rule.id]
      }, () => {
        chrome.declarativeNetRequest.getDynamicRules((updatedRules) => {
          renderBlockedSites(updatedRules);
        });
      });
    };

    li.appendChild(btn);
    blockedList.appendChild(li);
  });
}


addBtn.onclick = () => {
  const site = input.value.trim();
  if (!site) return;

  const ruleId = Math.floor(Math.random() * 100000);

  const rule = {
    id: ruleId,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: site,
      resourceTypes: ["main_frame"]
    }
  };

  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [rule],
    removeRuleIds: []
  }, () => {
    chrome.declarativeNetRequest.getDynamicRules((rules) => {
      renderBlockedSites(rules);
    });
  });

  input.value = "";
};


chrome.declarativeNetRequest.getDynamicRules((rules) => {
  renderBlockedSites(rules);
});
