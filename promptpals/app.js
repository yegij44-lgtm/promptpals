const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function theme(t){document.documentElement.dataset.theme=t;$('#theme').textContent=t==='dark'?'Light':'Dark';store.set('pp_theme',t)}
$('#theme').onclick=()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark');
theme(store.get('pp_theme',matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
/* Credits live in this browser only (no backend). Reset on the 1st of each month, +BONUS per new day, capped at MAX. */
const COST={image:100,builder:80,improve:60,study:40,email:40,social:40,sum:30,rewrite:30,meal:20,budget:15,decide:15,names:10,plan:10};
const MAX=500,BONUS=50;
const ym=d=>d.getFullYear()+'-'+(d.getMonth()+1),ymd=d=>ym(d)+'-'+d.getDate();
function credits(){
  const n=new Date();let c=store.get('pp_cr',null);
  if(!c||c.m!==ym(n)){c={bal:MAX,m:ym(n),d:ymd(n)}}
  else if(c.d!==ymd(n)){c.bal=Math.min(MAX,c.bal+BONUS);c.d=ymd(n)}
  store.set('pp_cr',c);return c;
}
function badge(){const b=document.getElementById('credits');if(b)b.textContent=credits().bal+' credits'}
badge();
if(document.getElementById('tools')){
const TONES=['Friendly','Professional','Casual','Persuasive','Playful','Simple and clear'];
const COL=['--pink','--lav','--mint','--sun','--sky','--peach'];
/* field = [key, label, type (t text, a textarea, s select), placeholder or options] */
const TOOLS=[
{id:'builder',n:'Prompt Builder',e:'🧩',cat:'Prompts',d:'Role, task, context and format in one neat prompt.',f:[['role','Who should the AI be?','t','a friendly career coach'],['task','What do you need?','a','Help me prepare for a job interview'],['context','Context (optional)','a','I am a fresher applying for a marketing role'],['format','Answer format','s',['Step-by-step list','Table','Short paragraphs','Bullet points','Email draft']],['tone','Tone','s',TONES]],
 b:v=>`Act as ${v.role||'a helpful expert'}.\n\nTask: ${v.task}\n${v.context?`Context: ${v.context}\n`:''}\nFormat: ${v.format}\nTone: ${v.tone}\n\nIf anything is unclear, ask me up to 3 questions before answering.`},
{id:'email',n:'Email Writer',e:'💌',cat:'Prompts',d:'Follow-ups, complaints, apologies, cold outreach.',f:[['sit','Situation','s',['Follow-up','Complaint','Apology','Cold outreach','Request a favor','Thank you','Ask for a refund']],['who','Who is it to? (optional)','t','my landlord'],['det','Key details','a','The heater has been broken for a week...'],['tone','Tone','s',TONES],['len','Length','s',['Short','Medium','Detailed']]],
 b:v=>`Write a ${v.len.toLowerCase()} email.\nSituation: ${v.sit}\n${v.who?`Recipient: ${v.who}\n`:''}Key details: ${v.det}\nTone: ${v.tone}\n\nGive me a subject line and the email body, then one shorter alternative version.`},
{id:'study',n:'Study Helper',e:'📚',cat:'Prompts',d:'Explain, quiz, summarize or plan your studying.',f:[['topic','Topic','t','photosynthesis'],['mode','What do you want?','s',['Explain it simply','Make a quiz','Summarize my notes','Build a study plan']],['level','Level','s',['elementary','middle school','high school','college','beginner']],['notes','Notes (for summaries)','a','Paste your notes here']],
 b:v=>({'Explain it simply':`Explain "${v.topic}" for a ${v.level} student. Use a simple analogy and a real-life example, then end with 3 check-your-understanding questions.`,'Make a quiz':`Create an 8-question quiz on "${v.topic}" for a ${v.level} student. Mix multiple choice and short answer, and put the answer key at the end with short explanations.`,'Summarize my notes':`Summarize my notes on "${v.topic}" into key points, definitions and 5 flashcards:\n\n${v.notes||'[paste notes here]'}`,'Build a study plan':`Build a 7-day study plan for "${v.topic}" at ${v.level} level, with daily goals, 30 to 45 minute sessions and a quick review at the end.`})[v.mode]},
{id:'social',n:'Social Media Ideas',e:'📱',cat:'Prompts',d:'Captions, hooks and a week of content.',f:[['topic','Topic or product','t','homemade candles'],['plat','Platform','s',['Instagram','TikTok','Facebook','X (Twitter)','LinkedIn','YouTube Shorts']],['mode','I need','s',['Captions','Hooks','Content calendar']],['goal','Goal','t','get more followers'],['tone','Tone','s',TONES]],
 b:v=>`Create ${v.mode.toLowerCase()} for ${v.plat} about: ${v.topic}.\nGoal: ${v.goal}\nTone: ${v.tone}\n\n${v.mode==='Content calendar'?'Make a 7-day calendar with the post idea, format and best posting time for each day.':'Give 5 options, each with relevant hashtags and a call to action.'}`},
{id:'image',n:'Image Prompt Maker',e:'🎨',cat:'Prompts',d:'Style, lighting and mood for AI art tools.',f:[['subject','Subject','t','a sleepy fox in a flower field'],['style','Style','s',['watercolor','3D cartoon','anime','photorealistic','pixel art','paper cut','oil painting']],['light','Lighting','s',['soft morning','golden hour','neon','studio','moonlight']],['mood','Mood','s',['cozy','dreamy','dramatic','cheerful','mysterious']],['extra','Extra details (optional)','t','pastel colors']],
 b:v=>`${v.subject}, ${v.style} style, ${v.light} lighting, ${v.mood} mood${v.extra?', '+v.extra:''}, highly detailed, sharp focus, balanced composition`},
{id:'improve',n:'Prompt Improver',e:'🪄',cat:'Prompts',d:'Paste a weak prompt, get a stronger one.',f:[['p','Your prompt','a','write something about dogs']],
 b:v=>`Improve the prompt below. Make it clearer, more specific and better structured by adding a role, context, constraints and an output format. Keep my original intent.\n\nReturn: 1) the improved prompt in a code block, 2) a short list of what you changed.\n\nMy prompt:\n"""\n${v.p}\n"""`},
{id:'rewrite',n:'Text Rewriter',e:'✏️',cat:'Everyday',d:'Same message, a different tone.',f:[['text','Your text','a','Paste your text here'],['tone','New tone','s',TONES.concat(['Shorter','More polite'])]],
 b:v=>`Rewrite the text below in a ${v.tone.toLowerCase()} tone. Keep the meaning, fix grammar, and give me 2 versions.\n\nText:\n"""\n${v.text}\n"""`},
{id:'sum',n:'Quick Summarizer',e:'📝',cat:'Everyday',d:'Long text in, TL;DR out.',f:[['text','Text to summarize','a','Paste an article or notes'],['fmt','Format','s',['5 bullet points','a TL;DR in 2 sentences','a one-paragraph summary','key takeaways and action items']]],
 b:v=>`Summarize the text below as ${v.fmt}. Put the most important point first.\n\n"""\n${v.text}\n"""`},
{id:'meal',n:'Meal Planner',e:'🥗',cat:'Everyday',d:'A menu and grocery list that fit your budget.',f:[['days','How many days?','s',['3','5','7','14']],['diet','Diet (optional)','t','vegetarian'],['budget','Budget per day','t','$10'],['no','Foods to avoid (optional)','t','mushrooms']],
 b:v=>`Plan ${v.days} days of meals${v.diet?' for a '+v.diet+' diet':''} with a budget of about ${v.budget||'a modest amount'} per day.${v.no?' Avoid: '+v.no+'.':''} Include breakfast, lunch, dinner and a snack, then a grocery list grouped by store section.`},
{id:'budget',n:'Budget Helper',e:'🐷',cat:'Everyday',d:'See where your money goes and save more.',f:[['inc','Monthly income','t','$1,800'],['exp','Monthly expenses','a','Rent $600, food $300, transport $80...'],['goal','Your goal','t','save $500 in 3 months']],
 b:v=>`Act as a friendly budgeting coach. My monthly income is ${v.inc}. My expenses: ${v.exp}. My goal: ${v.goal}.\nShow a simple breakdown (needs, wants, savings), spot where I can cut back, and give me 5 realistic saving tips.`},
{id:'decide',n:'Decision Helper',e:'⚖️',cat:'Everyday',d:'Pros, cons and a scored recommendation.',f:[['dec','The decision','t','Which laptop should I buy?'],['opts','Options','a','Option A, Option B...'],['pri','What matters most','t','price, battery life, weight']],
 b:v=>`Help me decide: ${v.dec}\nOptions: ${v.opts}\nWhat matters most to me: ${v.pri}\n\nGive pros and cons for each option, score each from 1 to 10 against my priorities in a table, then recommend one and explain why.`},
{id:'names',n:'Name & Slogan Maker',e:'🏷️',cat:'Everyday',d:'Names for pets, shops, projects, usernames.',f:[['what','What needs a name?','t','a cozy bookshop café'],['vibe','Vibe','s',['cute','elegant','funny','modern','warm','bold']],['kw','Words to include (optional)','t','book, tea']],
 b:v=>`Give me 15 creative name ideas for ${v.what}. Vibe: ${v.vibe}.${v.kw?' Include or play with: '+v.kw+'.':''} Add a catchy slogan for your top 3 picks.`},
{id:'plan',n:'Daily Planner',e:'🗓️',cat:'Everyday',d:'Turn a messy to-do list into a schedule.',f:[['todo','Your to-do list','a','Laundry, reply to emails, gym, study 2 hours'],['hrs','Free hours today','t','6'],['en','Energy level','s',['high in the morning','low all day','high in the evening','steady']]],
 b:v=>`Turn my to-do list into a realistic schedule for today. I have ${v.hrs} free hours and my energy is ${v.en}.\nTo-do list:\n${v.todo}\n\nPrioritize by importance, put hard tasks when my energy is high, add short breaks, and tell me what to drop if time runs out.`}
];
const TPL=[
['Explain like I am 10','Explain [topic] like I am 10 years old, using a fun analogy.'],
['Weekly review','Ask me 5 short questions to review my week, then summarize my wins and what to improve next week.'],
['Polite no','Write a kind but firm message declining [request] without hurting the relationship.'],
['Trip planner','Plan a 3-day trip to [place] for [number] people with a budget of [amount]. Include food stops and a rainy-day backup.'],
['Cover letter spark','Write a confident 150-word cover letter opening for a [job title] role, based on this experience: [paste].'],
['Learn in 20 minutes','Teach me the basics of [skill] in a 20-minute lesson, with one practice exercise at the end.']
];
let cat='All',tab='saved',cur=null,qv='';
const esc=s=>s;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1800)}
function copy(txt){
  const done=()=>toast('Copied. Paste it into your AI app');
  if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(txt).then(done,()=>fb())}else fb();
  function fb(){const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){toast('Press Ctrl+C to copy')}a.remove()}
}
function renderChips(){
  const c=$('#chips');c.innerHTML='';
  ['All','Prompts','Everyday'].forEach(n=>{const b=document.createElement('button');b.className='chip';b.textContent=n==='All'?'All':n==='Prompts'?'Prompt makers':'Everyday';b.setAttribute('aria-pressed',n===cat);b.onclick=()=>{cat=n;renderChips();renderTiles()};c.appendChild(b)});
}
function renderTiles(){
  const g=$('#tools');g.innerHTML='';
  const list=TOOLS.filter(t=>(cat==='All'||t.cat===cat)&&(t.n+' '+t.d).toLowerCase().includes(qv));
  if(!list.length){g.innerHTML='<p class="empty">No tools match that. Try "email" or "plan".</p>';return}
  list.forEach(t=>{
    const b=document.createElement('button');b.className='tile stick';b.style.setProperty('--c','var('+COL[TOOLS.indexOf(t)%COL.length]+')');
    b.innerHTML='<span class="tag"></span><h3></h3><span class="d"></span>';
    b.children[0].textContent=t.cat.toLowerCase()+' · '+COST[t.id]+' credits';b.children[1].textContent=t.n;b.children[2].textContent=t.d;
    b.onclick=()=>openTool(t.id);g.appendChild(b);
  });
}
function openTool(id){
  cur=TOOLS.find(t=>t.id===id);
  $('#dt').textContent=cur.n;$('#go').textContent='Generate prompt ('+COST[cur.id]+' credits)';
  $('#dlg').style.setProperty('--c','var('+COL[TOOLS.indexOf(cur)%COL.length]+')');
  const f=$('#form');f.innerHTML='';
  cur.f.forEach(([k,l,t,x])=>{
    const lb=document.createElement('label');lb.append(l);let i;
    if(t==='s'){i=document.createElement('select');x.forEach(o=>{const op=document.createElement('option');op.textContent=o;i.appendChild(op)})}
    else{i=document.createElement(t==='a'?'textarea':'input');i.placeholder=x}
    i.id='f_'+k;lb.appendChild(i);f.appendChild(lb);
  });
  $('#out').value='';$('#dlg').showModal();
}
function spend(n){const c=credits();if(c.bal<n){const t=new Date(),nx=new Date(t.getFullYear(),t.getMonth()+1,1);toast('Not enough credits. +'+BONUS+' tomorrow, full refill on '+nx.toLocaleDateString(undefined,{month:'short',day:'numeric'}));return false}c.bal-=n;store.set('pp_cr',c);badge();return true}
function generate(){
  const v={};cur.f.forEach(([k])=>v[k]=$('#f_'+k).value.trim());
  if(!v[cur.f[0][0]]){toast('Fill in the first box first');$('#f_'+cur.f[0][0]).focus();return}
  if(!spend(COST[cur.id]))return;const txt=cur.b(v);$('#out').value=txt;
  const h=store.get('pp_hist',[]);h.unshift({t:cur.n,p:txt});store.set('pp_hist',h.slice(0,10));renderMy();
}
function renderMy(){
  const box=$('#mylist');box.innerHTML='';
  const arr=store.get(tab==='saved'?'pp_saved':'pp_hist',[]);
  if(!arr.length){const p=document.createElement('p');p.className='empty';p.textContent=tab==='saved'?'Nothing saved yet. Make a prompt and tap Save.':'Your last 10 prompts will show up here.';box.appendChild(p);return}
  arr.forEach((it,i)=>{
    const d=document.createElement('div');d.className='item stick';
    const l=document.createElement('div');const s=document.createElement('small');s.textContent=it.t;const p=document.createElement('p');p.textContent=it.p;l.append(s,p);
    const a=document.createElement('div');a.className='acts';
    const c=document.createElement('button');c.className='btn mini sun';c.textContent='Copy';c.onclick=()=>copy(it.p);a.appendChild(c);
    if(tab==='saved'){const x=document.createElement('button');x.className='btn mini';x.textContent='Delete';x.setAttribute('aria-label','Delete');x.onclick=()=>{arr.splice(i,1);store.set('pp_saved',arr);renderMy()};a.appendChild(x)}
    d.append(l,a);box.appendChild(d);
  });
}
function renderTpl(){
  const g=$('#tpl');
  TPL.forEach(([t,p],i)=>{
    const d=document.createElement('div');d.className='stick';
    const h=document.createElement('h3');h.textContent=t;const q=document.createElement('p');q.textContent=p;
    const b=document.createElement('button');b.className='btn mini';b.textContent='Copy prompt';b.onclick=()=>copy(p);
    d.append(h,q,b);g.appendChild(d);
  });
}
$('#go').onclick=generate;
$('#x').onclick=()=>$('#dlg').close();
$('#dlg').addEventListener('click',e=>{if(e.target.id==='dlg')e.target.close()});
$('#copy').onclick=()=>{const t=$('#out').value;t?copy(t):toast('Make a prompt first')};
$('#gpt').onclick=()=>{const t=$('#out').value;if(!t)return toast('Make a prompt first');window.open('https://chatgpt.com/?q='+encodeURIComponent(t),'_blank','noopener')};
$('#cl').onclick=()=>{const t=$('#out').value;if(!t)return toast('Make a prompt first');window.open('https://claude.ai/new?q='+encodeURIComponent(t),'_blank','noopener')};
$('#save').onclick=()=>{const t=$('#out').value;if(!t)return toast('Make a prompt first');const s=store.get('pp_saved',[]);s.unshift({t:cur.n,p:t});store.set('pp_saved',s);tab='saved';document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tab===tab));renderMy();toast('Saved')};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderMy()});
$('#q').oninput=e=>{qv=e.target.value.toLowerCase().trim();renderTiles()};

document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$('#q').focus()}});
renderChips();renderTiles();renderMy();renderTpl();
}
