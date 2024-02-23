import Parser from './analysis/parser';
import * as readline from 'readline';
import { evaluate } from './synthesis/interpreter'
import Environment from './synthesis/environment';
import { MKBOOL, MKNUMBER, MKNULL, NumberVal } from './synthesis/values';

repl();

function repl() {
    const parser = new Parser();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const env = new Environment();
    console.log("repl v0.1");
    cmd(rl, parser, env);
}

function cmd(rl: readline.Interface, parser: Parser, env: Environment) {
    rl.question('> ', (answer) => {
        switch(answer) {
            case 'exit':
                rl.close();
                process.exit();
            case 'quit':
                rl.close();
                process.exit();
            default:
                const ast = parser.createAST(answer);
                const i = evaluate(ast, env);
                // console.log(ast.body);
                // console.log("============================================\n");
                console.log(i);
        }
    
        cmd(rl, parser, env);
    });
}