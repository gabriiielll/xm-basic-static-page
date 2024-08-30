#!/usr/bin/env node

/*
* Title: Basic static page generator
* Description: For generating basic html, css and js static page
* Date Created: August 30, 2024
* Author: Gabriel Lebue
*
*/

import { writeFile, createWriteStream, existsSync, mkdirSync, readFile } from 'fs';
import { get } from 'https';
import { prompt } from './prompt.js';

const projectName = await prompt('Folder name: ');
const gitUrl = 'https://raw.githubusercontent.com/gabriiielll/xm-basic-static-page/3940c0362cbe18f7ab04d8a03fe8e74985a23321';

if (!existsSync(projectName)) {
    new Promise(() => {
        

        mkdirSync(`./${projectName}`, {recursive: true});
        mkdirSync(`./${projectName}/assets`, {recursive: true});
        mkdirSync(`./${projectName}/assets/css`, {recursive: true});
        mkdirSync(`./${projectName}/assets/js`, {recursive: true});
        mkdirSync(`./${projectName}/assets/img`, {recursive: true});
        mkdirSync(`./${projectName}/assets/fonts`, {recursive: true});
        download(`${gitUrl}/package/assets/css/style.css`,`./${projectName}/assets/css/style.css`);
        download(`${gitUrl}/package/assets/img/close.svg`,`./${projectName}/assets/img/close.svg`);
        download(`${gitUrl}/package/assets/img/hamburger.svg`,`./${projectName}/assets/img/hamburger.svg`);
        download(`${gitUrl}/package/assets/js/script.js`,`./${projectName}/assets/js/script.js`);
        download(`${gitUrl}/package/index.html`,`./${projectName}/index.html`);
    }) 
}

// Build html file
const title = await prompt('Document Title: ');
const html = `./${projectName}/index.html`;

new Promise(() => {
    readFile(html, 'utf-8', (err, data) => {
        const content = data.replace('${title}',title).replace('${year}',new Date().getFullYear());
        writeFile(html,content, (err) => {});
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
        writeFile(newFile, content, (err) => {
            process.exit();
        });
    });
});

function download(url, filePath) {
    get(url, (response) => {
        if (response.statusCode === 200) {
            const file = createWriteStream(filePath);
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                });
        }
    });
}

function nullFill(val) {
    return !val ? "''" : (val.includes('http') ? `url('${val}')` : val);
}

async function cssVarsBuild(count, text, font = false) {
    const initArr = [];
    const finArr = [];
    const propName = text.toLowerCase().replace(' ','-');
    
    for (let a=1; a <= count; a++) initArr.push(await prompt(`${text} ${a}: `));
    initArr.map((val, key) => {finArr.push(`--${propName}-${key+1}:${nullFill(val)};`);});

    return finArr.join('\n');
}