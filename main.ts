import Parser from './analysis/parser';
import * as readline from 'readline';
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
                const p = parser.createAST(answer);
                console.log(p.body);
        }
    
        cmd(rl, parser);
    });
}