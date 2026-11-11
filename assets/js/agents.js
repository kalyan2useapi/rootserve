/* Rootserve hero: agents coordinating real small-business workflows */
(()=>{
const P={
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 truck:'<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
 box:'<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
 tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
 card:'<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
 phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
 list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 shield:'<path d="M12 3 4.5 6v5c0 5 3.3 8.6 7.5 10 4.2-1.4 7.5-5 7.5-10V6z"/><path d="m9 12 2 2 4-4"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
 folder:'<path d="M3 6h6l2 2h10v11H3z"/>',
 store:'<path d="M4 9 5.5 4h13L20 9M4 9h16v11H4zM4 9c0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0 0 2 4 2 4 0"/>',
 flower:'<circle cx="12" cy="9" r="2.5"/><path d="M12 6.5C12 3 15.5 3 15.5 6S12 9 12 9 8.5 9 8.5 6s3.5-3 3.5.5M12 11.5V21M12 16c-3 0-4.5-2-4.5-2M12 18c3 0 4.5-2 4.5-2"/>',
 pin:'<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 factory:'<path d="M3 20V10l5 3V10l5 3V6h4l1 14z"/><path d="M3 20h18"/>',
 inbox:'<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 5h14l2 8v6H3v-6z"/>',
 scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H4zM20 4h-6a3 3 0 0 0-1 .2"/><path d="M20 4v13.5h-6.5"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 bank:'<path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>'
};
const ico=k=>`<svg class="ico" viewBox="0 0 24 24">${P[k]}</svg>`;

const CASES=[
{tab:'HVAC',k:'9:12 PM · New service call',title:'AC not cooling, condo in Brickell',
 agents:[['desk','Front desk','chat'],['disp','Dispatch','truck'],['parts','Parts','box'],['price','Pricing','tag'],['you','Owner','user',1]],
 tools:[['sms','Texts','phone'],['sched','Schedule','cal'],['pay','Payments','card']],
 T:[[400,'sms','desk','“AC stopped, it’s 88° inside”','t'],
  [1700,'desk','disp','Urgent, no cooling. Brickell condo'],[1900,'desk','parts','Carrier unit, 2014. Likely a capacitor'],
  [3500,'parts','disp','Van 3 is out of capacitors','w'],
  [5000,'parts','disp','Van 5 has two. 12 minutes further'],[5200,'disp','sched','Hold Van 5, 9:40 to 10:40 PM','t'],
  [6700,'disp','price','Van 5 confirmed, ETA 10:02 PM'],
  [8200,'price','you','$289 is over your $250 rule. Approve?'],
  [10200,'you','price','Approved'],
  [11600,'price','pay','Send the $289 quote link','t'],[11800,'desk','sms','Tech arriving at 10:02 PM','t'],
  [13300,'pay','desk','Customer paid the deposit','t']],
 end:['Booked, quoted and paid','A van rerouted, a deposit collected, and one tap from the owner.',['12 messages','3 tools','1 approval']]},
{tab:'Dental',k:'7:40 AM · Cancellation',title:'Tuesday 2 PM cleaning just opened up',
 agents:[['sch','Scheduler','cal'],['wait','Waitlist','list'],['ins','Insurance','shield'],['rem','Reminders','bell'],['mgr','Office mgr','user',1]],
 tools:[['calt','Calendar','cal'],['rec','Records','folder'],['sms','Texts','phone']],
 T:[[400,'calt','sch','Cancelled: Tue 2:00 PM cleaning','t'],
  [1700,'sch','wait','Find a patient for Tue 2 PM'],[1900,'sch','rem','Pause reminders for that slot'],
  [3300,'wait','rec','Who’s overdue and free Tuesday afternoons?','t'],
  [4700,'rec','wait','Three matches: Maria, Ken, Priya','t'],
  [6000,'wait','ins','Check coverage for all three'],
  [7400,'ins','wait','Ken’s plan lapsed last month','w'],
  [8700,'ins','mgr','Maria needs X-ray pre-auth. Approve?'],
  [10500,'mgr','ins','Approved'],
  [11700,'wait','rem','Offer the slot to Maria first'],[11900,'rem','sms','Texting Maria the 2 PM offer','t'],
  [13300,'sms','sch','Maria: “Yes please!”','t']],
 end:['Empty chair filled by 7:46 AM','No phone tag, and coverage checked before booking.',['12 messages','3 tools','1 approval']]},
{tab:'Florist',k:'11:05 AM · Same-day order',title:'24 red roses, Coral Gables, by 6 PM',
 agents:[['ord','Orders','store'],['inv','Inventory','box'],['des','Design','flower'],['del','Delivery','truck'],['own','Owner','user',1]],
 tools:[['shop','Storefront','store'],['sup','Supplier','factory'],['map','Maps','pin']],
 T:[[400,'shop','ord','New order: 24 red roses, by 6 PM','t'],
  [1700,'ord','inv','Need 24 red roses today'],[1900,'ord','del','Coral Gables, before 6 PM'],
  [3300,'inv','ord','Only 14 red roses in the cooler','w'],
  [4600,'inv','sup','Can you bring 10 more by 2 PM?','t'],
  [6000,'sup','inv','Not until tomorrow morning','w'],
  [7300,'inv','des','Suggest a swap for 10 stems'],
  [8600,'des','own','Swap 10 for garden roses, same price?'],
  [10400,'own','des','Approved'],
  [11600,'des','ord','Card updated with photo of the new mix'],[11800,'del','map','Route with three other drops','t'],
  [13200,'map','del','Arrives at 5:20 PM','t']],
 end:['Delivered 40 minutes early','The shortage was solved before the customer ever knew.',['12 messages','3 tools','1 approval']]},
{tab:'Bookkeeping',k:'Month-end · Accounts payable',title:'42 vendor invoices arrived overnight',
 agents:[['inb','Intake','inbox'],['ext','Extractor','scan'],['mat','Matcher','link'],['pay','Payables','bank'],['ctl','Controller','user',1]],
 tools:[['mail','Email','mail'],['led','Ledger','book'],['bnk','Bank','bank']],
 T:[[400,'mail','inb','42 invoices from 17 vendors','t'],
  [1700,'inb','ext','Read all 42, pull totals and PO numbers'],
  [3100,'ext','mat','42 parsed, ready to match'],
  [4400,'mat','led','Match against open purchase orders','t'],
  [5700,'led','mat','39 match. 3 don’t','t'],
  [6900,'mat','ext','Recheck #1182, the total looks off','w'],
  [8200,'ext','mat','Scan error. $4,120, not $41.20'],
  [9500,'mat','ctl','2 invoices over PO by 12%. Approve?'],
  [11300,'ctl','mat','Approve #1190, hold #1204'],
  [12500,'mat','pay','Post 41, schedule Friday payments'],[12700,'inb','mail','Ask the vendor about #1204','t'],
  [14000,'pay','bnk','Friday payment batch queued','t']],
 end:['Month-end close, done by 9 AM','A scan error caught, one invoice held, and the vendor already asked.',['12 messages','3 tools','2 decisions']]}
];

const root=document.querySelector('.agents');if(!root)return;const el=root.querySelector('.hero-visual'),L=el.querySelector('.layer'),mesh=el.querySelector('.mesh'),fx=el.querySelector('.fx'),
 kEl=el.querySelector('.core .k'),cEl=el.querySelector('.core .case'),log=el.querySelector('.log'),tabs=root.querySelector('.tabs');
L.addEventListener('animationend',()=>L.classList.remove('in','d3'),{once:true});
const NS='http://www.w3.org/2000/svg',CX=203,CY=181,R=142,RT=180,TRAVEL=1100,HOLD=4200;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const AANG=[-90,-18,54,126,198], TANG=[-54,90,-126];
let ents=[],idx={},spokes=[],pairs=[],cur=0,t0=null,fired=new Set(),live=[],ended=false,running=false,endAt=0;

CASES.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.innerHTML=c.tab+'<span class="p"></span>';b.onclick=()=>{load(i);t0=null};tabs.appendChild(b)});

function side(a){const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180);return Math.abs(c)>.45?(c>0?'r':'l'):(s<0?'t':'b')}
function load(i){cur=i;const c=CASES[i];
 L.querySelectorAll('.node').forEach(n=>n.remove());mesh.innerHTML='';fx.innerHTML='';log.innerHTML='';live=[];fired=new Set();ended=false;
 ents=[];idx={};
 c.agents.forEach((a,j)=>ents.push({k:a[0],n:a[1],i:a[2],h:!!a[3],tool:false,base:AANG[j],r:R,sp:.15+((j*37)%10)/100,ph:j*1.37}));
 c.tools.forEach((a,j)=>ents.push({k:a[0],n:a[1],i:a[2],tool:true,base:TANG[j],r:RT,sp:.11+j*.03,ph:j*2.1+.5}));
 ents.forEach((e,j)=>{idx[e.k]=j;const d=document.createElement('div');d.className='node'+(e.h?' h':'')+(e.tool?' tool':'')+' '+side(e.base);
  d.innerHTML=`<div class="dot">${ico(e.i)}</div><div class="lbl">${e.n}</div>`;L.appendChild(d);e.el=d});
 pairs=[];for(let a=0;a<5;a++)for(let b=a+1;b<5;b++){const ln=document.createElementNS(NS,'line');mesh.appendChild(ln);pairs.push([a,b,ln])}
 spokes=[];const used={};c.T.forEach(m=>{const f=idx[m[1]],t=idx[m[2]];if(ents[f].tool!==ents[t].tool){const tl=ents[f].tool?f:t,ag=ents[f].tool?t:f;used[tl+'-'+ag]=[tl,ag]}});
 Object.values(used).forEach(([a,b])=>{const ln=document.createElementNS(NS,'line');ln.setAttribute('class','spoke');mesh.appendChild(ln);spokes.push([a,b,ln])});
 el.querySelector('.core').classList.remove('done');kEl.textContent=c.k;cEl.textContent=c.title;
 [...tabs.children].forEach((b,j)=>{b.classList.toggle('on',j===i);b.setAttribute('aria-selected',j===i);b.querySelector('.p').style.width='0'});
 endAt=c.T[c.T.length-1][0]+TRAVEL+500}
const pos=[];
function place(now){const s=now/1000;ents.forEach((e,j)=>{const amp=e.tool?6:9;const ang=(e.base+amp*Math.sin(s*e.sp+e.ph))*Math.PI/180;const r=e.r+(e.tool?5:8)*Math.sin(s*e.sp*1.6+e.ph*2);
  const x=CX+r*Math.cos(ang),y=CY+r*Math.sin(ang)+3*Math.sin(s*.5+e.ph);pos[j]=[x,y];e.el.style.left=(x/412*100)+'%';e.el.style.top=(y/360*100)+'%'});
 pairs.concat(spokes).forEach(([a,b,ln])=>{ln.setAttribute('x1',pos[a][0]);ln.setAttribute('y1',pos[a][1]);ln.setAttribute('x2',pos[b][0]);ln.setAttribute('y2',pos[b][1])})}
function qp(a,b,k,bend){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,cx=mx+(CX-mx)*bend,cy=my+(CY-my)*bend,u=1-k;return[u*u*a[0]+2*u*k*cx+k*k*b[0],u*u*a[1]+2*u*k*cy+k*k*b[1]]}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const kind=m=>m[4]==='w'?'w':(ents[idx[m[1]]].h||ents[idx[m[2]]].h)?'h':m[4]==='t'?'t':'';
const COL={'':'#5CCFE6',h:'#F2B15A',w:'#F08A78',t:'#9BE3F2'};
function addMsg(m){const ty=kind(m);[...log.children].forEach(c=>c.classList.add('old'));while(log.children.length>1)log.firstChild.remove();
 const d=document.createElement('div');d.className='msg '+ty;d.innerHTML=`<em>${ents[idx[m[1]]].n} → ${ents[idx[m[2]]].n}</em>${m[3]}`;log.appendChild(d)}
function ending(){root.dispatchEvent(new CustomEvent('agentend'));el.querySelector('.core').classList.add('done');const e=CASES[cur].end;log.innerHTML=`<div class="end msg"><div class="n">${e[0]}</div><div class="s">${e[1]}</div><div class="ag-stats">${e[2].map(x=>'<b>'+x+'</b>').join('')}</div></div>`}

load(0);
/* Reduce Motion: the stories still play, but agents hold still, messages fade in place instead of flying, and nothing sprays */

function frame(now){if(!running)return;if(t0===null)t0=now;const t=now-t0;place(RM?0:now);const c=CASES[cur];
 c.T.forEach((m,j)=>{if(t>=m[0]&&!fired.has(j)){fired.add(j);const ty=kind(m),col=COL[ty];
  const g=document.createElementNS(NS,'g');const path=document.createElementNS(NS,'path');path.setAttribute('class','trail');path.setAttribute('stroke',col);path.setAttribute('stroke-width',ty==='t'?'1':'1.3');
  if(ty==='t')path.setAttribute('stroke-dasharray','2 3');
  const dot=document.createElementNS(NS,'circle');dot.setAttribute('r',ty==='t'?'2.6':'3.4');dot.setAttribute('fill','#fff');dot.style.filter=`drop-shadow(0 0 4px ${col}) drop-shadow(0 0 10px ${col})`;
  g.appendChild(path);g.appendChild(dot);fx.appendChild(g);ents[idx[m[1]]].el.classList.add('act');
  live.push({m,start:m[0],g,path,dot,ty,bend:ty==='t'?.12:.35})}});
 live=live.filter(o=>{const k=Math.min(1,(t-o.start)/TRAVEL),ke=ease(k),a=pos[idx[o.m[1]]],b=pos[idx[o.m[2]]];
  const p=qp(a,b,ke,o.bend);o.dot.setAttribute('cx',p[0]);o.dot.setAttribute('cy',p[1]);
  const k0=RM?0:Math.max(0,ke-.3),k1=RM?1:ke;let d='';for(let s=0;s<=8;s++){const q=qp(a,b,k0+(k1-k0)*s/8,o.bend);d+=(s?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1)}o.path.setAttribute('d',d);if(RM&&!o.arrived){o.dot.setAttribute('r','0');o.path.style.opacity=k}
  const to=ents[idx[o.m[2]]].el,from=ents[idx[o.m[1]]].el;
  if(k>=1&&!o.arrived){o.arrived=true;o.arr=t;from.classList.remove('act');to.classList.add('act');if(o.ty==='w')to.classList.add('warn');addMsg(o.m);o.dot.setAttribute('r','0');const q=pos[idx[o.m[2]]];root.dispatchEvent(new CustomEvent('agentmsg',{detail:{x:q[0],y:q[1],type:o.ty}}))}
  if(o.arrived){const f=Math.max(0,1-(t-o.arr)/550);o.path.style.opacity=f;if(f===0){to.classList.remove('act','warn');o.g.remove();return false}}
  return true});
 const bar=tabs.children[cur].querySelector('.p');bar.style.width=Math.min(100,t/(endAt+HOLD)*100)+'%';
 if(t>=endAt&&!ended){ended=true;ending()}
 if(t>=endAt+HOLD){L.classList.add('out');running=false;setTimeout(()=>{load((cur+1)%CASES.length);t0=null;L.classList.remove('out');running=true;requestAnimationFrame(frame)},500);return}
 requestAnimationFrame(frame)}
place(performance.now());
new IntersectionObserver(en=>{const v=en[0].isIntersecting;if(v&&!running){running=true;requestAnimationFrame(frame)}else if(!v){running=false}}).observe(el);
})();
