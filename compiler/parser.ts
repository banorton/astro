import { Expression, Identifier, NumericLiteral, Program, Statement, BinaryExpression } from "./ast";
import { TokenType, tokenize, Token } from "./lexer";

export default class Parser {
    private tokens: Token[] = [];

    private token(): Token {
        return this.tokens[0];
    }

    private next(): Token {
        return this.tokens.shift() as Token;
    }

    // STATEMENTS
    public createAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.token().type != TokenType.EOF) {
            program.body.push(this.parse_statement());
        }

        return program;
    }

    private parse_statement(): Statement {
        return this.parse_expression();
    }

    // EXPRESSIONS
    private parse_expression(): Expression {
        return this.parse_additive_expression();
    }

    private parse_additive_expression(): Expression {
        let left = this.parse_primary_expression();

        const checks: string[] = ["+", "-"];
        while (this.token().value in checks) {
            const operator = this.next().value;
            const right = this.parse_primary_expression();
            left = {
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator,
            } as BinaryExpression;
        }

        return left;
    }

    private parse_multiplicative_expression(): Expression {
        return {} as Expression;
    }

    private parse_primary_expression(): Expression {
        switch (this.token().type) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.token().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", symbol: parseFloat(this.token().value) } as NumericLiteral;
            case TokenType.Number:
                return { kind: "NumericLiteral", symbol: parseFloat(this.token().value) } as NumericLiteral;
            default:
                console.error("Unexpected token found during parsing!", this.token());
                throw new Error();
        }
    }

}