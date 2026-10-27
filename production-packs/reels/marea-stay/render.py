from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json,subprocess
root=Path('mcc-marea')
serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
sans='/usr/share/fonts/truetype/higgsfield/Montserrat-ExtraBold.ttf'
ivory='#f4efe6'; gold='#c99a64'; navy='#071827'
def text(draw,xy,s,size,color=ivory,font=sans):
 draw.multiline_text(xy,s,font=ImageFont.truetype(font,size),fill=color,spacing=12)
def overlay(name,title):
 im=Image.new('RGBA',(720,1280),(0,0,0,0));d=ImageDraw.Draw(im)
 d.rectangle((0,0,720,140),fill=navy);d.rectangle((0,1140,720,1280),fill=navy)
 text(d,(34,25),'MCC  /  MAREA STAY',18,gold)
 text(d,(34,66),title,26)
 d.line((34,126,686,126),fill=gold,width=2)
 text(d,(34,1168),'FICTIEVE CONCEPTDEMO · ECHTE INTERACTIE',15,gold)
 text(d,(34,1207),'Wil je jouw versie? DM CLONE · @mccai.nl',18)
 im.save(root/name)
overlay('visit.png','Van kijken naar boeken.')
overlay('choose.png','Kies je suite. Bekijk de totaalprijs.')
overlay('confirm.png','De gast bevestigt de reservering.')
overlay('owner.png','De eigenaar ziet de boeking.')
overlay('status.png','Check-in. Status bijgewerkt.')
im=Image.new('RGBA',(720,1280),(0,0,0,0));d=ImageDraw.Draw(im)
d.rectangle((0,0,720,340),fill=(7,24,39,210));d.rectangle((0,1120,720,1280),fill=(7,24,39,220))
text(d,(40,54),'MCC  /  INTERACTIEVE WEBSITES',21,gold)
text(d,(40,124),'Een mooie website.\nEen heldere gastreis.',39,font=serif)
text(d,(40,1162),'MAREA STAY · FICTIEF HOTELCONCEPT',19)
im.save(root/'opening.png')
im=Image.new('RGB',(720,1280),navy);d=ImageDraw.Draw(im)
text(d,(48,100),'MCC',44);d.line((48,182,672,182),fill=gold,width=2)
text(d,(48,310),'Jouw merk.\nJouw gastreis.',53,font=serif)
text(d,(48,520),'Gebouwd door MCC.',30,gold)
text(d,(48,685),'Probeer de demo.\nLees het projectartikel.',30)
text(d,(48,910),'DM CLONE',48,gold)
text(d,(48,996),'@mccai.nl',34)
text(d,(48,1168),'Conceptdemo · geen echte boekingen',18)
im.save(root/'end.png')
timing=json.loads((root/'timing.json').read_text())
start=timing['hero']; ui_len=timing['end']-start
# 5.5 s opening + genuine recorded journey + CTA = 38 seconds.
end_len=38-5.5-ui_len
assert 2<end_len<5,(ui_len,end_len)
filters=[]
filters.append("[0:v]trim=0:5.5,setpts=PTS-STARTPTS,scale=-2:1280,crop=720:1280:(iw-720)*0.67:0,fps=30,setsar=1[coast]")
filters.append("[coast][2:v]overlay=0:0:shortest=1,fade=t=out:st=5.25:d=0.25[open]")
filters.append(f"[1:v]trim=start={start}:end={timing['end']},setpts=PTS-STARTPTS,scale=720:1000,pad=720:1280:0:140:color=0x071827,fps=30,setsar=1[ui0]")
points=[0,timing['rooms']-start,timing['submit']-start,timing['owner']-start,timing['checkin']-start,ui_len]
for i in range(5):
 filters.append(f"[ui{i}][{3+i}:v]overlay=0:0:shortest=1:enable='between(t,{points[i]},{points[i+1]})'[ui{i+1}]")
filters.append(f"[ui5]fade=t=in:st=0:d=0.25,fade=t=out:st={ui_len-0.25}:d=0.25[ui]")
filters.append(f"[8:v]trim=duration={end_len},setpts=PTS-STARTPTS,fps=30,setsar=1,fade=t=in:st=0:d=0.25,fade=t=out:st={end_len-0.4}:d=0.4[end]")
filters.append("[open][ui][end]concat=n=3:v=1:a=0,format=yuv420p[out]")
(root/'render-filter.txt').write_text(';'.join(filters))
cmd=['ffmpeg','-y','-i',str(root/'coast.mp4'),'-i',str(root/'live.mp4')]
for p in ['opening.png','visit.png','choose.png','confirm.png','owner.png','status.png','end.png']:cmd+=['-loop','1','-i',str(root/p)]
cmd+=['-filter_complex_script',str(root/'render-filter.txt'),'-map','[out]','-an','-t','38','-r','30','-c:v','libx264','-preset','fast','-crf','20','-movflags','+faststart',str(root/'MCC_Marea_Stay_Review_v2.mp4')]
subprocess.run(cmd,check=True)
print('Render complete: 38 seconds, 720x1280, silent review cut.')
