'use strict';
let strategyPreview=[],strategyStart='',strategyMessage='',approving=false;
const koreaToday=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul'}).format(new Date());
const strategyMetrics=()=>Array.isArray(data.dailyMetrics)?data.dailyMetrics:[];
function proposedStart(){const now=koreaToday();const dates=managedPosts().map(p=>(p.date||'').slice(0,10)).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&d>=now).sort();const last=dates.at(-1);return last?BS.day(last,1):now}
function strategyView(){
 const today=koreaToday(),metrics=strategyMetrics();
 strategyStart||=proposedStart();
 const rank=BS.keywords(metrics,today,data.posts);
 const metricCell=(m)=>m.value===null?'미입력':m.value+' · '+m.days+'일 기록';
 $('view').innerHTML=`<section class="panel"><h2>AI 전략실</h2><p>네이버 검색 유입 → 화산불백 인지도 → 가맹·입점 상담</p><div class="blogcards">${channels.map(c=>`<div class="notice"><strong>${esc(c.name)}</strong><p>${esc(BS.roles[c.key])}</p></div>`).join('')}</div>
 <h3>1. 화산불백 검색어 분석</h3><p class="muted">최근 30일에 기록한 유입어와 연결되는 후보를 우선 표시합니다. 일수는 내 블로그 기록이며 네이버 전체 검색량이나 검색 순위가 아닙니다. 실제 수요와 검색 의도는 데이터랩과 검색 결과에서 확인하세요.</p>
 <div class="actions"><a href="https://datalab.naver.com/keyword/trendSearch.naver" target="_blank" rel="noopener">네이버 데이터랩에서 추이 비교</a><button onclick="strategyView()">유입 기록으로 다시 분석</button></div>
 <div class="tablewrap"><table><thead><tr><th>검색 후보</th><th>글의 방향</th><th>유입 기록</th><th>검색 결과</th></tr></thead><tbody>${rank.map(i=>`<tr><td>${esc(i.keyword)}${i.used?' · 유사 주제 있음':''}</td><td>${esc(i.angle)}</td><td>${i.days?i.days+'일':'확인된 기록 없음'}</td><td><a href="https://search.naver.com/search.naver?query=${encodeURIComponent(i.keyword)}" target="_blank" rel="noopener">네이버 검색</a></td></tr>`).join('')}</tbody></table></div>
 <h3>2. 30일 주제 선정과 원고 생성</h3><p class="muted">기존 일정과 유사 주제를 건너뛰고 맛 8편·창업 8편·브랜드 4편까지 추천합니다. 등록한 주제는 원고 작업에서 기존 AI로 생성합니다.</p>
 <label for="strategyStart">계획 시작일 · 한국시간</label><input id="strategyStart" type="date" value="${esc(strategyStart)}" min="${today}">
 <div class="actions"><button class="primary" onclick="previewStrategyPlan()">30일 주제 미리보기</button></div>
 ${strategyMessage?`<p class="notice" role="status">${esc(strategyMessage)}</p>`:''}
 ${strategyPreview.length?`<p>${esc(strategyStart)} ~ ${esc(BS.day(strategyStart,29))} · ${strategyPreview.length}편</p><div class="tablewrap"><table><thead><tr><th>추가</th><th>발행 예정</th><th>블로그·원고 제목</th></tr></thead><tbody>${strategyPreview.map((p,i)=>`<tr><td><input type="checkbox" class="strategyPick" value="${i}" checked aria-label="${esc(p.title)} 추가"></td><td>${esc(p.date.replace('T',' '))}</td><td><small>${esc(channels.find(c=>c.key===p.channel).name)}</small><br>${esc(p.title)}<br><small>${esc(p.angle)}</small></td></tr>`).join('')}</tbody></table></div><div class="actions"><button class="primary" onclick="saveStrategyPlan(false)">선택 주제 일정에 추가</button><button onclick="saveStrategyPlan(true)">선택 주제 추가 후 첫 원고 열기</button></div>`:''}
 <label for="strategyDraft">기존 일정·초안에서 원고 선택</label><select id="strategyDraft"><option value="">원고를 선택하세요</option>${managedPosts().filter(p=>!isLive(p)).map(p=>`<option value="${esc(p.id)}">${esc(p.date?.slice(0,10)||'날짜 미정')} · ${esc(p.title)}</option>`).join('')}</select><button onclick="writeFromStrategy()">선택 원고 AI 생성</button>
 <h3>3. 방문자·검색 유입·상담 성과</h3><p class="muted">최근 7일과 직전 7일의 입력값을 비교합니다. 기록일 수가 다르면 합계만으로 증감을 판단하지 마세요. 0과 미입력은 구분합니다.</p><div class="tablewrap"><table><thead><tr><th>블로그</th><th>기간</th><th>방문자</th><th>검색 유입</th><th>홈페이지 클릭</th><th>상담</th></tr></thead><tbody>${channels.flatMap(c=>[[today,'최근 7일'],[BS.day(today,-7),'직전 7일']].map(([end,label])=>{const m=BS.summary(metrics,c.key,end);return `<tr><td>${esc(c.name)}</td><td>${label}</td>${['visitors','searches','clicks','inquiries'].map(k=>`<td>${metricCell(m[k])}</td>`).join('')}</tr>`})).join('')}</tbody></table></div>
 ${channels.map(c=>{const next=rank.find(i=>i.channel===c.key&&!i.used&&i.days);return `<p><strong>${esc(c.name)}</strong> · ${next?'기록된 유입어와 연결되는 다음 후보: '+esc(next.title):'검증된 유입 후보가 아직 없습니다. 게시 후 검색 유입어와 상담 수를 기록하세요.'}</p>`}).join('')}
 <button onclick="setTab('성과 관리')">네이버 통계 기록하기</button></section>`;
}
function writeFromStrategy(){const p=data.posts.find(p=>p.id===$('strategyDraft').value&&!isLive(p));if(!p)return alert('작성할 미발행 원고를 선택하세요.');selectPost(p.id);return cloudAI()}
function previewStrategyPlan(){const start=$('strategyStart').value;if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||start<koreaToday()||!Number.isFinite(Date.parse(start)))return alert('오늘 이후의 계획 시작일을 선택하세요.');strategyStart=start;strategyPreview=BS.plan(start,strategyMetrics(),data.posts,koreaToday());strategyMessage=strategyPreview.length<20?'기존 일정이나 유사 주제를 제외하고 추가 가능한 '+strategyPreview.length+'편을 골랐습니다. 다른 기간도 확인할 수 있습니다.':'';strategyView()}
async function saveStrategyPlan(openFirst){
 if(contentBusy||cloudBusy)return;
 const picked=[...document.querySelectorAll('.strategyPick:checked')].map(el=>strategyPreview[Number(el.value)]).filter(Boolean);
 const next=BM.clone(data),added=[];
 for(const row of picked){
  if(next.posts.some(p=>(p.date||'').slice(0,10)===row.date.slice(0,10))||BS.similar(row,next.posts))continue;
  const profile=channels.find(c=>c.key===row.channel),id=channelBlogId(profile);
  const p={id:crypto.randomUUID(),channel:row.channel,topicType:row.channel,title:row.title,body:'',date:row.date,status:'작성 예정',series:'화산불백 30일 운영 계획',blogs:id?[id]:[],photos:[],count:3,seoKeywords:row.keyword,hashtags:'',keywords:'',brief:row.angle,photoBrief:BS.photos(row.channel,row.keyword).join('\n'),homepage:'https://bulbaek.com',tone:'실용적인 설명체',length:'보통',reviewed:false};
  p.hashtags=BS.tags(p);next.posts.push(p);added.push(p);
 }
 if(!added.length)return alert('추가할 주제를 선택하세요. 이미 일정에 등록된 주제는 제외됩니다.');
 try{await commitContent(next,'화산불백 전략 일정 추가');strategyPreview=[];strategyStart=proposedStart();strategyMessage=added.length+'편을 추가했습니다. 기존 원고와 발행 일정은 보존했습니다.';if(openFirst)selectPost(added[0].id);else render()}catch(e){alert(e.message)}
}
function acceptStrategyDraft(p,body){
 const issue=BS.draftIssue({...p,body},data.posts);if(issue)throw Error(issue+' 기존 원고는 유지했습니다.');
 const previous={...p};
 p.body=body;p.hashtags=BS.tags(p,body);
 if(!p.photoBrief?.trim())p.photoBrief=BS.photos(p.channel,(p.seoKeywords||'').split(',')[0].trim()).join('\n');
 p.status='검수 대기';p.reviewed=false;delete p.approvedAt;
 if(!save()){for(const k of Object.keys(p))if(!Object.hasOwn(previous,k))delete p[k];Object.assign(p,previous);throw Error('저장하지 못했습니다. 기존 원고를 유지했습니다.')}
}
async function setBrandReview(checked){
 const p=current();if(!p||approving)return;
 if(!checked){delete p.approvedAt;p.reviewed=false;if(['발행 준비','예약 발행'].includes(state(p)))p.status='검수 대기';save();render();return}
 const issue=BS.draftIssue(p,data.posts);if(issue){alert(issue);render();return}
 const before=JSON.stringify(p);approving=true;
 try{
  const r=await fetch('/api/ai/status',{cache:'no-store'}),info=await r.json();
  if(!r.ok)throw Error(info.error||'관리자 연결을 확인할 수 없습니다.');
  if(!info.authorized&&!await managerLogin())return;
  if(!data.posts.includes(p)||JSON.stringify(p)!==before)throw Error('승인 중 원고가 변경됐습니다. 다시 확인해 주세요.');
  p.reviewed=true;p.approvedAt=new Date().toISOString();if(!save()){p.reviewed=false;delete p.approvedAt;throw Error('승인 기록을 저장하지 못했습니다.')}toast('관리자 승인 완료. 네이버 편집기에서 발행할 수 있습니다.');
 }catch(e){alert(e.message)}finally{approving=false;render()}
}
