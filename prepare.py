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
# Look p.34 restores mission 1593 and the mission cards' once-per-game research action.
stories['story:look:1593:01']=[1593,'你代表一群尋求與新世界結盟的大使。建立強大聯繫的最佳方式是向這個星球的文化證明你的價值。獲得試煉地圖（1261）。',2,'',1,'探究如何完成使命（此行動每場遊戲最多執行一次）']
for number in range(1577,1598):
 event=f'story:look:{number}:01'
 actions=cards[str(number)]['actions']
 if event in stories and not any(a['event_uid']==event for a in actions):
  actions.insert(0,dict(action_uid=f'action:{number}:research',action='探究',family='查看',event_uid=event,book='look',entry=number,repeatable=False))
# Restore page continuations after the pair reward in Engage and Overpower.
for event,card_id in {'story:engage:0367:01': 1164, 'story:engage:0432:01': 1162, 'story:engage:0485:01': 1162, 'story:engage:0494:01': 1165, 'story:engage:0602:01': 1165, 'story:overpower:0367:01': 1164, 'story:overpower:0416:01': 1162, 'story:overpower:0432:01': 1162, 'story:overpower:0457:01': 1165, 'story:overpower:0467:01': 1164, 'story:overpower:0485:01': 1162, 'story:overpower:0494:01': 1165, 'story:overpower:0502:01': 1164, 'story:overpower:0602:01': 1165, 'story:overpower:0756:01': 1162}.items():
 stories[event][1]+=f'{card_id}。否则，获得$4。'
# The Take entries preserve the same trap outcomes verified on the other books' pages.
for number in (102,384):
 tail=stories[f'story:take:{number:04}:01'][1].replace(' ','').split('一对相同结果，获得物品')[-1]
 for book in ('engage','overpower'):
  stories[f'story:{book}:{number:04}:01'][1]+=tail
# Engage pages 10, 11, 17, 19, 20, 27, 29 and Overpower page 5.
for key,tail in {'engage:0253': '1160。否則，寶箱突然迸發出火焰，灼傷了你的手（受到1點高溫傷害）。', 'engage:0270': '1165。否則，箱子像陷阱一樣夾住了你的腿；獲得1點強化並失去1點技能（如果可能）。', 'engage:0416': '1162。否則，獲得$4。', 'engage:0457': '1165。否則，獲得$4。', 'engage:0488': '1162。否則，獲得$4。', 'engage:0653': '885。否則，箱子裡彈出一個陷阱，把你肺裡的空氣都撞了出來（受到1點缺氧傷害）。', 'engage:0609': '1163。否則，獲得$4。', 'overpower:0126': '895。否則，獲得$4。'}.items():
 stories['story:'+key+':01'][1]+=tail
stories['story:overpower:0270:recovered:0078'][1]='在强大的阻力之下，锁砰然打开。掷5颗技能骰；每颗骰子'+stories['story:engage:0270:01'][1].replace(' ','').split('每颗骰子',1)[1]
# 1213 is the egg acquired in 302. The scan indexed its inline item number as a story header.
for misplaced in ('story:take:1213:01','story:move:1213:01'):
 stories.pop(misplaced,None)
# The imported result for 074 runs into the next three entries of the book.
entry=stories['story:overpower:0074:01']
entry[1]=entry[1].split(' 08(5',1)[0]
# Both tower faces print Send between Research and Craft. Keep existing save keys stable.
for number in (407,419):
 actions=cards[str(number)]['actions']
 if not any(a['book']=='engage' for a in actions):
  actions.insert(2,dict(action_uid=f'action:{number:04}:send',action='發送',family='交談',event_uid=f'story:engage:{number:04}:01',book='engage',entry=number,repeatable=False))
if not any(a['book']=='engage' for a in cards['467']['actions']):
 cards['467']['actions'].insert(2,dict(action_uid='action:0467:pick',action='挑/撬',family='交談',event_uid='story:engage:0467:01',book='engage',entry=467,repeatable=False))
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
