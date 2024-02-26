import { PassThrough } from "stream";
import { Expression, Identifier, NumericLiteral, Program, Statement, BinaryExpression, VariableDeclaration } from "./ast";
import { TokenType, tokenize, Token } from "./lexer";
import exp from "constants";

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
            throw new Error(errMsg);
        }
        return tk;
    }

    // STATEMENTS
    public createAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.token().type != TokenType.EOF) {
            program.body.push(this.statement());
        }

        return program;
    }

    private statement(): Statement {
        switch (this.token().type) {
            case TokenType.Let:
                return this.varDeclaration();
            case TokenType.Const:
                return this.varDeclaration();
            default:
                return this.expression();
        }
    }
    
    private varDeclaration(): VariableDeclaration {
        const isConst = this.next().type == TokenType.Const;
        const id = this.nextExpect(TokenType.Identifier, `Expected TokenType.Identifier but found ${this.token().type}.`).value;
        if (this.token().type == TokenType.NewLine || this.token().type == TokenType.Comma) {
            if (isConst) {
                throw new Error("Must assign a value to a const expression.");
            } else {
                return {
                    kind: "VariableDeclaration",
                    constant: false,
                    id: id,
                } as VariableDeclaration;
            }
        } else if (this.token().type == TokenType.Equals) {
            this.next();
            const dec = {
                kind: "VariableDeclaration",
                constant: isConst,
                id: id,
                value: this.expression(),
            } as VariableDeclaration;
            this.nextExpect(TokenType.Comma, `Variable declaration statements must end in a newline or comma but found ${this.token().value}.`);
            return dec;
        } else {
            throw new Error(`Unexpected token found: ${this.token().value}.`);
        }
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
                this.nextExpect(TokenType.CloseParen, `Expected TokenType.CloseParen but found ${this.token().type}.`);
                return value;
            default:
                throw new Error(`Unexpected token found: ${this.token().value}.`);
        }
    }
}