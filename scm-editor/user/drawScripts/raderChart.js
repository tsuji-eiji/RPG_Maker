// このスクリプトは「一覧ウィンドウ識別子」にアクター一覧のウィンドウを指定した時に有効になります。
// 正しく表示できているか確認するには以下のコメントアウトを解除し、「true」が表示されるかチェックしてください。
//console.log(item.constructor.name === "Game_Actor")

/* ------------------- */
// これらの数値を変更することで描画を調整できます。
/* ------------------- */
// 表示ステータス(表示名/プロパティ名)
const status = [
  ["運", "luk"],
  ["攻撃", "atk"],
  ["防御", "def"],
  ["魔攻", "mat"],
  ["魔防", "mdf"],
  ["素早さ", "agi"],
];

const POLYGON_SIZE = 100; // 多角形の大きさ
const MAX_PARAM = 40; // パラメータの最大値
const MAIN_COLOR = "#75dbf0"; // 色
const BASE_COLOR = "#eeeeee";
const BASE_LINE_WIDTH = 3; // 太さ
const MAIN_LINE_WIDTH = 3;
const MAIN_FILL_COLOR = "rgba(111,222, 222, 0.3)"; // 塗りつぶし色（透明）

// 描画位置のオフセット指定
const offsetX = 0;
const offsetY = -30;

// 描画位置を画面中央に設定
const cx = this.width / 2 + offsetX;
const cy = this.height / 2 + offsetY;

// ステータス名と数値の描画
const drawStatusLabel = (label, value, x, y) => {
  const margin = 24;
  this.drawTextEx(`\\C[6]${label}`, x - 16, y - margin, 64);
  this.drawTextEx(`${value}`, x - 16, y - 0, 64);
};

/* ------------------- */
// 以下、基本的に変更は不要です。
/* ------------------- */

function drawLabels(ctx, cx, cy, radius) {
  const n = status.length;
  status.forEach(([label, key], i) => {
    const angle = ((Math.PI * 2) / n) * i - Math.PI / 2;
    const x = cx + (radius + 12) * Math.cos(angle);
    const y = cy + (radius + 12) * Math.sin(angle);
    const value = item[key] || 0;
    drawStatusLabel(label, value, x, y);
  });
}

// 頂点座標を取得（status数に応じた多角形）
function getPolygonPoints(cx, cy, radius, rates) {
  const n = rates.length;
  return rates.map((rate, i) => {
    const angle = ((Math.PI * 2) / n) * i - Math.PI / 2;
    return [
      cx + radius * rate * Math.cos(angle),
      cy + radius * rate * Math.sin(angle),
    ];
  });
}

// 多角形を描画（塗りつぶし対応）
function drawPolygon(ctx, points, strokeColor, lineWidth, fillColor = null) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();

  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// === 描画実行 ===
const ctx = this.contents.context;
ctx.clearRect(0, 0, this.width, this.height);

const rates = status.map(([_, key]) => (item[key] || 0) / MAX_PARAM);
const fullRates = status.map(() => 1);

// 多角形を2つ描く（背景と現在値）
drawPolygon(
  ctx,
  getPolygonPoints(cx, cy, POLYGON_SIZE, fullRates),
  BASE_COLOR,
  BASE_LINE_WIDTH
);
drawPolygon(
  ctx,
  getPolygonPoints(cx, cy, POLYGON_SIZE, rates),
  MAIN_COLOR,
  MAIN_LINE_WIDTH,
  MAIN_FILL_COLOR
);

drawLabels.call(this, ctx, cx, cy, POLYGON_SIZE);
