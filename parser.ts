import { Expression, Program, Statement } from "./ast";
import { TokenType, tokenize, Token } from "./lexer";

export default class Parser {
    private tokens: Token[] = [];

    private token(): Token {
        return this.tokens[0];
    }

    // STATEMENTS
    public createAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);

        const program: Program = {
            kind: "Program",
            body: [],
        };

        while (this.token().type != TokenType.EOF) {
            program.body.push(this.parse_statement())
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
        const left = this.parse_primary_expression();

        return left;
    }

    private parse_multiplicative_expression(): Expression {
        return {} as Expression;
    }

    private parse_primary_expression(): Expression {
        const tk = this[0].type;

        switch (tk) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.shift().value};
        }
    }

}