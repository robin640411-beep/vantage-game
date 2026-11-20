#!/bin/zsh
cd -- "${0:A:h}/dist" || exit 1
# Serve only the finished game on this Mac's local network.
game_interface=$(/sbin/route -n get default 2>/dev/null | awk '/interface:/{print $2}')
game_address=$(/usr/sbin/ipconfig getifaddr "${game_interface:-en0}" 2>/dev/null)
if [[ -z "$game_address" ]]; then
  print '找不到區域網路位址。請先讓 Mac 和手機連上同一個 Wi-Fi，再重新開啟。'
  read -k 1
  exit 1
fi
print "萬境奇旅｜單人探險"
print "在同一個 Wi-Fi 的手機瀏覽器輸入 http://${game_address}:8174/"
print "遊玩時保持此視窗開啟。按 Control-C 可停止。"
exec /usr/bin/python3 -m http.server 8174 --bind "$game_address"
