"use strict";

exports.__esModule = true;
var _rowHeaders = _interopRequireDefault(require("./rowHeaders"));
exports.RowHeadersRenderer = _rowHeaders.default;
var _columnHeaders = _interopRequireDefault(require("./columnHeaders"));
exports.ColumnHeadersRenderer = _columnHeaders.default;
var _colGroup = _interopRequireDefault(require("./colGroup"));
exports.ColGroupRenderer = _colGroup.default;
var _rows = _interopRequireDefault(require("./rows"));
exports.RowsRenderer = _rows.default;
var _cells = _interopRequireDefault(require("./cells"));
exports.CellsRenderer = _cells.default;
var _table = _interopRequireDefault(require("./table"));
exports.TableRenderer = _table.default;
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Content renderer.
 *
 * @class Renderer
 */
class Renderer {
  constructor() {
    let {
      TABLE,
      THEAD,
      COLGROUP,
      TBODY,
      rowUtils,
      columnUtils,
      cellRenderer,
      stylesHandler
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    /**
     * General renderer class used to render Walkontable content on screen.
     *
     * @type {TableRenderer}
     */
    this.renderer = new _table.default(TABLE, {
      cellRenderer,
      stylesHandler
    });
    this.renderer.setRenderers({
      rowHeaders: new _rowHeaders.default(),
      columnHeaders: new _columnHeaders.default(THEAD),
      colGroup: new _colGroup.default(COLGROUP),
      rows: new _rows.default(TBODY),
      cells: new _cells.default()
    });
    this.renderer.setAxisUtils(rowUtils, columnUtils);
  }

  /**
   * Sets the overlay that is currently rendered. If `null` is provided, the master overlay is set.
   *
   * @param {'inline_start'|'top'|'top_inline_start_corner'|'bottom'|'bottom_inline_start_corner'|'master'} overlayName The overlay name.
   * @returns {Renderer}
   */
  setActiveOverlayName(overlayName) {
    this.renderer.setActiveOverlayName(overlayName);
    return this;
  }

  /**
   * Sets filter calculators for newly calculated row and column position. The filters are used to transform visual
   * indexes (0 to N) to source indexes provided by Handsontable.
   *
   * @param {RowFilter} rowFilter The row filter instance.
   * @param {ColumnFilter} columnFilter The column filter instance.
   * @returns {Renderer}
   */
  setFilters(rowFilter, columnFilter) {
    this.renderer.setFilters(rowFilter, columnFilter);
    return this;
  }

  /**
   * Sets the viewport size of the rendered table.
   *
   * @param {number} rowsCount An amount of rows to render.
   * @param {number} columnsCount An amount of columns to render.
   * @returns {Renderer}
   */
  setViewportSize(rowsCount, columnsCount) {
    this.renderer.setViewportSize(rowsCount, columnsCount);
    return this;
  }

  /**
   * Sets row and column header functions.
   *
   * @param {Function[]} rowHeaders Row header functions. Factories for creating content for row headers.
   * @param {Function[]} columnHeaders Column header functions. Factories for creating content for column headers.
   * @returns {Renderer}
   */
  setHeaderContentRenderers(rowHeaders, columnHeaders) {
    this.renderer.setHeaderContentRenderers(rowHeaders, columnHeaders);
    return this;
  }

  /**
   * Adjusts the table (preparing for render).
   */
  adjust() {
    this.renderer.adjust();
  }

  /**
   * Renders the table.
   */
  render() {
    this.renderer.render();
  }
}
exports.Renderer = Renderer;