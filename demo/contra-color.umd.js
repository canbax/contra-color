(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.contraColor = {}));
})(this, (function (exports) { 'use strict';

    var RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i;
    var COLOR_WIDTH = 256;
    function sRGBtoLin(colorChannel) {
        // Send this function a decimal sRGB gamma encoded color channel
        // between 0.0 and 1.0, and it returns a linearized value.
        colorChannel = colorChannel / 255;
        if (colorChannel <= 0.04045) {
            return colorChannel / 12.92;
        }
        else {
            return Math.pow((colorChannel + 0.055) / 1.055, 2.4);
        }
    }
    function luminance(rgb) {
        var r = sRGBtoLin(rgb[0]);
        var g = sRGBtoLin(rgb[1]);
        var b = sRGBtoLin(rgb[2]);
        return r * 0.2126 + g * 0.7152 + b * 0.0722;
    }
    // thanks to https://github.com/onury/invert-color
    function hex2RGBArray(hex) {
        if (hex.slice(0, 1) === "#") {
            hex = hex.slice(1);
        }
        if (!RE_HEX.test(hex)) {
            throw new Error("Invalid HEX color: \"" + hex + "\"");
        }
        // normalize / convert 3-chars hex to 6-chars.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16), // b
        ];
    }
    function contrast(rgb1, rgb2, isLinearLuminance) {
        if (isLinearLuminance === void 0) { isLinearLuminance = true; }
        var l1 = luminance(rgb1);
        var l2 = luminance(rgb2);
        if (!isLinearLuminance) {
            l1 = Math.pow(l1, 0.425);
            l2 = Math.pow(l2, 0.425);
        }
        if (l1 > l2) {
            return (l1 + 0.05) / (l2 + 0.05);
        }
        return (l2 + 0.05) / (l1 + 0.05);
    }
    function padz(str, len) {
        return (new Array(len).join("0") + str).slice(-len);
    }
    function cloneArr(arr) {
        var r = [];
        for (var i = 0; i < arr.length; i++) {
            r.push(arr[i]);
        }
        return r;
    }
    function getRandomColor() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return [r, g, b];
    }
    function rgb2hex(rgb) {
        return "#" + rgb.map(function (c) { return padz(c.toString(16), 2); }).join("");
    }
    function getContrastingColor(c, isLinearLuminance, contrastDiff) {
        if (isLinearLuminance === void 0) { isLinearLuminance = true; }
        if (contrastDiff === void 0) { contrastDiff = 0; }
        var rgb = hex2RGBArray(c);
        var maxContrast = 0;
        var greedyResults = [[0, 0, 0], [255, 255, 255], getRandomColor()];
        if (contrastDiff > 0) {
            greedyResults.unshift(hex2RGBArray(c));
        }
        // process from the most important to least important
        var channelIdxes = [1, 0, 2];
        for (var a = 0; a < greedyResults.length; a++) {
            maxContrast = 0;
            for (var i = 0; i < channelIdxes.length; i++) {
                var currChannelIdx = channelIdxes[i];
                for (var j = 0; j < COLOR_WIDTH; j++) {
                    var tmp = cloneArr(greedyResults[a]);
                    tmp[currChannelIdx] = j;
                    var currContrast = contrast(rgb, tmp, isLinearLuminance);
                    if (currContrast > maxContrast) {
                        maxContrast = currContrast;
                        greedyResults[a][currChannelIdx] = j;
                    }
                    if (contrastDiff > 0 &&
                        currContrast >= contrastDiff &&
                        currContrast <= contrastDiff + 0.5) {
                        // early return to find limited contrast difference
                        return { color: rgb2hex(greedyResults[a]), contrast: currContrast };
                    }
                }
            }
        }
        var maxOfGreedyResults = [0, 0, 0];
        maxContrast = 0;
        for (var a = 0; a < greedyResults.length; a++) {
            var currContrast = contrast(rgb, greedyResults[a], isLinearLuminance);
            if (currContrast > maxContrast) {
                maxContrast = currContrast;
                maxOfGreedyResults = greedyResults[a];
            }
        }
        return { color: rgb2hex(maxOfGreedyResults), contrast: maxContrast };
    }
    function getContrast(c1, c2, isLinearLuminance) {
        if (isLinearLuminance === void 0) { isLinearLuminance = true; }
        var rgb1 = hex2RGBArray(c1);
        var rgb2 = hex2RGBArray(c2);
        return contrast(rgb1, rgb2, isLinearLuminance);
    }

    exports.getContrast = getContrast;
    exports.getContrastingColor = getContrastingColor;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
