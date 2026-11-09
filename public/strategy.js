(function(root){
'use strict';
const rules='모든 본문은 화산불백을 중심으로 작성하세요. 브랜드명과 함께 주제에 직접 관련된 실제 메뉴·조리·운영·입점 상담 정보 중 하나 이상을 구체적으로 설명하세요. 이름이나 링크만 덧붙이는 것으로 끝내지 마세요. 제목에는 검색 의도를 우선하고 브랜드명을 억지로 반복하지 마세요. 확인되지 않은 매출·수익·운영 실적·점포 상태·모집 조건을 지어내지 마세요.';
const roles={
 taste:'소비자에게 메뉴의 맛과 선택 기준을 설명하세요. 직화불백덮밥과 간장직화·매운직화·고추장버터·마라 등 화산불백 메뉴에서 해당 주제에 맞는 사례를 선택하세요. 실제 방문한 것처럼 꾸미지 마세요.',
 food:'예비 창업자가 판단할 수 있도록 화산불백의 불백덮밥 중심 메뉴 구성, 표준 조리 또는 소형 매장 동선 가운데 해당 주제를 실제 운영 방식과 연결하세요. 확인된 자료 없이 비용·매출·수익을 제시하지 마세요.',
 bulbaek:'가맹 희망자에게 화산불백 브랜드와 입점 파트너 상담의 검토 사항을 설명하고 필요 시 https://bulbaek.com을 안내하세요. 현재 모집지·계약 조건·운영 실적은 제공 자료로 확인되는 경우에만 적으세요.'
};
const raw={
 taste:[
 ['직장인 점심 덮밥','직장인 점심 덮밥, 짧은 점심시간에 고르는 기준','화산불백 직화불백덮밥의 한 그릇 구성과 점심 메뉴 선택을 연결'],
 ['혼밥 점심 메뉴','혼밥 점심 메뉴, 고기 덮밥이 당기는 날 고르는 법','화산불백 기본 불백과 간장직화 중 맛의 선택 기준'],
 ['직화불백 덮밥','직화불백 덮밥에서 불향과 밥의 균형이 중요한 이유','화산불백 직화 조리와 덮밥으로 완성하는 방식'],
 ['고추장버터 불백','고추장버터 불백은 매콤함과 고소함이 어떻게 다를까','화산불백 고추장버터 메뉴의 버터·치즈·고추장 조합'],
 ['간장불백 덮밥','간장불백 덮밥, 매운맛 없이 즐기는 점심 선택','화산불백 간장직화 메뉴의 맛 선택 기준'],
 ['매운 돼지불백','매운 돼지불백이 먹고 싶은 날 살펴볼 맛의 차이','화산불백 매운직화와 기본 메뉴의 차이'],
 ['불백 쌀국수 세트','불백과 쌀국수 세트, 밥과 국물을 함께 고르는 이유','화산불백 덮밥과 쌀국수의 세트 구성'],
 ['마라 불백 덮밥','마라 불백 덮밥, 평소 먹던 불백과 뭐가 다를까','화산불백 마라 메뉴의 향과 매운맛 선택 기준'],
 ['고기 덮밥 메뉴','고기 덮밥 메뉴, 돼지불백과 우삼겹 중 고르는 법','화산불백의 기본 불백과 우삼겹 메뉴의 차이'],
 ['불백 포장 메뉴','불백을 포장할 때 밥과 소스에서 확인할 점','화산불백 덮밥을 포장 메뉴로 검토할 때의 식사 구성']
 ],
 food:[
 ['소자본 음식점 창업','소자본 음식점 창업, 덮밥 메뉴 구성을 먼저 좁혀야 하는 이유','화산불백 기본·시그니처 메뉴 구성 사례와 필요한 설비 검토'],
 ['10평 음식점 창업','10평 음식점 창업, 조리대와 포장대 동선부터 그려보기','화산불백 덮밥 조리·담기·포장에 필요한 작업 순서'],
 ['음식점 원가 계산','음식점 원가 계산, 불백 한 그릇에서 무엇을 따로 기록할까','화산불백 한 그릇의 고기·밥·소스·포장재 항목 분리'],
 ['업종 변경 음식점 창업','업종 변경 음식점 창업, 기존 주방에서 남길 설비 확인법','화산불백 직화 메뉴 전환 시 화구·배기·작업대 확인'],
 ['적은 인원 운영 식당','적은 인원으로 운영하는 식당, 피크 시간 역할 나누기','화산불백 주문·직화 조리·담기·제공 단계의 분담'],
 ['덮밥 전문점 창업','덮밥 전문점 창업, 메뉴가 늘어도 주방이 복잡해지지 않으려면','화산불백 기본 메뉴와 소스 변형 메뉴의 공통 작업'],
 ['부부 창업 음식점','부부 창업 음식점, 점심 피크에 한 사람이 맡을 일 정하기','화산불백 조리 담당과 주문·담기 담당의 구체적인 업무 구분'],
 ['직장인 점심 상권','직장인 점심 상권, 계약 전 시간대별 주문 흐름을 보는 방법','화산불백 한 그릇 메뉴를 점심 상권에 대입하는 검토 항목'],
 ['오래 할 수 있는 음식점 창업','오래 할 수 있는 음식점 창업, 재고와 조리 부담을 살펴보기','화산불백 공통 식재료와 조리 공정에서 점검할 항목'],
 ['프랜차이즈 창업 비용','프랜차이즈 창업 비용, 가맹비 외에 따로 확인할 항목','화산불백 상담 시 주방·배기·임대 조건 확인, 실제 금액은 자료 없으면 기재 금지']
 ],
 bulbaek:[
 ['화산불백 브랜드','화산불백은 어떤 덮밥 브랜드인가, 직화불백 메뉴에서 시작된 이야기','돼지불백덮밥 전문 브랜드의 메뉴 방향과 슬로건 소개'],
 ['화산불백 입점 파트너','화산불백 입점 파트너 상담 전, 후보 점포에서 확인할 세 가지','입점 희망자가 준비할 상권·면적·기존 주방 정보와 공식 문의 경로'],
 ['화산불백 가맹 상담','화산불백 가맹 상담, 첫 문의에 준비하면 좋은 자료','희망 지역·운영 형태·예산·점포 보유 여부를 정리하는 법'],
 ['직화불백 프랜차이즈','직화불백 프랜차이즈를 비교할 때 화산불백에 물어볼 질문','브랜드의 메뉴 운영과 조리 기준, 상담에서 확인할 지원 범위'],
 ['화산불백 업종변경','화산불백 업종변경 상담, 기존 매장을 어떻게 검토할까','현장 확인 전 배기·전기·화구와 영업 방식 자료 준비'],
 ['화산불백 메뉴 구성','화산불백 메뉴 구성, 기본 불백부터 시그니처까지','기본·시그니처·고기특화 메뉴 라인의 역할 소개']
 ]
};
const ideas=Object.entries(raw).flatMap(([channel,rows])=>rows.map(([keyword,title,angle],i)=>({id:channel+'-'+i,channel,keyword,title,angle})));
const clean=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/https?:\/\/\S+|#[\p{L}\p{N}_]+/gu,'').replace(/[^\p{L}\p{N}]/gu,'');
function score(a,b,n){if(a===b&&a)return 1;if(a.length<n||b.length<n)return 0;const grams=s=>new Set(Array.from({length:s.length-n+1},(_,i)=>s.slice(i,i+n)));const x=grams(a),y=grams(b);let common=0;for(const g of x)if(y.has(g))common++;return common/(x.size+y.size-common)}
function similar(p,posts){const t=clean(p.title),b=clean(p.body);return posts.find(q=>q.id!==p.id&&(score(t,clean(q.title),3)>=0.73||(b.length>=45&&score(b,clean(q.body),5)>=0.52)))}
function photos(channel,keyword){const subject=keyword||'화산불백';return channel==='taste'?[subject+'에 해당하는 화산불백 실제 메뉴 전체 사진','고기·소스 또는 덮밥 구성의 실제 근접 사진','같은 메뉴의 곁들임·세트 사진(보유 시)']:channel==='food'?['화산불백 실제 작업대·주방 사진(공개 가능 자료)','주제에 맞는 화산불백 조리·담기 과정 사진','실제 운영 체크리스트 또는 동선 자료(보유 시)']:['화산불백 공식 로고 또는 매장 외관 사진','화산불백 실제 대표 메뉴·운영 사진','상담 주제와 관련된 공개 가능한 점포 자료(보유 시)']}
function tags(p,body=''){const match=String(body).match(/#[\p{L}\p{N}_]+/gu)||[];const extra=p.channel==='taste'?['직화불백','불백덮밥','점심메뉴','혼밥메뉴','덮밥메뉴']:p.channel==='food'?['식당창업','음식점운영','외식업창업','덮밥전문점','불백창업']:['직화불백','화산불백가맹','입점파트너','외식프랜차이즈','덮밥전문점'];return [...new Set(['#화산불백',...(p.seoKeywords||'').split(',').map(k=>clean(k)).filter(Boolean).map(k=>'#'+k),...match,...extra.map(k=>'#'+k)])].slice(0,8).join(' ')}
function draftIssue(p,posts){if(!p.body?.trim())return '본문을 먼저 작성하세요.';if(!p.body.replace(/#[\p{L}\p{N}_]+/gu,'').includes('화산불백'))return '본문에 화산불백의 실제 메뉴·운영·브랜드 정보를 주제와 연결해 주세요.';const hit=similar(p,posts);return hit?'기존 글과 제목 또는 본문이 유사합니다: '+hit.title:''}
function day(date,offset){const d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10)}
function recent(rows,ending,days=7){const start=day(ending,1-days);return rows.filter(r=>typeof r.date==='string'&&r.date>=start&&r.date<=ending)}
function keywords(metrics,ending,posts=[]){const rows=recent(metrics,ending,30);return ideas.map(i=>{const k=clean(i.keyword);const matching=rows.filter(r=>r.channel===i.channel&&String(r.queries||'').split(/[,;\n]/).some(q=>{const x=clean(q);return x.length>=4&&(x===k||x.includes(k)||k.includes(x))}));return {...i,days:new Set(matching.map(r=>r.date)).size,used:!!similar(i,posts)}}).sort((a,b)=>b.days-a.days)}
function summary(rows,channel,ending,days=7){const metrics=recent(rows.filter(r=>r.channel===channel),ending,days);const out={days:new Set(metrics.map(r=>r.date)).size};for(const k of ['visitors','searches','clicks','inquiries']){const present=metrics.filter(r=>Number.isFinite(r[k]));out[k]={value:present.length?present.reduce((s,r)=>s+r[k],0):null,days:new Set(present.map(r=>r.date)).size}}return out}
function plan(start,rows,posts,ending){const ranked=keywords(rows,ending,posts);const used=new Set(posts.map(p=>String(p.date||'').slice(0,10)));const result=[];const rhythm=['taste','food','taste','food','bulbaek'];const counts={taste:0,food:0,bulbaek:0},targets={taste:8,food:8,bulbaek:4};for(let n=0;n<30;n++){const date=day(start,n);if(used.has(date)||n<Math.floor(result.length*1.5))continue;const preferred=rhythm[result.length%rhythm.length];const channels=[...new Set([preferred,...rhythm])];const next=channels.map(c=>counts[c]<targets[c]?ranked.find(i=>i.channel===c&&!i.used&&!result.some(p=>p.id===i.id)&&!similar(i,result)):null).find(Boolean);if(!next)break;counts[next.channel]++;result.push({...next,date:date+'T'+({taste:'11:30',food:'18:30',bulbaek:'19:00'}[next.channel])});if(result.length===20)break}return result}
root.BS={rules,roles,ideas,similar,photos,tags,draftIssue,day,recent,keywords,summary,plan};
})(globalThis);
