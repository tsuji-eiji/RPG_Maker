export class InputField {
  /** @type {HTMLElement } */
  element;
  props = {};

  /**
   * @param {SCM_Data} data- Current window data
   * @param {string} param - Field generation options
   */
  constructor(data, param) {
    this.element = document.createElement("input");
    this.element.addEventListener("change", (e) => {
      this.onChange(e);
    });
  }
  onChange = (e) => {};
}
