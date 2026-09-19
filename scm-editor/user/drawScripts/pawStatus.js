const ICON_STAMP = 480;
const ICON_SKILL = 220;
const tableWidth = 100; // 列間隔
const _margin = 16; // 行間
const _margin_category = 50; // 「ステータス」とその上
const margin_categoryX = -20;
const actorMarginX = 50;

const portrait_x = 250;
const mx = 11; // マージンX
const my = 11; // マージン
r.x += mx;
r.y += my;

this.drawActorCharacter(item, r.x + 12, r.y + 50); // アクターキャラクター
this.drawActorName(item, r.x + actorMarginX, r.y); // アクター名称
this.drawActorClass(item, r.x + actorMarginX, r.y + 20); // アクター職業
//this.drawActorLevel(item, r.x + 100, r.y, 100); // アクターのレベル
this.drawTextEx(`Lv:${item.level}`, r.x + 100, r.y, r.width);

r.y += _margin;
r.y += _margin_category;
this.drawTextEx(`\\I[98]ステータス`, r.x + margin_categoryX, r.y, r.width); // 任意のテキスト描画

r.y += _margin;
//this.placeGauge(item, "hp", r.x, r.y); // HPゲージ
//this.placeGauge(item, "mp", r.x + th, r.y); // MPゲージ
//r.y += _margin;

this.drawTextEx(`こうげき:${item.atk}`, r.x, r.y, r.width);
this.drawTextEx(`ぼうぎょ:${item.atk}`, r.x + tableWidth, r.y, r.width);
r.y += _margin;
this.drawTextEx(`まほう:${item.mat}`, r.x, r.y, r.width);
this.drawTextEx(`まほうぼうぎょ:${item.mdf}`, r.x + tableWidth, r.y, r.width);
r.y += _margin;
this.drawTextEx(`すばやさ:${item.agi}`, r.x, r.y, r.width);
this.drawTextEx(`ラッキー:${item.luk}`, r.x + tableWidth, r.y, r.width);
r.y += _margin;
r.y += 4;
this.drawTextEx(`\\I[${ICON_STAMP}]スタンプ`, r.x, r.y, r.width);
this.drawTextEx(`\\I[${ICON_SKILL}]スキル`, r.x + tableWidth, r.y, r.width);
