import assert from 'node:assert/strict';
import test from 'node:test';
import '../public/strategy.js';
const {BS}=globalThis;
test('30-day plan skips occupied dates and existing titles, without changing data',()=>{
 const posts=[{id:'existing',title:BS.ideas[0].title,date:'2026-11-10T12:00',body:'기존 원고'}],snapshot=JSON.stringify(posts);
 const next=BS.plan('2026-11-10',[],posts,'2026-11-09');
 assert.equal(JSON.stringify(posts),snapshot);
 assert.equal(next.length,20);
 assert.deepEqual(['taste','food','bulbaek'].map(c=>next.filter(p=>p.channel===c).length),[8,8,4]);
 assert(next.every(x=>x.title!==posts[0].title&&x.date.slice(0,10)!=='2026-11-10'&&x.date<'2026-12-10'&&(x.angle.includes('화산불백')||x.channel==='bulbaek')));
 assert.equal(new Set(next.map(x=>x.date.slice(0,10))).size,20);
 assert(next.at(-1).date>='2026-12-07');
});
test('analytics separate missing metrics from zero and count only recorded search terms',()=>{
 const rows=[{date:'2026-11-08',channel:'taste',visitors:0,searches:null,queries:'직장인 점심 덮밥, 다른 말'},{date:'2026-10-01',channel:'taste',visitors:8,queries:'마라 불백 덮밥'}];
 const m=BS.summary(rows,'taste','2026-11-09');
 assert.deepEqual(m.visitors,{value:0,days:1});
 assert.deepEqual(m.searches,{value:null,days:0});
 const rank=BS.keywords(rows,'2026-11-09');
 assert.equal(rank[0].keyword,'직장인 점심 덮밥');
 assert.equal(rank[0].days,1);
});
test('draft gate catches hashtag-only brand mentions and near copies across blogs',()=>{
 const body='화산불백 직화불백덮밥은 고기를 직화로 조리해 밥과 함께 한 그릇으로 내는 메뉴입니다. 점심에는 조리 순서와 제공 동선이 중요합니다.';
 assert.match(BS.draftIssue({title:'메뉴',body:'일반 글입니다. #화산불백'},[]),/실제 메뉴/);
 assert.match(BS.draftIssue({id:'a',title:'창업 기준',body:body+' 한 문장 추가.'},[{id:'b',channel:'taste',title:'점심 메뉴',body}]),/유사/);
 assert.equal(BS.draftIssue({title:'식사 구성',body},[]),'');
 assert(BS.tags({channel:'taste'},'#화산불백').split(' ').length>=5);
 assert.equal(BS.photos('food','동선').length,3);
});
