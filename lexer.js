"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = exports.isnumeric = exports.isalpha = exports.mktoken = exports.TokenType = void 0;
var fs = require("fs");
var process = require("process");
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Number"] = 0] = "Number";
    TokenType[TokenType["Indentifier"] = 1] = "Indentifier";
    TokenType[TokenType["Equals"] = 2] = "Equals";
    TokenType[TokenType["OpenParen"] = 3] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 4] = "CloseParen";
    TokenType[TokenType["BinaryOperator"] = 5] = "BinaryOperator";
    TokenType[TokenType["Let"] = 6] = "Let";
})(TokenType || (exports.TokenType = TokenType = {}));
var KEYWORDS = {
    "let": TokenType.Let,
};
function mktoken(value, type) {
    if (value === void 0) { value = ""; }
    return { value: value, type: type };
}
exports.mktoken = mktoken;
function isalpha(str) {
    return /^[a-zA-Z]$/.test(str);
}
exports.isalpha = isalpha;
function isnumeric(str) {
    return /^[0-9]$/.test(str);
}
exports.isnumeric = isnumeric;
function tokenize(srcCode) {
    var tokens = new Array();
    var src = srcCode.split("");
    while (src.length) {
        if (src[0] == '(') {
            tokens.push(mktoken(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] == ')') {
            tokens.push(mktoken(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] == '+' || src[0] == '-' || src[0] == '/' || src[0] == '*') {
            tokens.push(mktoken(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] == '=') {
            tokens.push(mktoken(src.shift(), TokenType.Equals));
        }
        else {
            // Handle multicharacter tokens
            if (isalpha(src[0])) {
                var ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }
                // Check for reserved keywords
                var reserved = KEYWORDS[ident];
                if (reserved == undefined) {
                    tokens.push(mktoken(ident, TokenType.Indentifier));
                }
                else {
                    tokens.push(mktoken(ident, reserved));
                }
            }
            else if (isnumeric(src[0])) {
                var num = "";
                while (src.length > 0 && isnumeric(src[0])) {
                    num += src.shift();
                }
                tokens.push(mktoken(num, TokenType.Number));
            }
            else if (src[0] == ' ' || src[0] == '\n' || src[0] == '\t') {
                src.shift();
            }
            else {
                throw new Error('Unrecognized character in source: ' + src[0]);
            }
        }
    }
    return tokens;
}
exports.tokenize = tokenize;
var source = fs.readFileSync(process.argv.slice(2, 3)[0], 'utf8');
for (var _i = 0, _a = tokenize(source); _i < _a.length; _i++) {
    var token = _a[_i];
    console.log(token);
}
