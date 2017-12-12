"use strict";
// Type definitions
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Default theme definition
var palette = {
    info: "#1499CE",
    success: "#00b34d",
    warning: "#FFAE00",
    error: "#DE1A1A",
    white: "#FFFFFF",
    black: "#000000",
    grey10: "#F8F8F8",
    grey20: "#e8e8e8",
    grey30: "#D0D0D0",
    grey40: "#C6C6C6",
    grey50: "#BBBBBB",
    grey60: "#999999",
    grey70: "#808080",
    grey80: "#747474",
    grey90: "#444444"
};
var usageColors = {
    bodyBackground: "#F1F1F1",
    bodyText: "#555f61",
    cardBackground: palette.white,
    contentBorder: "#dadada",
    contentSeparatorLine: "#f2f2f2",
    emphasizedText: "#373d3f",
    lightText: "#969696",
    link: palette.info,
    sideNavigationBackground: "#393939",
    subContentSeparatorLine: "#f8f8f8"
};
var colors = {
    palette: palette,
    usage: usageColors
};
var baseTypography = {
    lineHeight: "1.5",
    textTransform: "none",
    letterSpacing: "normal"
};
var typography = {
    title: __assign({}, baseTypography, { fontSize: 22, fontWeight: 600 }),
    heading1: __assign({}, baseTypography, { fontSize: 13, fontWeight: 700, color: usageColors.emphasizedText }),
    heading2: __assign({}, baseTypography, { fontSize: 13, fontWeight: 600, textTransform: "uppercase", color: usageColors.lightText, "&::before": {
            content: "» "
        } }),
    body: __assign({}, baseTypography, { fontSize: 13, fontWeight: 400 }),
    small: __assign({}, baseTypography, { fontSize: 12, fontWeight: 400 })
};
var shadows = {
    pressed: "inset 0 1px 1px rgba(0,0,0,0.15)",
    card: "0px 1px 2px #d3d1d1",
    focus: "inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(82,168,236,.6)",
    popup: "0 3px 12px rgba(0, 0, 0, .14)"
};
var contiamoTheme = {
    typography: typography,
    shadows: shadows,
    colors: colors,
    spacing: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    baseZIndex: 0
};
exports.contiamoTheme = contiamoTheme;
//# sourceMappingURL=index.js.map