// @ts-check
const toggleState = {}; // カテゴリの状態を保存

/**
 *
 * @param {HTMLDivElement} categoryDiv
 * @param {string} label
 * @param {*} [categoryId]
 * @param {number} [depth] - ネスト時に色を変える用
 * @returns {{categoryDiv:HTMLDivElement , categoryName:HTMLElement}}
 */
export function createToggleCategory(
  categoryDiv,
  label = "Category",
  categoryId = label,
  depth = 0
) {
  const toggleHeader = document.createElement("div");
  toggleHeader.classList.add("category-toggle-header");

  const categoryName = document.createElement("span");
  categoryName.textContent = label;

  const toggleIndicator = document.createElement("span");

  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("category-content");

  while (categoryDiv.firstChild) {
    contentWrapper.appendChild(categoryDiv.firstChild);
  }

  const isOpen = toggleState[categoryId] ?? false;
  contentWrapper.style.display = isOpen ? "block" : "none";
  toggleIndicator.textContent = isOpen ? "▼" : "▶";

  toggleHeader.appendChild(categoryName);
  toggleHeader.appendChild(toggleIndicator);
  categoryDiv.appendChild(toggleHeader);
  categoryDiv.appendChild(contentWrapper);

  // depth に応じたクラス追加
  categoryDiv.classList.add(`category-depth-${depth}`);

  toggleHeader.addEventListener("click", () => {
    const isVisible = contentWrapper.style.display === "block";
    contentWrapper.style.display = isVisible ? "none" : "block";
    toggleIndicator.textContent = isVisible ? "▶" : "▼";
    toggleState[categoryId] = !isVisible;
  });

  return { categoryDiv, categoryName };
}
