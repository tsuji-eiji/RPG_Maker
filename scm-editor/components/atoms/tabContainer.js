// @ts-check

const tabState = {}; // タブの状態を保存
/**
 * @param {{title:string,content:HTMLElement}[]} tabs
 * @param {number} [tabId]
 * @returns
 */
export function createTabUI(tabs, tabId = 0) {
  // メインコンテナ作成
  const container = document.createElement("div");
  container.className = "tab-container";

  // タブヘッダーコンテナ
  const tabHeaderContainer = document.createElement("div");
  tabHeaderContainer.className = "tab-headers";

  // タブコンテンツコンテナ
  const tabContentContainer = document.createElement("div");
  tabContentContainer.className = "tab-contents";

  // 前回の選択状態を取得、存在しない場合は0に
  const savedIndex = tabState[tabId] ?? 0;

  // タブの作成
  tabs.forEach((tab, index) => {
    // タブヘッダー
    const tabHeader = document.createElement("button");
    tabHeader.textContent = tab.title;
    // tabHeader.style.padding = "10px 15px";
    // tabHeader.style.border = "none";
    tabHeader.style.backgroundColor =
      index === savedIndex ? "white" : "#f5f5f5";
    // tabHeader.style.borderBottom =
    //   index === savedIndex ? "2px solid blue" : "none";
    // tabHeader.style.cursor = "pointer";
    tabHeader.className = "tab-header";

    // タブコンテンツ
    const tabContent = document.createElement("div");
    tabContent.style.display = index === savedIndex ? "block" : "none";

    // コンテンツ追加
    if (typeof tab.content === "string") {
      tabContent.innerHTML = tab.content;
    } else if (tab.content instanceof HTMLElement) {
      tabContent.appendChild(tab.content);
    }

    // タブ切り替えイベント
    tabHeader.addEventListener("click", () => {
      Array.from(tabContentContainer.children).forEach(
        (content, contentIndex) => {
          content.style.display = "none";
          tabHeaderContainer.children[contentIndex].style.backgroundColor =
            "#f5f5f5";
          tabHeaderContainer.children[contentIndex].style.borderBottom = "none";
        }
      );

      // 選択したタブを表示
      tabContent.style.display = "block";
      tabHeader.style.backgroundColor = "white";
      // tabHeader.style.borderBottom = "2px solid blue";

      // 状態を保存
      tabState[tabId] = index;
    });

    tabHeaderContainer.appendChild(tabHeader);
    tabContentContainer.appendChild(tabContent);
  });

  // コンテナに追加
  container.appendChild(tabHeaderContainer);
  container.appendChild(tabContentContainer);

  return container;
}
