import {cpSync,mkdirSync,rmSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
const html=readFileSync('public/index.html','utf8');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
rmSync('dist',{recursive:true,force:true});mkdirSync('dist',{recursive:true});cpSync('public','dist',{recursive:true});
console.log('Built static app and checked browser JavaScript. Netlify bundles functions separately.');
