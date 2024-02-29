import Parser from './analysis/parser';
import * as readline from 'readline';
import { evaluate } from './synthesis/interpreter'
import Environment from './synthesis/environment';
import { MKBOOL, MKNUMBER, MKNULL, NumberVal } from './synthesis/values';
import * as fs from 'fs';
import { Call, Declaration, Member } from './analysis/ast';

readFromFile();

function readFromFile() {
    const filename = './examples/example2.astro';
    let content = fs.readFileSync(filename, 'utf8');

    const parser = new Parser();
    const env = new Environment();
    const ast = parser.createAST(content);
    console.log(content);
    console.log(ast);
    console.log((ast.body[0] as Declaration).value);
    // console.log((ast.body[0] as Call).caller);
    // console.log((ast.body[0] as Member).object);
    // console.log((ast.body[0] as Member).property);
    // console.log((ast.body[0] as Call).args);
    // const result = evaluate(ast, env);
    // console.log(result);
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