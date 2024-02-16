export enum TokenType {
    // Literal Types
    Number,
    Identifier,

    // Keywords
    Let,

    // Grouping * Operators
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,

    // End of file
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
}

export interface Token {
    value: string,
    type: TokenType;
}

export function mktoken(value = "", type: TokenType): Token {
    return { value, type };
}

export function isalpha(str: string): boolean {
    return /^[a-zA-Z]$/.test(str)
}

export function isnumeric(str: string): boolean {
    return /^[0-9]$/.test(str)
}

export function tokenize(srcCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = srcCode.split("");

    while (src.length) {
        if (src[0] == '(') {
            tokens.push(mktoken(src.shift(), TokenType.OpenParen));
        } else if (src[0] == ')') {
            tokens.push(mktoken(src.shift(), TokenType.CloseParen));
        } else if (src[0] == '+' || src[0] == '-' || src[0] == '/' || src[0] == '*') {
            tokens.push(mktoken(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == '=') {
            tokens.push(mktoken(src.shift(), TokenType.Equals));
        } else {
            // Handle multicharacter tokens
            if (isalpha(src[0])) {
                let ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (reserved == undefined) {
                    tokens.push(mktoken(ident, TokenType.Identifier));
                } else {
                    tokens.push(mktoken(ident, reserved));
                }
            } else if (isnumeric(src[0])) {
                let num = "";
                while (src.length > 0 && isnumeric(src[0])) {
                    num += src.shift();
                }
                tokens.push(mktoken(num, TokenType.Number));
            } else if (src[0] == ' ' || src[0] == '\n' || src[0] == '\t') {
                src.shift()
            } else {
                throw new Error('Unrecognized character in source: ' + src[0]);
            }
        }
    }
    tokens.push(mktoken("EOF", TokenType.EOF))
    return tokens;
}