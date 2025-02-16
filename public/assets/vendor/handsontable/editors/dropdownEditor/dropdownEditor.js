"use strict";

exports.__esModule = true;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.filter.js");
var _autocompleteEditor = require("../autocompleteEditor");
var _hooks = require("../../core/hooks");
const EDITOR_TYPE = exports.EDITOR_TYPE = 'dropdown';

/**
 * @private
 * @class DropdownEditor
 */
class DropdownEditor extends _autocompleteEditor.AutocompleteEditor {
  static get EDITOR_TYPE() {
    return EDITOR_TYPE;
  }

  /**
   * @param {number} row The visual row index.
   * @param {number} col The visual column index.
   * @param {number|string} prop The column property (passed when datasource is an array of objects).
   * @param {HTMLTableCellElement} td The rendered cell element.
   * @param {*} value The rendered value.
   * @param {object} cellProperties The cell meta object (see {@link Core#getCellMeta}).
   */
  prepare(row, col, prop, td, value, cellProperties) {
    super.prepare(row, col, prop, td, value, cellProperties);
    this.cellProperties.filter = false;
    this.cellProperties.strict = true;
  }
}
exports.DropdownEditor = DropdownEditor;
_hooks.Hooks.getSingleton().add('beforeValidate', function (value, row, col) {
  const visualColumnIndex = this.propToCol(col);
  if (Number.isInteger(visualColumnIndex)) {
    const cellMeta = this.getCellMeta(row, visualColumnIndex);
    if (cellMeta.editor === DropdownEditor) {
      if (cellMeta.strict === undefined) {
        cellMeta.filter = false;
        cellMeta.strict = true;
      }
    }
  }
});