require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 291:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.killSavedPIDs = exports.savePIDToFile = exports.getSavedPIDs = void 0;
const fs_1 = __importDefault(__nccwpck_require__(52));
const pidsFile = "/opt/localtunnel-pids.json";
const getSavedPIDs = () => {
    if (!fs_1.default.existsSync(pidsFile)) {
        return [];
    }
    const pids = fs_1.default.readFileSync(pidsFile, "utf8");
    return JSON.parse(pids);
};
exports.getSavedPIDs = getSavedPIDs;
const savePIDToFile = (pid) => {
    const pids = (0, exports.getSavedPIDs)();
    pids.push(pid);
    fs_1.default.writeFileSync(pidsFile, JSON.stringify(pids))
};
exports.savePIDToFile = savePIDToFile;
const killSavedPIDs = () => {
    const pids = (0, exports.getSavedPIDs)();
    pids.forEach(pid => {
        try {
            process.kill(pid, "SIGTERM");
            console.log(`Killed process ${pid}`);
        }
        catch (e) {
            console.log(`Failed to kill process ${pid}: ${e}`);
        }
    });
    if (fs_1.default.existsSync(pidsFile)) {
        fs_1.default.unlinkSync(pidsFile);
    }
};
exports.killSavedPIDs = killSavedPIDs;


/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const processManagement_1 = __nccwpck_require__(291);
(0, processManagement_1.killSavedPIDs)();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map