const getCurrentTab = () => {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  const queryInfo = {
    active: true,
    currentWindow: true,
  };

  return new Promise((resolve) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      const tab = tabs[0];
      resolve(tab);
    })
  });
}
const getWindow = windowId => {
  return new Promise((resolve) => {
    chrome.windows.get(windowId, (windowOfId) => {
      resolve(windowOfId);
    })
  });
}
