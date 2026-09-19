/*:
 * @target MZ
 * @plugindesc スマホ用仮想十字キー＋決定ボタン
 * @author
 *
 * @help
 * スマートフォン・タブレット向けの仮想コントローラーを表示します。
 *
 * 左下：方向キー
 * 右下：決定ボタン
 *
 * PCでは表示しません。
 */

(() => {
    "use strict";

    // --------------------------------------------------
    // スマホ・タブレット判定
    // --------------------------------------------------

    const isMobile = /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
    );

    if (!isMobile) {
        return;
    }

    // --------------------------------------------------
    // CSS
    // --------------------------------------------------

    const style = document.createElement("style");

    style.textContent = `
        #virtual-pad {
            position: fixed;
            left: 20px;
            bottom: 20px;
            width: 180px;
            height: 180px;
            z-index: 9999;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        }

        .vp-button {
            position: absolute;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.45);
            border: 2px solid rgba(255, 255, 255, 0.8);
            color: white;
            font-size: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }

        .vp-button:active {
            background: rgba(255, 255, 255, 0.45);
        }

        #vp-up {
            left: 62px;
            top: 0;
        }

        #vp-left {
            left: 0;
            top: 62px;
        }

        #vp-down {
            left: 62px;
            top: 62px;
        }

        #vp-right {
            left: 124px;
            top: 62px;
        }

        #virtual-ok {
            position: fixed;
            right: 30px;
            bottom: 55px;
            width: 75px;
            height: 75px;
            z-index: 9999;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.45);
            border: 2px solid rgba(255, 255, 255, 0.8);
            color: white;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        }
    `;

    document.head.appendChild(style);

    // --------------------------------------------------
    // HTML
    // --------------------------------------------------

    const pad = document.createElement("div");

    pad.id = "virtual-pad";

    pad.innerHTML = `
        <div class="vp-button" id="vp-up">▲</div>
        <div class="vp-button" id="vp-left">◀</div>
        <div class="vp-button" id="vp-down">▼</div>
        <div class="vp-button" id="vp-right">▶</div>
    `;

    document.body.appendChild(pad);

    const ok = document.createElement("div");

    ok.id = "virtual-ok";
    ok.textContent = "決定";

    document.body.appendChild(ok);

    // --------------------------------------------------
    // MZのInputへ入力を送る
    // --------------------------------------------------

    const directionMap = {
        "vp-up": 8,
        "vp-down": 2,
        "vp-left": 4,
        "vp-right": 6
    };

    function pressDirection(direction) {
        Input._currentState[direction] = true;
    }

    function releaseDirection(direction) {
        Input._currentState[direction] = false;
    }

    // --------------------------------------------------
    // 十字キー
    // --------------------------------------------------

    document.querySelectorAll(".vp-button").forEach(button => {

        const direction = directionMap[button.id];

        button.addEventListener("pointerdown", event => {
            event.preventDefault();

            button.setPointerCapture(event.pointerId);

            pressDirection(direction);
        });

        button.addEventListener("pointerup", event => {
            event.preventDefault();

            releaseDirection(direction);
        });

        button.addEventListener("pointercancel", event => {
            releaseDirection(direction);
        });

        button.addEventListener("pointerleave", event => {
            if (event.buttons === 0) {
                releaseDirection(direction);
            }
        });
    });

    // --------------------------------------------------
    // 決定ボタン
    // --------------------------------------------------

    ok.addEventListener("pointerdown", event => {
        event.preventDefault();

        ok.setPointerCapture(event.pointerId);

        Input._currentState["ok"] = true;
    });

    ok.addEventListener("pointerup", event => {
        event.preventDefault();

        Input._currentState["ok"] = false;
    });

    ok.addEventListener("pointercancel", event => {
        Input._currentState["ok"] = false;
    });

})();