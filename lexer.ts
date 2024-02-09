export enum TokenType {
    Number,
    Indentifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
}

export interface Token {
    value: string,
    type: TokenType;
}

export function mktoken (value = "", type: TokenType): Token {
    return { value, type };
}

export function isalpha (str: string): boolean {
    return /^[a-zA-Z]$/.test(str)
}

export function isnumeric (str: string): boolean {
    return /^[0-9]$/.test(str)
}

export function tokenize (srcCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = srcCode.split("");

    while (src.length > 0) {
        if (src[0] == '(') {
            tokens.push(mktoken(src.shift(), TokenType.OpenParen))
        } else if (src[0] == ')') {
            tokens.push(mktoken(src.shift(), TokenType.CloseParen))
        } else if (src[0] == '+' || src[0] == '-' || src[0] == '/' || src[0] == '*') {
            tokens.push(mktoken(src.shift(), TokenType.BinaryOperator))
        } else if (src[0] == '=') {
            tokens.push(mktoken(src.shift(), TokenType.Equals))
        } else if (src[0] == '=') {
            tokens.push(mktoken(src.shift(), TokenType.Equals))
        } else {
            // Handle multicharacter tokens
            if (isalpha(src[0])) {
                
            } else if (isnumeric(src[0])) {

            }

        }
    }

    return tokens;
}