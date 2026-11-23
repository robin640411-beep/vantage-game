const voyageStore='wanjing.solo.voyages.1';
function voyageEntries(){
 if(!s)return [];
 // Old saves retain the stories that were actually recorded.
 if(!s.voyage)s.voyage=(s.journal||[]).map((row,i)=>({turn:row.turn,story:i}));
 return s.voyage
}
function tripEvent(title,body='',loc=s.loc){
 voyageEntries().push({turn:s.turn,loc,title,body})
}
function noteDecision(message){
 if(s.a)(s.a.decisions??=[]).push(message);
 else tripEvent('我的選擇',message)
}
function revealedStory(a){
 const readEntries=[];
 const {shown,parts,branched}=storyParts(a.text,a.choice),lines=[shown],choices=[...(a.decisions||[])];
 function selected(parts,i){if(i!=null&&parts[i])choices.push(parts[i].slice(1).trim().split(/[：:；。]/)[0])}
 if(branched)selected(parts,a.choice);
 storyRefs(shown,storySource(a),a.reading||{},'a',[],lines,(_,parts,branched,i,shown,ref)=>{if(ref)readEntries.push(ref.book+':'+ref.id);if(branched)selected(parts,i)});
 return {turn:s.turn,kind:a.kind,sourceCard:a.id,readEntries,event:a.event,loc:a.origin||(a.kind==='地點'?a.id:s.loc),title:a.title,action:a.name,choices,body:lines.join('\n\n'),cardIds:revealCards(a)}
}
function voyageRows(current){
 const list=voyageEntries().map(e=>e.story==null?e:s.journal?.[e.story]).filter(Boolean);
 if(current&&s.a&&s.phase!=='ended'){
  if(s.phase==='result'&&!s.stats.includes(0))list.push({...revealedStory(s.a),pending:true});
  else list.push({turn:s.turn,loc:s.a.origin||s.loc,title:s.a.name,pending:true,choices:s.a.decisions||[],body:'已宣告行動。'})
 }
 return list
}
function oldVoyages(){try{return JSON.parse(localStorage.getItem(voyageStore)||'[]')}catch{return []}}
function newJourney(force=false){
 if(!s||(!force&&s.phase!=='ended'))return;
 if(force&&!confirm('確定要放棄這一局，開始一段新旅程嗎？目前進度將不會保留。'))return;
 try{
 const old=JSON.parse(localStorage.getItem(voyageStore)||'[]');
 const id=s.tripId??(s.tripId=Date.now());
 if(!old.some(t=>t.id===id)&&s.hero!=null&&s.turn)old.push({id,hero:s.hero,mission:s.mission,end:s.end||'中途放棄旅程',rows:voyageRows(false)});
 localStorage.setItem(voyageStore,JSON.stringify(old))
 }catch{return warn('裝置無法保存旅行見聞，目前旅程仍保留。')}
 s=null;tab='探險';notice='';
 try{localStorage.removeItem(slotKey)}catch{}
 save()
}
function tripRow(row,expanded){
 const loc=row.loc?' · 地點 '+pad(row.loc):'';
 return '<details class="tripEntry"'+(expanded?' open':'')+'><summary><small>第 '+esc(row.turn)+' 回合'+esc(loc)+(row.pending?' · 進行中':'')+'</small><b>'+esc(row.title||row.action)+'</b></summary>'+
 (row.action?'<p>行動　'+esc(row.action)+'</p>':'')+
 (row.choices?.length?'<h4>我的選擇</h4><ul>'+row.choices.map(v=>'<li>'+esc(v)+'</li>').join('')+'</ul>':'')+
 (row.body?'<p class="story">'+esc(row.body)+'</p>':'')+cardShelf(row.cardIds||[],'旅途中獲得')+'</details>'
}
function viewVoyage(index=-1){
 const old=oldVoyages(),archived=index>=0?old[index]:null;
 const rows=archived?archived.rows:s?voyageRows(true):[];
 const heading=archived?roleNames[archived.hero]+' · '+archived.end:s?'本次旅程':'歷次旅程';
 show('<section class="travelBook"><h2>旅行見聞</h2><p>'+esc(heading)+'</p>'+
 rows.slice().reverse().map((r,i)=>tripRow(r,i===0)).join('')+
 (s&&index!==-1?btn('回到本次旅程','viewVoyage()'):'')+
 (old.length?'<h3>已結束的旅程</h3>'+old.map((t,i)=>btn('第 '+(i+1)+' 次 · '+roleNames[t.hero]+' · '+t.end,'viewVoyage('+i+')')).join(''):'')+'</section>')
}

let currentDiaryMode = 'story';

function setDiaryMode(mode){
 currentDiaryMode = mode;
 if(typeof tab !== 'undefined' && tab === '日記'){
  render();
 } else {
  go('日記');
 }
}

function saveCustomNote(){
 const el = document.getElementById('customDiaryNote');
 if(el && s){
  s.customNotes = el.value;
  save();
  notice = '探險筆記已儲存。';
  render();
 }
}

function clearCustomNote(){
 if(s && confirm('確定要清空筆記內容嗎？')){
  s.customNotes = '';
  save();
  notice = '探險筆記已清空。';
  render();
 }
}

function diaryPanel(){
 if(!s) return '<section class="panel diaryView"><p>目前尚未開始旅程。</p></section>';
 const curLoc = s.loc;
 const curRegion = typeof getLocationRegion === 'function' ? getLocationRegion(curLoc) : 'C';
 const heroName = (typeof roleNames !== 'undefined' && s.hero != null) ? roleNames[s.hero] : '探險者';
 const rows = (typeof voyageRows === 'function') ? voyageRows(true) : [];
 const logEntries = s.log || [];
 const customNotes = s.customNotes || '';

 let contentHtml = '';
 if(currentDiaryMode === 'story'){
  if(!rows.length){
   contentHtml = '<div style="padding:24px 16px;text-align:center;color:#6b5f4c;background:#fffcf5;border:1px dashed #d5cdb8;border-radius:8px;"><p style="font-size:1.05rem;margin:0 0 6px;">📖 目前尚無故事見聞紀錄</p><small>當你在探險中宣告行動、擲骰並結算後，所有經歷的故事與抉擇都會自動收錄於此！</small></div>';
  } else {
   contentHtml = `
    <div class="diaryStoryList">
     ${rows.slice().reverse().map((r, i) => tripRow(r, i === 0)).join('')}
    </div>
   `;
  }
 } else if(currentDiaryMode === 'log'){
  if(!logEntries.length){
   contentHtml = '<p style="color:#776d58;margin:12px 0;">目前尚無行動紀錄。</p>';
  } else {
   contentHtml = `
    <div class="diaryLogContainer">
     ${logEntries.slice().reverse().map((l, idx) => `
      <div class="diaryLogItem">
       <span class="logIndex">#${logEntries.length - idx}</span>
       <span class="logText">${esc(l)}</span>
      </div>
     `).join('')}
    </div>
   `;
  }
 } else if(currentDiaryMode === 'notes'){
  contentHtml = `
   <div class="diaryNotesContainer">
    <p style="font-size:.9rem;color:#495d52;margin-bottom:8px;">
     ✍️ <b>探險隨筆備忘</b>：記錄在星球探索中發現的密碼、謎題線索、隱蔽地城位置或下一步探索計畫。筆記將即時保存在存檔中。
    </p>
    <textarea id="customDiaryNote" rows="8" style="width:100%;border:1px solid #c7c1ae;border-radius:8px;padding:10px;font:inherit;background:#fffcf5;line-height:1.6;" placeholder="寫下你的探險心得、地標線索、未解之謎...">${esc(customNotes)}</textarea>
    <div style="margin-top:8px;display:flex;gap:8px;">
     <button class="primary" onclick="saveCustomNote()">💾 儲存筆記</button>
     <button onclick="clearCustomNote()">清空筆記</button>
    </div>
   </div>
  `;
 } else if(currentDiaryMode === 'history'){
  const old = (typeof oldVoyages === 'function') ? oldVoyages() : [];
  if(!old.length){
   contentHtml = '<div style="padding:20px;text-align:center;color:#7a6d55;background:#fffcf5;border:1px dashed #d5cdb8;border-radius:8px;"><p>尚無已結束的歷史探險存檔。</p></div>';
  } else {
   contentHtml = `
    <div class="diaryHistoryList" style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
     ${old.map((t, idx) => `
      <div class="historyTripCard" style="background:#fffcf5;border:1px solid #d5cdb8;border-radius:8px;padding:10px;">
       <div style="display:flex;justify-content:space-between;align-items:center;">
        <h4 style="margin:0 0 4px;font-size:1rem;">第 ${idx + 1} 次探險 · ${(typeof roleNames !== 'undefined' && t.hero != null) ? roleNames[t.hero] : '探險者'}</h4>
        <small style="color:#7a6d55;">${esc(t.end || '旅程結束')}</small>
       </div>
       <div style="font-size:.84rem;color:#596b60;margin-bottom:6px;">使命：${t.mission ? ('使命 ' + t.mission) : '未記錄'} · 見聞 ${t.rows?.length || 0} 條</div>
       <button class="smallBtn" onclick="viewVoyage(${idx})">查看此篇歷史見聞</button>
      </div>
     `).join('')}
    </div>
   `;
  }
 }

 return `
  <section class="panel diaryView">
   <div class="diaryHeader">
    <h2>📔 旅程日記</h2>
    <div class="diaryStats">
     <span>探險角色 <b>${esc(heroName)}</b></span>
     <span>目前所在 <b>地點 ${pad(curLoc)}（地區 ${curRegion}）</b></span>
     <span>航程 <b>第 ${s.turn} 回合</b></span>
     <span>見聞 <b>${rows.length}</b> 篇</span>
    </div>
   </div>
   <div class="diaryTabs">
    <button class="${currentDiaryMode === 'story' ? 'primary' : ''}" onclick="setDiaryMode('story')">📖 故事見聞錄 (${rows.length})</button>
    <button class="${currentDiaryMode === 'log' ? 'primary' : ''}" onclick="setDiaryMode('log')">📜 行動詳細日誌 (${logEntries.length})</button>
    <button class="${currentDiaryMode === 'notes' ? 'primary' : ''}" onclick="setDiaryMode('notes')">✍️ 探險隨筆 ${customNotes ? '●' : ''}</button>
    <button class="${currentDiaryMode === 'history' ? 'primary' : ''}" onclick="setDiaryMode('history')">🏛️ 歷次探險紀錄</button>
   </div>
   ${contentHtml}
  </section>
 `;
}
