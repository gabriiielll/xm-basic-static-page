/*
* Title: Prompt Javascript module
* Description: For imitating prompt log function in javascript in console for nodeJS
* Date Created: August 30, 2024
* Author: Gabriel Lebue
*
*/

import readLine from 'node:readline';

const rl = readLine.createInterface({input: process.stdin, output: process.stdout});
export const prompt = (question) => new Promise((answer) => rl.question(question, answer));
