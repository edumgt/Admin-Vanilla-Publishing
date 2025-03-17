"use strict";

exports.__esModule = true;
var _dropdownEditor = require("../../editors/dropdownEditor");
var _dropdownRenderer = require("../../renderers/dropdownRenderer");
var _dropdownValidator = require("../../validators/dropdownValidator");
const CELL_TYPE = exports.CELL_TYPE = 'dropdown';
const DropdownCellType = exports.DropdownCellType = {
  CELL_TYPE,
  editor: _dropdownEditor.DropdownEditor,
  // displays small gray arrow on right side of the cell
  renderer: _dropdownRenderer.dropdownRenderer,
  validator: _dropdownValidator.dropdownValidator
};