import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import fs from 'node:fs';
import '../public/writing-rules.js';
const {BW}=globalThis;
const paragraphs=[
 '점심 상권부터 보기\n소자본 음식점 창업을 준비한다면 먼저 평일 점심시간의 유동 인구를 살펴보세요. 같은 거리를 오전과 점심에 걸어 보면 주변 사무실에서 손님이 어느 방향으로 들어오는지 파악할 수 있습니다. 가까운 식당에서 혼자 먹는 손님과 포장 손님이 얼마나 나뉘는지도 기록해 보세요.',
 '한 그릇 메뉴로 주방 점검\n화산불백은 직화 돼지불백덮밥 전문점입니다. 직화 조리와 밥 담는 자리, 포장대를 어떤 순서로 배치할지 그려 보세요. 주방 장비를 정하기 전에 배기와 작업대 위치를 확인하면 준비에 필요한 항목을 구분하기 쉽습니다. 점심 주문이 몰리는 시간에는 누가 조리하고 누가 담을지도 정해 두는 편이 좋습니다.',
 '입점 상담 전 확인할 것\n가맹비 무료이며 업종변경이 가능합니다. 인테리어와 주방 장비는 직접 선택할 수 있습니다. 화산불백은 테헤란로·판교 입점 파트너를 모집합니다. 상권과 주방을 함께 검토하려면 창업 문의 때 희망 지역, 점포 유무, 기존 설비를 정리해 주세요. 현장 여건에 따라 필요한 공사와 준비 항목이 달라질 수 있으니 계약 전에 확인하는 것이 좋습니다.'
];
const valid={title:'소자본 음식점 창업, 점심 상권에서 먼저 볼 것',body:paragraphs.join('\n\n'),keywords:['소자본 음식점 창업','점심 상권','주방 장비'],hashtags:['#화산불백','#소자본음식점창업','#점심상권','#주방장비','#직화불백','#덮밥전문점','#입점파트너','#외식업창업']};
test('writing rules validate length, SEO, brand and tags',()=>{
 assert.equal(BW.issue(BW.parse(JSON.stringify(valid))), '');
 for(const [patch,error] of [[{body:'짧은 글'},/500~800/],[{body:valid.body.repeat(2)},/500~800/],[{title:'점심 메뉴 소개'},/제목에는/],[{keywords:['식당','식당 창업','화산불백']},/겹치/],[{body:valid.body.replace('직화 돼지불백덮밥','된장불백')},/된장/],[{hashtags:valid.hashtags.slice(0,7)},/8~10/]])assert.match(BW.issue({...valid,...patch}),error);
});
test('one correction retries invalid drafts without mutating the existing draft',async()=>{
 const p={title:'기존 제목',body:'기존 본문'};
 const source=fs.readFileSync('public/campaign.js','utf8');
 const checked=vm.runInNewContext(source.slice(source.indexOf('async function checkedBrandDraft'),source.indexOf('function saveBrandDraft'))+'\ncheckedBrandDraft',{BW,BS:{draftIssue:()=>''},data:{posts:[p]},toast:()=>{}});
 const feedback=[];
 const got=await checked(p,async note=>{feedback.push(note);return JSON.stringify(feedback.length===1?{...valid,body:'너무 짧음'}:valid)});
 assert.equal(got.title,valid.title);
 assert.match(feedback[1],/500~800/);
 await assert.rejects(checked(p,async()=>JSON.stringify({...valid,body:'너무 짧음'})),/기존 원고는 유지/);
 assert.deepEqual(p,{title:'기존 제목',body:'기존 본문'});
});
