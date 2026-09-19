export function createDraggableSeparator(containerElement, options = {}) {
  // デフォルトオプション
  const defaultOptions = {
    direction: "horizontal", // デフォルトは水平方向のリサイザー
    minFirstPaneSize: 50, // 最小の左/上のペインサイズ
    minSecondPaneSize: 50, // 最小の右/下のペインサイズ
    separatorWidth: 10, // セパレーターの幅
  };

  // オプションをマージ
  const config = { ...defaultOptions, ...options };

  // 共通の親コンテナを取得
  //   const containerElement = firstPane.parentElement;
  const firstPane = containerElement.children[0];
  const secondPane = containerElement.children[1];

  // セパレーターの作成
  const separator = document.createElement("div");
  separator.style.userSelect = "none";
  separator.style.cursor =
    config.direction === "horizontal" ? "col-resize" : "row-resize";
  separator.style.backgroundColor = "#ccc";
  separator.style.zIndex = "10";

  // コンテナにポジションを設定
  containerElement.style.position = "relative";

  // セパレーターのスタイル設定
  if (config.direction === "horizontal") {
    separator.style.width = `${config.separatorWidth}px`;

    // コンテナにフレックスレイアウトを適用
    containerElement.style.display = "flex";
    containerElement.style.flexDirection = "row";

    // 初期位置設定
    firstPane.style.flexGrow = 1;
    secondPane.style.flexGrow = 1;

    // セパレーターを追加
    containerElement.insertBefore(separator, secondPane);
  } else {
    separator.style.height = `${config.separatorWidth}px`;

    // コンテナにフレックスレイアウトを適用
    containerElement.style.display = "flex";
    containerElement.style.flexDirection = "column";

    // 初期位置設定
    firstPane.style.flexGrow = 1;
    secondPane.style.flexGrow = 1;

    // セパレーターを追加
    containerElement.insertBefore(separator, secondPane);
  }

  // ドラッグ関連の変数
  let isDragging = false;
  let startPos = 0;
  let initialFirstPaneSize = 0;

  // マウスダウンイベント
  const handleMouseDown = (e) => {
    isDragging = true;
    startPos = config.direction === "horizontal" ? e.clientX : e.clientY;

    // 初期サイズを取得
    const firstPaneRect = firstPane.getBoundingClientRect();
    initialFirstPaneSize =
      config.direction === "horizontal"
        ? firstPaneRect.width
        : firstPaneRect.height;

    // イベントリスナーの追加
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // テキスト選択を防ぐ
    e.preventDefault();
  };

  // マウス移動イベント
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentPos =
      config.direction === "horizontal" ? e.clientX : e.clientY;
    const delta = currentPos - startPos;

    // 新しいサイズの計算
    const newFirstPaneSize = initialFirstPaneSize + delta;
    const containerSize =
      config.direction === "horizontal"
        ? containerElement.clientWidth
        : containerElement.clientHeight;

    // サイズの制限
    const constrainedSize = Math.max(
      config.minFirstPaneSize,
      Math.min(
        newFirstPaneSize,
        containerSize - config.minSecondPaneSize - config.separatorWidth
      )
    );

    // フレックスベースを使用してサイズを調整
    firstPane.style.flexBasis = `${constrainedSize}px`;
    secondPane.style.flexBasis = `${
      containerSize - constrainedSize - config.separatorWidth
    }px`;
  };

  // マウスアップイベント
  const handleMouseUp = () => {
    isDragging = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // イベントリスナーの追加
  separator.addEventListener("mousedown", handleMouseDown);

  // クリーンアップ関数を返す
  return () => {
    separator.removeEventListener("mousedown", handleMouseDown);
    containerElement.removeChild(separator);
  };
}
