import "core-js/modules/es.error.cause.js";
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Factory for newly created DOM elements.
 *
 * @class {NodesPool}
 */
export default class NodesPool {
  constructor(nodeType) {
    /**
     * Node type to generate (ew 'th', 'td').
     *
     * @type {string}
     */
    _defineProperty(this, "nodeType", void 0);
    this.nodeType = nodeType.toUpperCase();
  }

  /**
   * Set document owner for this instance.
   *
   * @param {HTMLDocument} rootDocument The document window owner.
   */
  setRootDocument(rootDocument) {
    this.rootDocument = rootDocument;
  }

  /**
   * Obtains an element. The returned elements in the feature can be cached.
   *
   * @returns {HTMLElement}
   */
  obtain() {
    return this.rootDocument.createElement(this.nodeType);
  }
}