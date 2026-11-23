'use strict';

const WORLD_REGIONS = [
 { id: 'A', name: '沼澤與密林', desc: '西北沼澤、高空浮雲與密林古木', page: 31, quadrant: 'NW', quadrantLabel: 'NW-1', sky: 64, row: 0, col: 0 },
 { id: 'B', name: '北境孤峰與尖岩', desc: '北境針岩、嚴寒雪峰與符文石陣', page: 32, quadrant: 'NW', quadrantLabel: 'NW-2', sky: 65, row: 0, col: 1 },
 { id: 'C', name: '黃金荒漠與綠洲', desc: '金色沙丘、神祕綠洲與岩石峽谷', page: 33, quadrant: 'NE', quadrantLabel: 'NE-1', sky: 66, row: 0, col: 2 },
 { id: 'D', name: '遠古沙海與荒野', desc: '極東沙海、巨型骨骸與古城遺址', page: 34, quadrant: 'NE', quadrantLabel: 'NE-2', sky: 67, row: 0, col: 3 },
 { id: 'E', name: '湖泊平原與定居點', desc: '西部平原、開闊湖澤與行者聚集地', page: 35, quadrant: 'NW', quadrantLabel: 'NW-4', sky: 68, row: 1, col: 0 },
 { id: 'F', name: '熾炎高原與熔岩', desc: '中央高原、活火山與熾熱熔岩裂縫', page: 36, quadrant: 'NW', quadrantLabel: 'NW-3', sky: 69, row: 1, col: 1 },
 { id: 'G', name: '晶石群島與水域', desc: '中央內海、多島水域與藍晶石群', page: 37, quadrant: 'NE', quadrantLabel: 'NE-4', sky: 70, row: 1, col: 2 },
 { id: 'H', name: '東部荒野與沙脊', desc: '荒涼岩漠、奇異石柱與沙塵風暴', page: 38, quadrant: 'NE', quadrantLabel: 'NE-3', sky: 71, row: 1, col: 3 },
 { id: 'I', name: '綠洲城邦與古都', desc: '西南繁華城區、商業市集與巨型建築', page: 39, quadrant: 'SW', quadrantLabel: 'SW-1', sky: 72, row: 2, col: 0 },
 { id: 'J', name: '裂隙峽谷與丘陵', desc: '地底大裂隙、陡峭峭壁與石化森林', page: 40, quadrant: 'SW', quadrantLabel: 'SW-2', sky: 73, row: 2, col: 1 },
 { id: 'K', name: '蜿蜒河林與沼澤', desc: '連綿河谷、茂密叢林與野生異獸', page: 41, quadrant: 'SE', quadrantLabel: 'SE-1', sky: 74, row: 2, col: 2 },
 { id: 'L', name: '棕櫚群島與海岸', desc: '東南淺海、棕櫚沙灘與潮汐潟湖', page: 42, quadrant: 'SE', quadrantLabel: 'SE-2', sky: 75, row: 2, col: 3 },
 { id: 'M', name: '巨木林海與遠古遺跡', desc: '西南原始森林、巨樹之冠與隱蔽神殿', page: 43, quadrant: 'SW', quadrantLabel: 'SW-4', sky: 8, row: 3, col: 0 },
 { id: 'N', name: '南境海岸與沙洲', desc: '南方綿延沙灘、外海航道與珊瑚礁', page: 44, quadrant: 'SW', quadrantLabel: 'SW-3', sky: 9, row: 3, col: 1 },
 { id: 'O', name: '荒涼群島與海岩', desc: '南東多石海島、海蝕柱與孤寂燈塔', page: 45, quadrant: 'SE', quadrantLabel: 'SE-4', sky: 10, row: 3, col: 2 },
 { id: 'P', name: '深海浮島與外洋', desc: '極東南海域、漂浮島嶼與深海巨獸', page: 46, quadrant: 'SE', quadrantLabel: 'SE-3', sky: 11, row: 3, col: 3 }
];

const MAP_ITEM_CARDS = {
 1251: { name: '城市地圖', page: 9, desc: '顯示星球上各大文明聚落與主要城鎮的位置' },
 1252: { name: '洞穴地圖', page: 10, desc: '標註地下深處的洞窟網絡與地城入口' },
 1254: { name: '骸骨地圖', page: 11, desc: '記載巨型古代巨獸化石與埋骨荒原' },
 1255: { name: '符文投射器地圖', page: 12, desc: '標示六色遠古符文投射器的精準方位' },
 1256: { name: '內部地圖', page: 13, desc: '記錄大型建築、基地內部設施平面圖' },
 1257: { name: '蓮花地圖', page: 14, desc: '標明聖潔蓮花水域與心靈淨化之所' },
 1258: { name: '球體地圖', page: 15, desc: '標記散佈各地的引路玻璃球體位置' },
 1259: { name: '高塔地圖', page: 16, desc: '標繪傲立雲端的高塔與天際觀測台' },
 1260: { name: '寶藏地圖', page: 17, desc: '記錄各地隱蔽寶箱與遺落物資坐標' },
 1261: { name: '試煉地圖', page: 18, desc: '指引星球各部族試煉門徑與考驗地點' },
 1262: { name: '元素體地圖', page: 19, desc: '標示強大元素巨獸出沒與盤踞的危險區域' },
 1263: { name: '植物地圖', page: 20, desc: '記載珍稀植物與草藥生長的特殊生態群落' },
 1264: { name: '神器地圖', page: 21, desc: '記錄上古終極神器的埋藏與封印之地' }
};

let _locToRegionCache = null;
function getLocToRegionMap(){
 if(_locToRegionCache) return _locToRegionCache;
 const map = {};
 const regionAnchors = {
  A: [64, 96, 236, 241, 244, 229, 226],
  B: [65, 81, 622, 627, 630, 615, 612],
  C: [66, 87, 267, 271, 272, 274, 259, 256],
  D: [67, 85, 332, 341, 344, 329, 326],
  E: [68, 90, 178, 186, 189, 349, 346],
  F: [69, 82, 212, 221, 224, 209, 206],
  G: [70, 99, 162, 166, 169, 154, 151],
  H: [71, 83, 278, 286, 289, 490, 487],
  I: [72, 98, 775, 770, 788, 700, 697],
  J: [73, 84, 721, 711, 729, 725, 707],
  K: [74, 95, 117, 116, 119, 475, 472],
  L: [75, 91, 745, 740, 758, 480, 477],
  M: [8,  88, 678, 682, 685, 670, 667],
  N: [9,  89, 305, 311, 314, 374, 371],
  O: [10, 86, 133, 136, 139, 380, 377],
  P: [11, 92, 651, 62, 56, 58, 55]
 };
 const skyIds = new Set([64,65,66,67,68,69,70,71,72,73,74,75,8,9,10,11]);
 const q = [];
 for(const [r, list] of Object.entries(regionAnchors)){
  for(const id of list){
   if(!map[id]){ map[id] = r; q.push(id); }
  }
 }
 const allCards = (typeof cards !== 'undefined' ? cards : (typeof WORLD !== 'undefined' ? WORLD.cards : {}));
 while(q.length > 0){
  const cur = q.shift();
  const reg = map[cur];
  const c = allCards[String(cur)];
  if(!c || !c.exits) continue;
  for(const ex of Object.values(c.exits)){
   if(ex.destination && !skyIds.has(ex.destination) && !map[ex.destination]){
    map[ex.destination] = reg;
    q.push(ex.destination);
   }
  }
 }
 _locToRegionCache = map;
 return map;
}

function getLocationRegion(locId){
 const map = getLocToRegionMap();
 if(map[locId]) return map[locId];
 const allCards = (typeof cards !== 'undefined' ? cards : (typeof WORLD !== 'undefined' ? WORLD.cards : {}));
 const c = allCards[String(locId)];
 if(c?.exits){
  for(const ex of Object.values(c.exits)){
   if(ex.destination && map[ex.destination]) return map[ex.destination];
  }
 }
 return 'C';
}

function visitedLocations(){
 if(!s)return [];
 const allCards = (typeof cards !== 'undefined' ? cards : (typeof WORLD !== 'undefined' ? WORLD.cards : {}));
 const list = [s.loc];
 if(s.visits) list.push(...Object.keys(s.visits).map(Number));
 if(s.voyage) list.push(...s.voyage.map(e => e.loc).filter(Boolean));
 if(s.journal) list.push(...s.journal.map(j => j.loc).filter(Boolean));
 return [...new Set(list)].filter(n => n && allCards[n]?.home === 'location');
}

function allTravelRoutes(){
 const routes = [...(s?.travelRoutes || [])];
 if(s?.voyage?.length){
  let prevLoc = null;
  for(const entry of s.voyage){
   if(entry.loc && prevLoc && entry.loc !== prevLoc){
    if(!routes.some(r => r.from === prevLoc && r.to === entry.loc)){
     routes.push({ from: prevLoc, to: entry.loc, turn: entry.turn });
    }
   }
   if(entry.loc) prevLoc = entry.loc;
  }
 }
 return routes;
}

function getExitStoryDestination(exit){
 if(!exit || !exit.event_uid) return null;
 const allStories = (typeof stories !== 'undefined' ? stories : (typeof WORLD !== 'undefined' ? WORLD.stories : {}));
 const row = allStories[exit.event_uid];
 if(!row || !row[1]) return null;
 const m = row[1].match(/(?:前往|進入|退出至|通往|爬行至|前\s*往|前)\s*(?:內部|洞穴|洞窟|地城|城市|地點)?\s*(\d{1,4})/);
 return m ? Number(m[1]) : null;
}

function computeMapLayout(visited, startLoc, travelRoutes = []){
 const allCards = (typeof cards !== 'undefined' ? cards : (typeof WORLD !== 'undefined' ? WORLD.cards : {}));
 const allStories = (typeof stories !== 'undefined' ? stories : (typeof WORLD !== 'undefined' ? WORLD.stories : {}));
 const visitedSet = new Set(visited);

 const compassOffsets = {
  north: [0, -1],
  south: [0, 1],
  east: [1, 0],
  west: [-1, 0],
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
  NE: [1, -1],
  NW: [-1, -1],
  SE: [1, 1],
  SW: [-1, 1],
  'N/NW': [-1, -1]
 };

 const regionCoords = {};
 for(const r of WORLD_REGIONS){
  regionCoords[r.id] = { col: r.col, row: r.row };
 }

 // 1. Build adjacency graph with directional offsets
 const adj = new Map();
 for (const id of visited) {
  adj.set(id, []);
 }

 for (const id of visited) {
  const c = allCards[String(id)];
  if (!c?.exits) continue;

  for (const [dir, exit] of Object.entries(c.exits)) {
   let dest = exit.destination;
   let offset = compassOffsets[dir] || [0, 0];

   if (!dest && exit.event_uid && allStories[exit.event_uid]) {
    const sDest = getExitStoryDestination(exit);
    if (sDest) {
     dest = sDest;
     const compassDir = allStories[exit.event_uid][3];
     if (compassOffsets[compassDir]) {
      offset = compassOffsets[compassDir];
     }
    }
   }

   if (dest && visitedSet.has(dest) && dest !== id) {
    if (!adj.get(id).some(e => e.to === dest)) {
     adj.get(id).push({ to: dest, offset });
    }
    if (!adj.get(dest).some(e => e.to === id)) {
     adj.get(dest).push({ to: id, offset: [-offset[0], -offset[1]] });
    }
   }
  }
 }

 // 2. Add travel routes with direction inferred from world geography
 for (const route of travelRoutes) {
  if (visitedSet.has(route.from) && visitedSet.has(route.to) && route.from !== route.to) {
   if (!adj.get(route.from).some(e => e.to === route.to)) {
    const regFrom = getLocationRegion(route.from);
    const regTo = getLocationRegion(route.to);
    const cFrom = regionCoords[regFrom] || { col: 1, row: 1 };
    const cTo = regionCoords[regTo] || { col: 1, row: 1 };
    let dx = cTo.col - cFrom.col;
    let dy = cTo.row - cFrom.row;
    if (dx === 0 && dy === 0) {
     dx = route.to > route.from ? 1 : -1;
     dy = 0;
    } else {
     dx = Math.sign(dx);
     dy = Math.sign(dy);
    }
    adj.get(route.from).push({ to: route.to, offset: [dx, dy] });
    adj.get(route.to).push({ to: route.from, offset: [-dx, -dy] });
   }
  }
 }

 // 3. Component discovery and 2D coordinate assignment
 const rawCoords = new Map();
 const occupied = new Set();
 const visitedNodes = new Set();
 const order = [startLoc, ...visited.filter(x => x !== startLoc)];

 for (const rootId of order) {
  if (visitedNodes.has(rootId)) continue;
  const compCoords = new Map();
  compCoords.set(rootId, { x: 0, y: 0 });
  const compOccupied = new Set(['0,0']);
  const q = [rootId];
  visitedNodes.add(rootId);

  while (q.length > 0) {
   const cur = q.shift();
   const curCoord = compCoords.get(cur);
   for (const edge of (adj.get(cur) || [])) {
    if (!compCoords.has(edge.to) && visitedSet.has(edge.to)) {
     let nx = curCoord.x + edge.offset[0];
     let ny = curCoord.y + edge.offset[1];
     if (compOccupied.has(nx + ',' + ny)) {
      let found = false;
      for (let r = 1; r <= 5 && !found; r++) {
       const candidates = [
        [nx + edge.offset[0] * r, ny + edge.offset[1] * r],
        [nx, ny + r], [nx, ny - r], [nx + r, ny], [nx - r, ny]
       ];
       for (const [cx, cy] of candidates) {
        if (!compOccupied.has(cx + ',' + cy)) {
         nx = cx; ny = cy; found = true; break;
        }
       }
      }
     }
     compCoords.set(edge.to, { x: nx, y: ny });
     compOccupied.add(nx + ',' + ny);
     visitedNodes.add(edge.to);
     q.push(edge.to);
    }
   }
  }

  // Anchor component to its Region macro-coordinates (North = Row 0/1, South = Row 2/3, West = Col 0/1, East = Col 2/3)
  const rootReg = getLocationRegion(rootId);
  const regCoord = regionCoords[rootReg] || { col: 1, row: 1 };
  const baseMacroX = regCoord.col * 6;
  const baseMacroY = regCoord.row * 6;

  for (const [id, pos] of compCoords) {
   let gx = baseMacroX + pos.x;
   let gy = baseMacroY + pos.y;
   if (occupied.has(gx + ',' + gy)) {
    let found = false;
    for (let r = 1; r <= 8 && !found; r++) {
     const candidates = [
      [gx, gy + r], [gx + r, gy], [gx, gy - r], [gx - r, gy],
      [gx + r, gy + r], [gx - r, gy + r], [gx + r, gy - r], [gx - r, gy - r]
     ];
     for (const [cx, cy] of candidates) {
      if (!occupied.has(cx + ',' + cy)) {
       gx = cx; gy = cy; found = true; break;
      }
     }
    }
   }
   rawCoords.set(id, { x: gx, y: gy });
   occupied.add(gx + ',' + gy);
  }
 }

 // 4. Monotonic rank compression to eliminate empty space while preserving 2D north/south/west/east
 const xs = [...new Set([...rawCoords.values()].map(p => p.x))].sort((a,b) => a - b);
 const ys = [...new Set([...rawCoords.values()].map(p => p.y))].sort((a,b) => a - b);
 const xMap = new Map();
 xs.forEach((v, idx) => xMap.set(v, idx));
 const yMap = new Map();
 ys.forEach((v, idx) => yMap.set(v, idx));

 const nodes = [];
 for (const [id, pos] of rawCoords) {
  nodes.push({
   id,
   x: xMap.get(pos.x),
   y: yMap.get(pos.y)
  });
 }

 return {
  width: Math.max(xs.length, 1),
  height: Math.max(ys.length, 1),
  nodes
 };
}

let currentMapMode = 'planet'; // Default to 4x4 World Region Grid

function setMapMode(mode){
 currentMapMode = mode;
 if(typeof tab !== 'undefined' && tab === '地圖'){
  render();
 } else {
  viewMap(mode);
 }
}

function mapHtml(mode = currentMapMode, inPanel = false){
 if(!s) return inPanel ? '<section class="panel mapView">目前尚未開始旅程。</section>' : warn('目前尚未開始旅程。');
 const visited = visitedLocations();
 const routes = allTravelRoutes();
 const curLoc = s.loc;
 const curRegion = getLocationRegion(curLoc);
 const allCards = (typeof cards !== 'undefined' ? cards : (typeof WORLD !== 'undefined' ? WORLD.cards : {}));

 let contentHtml = '';

 if(mode === 'planet'){
  // 4x4 Planet Region Grid
  const visitedByRegion = {};
  for(const r of WORLD_REGIONS) visitedByRegion[r.id] = [];
  for(const id of visited){
   const r = getLocationRegion(id);
   if(visitedByRegion[r]) visitedByRegion[r].push(id);
  }

  const regionTiles = WORLD_REGIONS.map(reg => {
   const isCurrent = reg.id === curRegion;
   const list = visitedByRegion[reg.id] || [];
   const locPills = list.map(id => {
    const isCurLoc = id === curLoc;
    return `<button class="regionLocPill ${isCurLoc ? 'isCurrent' : ''}" onclick="inspectLocation(${id}, 'planet', ${inPanel})">${isCurLoc ? '📍 ' : ''}${pad(id)}</button>`;
   }).join('');

   return `
    <div class="regionTile ${isCurrent ? 'currentRegion' : ''}">
     <div>
      <div class="regionTileHead">
       <span class="regionLetter">${reg.id}</span>
       <span class="regionQuad">${reg.quadrantLabel} (${reg.quadrant})</span>
      </div>
      <div class="regionName">${esc(reg.name)}</div>
      <div class="regionDesc">${esc(reg.desc)}</div>
      ${isCurrent ? '<div class="curBadge" style="margin-bottom:6px;">📍 當前所在地區</div>' : ''}
      <div style="font-size:.8rem;color:#4f6458;margin:4px 0;">已探明 <b>${list.length}</b> 個地點</div>
      ${list.length ? `<div class="regionLocPills">${locPills}</div>` : '<div style="font-size:.76rem;color:#8a8370;margin:4px 0;">尚未探索本地區</div>'}
     </div>
     <div style="margin-top:8px;border-top:1px dashed #d5cdb8;padding-top:6px;">
      <button style="width:100%;font-size:.82rem;padding:5px;" onclick="pageView(9, ${reg.page})">📖 查閱地區圖（第 ${reg.page} 頁）</button>
     </div>
    </div>
   `;
  }).join('');

  contentHtml = `
   <div class="quickNavBanner">
    <strong style="width:100%;font-size:.88rem;color:#233a32;margin-bottom:2px;">📜 《萬境之書》全地圖導航：</strong>
    <button class="primary" onclick="pageView(9, 7)">📖 星球全圖（第 7 頁）</button>
    <button onclick="pageView(9, 2)">📖 16 地區矩陣圖（第 2 頁）</button>
    <button onclick="pageView(9, 3)">西北半球 NW (A,B,E,F)</button>
    <button onclick="pageView(9, 4)">東北半球 NE (C,D,G,H)</button>
    <button onclick="pageView(9, 6)">西南半球 SW (I,J,M,N)</button>
    <button onclick="pageView(9, 5)">東南半球 SE (K,L,O,P)</button>
   </div>

   <div class="worldGridContainer">
    <div class="worldRegionGrid">
     ${regionTiles}
    </div>
   </div>

   <p class="note" style="margin-top: 10px;line-height:1.6;">
    🧭 <b>規則書說明（第 8 頁）</b>：星球由 A 至 P 共 16 個廣闊地區組成，排布為 4×4 星球矩陣（第一行 A–D 為北半球，第四行 M–P 為南半球）。各具體地點所屬地區記載於《查看》故事書條目及《萬境之書》中。點選任意地區卡片即可翻閱該區專屬手繪地圖！
   </p>
  `;
 } else if(mode === 'grid'){
  const layout = computeMapLayout(visited, curLoc, routes);
  const tiles = layout.nodes.map(node => {
   const id = node.id;
   const c = allCards[id];
   const isCurrent = id === curLoc;
   const reg = getLocationRegion(id);
   const usedCount = (s.visits?.[id] || (isCurrent ? s.used : []))?.length || 0;
   const exits = c?.exits || {};
   const exitPills = Object.entries(exits).map(([dir, ex]) => {
    const dirZh = (typeof directions !== 'undefined' ? directions[dir] : null) || dir;
    if(ex.destination){
     const isVisited = visited.includes(ex.destination);
     return `<span class="exitPill ${isVisited ? 'visited' : ''}" title="${isVisited ? '已探索' : '未探明'}">${dirZh} ➜ ${pad(ex.destination)}</span>`;
    }
    const storyDest = getExitStoryDestination(ex);
    if(storyDest){
     const isVisited = visited.includes(storyDest);
     return `<span class="exitPill story ${isVisited ? 'visited' : ''}" title="${isVisited ? '已探索' : '未探明'}">${dirZh} ➜ ${pad(storyDest)}</span>`;
    }
    return `<span class="exitPill story" title="特殊離開路線">${dirZh} ➜ 離開</span>`;
   }).join('');

   return `<div class="mapTile ${isCurrent ? 'current' : ''}" style="grid-column: ${node.x + 1}; grid-row: ${node.y + 1};" onclick="inspectLocation(${id}, 'grid', ${inPanel})">
    ${isCurrent ? '<span class="curBadge">📍 當前所在</span>' : ''}
    <div style="font-size:.76rem;color:#6b5f4c;font-weight:700;">地區 ${reg}</div>
    <img class="mapCardThumb" src="cards/${id}.webp" alt="地點 ${pad(id)}" loading="lazy">
    <h4>地點 ${pad(id)}</h4>
    <div class="tileMeta">${usedCount ? '已執行 ' + usedCount + ' 項行動' : '尚未執行行動'}</div>
    <div class="mapExitsSummary">${exitPills}</div>
   </div>`;
  }).join('');

  contentHtml = `
   <div class="mapCompassBanner" style="display:flex;justify-content:space-between;align-items:center;background:#ebdcc0;border:1px solid #c9bca0;border-radius:6px;padding:5px 10px;margin-bottom:8px;font-size:.82rem;font-weight:700;color:#354d42;flex-wrap:wrap;gap:4px;">
    <span>🧭 羅盤方位基準：北（上方 ↑）／ 南（下方 ↓）／ 西（左方 ←）／ 東（右方 →）</span>
    <span>網格規格：${layout.width} 列 × ${layout.height} 行</span>
   </div>
   <div class="mapScrollContainer">
    <div class="mapGrid" style="display: grid; grid-template-columns: repeat(${layout.width}, minmax(145px, 175px)); grid-template-rows: repeat(${layout.height}, auto); gap: 14px;">
     ${tiles}
    </div>
   </div>
   <p class="note" style="margin-top: 10px;">💡 提示：2D 羅盤空間地圖依照規則書羅盤方位（北朝上、南朝下、東朝右、西朝左）正交排布地點。點擊卡片可查看卡面詳情與出口情報。</p>
  `;
 } else if(mode === 'trail'){
  const steps = [];
  if(s.voyage?.length){
   let lastL = null;
   for(const v of s.voyage){
    if(v.loc && v.loc !== lastL){
     steps.push({ turn: v.turn, loc: v.loc, title: v.title || v.action || '抵達地點' });
     lastL = v.loc;
    }
   }
  }
  if(!steps.some(x => x.loc === curLoc)){
   steps.push({ turn: s.turn, loc: curLoc, title: '目前駐留' });
  }

  contentHtml = `
   <div class="trailList">
    ${steps.map((st, i) => {
     const isCur = st.loc === curLoc;
     const caption = (typeof locationCaptions !== 'undefined' ? locationCaptions[st.loc] : null) || (typeof cardSummary !== 'undefined' ? cardSummary(st.loc) : '');
     const reg = getLocationRegion(st.loc);
     return `
      <div class="trailStep ${isCur ? 'currentStep' : ''}" onclick="inspectLocation(${st.loc}, 'trail', ${inPanel})">
       <span class="stepNum">第 ${i + 1} 站<br><small>第 ${st.turn} 回合</small></span>
       <img src="cards/${st.loc}.webp" alt="地點 ${pad(st.loc)}" loading="lazy">
       <div class="stepInfo">
        <h4>地點 ${pad(st.loc)}（地區 ${reg}） ${isCur ? '<span class="curBadge">📍 目前位置</span>' : ''}</h4>
        <p>${esc(caption)}</p>
       </div>
       <button class="smallBtn" onclick="event.stopPropagation(); inspectLocation(${st.loc}, 'trail', ${inPanel})">詳情</button>
      </div>
     `;
    }).join('')}
   </div>
  `;
 } else if(mode === 'items'){
  const acquired = [...new Set([...(s.grid || []), ...(s.supply || []), ...(s.reserve || [])])].filter(n => MAP_ITEM_CARDS[n]);
  const acquiredHtml = acquired.length ? acquired.map(mid => {
   const info = MAP_ITEM_CARDS[mid];
   const inGrid = s.grid?.includes(mid);
   const boost = s.boost?.[mid] || 0;
   return `
    <div class="mapItemCard">
     <img src="cards/${mid}.webp" alt="${info.name}" onclick="card(${mid})">
     <div class="mapItemBody">
      <h4>${mid} · ${esc(info.name)} ${inGrid ? '<span class="curBadge">在網格中</span>' : ''}</h4>
      <p>${esc(info.desc)}</p>
      <div style="font-size:.82rem;color:#495d52;margin-bottom:6px;">當前強化：<b>${boost}</b> 點</div>
      <button class="primary" style="font-size:.82rem;" onclick="pageView(9, ${info.page})">📖 查閱《萬境之書》第 ${info.page} 頁</button>
     </div>
    </div>
   `;
  }).join('') : '<p style="color:#776d58;margin:8px 0;">目前尚未持有隨身地圖卡牌（如 1259 高塔地圖、1251 城市地圖等）。</p>';

  const allMapCardsOverview = Object.entries(MAP_ITEM_CARDS).map(([id, info]) => {
   const have = acquired.includes(+id);
   return `
    <div style="padding:6px 8px;border:1px solid #d5cdb8;border-radius:6px;background:${have ? '#f0f7f2' : '#fff'};font-size:.82rem;display:flex;justify-content:space-between;align-items:center;">
     <span>${have ? '✓ ' : ''}<b>${id} · ${esc(info.name)}</b></span>
     <button class="smallBtn" onclick="pageView(9, ${info.page})">第 ${info.page} 頁</button>
    </div>
   `;
  }).join('');

  contentHtml = `
   <div style="margin:10px 0;">
    <h3>📜 已獲取的隨身地圖卡</h3>
    <div class="mapItemsList">${acquiredHtml}</div>

    <h3 style="margin-top:16px;">📚 《萬境之書》全地圖索引清單</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin:8px 0;">
     ${allMapCardsOverview}
    </div>

    <p class="note" style="margin-top:12px;line-height:1.6;">
     💡 <b>《秘密之書》第 14 頁地圖規則</b>：當你在自己的網格中放置一張地圖時，與其相鄰的每張卡牌（邊緣相接觸）使得地圖獲得 1 點強化。通過支付強化，你可以在《萬境之書》中參見該地圖的大版本。
    </p>
   </div>
  `;
 } else if(mode === 'list'){
  contentHtml = `
   <div class="mapCardList">
    ${visited.map(id => {
     const isCur = id === curLoc;
     const caption = (typeof locationCaptions !== 'undefined' ? locationCaptions[id] : null) || (typeof cardSummary !== 'undefined' ? cardSummary(id) : '');
     const reg = getLocationRegion(id);
     const used = (s.visits?.[id] || (isCur ? s.used : []))?.length || 0;
     return `
      <div class="exploredItem ${isCur ? 'current' : ''}">
       <img src="cards/${id}.webp" alt="地點 ${pad(id)}" loading="lazy" onclick="inspectLocation(${id}, 'list', ${inPanel})">
       <div class="itemBody">
        <h3>地點 ${pad(id)}（地區 ${reg}） ${isCur ? '<span class="curBadge">📍 當前所在</span>' : ''}</h3>
        <p class="caption">${esc(caption)}</p>
        <small>此地點已執行 ${used} 項行動</small>
        <div style="margin-top: 6px;">
         <button onclick="inspectLocation(${id}, 'list', ${inPanel})">查看地點卡情報</button>
        </div>
       </div>
      </div>
     `;
    }).join('')}
   </div>
  `;
 }

 return `
  <section class="${inPanel ? 'panel ' : ''}mapView">
   <div class="mapHeader">
    <h2>🗺️ 星球探索地圖</h2>
    <div class="mapStats">
     <span>已探明 <b>${visited.length}</b> 個地點</span>
     <span>目前所在 <b>地點 ${pad(curLoc)}（地區 ${curRegion}）</b></span>
     <span>航程 <b>第 ${s.turn} 回合</b></span>
    </div>
   </div>
   <div class="mapTabs">
    <button class="${mode === 'planet' ? 'primary' : ''}" onclick="setMapMode('planet')">🌍 4×4 星球地區總覽</button>
    <button class="${mode === 'grid' ? 'primary' : ''}" onclick="setMapMode('grid')">🗺️ 網格地圖</button>
    <button class="${mode === 'items' ? 'primary' : ''}" onclick="setMapMode('items')">📜 隨身地圖圖卷</button>
    <button class="${mode === 'trail' ? 'primary' : ''}" onclick="setMapMode('trail')">👣 探索足跡</button>
    <button class="${mode === 'list' ? 'primary' : ''}" onclick="setMapMode('list')">📑 地點圖鑑</button>
   </div>
   ${contentHtml}
  </section>
 `;
}

function viewMap(mode = 'planet'){
 currentMapMode = mode;
 const html = mapHtml(mode, false);
 if(html) show(html);
}

function mapPanel(){
 return mapHtml(currentMapMode, true);
}

function inspectLocation(locId, fromMode = 'planet', inPanel = false){
 const allCards = (typeof cards !== 'undefined' ? cards : (typeof WORLD !== 'undefined' ? WORLD.cards : {}));
 const c = allCards[locId];
 if(!c) return warn('無此地點資料。');
 const isCurrent = s?.loc === locId;
 const reg = getLocationRegion(locId);
 const caption = (typeof locationCaptions !== 'undefined' ? locationCaptions[locId] : null) || (typeof cardSummary !== 'undefined' ? cardSummary(locId) : '');
 const visited = visitedLocations();
 const used = (s?.visits?.[locId] || (isCurrent ? s?.used : [])) || [];

 const exitsRows = Object.entries(c.exits || {}).map(([dir, ex]) => {
  const dirZh = (typeof directions !== 'undefined' ? directions[dir] : null) || dir;
  let destZh = '';
  if(ex.destination){
   const isV = visited.includes(ex.destination);
   destZh = `地點 ${pad(ex.destination)} ${isV ? '<b style=\"color:#206552\">（已探明）</b>' : '<span style=\"color:#887755\">（未探明）</span>'}`;
  } else {
   destZh = '《離開》故事書特殊路線';
  }
  return `<tr><td>向${dirZh}</td><td>${destZh}</td><td>費用 ${ex.cost != null ? ex.cost : '依條目'}</td></tr>`;
 }).join('');

 const actionsRows = (c.actions || []).map(a => {
  const isDone = used.includes(a.action_uid);
  const skillName = typeof keys !== 'undefined' && typeof skills !== 'undefined' ? (skills[keys.indexOf(a.book)] || a.book) : a.book;
  return `<li><b>${esc(a.action || a.family)}</b>（${skillName}） · ${isDone ? '<span style=\"color:#206552;font-weight:700;\">✓ 已執行</span>' : '<span style=\"color:#777;\">未執行</span>'}</li>`;
 }).join('');

 const backFn = inPanel ? 'viewer.close()' : `viewMap('${fromMode}')`;
 const html = `
  <section class="locationDetailView">
   <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;margin-bottom:8px;">
    <button onclick="${backFn}">⬅ 返回探索地圖</button>
    <span style="font-size:.9rem;color:#55695e;">${isCurrent ? '📍 當前所在位置' : '已探索地點'} · 地區 ${reg}</span>
   </div>
   <h2>地點 ${pad(locId)}（地區 ${reg}）</h2>
   <img class="art" src="cards/${locId}.webp" alt="地點 ${pad(locId)}" style="max-height:42vh;cursor:zoom-in;" onclick="this.classList.toggle('zoomed')">
   <p class="story" style="margin:12px 0;font-size:1.05rem;">${esc(caption)}</p>

   <h3>出口情報</h3>
   <table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:.92rem;">
    <thead><tr style="text-align:left;border-bottom:1px solid #d5cdb8;"><th>方位</th><th>通往</th><th>費用</th></tr></thead>
    <tbody>${exitsRows || '<tr><td colspan=\"3\">無出口資料</td></tr>'}</tbody>
   </table>

   <h3>地點行動</h3>
   <ul style="margin:6px 0 14px;padding-left:20px;font-size:.92rem;">
    ${actionsRows || '<li>無特殊行動</li>'}
   </ul>
   <button class="primary" style="width:100%;" onclick="${backFn}">返回探索地圖</button>
  </section>
 `;

 show(html);
}
