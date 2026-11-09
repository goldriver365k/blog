import {cpSync,mkdirSync,rmSync,readFileSync} from 'node:fs';
import vm from 'node:vm';
for(const file of ['public/content-core.js','public/campaign-data.js','public/campaign.js','public/strategy.js','public/strategy-panel.js','public/photo-library.js'])new vm.Script(readFileSync(file,'utf8'),{filename:file});
const html=readFileSync('public/index.html','utf8');
new vm.Script(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
rmSync('dist',{recursive:true,force:true});mkdirSync('dist',{recursive:true});cpSync('public','dist',{recursive:true});
console.log('Built static app and checked browser JavaScript. Netlify bundles functions separately.');
