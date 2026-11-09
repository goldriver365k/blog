'use strict';
const photoTagKey=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const commonPhotoTags=new Set(['화산불백','사진','이미지','메뉴','음식']);
function photoTags(text){
 const unique=new Map();
 for(const raw of String(text||'').split(/[,，;\n]/)){
  const value=raw.trim().slice(0,40),key=photoTagKey(value);
  if(key.length>=2&&!commonPhotoTags.has(key)&&!unique.has(key))unique.set(key,value);
 }
 return [...unique.values()].slice(0,10).join(', ');
}
function matchingLibraryPhotos(p,library){
 const title=photoTagKey(p.title),keywords=String(p.seoKeywords||'').split(/[,，;\n]/).map(photoTagKey).filter(Boolean);
 const remaining=Math.max(0,([2,3].includes(p.count)?p.count:3)-p.photos.length);
 const used=new Set(p.photos.map(x=>x.src)),paras=String(p.body||'').split(/\n\s*\n/).filter(x=>x.trim());
 const candidates=library.flatMap(ph=>{
  if(!ph||!safeImage(ph.src)||used.has(ph.src))return [];
  const tags=photoTags(ph.archiveTags).split(', ').map(photoTagKey).filter(Boolean);
  const matches=tags.filter(t=>title.includes(t)||keywords.some(k=>k.includes(t)));
  if(!matches.length)return [];
  const score=Math.max(...matches.map(t=>(title.includes(t)?100:0)+(keywords.includes(t)?30:0)+Math.min(t.length,40)));
  return [{ph,matches,score}];
 }).sort((a,b)=>b.score-a.score);
 const out=[];
 for(const {ph,matches} of candidates){
  if(out.length>=remaining)break;
  if(used.has(ph.src))continue;
  used.add(ph.src);
  const position=paras.findIndex(s=>matches.some(t=>photoTagKey(s).includes(t)));
  out.push({...ph,id:crypto.randomUUID(),afterParagraph:position<0?null:position});
 }
 return out;
}
function fillLibraryPhotos(p){
 if(!p?.body?.trim()||isLive(p))return 0;
 const added=matchingLibraryPhotos(p,data.mediaLibrary||[]);
 if(!added.length)return 0;
 const previous={...p};
 p.photos=[...p.photos,...added];touchPost(p);
 if(!save()){
  for(const k of Object.keys(p))if(!Object.hasOwn(previous,k))delete p[k];
  Object.assign(p,previous);return -1;
 }
 return added.length;
}
function placeLibraryPhotos(){
 const p=current();
 if(!p?.body?.trim())return toast('본문을 먼저 작성하세요.');
 if(p.photos.length>=p.count)return toast('설정한 사진 수만큼 이미 첨부되어 있습니다.');
 const count=fillLibraryPhotos(p);
 render();
 if(count>0)toast('보관함 사진 '+count+'장을 배치했습니다.');
 else if(count===0)toast('맞는 사진이 없습니다. 사진 보관함에서 메뉴·주제 검색어를 등록하거나 직접 첨부하세요.');
 else toast('저장 공간이 부족해 사진을 배치하지 못했습니다.');
}
let libraryUploadBusy=false;
async function uploadLibraryPhotos(){
 if(libraryUploadBusy)return;
 const tags=photoTags($('libraryUploadTags').value),files=[...$('libraryUploadFiles').files];
 if(!tags||!files.length)return toast('사진을 고르고 구체적인 검색어를 입력하세요.');
 libraryUploadBusy=true;let added=0;const errors=[];
 try{
  for(const file of files){
   try{
    const src=await encodePhoto(file);
    const existing=(data.mediaLibrary||[]).find(x=>x.src===src);
    if(existing)continue;
    data.mediaLibrary??=[];
    data.mediaLibrary.push({id:crypto.randomUUID(),src,alt:file.name,provider:'직접 첨부',photographer:'',keyword:'',archiveTags:tags});
    if(!save()){data.mediaLibrary.pop();errors.push('저장 공간이 부족합니다.');break}
    added++;
   }catch(e){errors.push(e.message)}
  }
 }finally{libraryUploadBusy=false}
 if(tab==='사진 보관함')render();
 toast(added+'장 등록했습니다.'+(errors.length?' '+errors[0]:added?'':' 같은 사진은 다시 등록하지 않았습니다.'));
}
function editArchiveTags(i,value){
 const ph=data.mediaLibrary?.[i];if(!ph)return;
 const before=ph.archiveTags;ph.archiveTags=photoTags(value);
 if(!save()){ph.archiveTags=before;render();return}
 toast(ph.archiveTags?'자동 배치 검색어를 저장했습니다.':'검색어를 비워 자동 배치 대상에서 제외했습니다.');
}
function archiveAttachedPhoto(i){
 const p=current(),ph=p?.photos[i];
 if(!ph||ph.provider!=='직접 첨부'||!safeImage(ph.src))return;
 data.mediaLibrary??=[];
 if(data.mediaLibrary.some(x=>x.src===ph.src))return toast('이미 사진 보관함에 있습니다.');
 data.mediaLibrary.push({...ph,id:crypto.randomUUID(),archiveTags:ph.archiveTags||'',afterParagraph:null});
 if(!save()){data.mediaLibrary.pop();return}
 toast('사진을 보관했습니다. 사진 보관함에서 자동 배치 검색어를 입력하세요.');
}
