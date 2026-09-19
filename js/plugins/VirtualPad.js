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
            left: 0;
            bottom: 20px;
            width: 100%;
            height: 25%;
            z-index: 9999;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        }

        .vp-button {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.45);
            border: 2px solid rgba(255, 255, 255, 0.8);
            color: white;
            font-size: 60px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }

        .vp-button:active {
            background: rgba(255, 255, 255, 0.45);
        }

        #vp-up {
            left: 20%;
            top: 0;
        }

        #vp-left {
            left: 5%;
            top: 25%;
        }

        #vp-down {
            left: 20%;
            top: 50%;
        }

        #vp-right {
            left: 35%;
            top: 25%;
        }
        #vp-ok {
            right: 5%;
            top: 10%;
        }
        #vp-cancel {
            right: 20%;
            top: 45%;
        }
    `;

    document.head.appendChild(style);

    // --------------------------------------------------
    // HTML
    // --------------------------------------------------

    const pad = document.createElement("div");

    pad.id = "virtual-pad";

    pad.innerHTML = `
        <div class="vp-button" id="vp-up">↑</div>
        <div class="vp-button" id="vp-left">←</div>
        <div class="vp-button" id="vp-down">↓</div>
        <div class="vp-button" id="vp-right">→</div>
        <div class="vp-button" id="vp-ok">◯</div>
        <div class="vp-button" id="vp-cancel">✕</div>
    `;

    document.body.appendChild(pad);

    const okButton = document.getElementById("vp-ok");
    const cancelButton = document.getElementById("vp-cancel");

    // --------------------------------------------------
    // MZのInputへ入力を送る
    // --------------------------------------------------

    const directionMap = {
        "vp-up": "up",
        "vp-down": "down",
        "vp-left": "left",
        "vp-right": "right"
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

    okButton.addEventListener("pointerdown", event => {
        event.preventDefault();

        okButton.setPointerCapture(event.pointerId);

        Input._currentState["ok"] = true;
    });

    okButton.addEventListener("pointerup", event => {
        event.preventDefault();

        Input._currentState["ok"] = false;
    });

    okButton.addEventListener("pointercancel", event => {
        Input._currentState["ok"] = false;
    });

    // --------------------------------------------------
    // キャンセルボタン
    // --------------------------------------------------

    cancelButton.addEventListener("pointerdown", event => {
        event.preventDefault();

        cancelButton.setPointerCapture(event.pointerId);

        Input._currentState["cancel"] = true;
    });

    cancelButton.addEventListener("pointerup", event => {
        event.preventDefault();

        Input._currentState["cancel"] = false;
    });

    cancelButton.addEventListener("pointercancel", event => {
        Input._currentState["cancel"] = false;
    });

})();