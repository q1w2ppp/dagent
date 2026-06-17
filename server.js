const http=require('http'),https=require('https');
const PORT=process.env.PORT||10000;
const APP_ID='cli_aab8f90110ba9cc8',APP_SECRET='BBGn2cO02VNpZnAonZX8yf02Vi7X4COw';
const DEEPSEEK_KEY=process.env.DEEPSEEK_KEY||'';
const VISION_KEY=process.env.VISION_KEY||'';
const OPENAI_KEY=process.env.OPENAI_KEY||'';
const GLM_KEY=process.env.GLM_KEY||'';

// ═══ Knowledge Base ═══
const DESIGNERS=[{id:'paula-scher',name:'Paula Scher',tags:'后现代 信息密度 文字即图形'.split(' '),strategies:'文字填充空间 对比尺度跳跃'.split(' '),best_for:'品牌 海报 出版'.split(' '),work:'Public Theater / Citi'},{id:'kenya-hara',name:'Kenya Hara',tags:'极简 空寂 东方美学'.split(' '),strategies:'留白即信息 空的比满有力'.split(' '),best_for:'生活方式 文化 包装'.split(' '),work:'MUJI'},{id:'stefan-sagmeister',name:'Stefan Sagmeister',tags:'概念驱动 实验性 身体艺术'.split(' '),strategies:'用身体当画布 手写文字'.split(' '),best_for:'实验海报 音乐 艺术书'.split(' '),work:'Things I Learned'},{id:'josef-brockmann',name:'Josef Muller-Brockmann',tags:'瑞士国际 网格 数学美学'.split(' '),strategies:'网格即一切 数学比例'.split(' '),best_for:'海报 出版 展览'.split(' '),work:'Beethoven海报'},{id:'tibor-kalman',name:'Tibor Kalman',tags:'社会设计 反消费主义'.split(' '),strategies:'用设计讲社会议题 反精致'.split(' '),best_for:'社会运动 NGO'.split(' '),work:'Colors杂志'},{id:'david-carson',name:'David Carson',tags:'解构 反设计 实验排版'.split(' '),strategies:'打破网格 文字当纹理'.split(' '),best_for:'音乐 杂志 青年'.split(' '),work:'Ray Gun'},{id:'田中一光',name:'Ikko Tanaka',tags:'日本传统 几何化 东西融合'.split(' '),strategies:'传统纹样几何化 符号化'.split(' '),best_for:'文化 和风 出版'.split(' '),work:'Nihon Buyo'},{id:'michael-bierut',name:'Michael Bierut',tags:'大众设计 叙事 实用主义'.split(' '),strategies:'清晰的叙事线 人人能懂'.split(' '),best_for:'大型机构 公共'.split(' '),work:'Hillary 2016'}];
const WORKS=[{id:'w001',title:'Plastic Ocean',comp:'D&AD 石墨铅笔',theme:'海洋环保',concept:'塑料纹理模拟濒危海洋生物',visual:'微距摄影+标题退后',tags:'环保 高反差 实物造景'.split(' '),designer:'stefan-sagmeister'},{id:'w002',title:'Muji Horizons',comp:'iF 金质奖',theme:'日常之美',concept:'收集全球用户窗前景色做成书',visual:'横幅构图+低彩度',tags:'极简 品牌叙事 UGC'.split(' '),designer:'kenya-hara'},{id:'w003',title:'Beethoven 250th',comp:'Red Dot 最佳',theme:'音乐x几何',concept:'几何圆模拟乐谱',visual:'精确几何+纯色',tags:'几何 音乐可视化 红黑白'.split(' '),designer:'josef-brockmann'},{id:'w004',title:'Ray Gun #39',comp:'AIGA',theme:'反设计',concept:'采访回答乱序排版',visual:'无视网格+叠加',tags:'解构 实验 杂志'.split(' '),designer:'david-carson'},{id:'w005',title:'Public Theater',comp:'Cannes 金狮',theme:'文化民主化',concept:'街头粗体字占满空间',visual:'满版文字+无图',tags:'品牌 文字即图形 高密度'.split(' '),designer:'paula-scher'},{id:'w006',title:'Nihon Buyo',comp:'Tokyo TDC 大奖',theme:'传统x现代',concept:'传统舞伎脸做几何抽象',visual:'左右分栏+具象到抽象',tags:'日本传统 几何 平面构成'.split(' '),designer:'田中一光'},{id:'w011',title:'Colors Race',comp:'D&AD',theme:'种族',concept:'不用文只用肖像摄影',visual:'全页肖像+极简排版',tags:'社会议题 肖像 纪实'.split(' '),designer:'tibor-kalman'},{id:'w013',title:'Hillary 2016',comp:'AIGA',theme:'领导力',concept:'H+红色箭头极简符号',visual:'极简符号+单色',tags:'政治 极简符号 大众传播'.split(' '),designer:'michael-bierut'}];
const COMPS={red:{name:'Red Dot',w:{c:30,e:40,i:30},cats:'品牌 海报 包装 出版',pref:'商业系统创新'},dad:{name:'D and AD',w:{c:50,e:20,i:30},cats:'海报 字体 品牌 插画',pref:'大胆创意 社会议题'},tdc:{name:'Tokyo TDC',w:{c:25,e:45,i:30},cats:'字体 排版 海报 书籍',pref:'字体创新 东方审美'},if:{name:'iF Design',w:{c:20,e:50,i:30},cats:'品牌 产品 UI 包装',pref:'系统完整 商业可行'}};
const THEORY='网格:[致命]基线对齐[重要]跨栏完整[建议]留白整数倍 | 格式塔:[致命]信息靠近[重要]视觉区分[致命]第一眼焦点 | 动线:[致命]2秒找焦点[重要]无干扰 | 字体:[致命]3种字号[重要]行高1.4倍[致命]对比度4.5:1[建议]避13px | 色彩:[重要]主色3个[致命]语义匹配[重要]色盲分辨';

// ═══ Matching Engine ═══
function matchWorks(q){const sw='我 想 做 找 一 个 张 件 的 是 请 帮 助 看'.split(' ');const ch=q.split('').filter(c=>!sw.includes(c)&&!/\s/.test(c)).join('');return WORKS.filter(w=>{const h=w.theme+w.concept+w.tags.join(' ');for(let i=0;i<ch.length-1;i++)if(h.includes(ch.slice(i,i+2)))return true;return false}).slice(0,3)}
function matchDesigners(q){const sw='我 想 做 找 一 个 张 件 的 是'.split(' ');const ch=q.split('').filter(c=>!sw.includes(c)&&!/\s/.test(c)).join('');return DESIGNERS.filter(d=>{const h=d.tags.join(' ')+d.strategies.join(' ')+d.best_for.join(' ');for(let i=0;i<ch.length-1;i++)if(h.includes(ch.slice(i,i+2)))return true;return false}).slice(0,3)}
function getDesigner(id){return DESIGNERS.find(d=>d.id===id)}

// ═══ AI APIs ═══
const hist=new Map();
async function askDeepSeek(system,msg,chatId){
  if(!hist.has(chatId))hist.set(chatId,[]);const h=hist.get(chatId);h.push({role:'user',content:msg});
  const msgs=[{role:'system',content:system},...h.slice(-10)];
  return new Promise((resolve,reject)=>{
    const body=JSON.stringify({model:'deepseek-chat',messages:msgs,temperature:0.7,max_tokens:800});
    const r=https.request({hostname:'api.deepseek.com',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+DEEPSEEK_KEY,'Content-Length':Buffer.byteLength(body)}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);const ans=j.choices[0].message.content;h.push({role:'assistant',content:ans});if(h.length>16)h.splice(0,2);resolve(ans)}catch(e){reject(e)}})});r.on('error',reject);r.write(body);r.end()
  });
}
async function analyzeImage(imageData,mimeType){
  return new Promise((resolve,reject)=>{
    if(!GLM_KEY){resolve('GLM_KEY未配置');return}
    const url='data:'+(mimeType||'image/png')+';base64,'+imageData;
    const body=JSON.stringify({model:'glm-4v',messages:[{role:'user',content:[{type:'text',text:'分析这张设计作品的风格、配色、排版，推荐2-3位设计师'},{type:'image_url',image_url:{url}}]}],max_tokens:500});
    const r=https.request({hostname:'open.bigmodel.cn',path:'/api/paas/v4/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':GLM_KEY,'Content-Length':Buffer.byteLength(body)}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);resolve(j.choices?.[0]?.message?.content||('RAW:'+d.substring(0,200)))}catch(e){resolve('RAW:'+d.substring(0,200))}})});r.on('error',e=>{last.imgErr=e.message;resolve('NET:'+e.message)});r.write(body);r.end()
  });
}

// ═══ Process Query with Step 2 + AI ═══
async function processQuery(q,chatId){
  const intents=[{re:/参考|灵感|有没有|找找|我想做|主题/i,type:'inspire'},{re:/分析|拆解|为什么好/i,type:'deconstruct'},{re:/方向|思路|创意|方案/i,type:'direct'},{re:/比赛|参赛|投哪个/i,type:'compete'},{re:/审|检查|帮我看|问题|批评/i,type:'critique'}];
  let intent='inspire';for(const p of intents)if(p.re.test(q)){intent=p.type;break}
  const works=matchWorks(q),designers=matchDesigners(q);
  let ctx='## 知识库匹配结果\n';
  if(works.length){ctx+=`\n${works.length}件作品：\n`;works.forEach(w=>{const d=getDesigner(w.designer);ctx+=`- ${w.title}(${w.comp}) · ${w.theme} · ${w.concept} · ${w.visual} · 设计师:${d?d.name:''}\n`})}else ctx+='\n未匹配到相关作品。\n';
  if(designers.length){ctx+=`\n${designers.length}位设计师：\n`;designers.forEach(d=>ctx+=`- ${d.name} · ${d.tags.join(' ')} · ${d.strategies.join(' ')}\n`)}
  if(intent==='compete'&&works.length){ctx+='\n比赛推荐：\n';for(const[k,c]of Object.entries(COMPS))ctx+=`- ${c.name}: ${c.w.c}%概念 ${c.w.e}%执行 ${c.w.i}%创新 · ${c.pref}\n`}
  if(intent==='critique')ctx+=`\n审查清单：${THEORY}\n`;
  const sysBase=`你是设计评论家。根据下方知识库匹配结果回答。规则：
1. 必须引用匹配结果中的具体作品名、设计师名、比赛名
2. 匹配结果如果有就用，如果没有诚实说「知识库中无完美匹配，以下是最近似参考」
3. 绝对不编造作品名或设计师名——只引用匹配结果中出现的
4. 用户说"参考/灵感/我想做"→推荐2-3作品+2位设计师(说明为什么匹配)
5. 用户说"分析/拆解"→从概念/视觉/排版/色彩四维度拆解，给设计推理链
6. 用户说"方向/思路"→生成3个具体创意方向(含策略+视觉关键词+参考+风险)
7. 用户说"比赛/参赛"→推荐比赛+匹配理由+权重分析+风险提示
8. 用户说"审/检查/问题"→按审查清单逐项对照(致命/重要/建议三级)，列前3优先改
9. 不说"你可以这样""值得注意的是"——直接给结论
10. 引用理论库规则时说明是"设计理论库"而非自己编的\n${ctx}`;
  return askDeepSeek(sysBase,q,chatId);
}

// ═══ Feishu Helpers ═══
async function getToken(){return new Promise((resolve,reject)=>{const b=JSON.stringify({app_id:APP_ID,app_secret:APP_SECRET});const r=https.request({hostname:'open.feishu.cn',path:'/open-apis/auth/v3/tenant_access_token/internal',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(b)}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve(JSON.parse(d).tenant_access_token)}catch(e){reject(e)}})});r.on('error',reject);r.write(b);r.end()})}
async function sendMsg(oid,text){
  try{
    const token=await getToken();
    const b=JSON.stringify({receive_id:oid,msg_type:'text',content:JSON.stringify({text})});
    return new Promise((resolve,reject)=>{
      const r=https.request({hostname:'open.feishu.cn',path:'/open-apis/im/v1/messages?receive_id_type=open_id',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'Content-Length':Buffer.byteLength(b)}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>{last.sent=d;resolve()})});
      r.on('error',e=>{last.sent='NET:'+e.message;reject(e)});r.write(b);r.end();
    });
  }catch(e){last.sent='TOKEN:'+e.message;throw e}
}
async function downloadImage(key,token){return new Promise((resolve,reject)=>{const r=https.request({hostname:'open.feishu.cn',path:'/open-apis/im/v1/images/'+key,method:'GET',headers:{'Authorization':'Bearer '+token}},res=>{const chunks=[];const mime=res.headers['content-type']||'image/jpeg';res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({data:Buffer.concat(chunks).toString('base64'),mime}))});r.on('error',reject);r.end()})}

// ═══ Server ═══
const seen=new Set();let last={};
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
  if(req.method==='GET'&&req.url==='/test-send'){
    try{await sendMsg('ou_b88be4a4e6b6939cfbbc95feacfea648','测试消息-来自服务器');res.writeHead(200);res.end('sent')}catch(e){res.writeHead(500);res.end('fail:'+e.message)}
    return;
  }
  if(req.method==='GET'&&req.url==='/debug'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify(last))}
  
  if(req.method==='POST'&&req.url==='/api/chat'){
    let body='';req.on('data',c=>body+=c);req.on('end',async()=>{try{const d=JSON.parse(body);const a=await processQuery(d.message,d.chatId||'w');res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({answer:a}))}catch(e){res.writeHead(500);res.end(JSON.stringify({error:e.message}))}});return;
  }
  
  if(req.method==='POST'&&req.url==='/feishu'){
    let body='';req.on('data',c=>body+=c);req.on('end',async()=>{
      try{const d=JSON.parse(body);if(d.type==='url_verification'||d.challenge){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({challenge:d.challenge||d.token}))}
        const h=d.header||{};const et=h.event_type||'';const ev=d.event||{};const msg=ev.message||{};if(et!=='im.message.receive_v1'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({code:0}))}
        if(seen.has(msg.message_id)){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({code:0}))}seen.add(msg.message_id);
        let text='',imgKey='';try{const c=JSON.parse(msg.content||'{}');text=c.text||'';imgKey=c.image_key||''}catch(e){}
        const oid=((ev.sender||{}).sender_id||(d.sender||{})).open_id||(d.sender||{}).open_id||'';last={et,text:!!text,img:!!imgKey,content:(msg.content||'').substring(0,200)};
        if(imgKey&&oid){try{last.step='analyzing';const tk=await getToken();const img=await downloadImage(imgKey,tk);const a=await analyzeImage(img.data,img.mime);last.imgResult=a.substring(0,100);await sendMsg(oid,a);last.step='img-ok'}catch(e){last.step='img-err:'+e.message}}
        else if(text&&oid){try{last.step='querying';const a=await processQuery(text,oid);last.step='sending';await sendMsg(oid,a);last.step='sent'}catch(e){last.step='err:'+e.message}}
        res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({code:0}));
      }catch(e){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({code:0}))}
    });return;
  }
  res.writeHead(404);res.end();
});
server.listen(PORT,()=>console.log('Design Agent :'+PORT));
