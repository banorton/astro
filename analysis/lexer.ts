export enum TokenType {
    // Literal Types
    Number,
    Identifier,
    String,

    // Keywords
    Let,
    Const,

    // Grouping * Operators
    Equals,
    OpenParen,
    CloseParen,
    OpenBrace,
    CloseBrace,
    BinaryOperator,
    Semicolon,
    Colon,
    // NewLine,
    Comma,

    // End of file
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
    const: TokenType.Const,
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
        } else if (src[0] == '{') {
            tokens.push(mktoken(src.shift(), TokenType.OpenBrace));
        } else if (src[0] == '}') {
            tokens.push(mktoken(src.shift(), TokenType.CloseBrace));
        } else if (src[0] == '+' || src[0] == '-' || src[0] == '/' || src[0] == '*' || src[0] == '%') {
            tokens.push(mktoken(src.shift(), TokenType.BinaryOperator));
        } else if (src[0] == '=') {
            tokens.push(mktoken(src.shift(), TokenType.Equals));
        } else if (src[0] == ';') {
            tokens.push(mktoken(src.shift(), TokenType.Semicolon));
        } else if (src[0] == ':') {
            tokens.push(mktoken(src.shift(), TokenType.Colon));
        // } else if (src[0] == '\n') {
        //     tokens.push(mktoken(src.shift(), TokenType.NewLine));
        } else if (src[0] == ',') {
            tokens.push(mktoken(src.shift(), TokenType.Comma));
        } else {
            // Handle multicharacter tokens
            if (isalpha(src[0])) {
                let ident = "";
                while (src.length > 0 && isalpha(src[0])) {
                    ident += src.shift();
                }

                // Check for reserved keywords
                const reserved = KEYWORDS[ident];
                if (typeof reserved == "number") {
                    tokens.push(mktoken(ident, reserved));
                } else {
                    tokens.push(mktoken(ident, TokenType.Identifier));
                }
            } else if (isnumeric(src[0])) {
                let num = "";
                while (src.length > 0 && isnumeric(src[0])) {
                    num += src.shift();
                }
                tokens.push(mktoken(num, TokenType.Number));
            } else if (src[0] == ' ' || src[0] == '\t' || src[0] == '\n') {
                src.shift()
            } else {
                throw new Error(`Unrecognized character in source: '${src[0]}'`);
            }
        }
    }
    tokens.push(mktoken("EOF", TokenType.EOF))
    return tokens;
}