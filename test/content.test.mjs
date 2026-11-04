import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context=vm.createContext({console,TextDecoder});
vm.runInContext(fs.readFileSync('public/content-core.js','utf8'),context);
vm.runInContext(fs.readFileSync('public/campaign-data.js','utf8'),context);
const {BM,BM_CAMPAIGN}=context;
const plain=x=>JSON.parse(JSON.stringify(x));
const seed=()=>BM.normalizeRows(BM_CAMPAIGN.rows);
const oldPost=(id,status)=>({id,status,title:'기존 '+id,body:'기존 원고 '+id,photos:[],blogs:['legacy'],metrics:{views:20}});
test('authoritative campaign has 20 unique posts, correct counts, dates and original fields',()=>{
 const posts=BM.validateCampaign(seed());assert.equal(posts.length,20);
 assert.deepEqual(plain(['food','taste','bulbaek'].map(c=>posts.filter(p=>p.channel===c).length)),[8,8,4]);
 for(let i=0;i<20;i++){const row=BM_CAMPAIGN.rows[i],p=posts[i];assert.equal(p.body,row['본문']);assert.equal(p.hashtags,row['해시태그']);assert.equal(p.photoBrief,row['추천사진']);assert.equal(p.homepage,row['연결URL']);assert.equal(p.date,row['발행일']+'T'+row['권장시간'])}
 assert.equal(posts[0].blogs[0],'goldriver365');assert.equal(posts[1].blogs[0],'goldriver365-100');
});
test('replacement preserves published records exactly, settings, performance and all photos',()=>{
 const draft=oldPost('draft','원고 작성');draft.photos=[{id:'ph',src:'data:image/jpeg;base64,YQ==',provider:'직접 첨부'}];
 const live=oldPost('live','게시 완료'),old={posts:[draft,live],blogs:[{id:'brand-official',name:'화산불백 공식블로그'}],bulbaekId:'brand-official',dailyMetrics:[{date:'2026-11-01',visitors:3}],someSetting:{enabled:true}};
 const before=JSON.stringify(old),next=BM.merge(old,seed(),true,'v1');assert.equal(JSON.stringify(old),before);assert.equal(next.posts.length,21);assert.deepEqual(plain(next.posts[0]),live);assert.equal(next.mediaLibrary.length,1);assert.equal(next.mediaLibrary[0].src,draft.photos[0].src);assert.deepEqual(plain(next.dailyMetrics),old.dailyMetrics);assert.deepEqual(plain(next.someSetting),old.someSetting);assert.equal(next.posts.find(p=>p.channel==='bulbaek').blogs[0],'brand-official');
 const repeated=BM.merge(next,seed(),true,'v1');assert.equal(repeated.posts.length,21);assert.equal(repeated.mediaLibrary.length,1);
});
test('append and replacement do not duplicate published or existing ID/title/body',()=>{
 const p=seed()[0],old={posts:[{...plain(p),status:'발행 완료'}],blogs:[]};const next=BM.merge(old,seed(),true);assert.equal(next.posts.length,20);assert.equal(next.posts.filter(x=>x.sourceId===p.sourceId).length,1);const appended=BM.merge(next,seed(),false);assert.equal(appended.posts.length,20);
});
test('CSV parser preserves multiline quoted bodies, commas, escaped quotes and BOM',()=>{
 const table=BM.parseCSV('\uFEFF제목,본문,발행일\r\n"제목, 하나","첫 줄\n둘째 ""인용""",2026-11-06\r\n');const rows=BM.records(table);assert.equal(rows[0]['제목'],'제목, 하나');assert.equal(rows[0]['본문'],'첫 줄\n둘째 "인용"');assert.throws(()=>BM.parseCSV('제목,"닫히지 않음'));
});
test('imports reject duplicate content, invalid dates, unknown blogs and executable IDs',()=>{
 const rows=plain(BM_CAMPAIGN.rows);assert.throws(()=>BM.normalizeRows([rows[0],rows[0]]));assert.throws(()=>BM.normalizeRows([{...rows[0],발행일:'2026-02-30'}]));assert.throws(()=>BM.normalizeRows([{...rows[0],블로그ID:'bad',블로그:'bad'}]));assert.throws(()=>BM.normalizeRows([{...rows[0],ID:"x');alert(1)//"}]));
});
