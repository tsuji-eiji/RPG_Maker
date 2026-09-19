// @ts-check

const delaySec = 0.5; // ツールチップが表示されるまでの時間(秒指定)

export function createTooltip(targetElement, message) {
  // ツールチップ要素を作成
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = message;
  tooltip.style.cssText = `
    position: fixed;
    background-color: rgb(34, 34, 34); 
    color: rgb(200,200,200);
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    display: none;
    z-index: 1000;
    pointer-events: none;
  `;
  // スタイル追加
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .tooltip-target {
      position: relative;
      cursor: help;
      /*border-bottom: 1px dotted gray;*/
    }
  `;
  document.head.appendChild(styleElement);
  // ターゲット要素にクラスを追加
  targetElement.classList.add("tooltip-target");
  // ターゲット要素にツールチップを追加
  targetElement.appendChild(tooltip);

  // タイマーIDを保持する変数
  let hoverTimer;

  // 位置更新関数
  function updateTooltipPosition() {
    // ターゲット要素の位置を取得（スクロール考慮）
    const rect = targetElement.getBoundingClientRect();
    // 固定位置（position: fixed）を使用して、スクロールに追従
    tooltip.style.left = `${
      rect.left + rect.width / 2 - tooltip.offsetWidth / 2
    }px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
  }

  // イベントリスナーを追加
  targetElement.addEventListener("mouseover", () => {
    // 1秒後にツールチップを表示
    hoverTimer = setTimeout(() => {
      // 位置を更新
      updateTooltipPosition();
      // ツールチップを表示
      tooltip.style.display = "block";

      // スクロール時に位置を再計算
      const scrollHandler = () => {
        updateTooltipPosition();
      };
      window.addEventListener("scroll", scrollHandler);

      // マウスアウト時にスクロールリスナーを削除
      targetElement.addEventListener(
        "mouseout",
        () => {
          window.removeEventListener("scroll", scrollHandler);
          tooltip.style.display = "none";
        },
        { once: true }
      );
    }, delaySec * 1000);
  });

  // マウスアウト時にタイマーをクリア
  targetElement.addEventListener("mouseout", () => {
    clearTimeout(hoverTimer);
  });

  // リサイズ時にも位置を更新
  window.addEventListener("resize", updateTooltipPosition);
}
