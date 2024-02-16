import { Expression, Identifier, NumericLiteral, Program, Statement, BinaryExpression, NullLiteral } from "./ast";
import { TokenType, tokenize, Token } from "./lexer";

// Orders of Precedence
// Assignment Expression
// Member Expression
// Function Call
// Logical Expression
// Comparison Expression
// Additive Expression
// Multiplicative Expression
// Unary Expression
// Primary Expression

export default class Parser {
    private tokens: Token[] = [];

    private token(): Token {
        return this.tokens[0];
    }

    private next(): Token {
        return this.tokens.shift() as Token;
    }

    private nextExpect(expType: TokenType, errMsg: string): Token {
        const tk = this.tokens.shift();
        if (!tk || tk.type != expType) {
            throw new Error("PARSER ERROR: " + errMsg);
        }
        return tk;
    }

    // STATEMENTS
    public createAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        // console.log(this.tokens)

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.token().type != TokenType.EOF) {
            console.log(this.tokens);
            console.log(program.body);
            console.log("");
            program.body.push(this.statement());
        }

        return program;
    }

    private statement(): Statement {
        return this.expression();
    }

    // EXPRESSIONS
    private expression(): Expression {
        return this.additive();
    }

    private additive(): Expression {
        let left = this.multiplicative();

        const checks: string[] = ["+", "-"];
        while (checks.includes(this.token().value)) {
            const operator = this.next().value;
            const right = this.multiplicative();
            left = {
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator,
            } as BinaryExpression;
        }

        return left;
    }

    private multiplicative(): Expression {
        let left = this.primary();

        const checks = ["*", "*", "/", "%"]
        while (checks.includes(this.token().value)) {
            const operator = this.next().value
            const right = this.primary();
            left = {
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator,
            } as BinaryExpression;
        }

        return left;
    }

    private primary(): Expression {
        switch (this.token().type) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.next().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", symbol: parseFloat(this.next().value) } as NumericLiteral;
            case TokenType.OpenParen:
                this.next();
                const value = this.expression();
                this.nextExpect(TokenType.CloseParen, "Expected TokenType.CloseParen but found " + this.token().type);
                return value;
            case TokenType.Null:
                return { kind: "NullLiteral", symbol: this.next().value } as NullLiteral;
            default:
                throw new Error("PARSER ERROR: Unexpected token found: " + this.token());
        }
    }
}