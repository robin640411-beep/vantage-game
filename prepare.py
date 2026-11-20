from pathlib import Path
import json,re
from concurrent.futures import ThreadPoolExecutor
from PIL import Image
from opencc import OpenCC
root=Path(__file__).resolve().parent
out=root/'dist'; assets=out/'cards';assets.mkdir(exist_ok=True)
save=json.loads((root.parent/'3788661965.json').read_text())
cards={};stories={}
for obj in save['ObjectStates']:
 name=obj.get('Nickname','')
 if name.startswith('卡牌数据'):
  for k,r in json.loads(obj['GMNotes']).items():cards[k]=dict(name=r[2],slots=r[8],cap=len(r[9]),initial=r[10],orientation=r[15],home=r[3],tags=r[6],exits=r[11],actions=r[12])
 if name.startswith('故事数据'):stories.update(json.loads(obj['GMNotes'])['entries'])
crash=dict((k,int(v)) for k,v in re.findall(r'\["(\w+\|\w+)"\] = (\d+)',save['LuaScript'].split('local CRASH_LOCATIONS = {')[1].split('}')[0]))
mission=dict(zip(crash,[1590,1596,1578,1581,1589,1577,1583,1584,1585,1586,1587,1588,1582,1595,1591,1592,1593,1594,1580,1579,1597],strict=True))
cc=OpenCC('s2tw')
def convert(v):
 if isinstance(v,str):return cc.convert(v) if re.search('[\u3400-\u9fff]',v) else v
 if isinstance(v,list):return [convert(i) for i in v]
 if isinstance(v,dict):return {k:convert(i) for k,i in v.items()}
 return v
# Printed entries from Overpower p.31 and Help p.34 correct stale imported links.
for number,book,cost,title,body in [
 (910,'overpower',3,'捕魚以獲得食物（僅限位於有水域的地點）','擲3顆技能骰最多3次（每次都擲全部骰子）。每支付1點此牌上的強化就額外擲1顆骰子；如果還支付1點來自食物或植物牌上的強化，則再額外擲1顆骰子。依最終壓制數量結算：0，獲得1點強化。1，獲得1點生命值。2，獲得1點生命值和1點強化。3，獲得物品1226。4以上，獲得物品1232。'),
 (1578,'help',2,'磨練你的天賦以完成使命（此行動每場遊戲最多執行一次）','你專注於提升完成使命所需要的能力。獲得能力1470。'),
 (1579,'help',2,'磨練你的天賦以完成使命（此行動每場遊戲最多執行一次）','你專注於提升完成使命所需要的技藝。如果你擁有一張經驗牌，在其上添加1或2點強化；如果沒有，獲得2點查看。')]:
 action=next(a for a in cards[str(number)]['actions'] if a['book']==book)
 stories[action['event_uid']]=[number,body,cost,'',1,title]
for card in cards.values():
 for a in card['actions'][:]:
  if a['event_uid'] in stories:continue
  prefix=a['event_uid'].rsplit(':',1)[0]+':'
  candidates=[k for k in stories if k.startswith(prefix)]
  if len(candidates)==1:a['event_uid']=candidates[0]
  if card['home']=='skirm':card['actions'].remove(a)
# Some imported duplicate passages omit the cost recorded on the matching original.
costs={(key.split(':')[1],row[0],row[1]):row[2] for key,row in stories.items() if row[2] is not None}
for key,row in stories.items():
 if row[2] is None:row[2]=costs.get((key.split(':')[1],row[0],row[1]))
(out/'world.js').write_text('const WORLD='+json.dumps(convert(dict(cards=cards,stories=stories,crash=crash,mission=mission)),ensure_ascii=False,separators=(',',':'))+';')
def export(p):
 f=assets/(str(int(p.stem))+'.webp')
 if not f.exists():Image.open(p).convert('RGB').save(f,quality=78,method=2)
with ThreadPoolExecutor(5) as ex:list(ex.map(export,(root.parent/'單張卡牌').glob('*.png')))
print(len(cards),len(stories),len(list(assets.glob('*'))))
