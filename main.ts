import Parser from './analysis/parser';
import * as readline from 'readline';
import { evaluate } from './synthesis/interpreter'
// import * as fs from 'fs';
// const source = fs.readFileSync(process.argv.slice(2,3)[0], 'utf8');

astro();

function astro() {
    const parser = new Parser();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    console.log("astro v0.1");
    cmd(rl, parser);
}

function cmd(rl: readline.Interface, parser: Parser) {
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
                const i = evaluate(ast);
                // console.log(ast.body);
                // console.log("============================================\n");
                console.log(i);
        }
    
        cmd(rl, parser);
    });
}