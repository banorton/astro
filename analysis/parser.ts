import { PassThrough } from "stream";
import { Expression, Identifier, NumericLiteral, Program, Statement, BinaryExpression, Declaration, Assignment, Property, ObjectLiteral, Member, Call } from "./ast";
import { TokenType, tokenize, Token } from "./lexer";
import exp from "constants";

// Orders of Precedence
// Assignment Expression
// Logical Expression
// Comparison Expression
// Additive Expression
// Multiplicative Expression
// Call
// Member
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

    // STATEMENTS
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
    
    private varDeclaration(): Declaration {
        const isConst = this.next().type == TokenType.Const;
        const id = this.nextExpect(TokenType.Identifier, `Expected TokenType.Identifier but found '${this.token().type}'`).value;

        if (this.token().type == TokenType.Semicolon) {
            if (isConst) {
                throw new Error("Must assign a value to a const expression.");
            } else {
                this.next();

                return {
                    kind: "Declaration",
                    constant: false,
                    id: id,
                } as Declaration;
            }
        } else if (this.token().type == TokenType.Equals) {
            this.next();

            const dec = {
                kind: "Declaration",
                constant: isConst,
                id: id,
                value: this.expression(),
            } as Declaration;
            this.nextExpect(TokenType.Semicolon, `Variable declaration statements must end in a semicolon but found '${this.token().value}'`);

            return dec;
        } else {
            throw new Error(`Unexpected token found: '${this.token().value}'`);
        }
    }

    // EXPRESSIONS
    private expression(): Expression {
        return this.assignment();
    }

    private assignment(): Expression {
        let left = this.object();

        if (this.token().type == TokenType.Equals) {
            this.next();
            const right = this.assignment();
            return { kind: "Assignment", left: left, right: right } as Assignment
        }

        return left;
    }

    private object(): Expression {
        if (this.token().type !== TokenType.OpenBrace) {
            return this.additive();
        }

        this.next();
        const properties = new Array<Property>();

        while (this.token().type !== TokenType.CloseBrace) {
            const key = this.nextExpect(TokenType.Identifier, `Expected TokenType.Identifier but found: '${this.token().value}'`)

            if (this.token().type == TokenType.Comma) {
                this.next();
                properties.push({ kind: "Property", key: key.value } as Property);
                continue;
            } else if (this.token().type == TokenType.Colon) {
                this.next();
                const value = this.expression();
                properties.push({ kind: "Property", key: key.value, value: value } as Property);
                if (this.token().type !== TokenType.CloseBrace) {
                    this.nextExpect(TokenType.Comma, `Expected TokenType.Comma but found: '${this.token().value}'`)
                }
            } else {
                throw new Error(`Expected TokenType.Comma or TokenType.Colon but found: '${this.token().value}'`)
            }
        }

        this.next();
        return { kind: "ObjectLiteral", properties: properties } as ObjectLiteral;
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
        let left = this.callMember();

        const checks = ["*", "*", "/", "%"]
        while (checks.includes(this.token().value)) {
            const operator = this.next().value
            const right = this.callMember();
            left = {
                kind: "BinaryExpression",
                left: left,
                right: right,
                operator: operator,
            } as BinaryExpression;
        }

       return left;
    }

    private callMember(): Expression {
        const m = this.member();

        if (this.token().type == TokenType.OpenParen) {
            return this.call(m) as Call;
        }

        return m as Member;
    }

    private call(caller: Expression): Expression {
        let callExpr: Expression = {
            kind: "Call",
            caller: caller,
            args: this.args(),
        } as Call;

        if (this.token().type == TokenType.OpenParen) {
            callExpr = this.call(callExpr);
        }

        return callExpr;
    }

    private member(): Expression {
        let object = this.primary();

        while (this.token().type == TokenType.Dot || this.token().type == TokenType.OpenBracket){
            const operator = this.next();
            let property: Expression;
            let computed: boolean;

            if (operator.type == TokenType.Dot) {
                computed = false;
                property = this.primary();
                if (property.kind != "Identifier") {
                    throw new Error(`Expected TokenType.Identifier after dot in member expression but found '${property.kind}'`);
                }
            } else {
                computed = true;
                property = this.expression();
                this.nextExpect(TokenType.CloseBracket, `Expected TokenType.CloseBracket after member expression but found '${this.token().value}'`);
            }
            
            object = {
                kind: "Member",
                object: object,
                property: property,
                computed: computed,
            } as Member;
        }

        return object;
    }

    private args(): Expression[] {
        this.nextExpect(TokenType.OpenParen, `Expected TokenType.OpenParen at the start of args but found '${this.token().value}'`);
        const args = (this.token().type == TokenType.CloseParen) ? [] : this.argsList();
        this.nextExpect(TokenType.CloseParen, `Expected TokenType.CloseParen at the end of args but found '${this.token().value}'`);
        return args;
    }

    private argsList(): Expression[] {
        const args: Expression[] = [];
        while (this.token().type !== TokenType.CloseParen && this.token().type !== TokenType.EOF) {
            args.push(this.assignment());
            if (this.token().type == TokenType.Comma) {
                this.next();
            }
        }
        return args;
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
                this.nextExpect(TokenType.CloseParen, `Expected TokenType.CloseParen but found '${this.token().type}'`);
                return value;
            default:
                throw new Error(`Unexpected token found: '${this.token().value}'`);
        }
    }
}