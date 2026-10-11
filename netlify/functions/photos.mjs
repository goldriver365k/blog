import {handle} from './api.mjs';
const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const clean=s=>String(s||'').replace(/<[^>]*>/g,'').replace(/&(?:quot|#34);/g,'"').replace(/&amp;/g,'&').replace(/&(?:lt|gt);/g,'').trim().slice(0,300);
const topics=[
 {q:'restaurant kitchen',words:['조리','주방','맛','음식','공정','cooking','kitchen']},
 {q:'calculator accounting',words:['원가','매출','이익','비용','계산','수익','손익','cost','accounting']},
 {q:'restaurant waiter',words:['고객','손님','서비스','응대','직원','접객','customer','service']},
 {q:'restaurant interior',words:['상권','입지','좌석','인테리어','매장','동선','interior']},
 {q:'food ingredients',words:['재료','식재료','보관','재고','발주','ingredients']},
 {q:'restaurant menu',words:['메뉴','가격','객단가','menu']}
];
export function planPhotos(p){const paras=p.body.split(/\n\s*\n/).filter(x=>x.trim());const all=p.title+' '+p.body;
 let picked=topics.map(t=>({...t,score:t.words.reduce((n,w)=>n+(all.includes(w)?1:0),0)})).sort((a,b)=>b.score-a.score).slice(0,p.count);
 const manual=p.keywords?.split(',').map(x=>x.trim()).filter(Boolean).slice(0,p.count)||[];
 if(manual.length)picked=manual.map(q=>({q,words:topics.find(t=>t.q===q)?.words||[q]}));
 const occupied=new Set();return picked.map((t,k)=>{let best=-1,score=0;paras.forEach((s,i)=>{const n=t.words.reduce((n,w)=>n+(s.includes(w)?1:0),0);if(!occupied.has(i)&&n>score){best=i;score=n}});if(best<0)best=Math.min(Math.max(paras.length-1,0),Math.floor(paras.length*k/p.count));occupied.add(best);return {keyword:t.q.slice(0,100),afterParagraph:best}})
}
function normalize(page,slot){const info=page.imageinfo?.[0],m=info?.extmetadata;if(!info||!m||!/\.(jpe?g|png|webp)$/i.test(page.title))return null;
 const name=clean(m.LicenseShortName?.value),lic=clean(m.License?.value);if(!/^CC BY (?:[1234](?:\.0)?)$/i.test(name)&&!/^CC0(?: 1\.0)?$/i.test(name)&&!/^Public domain$/i.test(name))return null;
 if(m.Restrictions?.value)return null;
 let src;try{const u=new URL(info.thumburl||info.url);if(u.protocol!=='https:'||!['upload.wikimedia.org','thumb.wikimedia.org'].includes(u.hostname))return null;src=u.href}catch{return null}
 const license=m.LicenseUrl?.value|| (/^CC0/i.test(name)?'https://creativecommons.org/publicdomain/zero/1.0/':'https://commons.wikimedia.org/wiki/Commons:Copyright_tags#Public_domain');
 return {id:'commons-'+page.pageid,src,url:info.descriptionurl,photographer:clean(m.Artist?.value)||'저작자 정보는 원본 참조',alt:clean(page.title.replace(/^File:/,'')),title:clean(page.title.replace(/^File:/,'')),keyword:slot.keyword,afterParagraph:slot.afterParagraph,provider:'Wikimedia Commons',license,licenseName:name,licenseCode:lic};
}
export async function searchCommons(slots,upstream=fetch){const seen=new Set(),results=[],warnings=[];
 for(const slot of slots){try{const url=new URL('https://commons.wikimedia.org/w/api.php');url.search=new URLSearchParams({action:'query',generator:'search',gsrsearch:slot.keyword+' filetype:bitmap',gsrnamespace:'6',gsrlimit:'12',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1200',format:'json'});
 const r=await upstream(url,{headers:{'User-Agent':'BlogManager/1.0 (https://github.com/goldriver365k/blog)'},signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error();const j=await r.json();if(j.error)throw Error();const pages=Object.values(j.query?.pages||{}).sort((a,b)=>(a.index||0)-(b.index||0));for(const page of pages){const ph=normalize(page,slot);if(ph&&!seen.has(ph.id)){seen.add(ph.id);results.push(ph);if(results.filter(p=>p.keyword===slot.keyword).length>=3)break}}
 }catch{warnings.push(slot.keyword+' 검색 연결 실패')}}return {photos:results,warnings};
}
export async function photosHandler(request,env=process.env,upstream=fetch){
 const auth=await handle(new Request(new URL('/api/ai/status',request.url),{headers:{cookie:request.headers.get('cookie')||''}}),env);const status=await auth.json();if(!auth.ok)return reply(status,auth.status);if(!status.authorized)return reply({error:'관리자 로그인 후 사진 검색을 사용하세요.'},401);
 if(request.method!=='POST')return reply({error:'POST 요청이 필요합니다.'},405);if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'허용되지 않은 요청입니다.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'JSON 요청이 필요합니다.'},415);
 const raw=await request.text();if(raw.length>16000)return reply({error:'검색할 글이 너무 깁니다.'},413);let p;try{p=JSON.parse(raw)}catch{return reply({error:'입력 형식 오류'},400)}
 if(!p||typeof p.title!=='string'||p.title.length>300||typeof p.body!=='string'||p.body.length>12000||![2,3].includes(p.count)||(p.keywords!==undefined&&(typeof p.keywords!=='string'||p.keywords.length>300)))return reply({error:'사진 검색 입력을 확인하세요.'},400);
 const slots=planPhotos(p),result=await searchCommons(slots,upstream);return reply({...result,slots});
}
export default request=>photosHandler(request);
export const config={path:'/api/photos/search'};
