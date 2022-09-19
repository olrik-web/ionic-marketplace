export function showTabBar() {
  const tabBar = document.getElementById("app-tab-bar");
  if (tabBar !== null) {
    tabBar.style.display = "flex";
  }
}

export function hideTabBar() {
  const tabBar = document.getElementById("app-tab-bar");
  if (tabBar !== null) {
    tabBar.style.display = "none";
  }
}