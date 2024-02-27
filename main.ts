import Parser from './analysis/parser';
import * as readline from 'readline';
import { evaluate } from './synthesis/interpreter'
import Environment from './synthesis/environment';
import { MKBOOL, MKNUMBER, MKNULL, NumberVal } from './synthesis/values';
import * as fs from 'fs';

readFromFile();

function readFromFile() {
    const filename = './examples/example.astro';
    let content = fs.readFileSync(filename, 'utf8');

    const parser = new Parser();
    const env = new Environment();
    const ast = parser.createAST(content);
    const result = evaluate(ast, env);
    console.log(result);
}

function repl() {
    const parser = new Parser();
    const env = new Environment();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    console.log("repl v0.1");
    cmd(rl, parser, env);

    // cmd line
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
                    const result = evaluate(ast, env);
                    console.log(result);
            }       
            cmd(rl, parser, env);
        });
    }
}