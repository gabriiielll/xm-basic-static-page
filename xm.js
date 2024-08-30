/*
* Title: Basic static page generator
* Description: For generating basic html, css and js static page
* Date Created: August 30, 2024
* Author: Gabriel Lebue
*
*/

import { appendFile, writeFile, existsSync, mkdirSync, cpSync, readFile } from 'fs';
import { prompt } from './prompt.js';

const projectName = await prompt('Folder name: ');

if (!existsSync(projectName)) {
    new Promise(() => {
        mkdirSync(`./${projectName}`, {recursive: true});
        cpSync('./package/assets',`./${projectName}/assets`, {recursive: true});
    }) 
}

// Build html file
const title = await prompt('Document Title: ');

new Promise(() => {
    readFile('./package/index.html', 'utf-8', (err, data) => {
        const content = data.replace('${title}',title).replace('${year}',Date('Y'));
        const newFile = `./${projectName}/${title}.html`;
        if (!existsSync(`${newFile}`)) {
            appendFile(newFile,content, (err) => {});
        } else {
            console.error(`File ${title}.html already exist!`);
        }
    });
});


// Build css file
let {colors, fonts} = '';
const maxWidth = await prompt('Container max width (rem): ');
const numColors = await prompt('Number of color(s): ');
const numFonts = await prompt('Number of font(s): ');

colors  = await cssVarsBuild(numColors ? numColors : 1, 'Color');
fonts   = await cssVarsBuild(numFonts ? numFonts : 1, 'Font URL');

new Promise(() => {
    readFile(`./${projectName}/assets/css/style.css`, 'utf-8', (err, data) => {
        const content = data.replace(`--xcolors:'';`,colors).replace(`--xfonts:'';`,fonts).replace('xMaxWidth',nullFill(maxWidth));
        const newFile = `./${projectName}/assets/css/style.css`;
        writeFile(newFile, content, (err) => {});
    });
});

async function cssVarsBuild(count, text, font = false) {
    const initArr = [];
    const finArr = [];
    const propName = text.toLowerCase().replace(' ','-');
    
    for (let a=1; a <= count; a++) initArr.push(await prompt(`${text} ${a}: `));
    initArr.map((val, key) => {finArr.push(`--${propName}-${key+1}:${nullFill(val)};`);});

    return finArr.join('\n');
}

function nullFill(val) {
    return !val ? "''" : (val.includes('http') ? `url('${val}')` : val);
}