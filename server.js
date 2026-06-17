const http=require('http'),https=require('https');
const PORT=process.env.PORT||10000;
const APP_ID='cli_aab8f90110ba9cc8',APP_SECRET='BBGn2cO02VNpZnAonZX8yf02Vi7X4COw';
const DEEPSEEK_KEY=process.env.DEEPSEEK_KEY||'';
const VISION_KEY=process.env.VISION_KEY||'';

// ═══ Knowledge Base ═══
const DESIGNERS=[
  {id:'paula-scher',name:'保拉·谢尔',tags:['后现代','信息密度','文字即图形'],strategies:['文字填充空间','对比尺度跳跃'],best_for:['品牌识别','海报','出版物'],代表:'Public Theater / Citi'},
  {id:'kenya-hara',name:'原研哉',tags:['极简','空寂','东方美学'],strategies:['留白即信息','空的比满有力'],best_for:['生活方式','文化','包装'],代表:'MUJI'},
  {id:'stefan-sagmeister',name:'施德明',tags:['概念驱动','实验性','身体艺术'],strategies:['用身体当画布','手写文字'],best_for:['实验海报','音乐','艺术书'],代表:'Things I Learned'},
  {id:'otl-aicher',name:'奥托·艾舍',tags:['系统设计','图标','网格'],strategies:['模块化思维','数学比例'],best_for:['导视系统','图标','企业'],代表:'慕尼黑奥运'},
  {id:'david-carson',name:'大卫·卡森',tags:['解构','反设计','实验排版'],strategies:['打破网格','文字当纹理'],best_for:['音乐','杂志','青年文化'],代表:'Ray Gun'},
  {id:'tanaka',name:'田中一光',tags:['日本传统','几何化','东西融合'],strategies:['传统纹样几何化','符号化'],best_for:['文化','和风','出版'],代表:'Nihon Buyo'},
  {id:'jessica-walsh',name:'Jessica Walsh',tags:['超现实','粉色美学','手工感'],strategies:['实物造景','手工制作'],best_for:['时尚','美妆','艺术'],代表:'&Walsh'},
  {id:'herb-lubalin',name:'Herb Lubalin',tags:['字体大师','连字','Logo即字'],strategies:['字体连字设计'],best_for:['Logo','字体标识','出版'],代表:'Mother & Child'},
  {id:'tadanori-yokoo',name:'横尾忠则',tags:['迷幻','拼贴','日本波普'],strategies:['图像拼贴','矛盾空间'],best_for:['音乐','艺术','批判'],代表:'John Lennon海报'},
  {id:'josef-brockmann',name:'穆勒-布罗克曼',tags:['瑞士国际','网格','数学美学'],strategies:['网格即一切','数学比例'],best_for:['海报','出版','展览'],代表:'Beethoven海报'},
  {id:'neville-brody',name:'Neville Brody',tags:['实验字体','后朋克'],strategies:['字体实验','数字化美学'],best_for:['音乐','时尚','数字'],代表:'The Face杂志'},
  {id:'tibor-kalman',name:'Tibor Kalman',tags:['社会设计','反消费主义','概念先行'],strategies:['用设计讲社会议题','反精致'],best_for:['社会运动','NGO','社论'],代表:'Colors杂志'},
  {id:'irma-boom',name:'Irma Boom',tags:['书籍设计','材质叙事','荷兰设计'],strategies:['书即物体','白色空白说话'],best_for:['书籍','画册','奢侈品牌书'],代表:'SHV Think Book'},
  {id:'henry-steiner',name:'Henry Steiner',tags:['跨文化','中西融合','香港之父'],strategies:['东西符号混用','文化转译'],best_for:['亚洲品牌','银行'],代表:'HSBC'},
  {id:'michael-bierut',name:'Michael Bierut',tags:['大众设计','叙事','实用主义'],strategies:['清晰的叙事线','人人能懂'],best_for:['大型机构','公共项目'],代表:'Hillary2016'},
];
const WORKS=[
  {id:'w001',title:'Plastic Ocean',comp:'D&AD石墨铅笔',theme:'海洋环保',concept:'塑料纹理模拟濒危海洋生物',visual:'微距摄影+标题退后',tags:['环保','高反差','实物造景'],designer:'stefan-sagmeister'},
  {id:'w002',title:'Muji Horizons',comp:'iF金质奖',theme:'日常之美',concept:'收集全球用户窗前景色做成书',visual:'横幅构图+低彩度',tags:['极简','品牌叙事','UGC'],designer:'kenya-hara'},
  {id:'w003',title:'Beethoven 250th',comp:'Red Dot最佳',theme:'音乐×几何',concept:'几何圆模拟交响乐乐谱',visual:'精确几何+纯色',tags:['几何','音乐可视化','红黑白'],designer:'josef-brockmann'},
  {id:'w004',title:'Ray Gun #39',comp:'AIGA封面',theme:'反设计',concept:'采访回答乱序排版',visual:'无视网格+多层叠加',tags:['解构','实验','杂志'],designer:'david-carson'},
  {id:'w005',title:'Public Theater',comp:'Cannes金狮',theme:'文化民主化',concept:'街头粗体字占据所有空间',visual:'满版文字+无图',tags:['品牌','文字即图形','高密度'],designer:'paula-scher'},
  {id:'w006',title:'Nihon Buyo',comp:'Tokyo TDC大奖',theme:'传统×现代',concept:'传统舞伎脸做几何抽象',visual:'左右分栏+具象到抽象',tags:['日本传统','几何','平面构成'],designer:'tanaka'},
  {id:'w007',title:'Things I Learned',comp:'D&AD黄铅笔',theme:'人生感悟',concept:'格言用实体造字方式书写',visual:'实物造字+环境介入',tags:['概念','字体实验','装置'],designer:'stefan-sagmeister'},
  {id:'w011',title:'Colors Race',comp:'D&AD杂志',theme:'种族',concept:'不用文只用肖像摄影',visual:'全页肖像+极简排版',tags:['社会议题','肖像','纪实'],designer:'tibor-kalman'},
  {id:'w012',title:'HSBC六角形',comp:'Red Dot品牌',theme:'全球×在地',concept:'六角形框统一全球分行',visual:'六角形包装器+区域变体',tags:['品牌','全球','几何','系统'],designer:'henry-steiner'},
  {id:'w013',title:'Hillary 2016',comp:'AIGA政治',theme:'领导力',concept:'H+红色箭头极简符号',visual:'极简符号+单色',tags:['政治','极简符号','大众传播'],designer:'michael-bierut'},
];
const COMPS={red:{name:'Red Dot',w:{c:.3,e:.4,i:.3},prefers:'商业系统创新',cats:'品牌/海报/包装/UI/出版'},dad:{name:'D&AD',w:{c:.5,e:.2,i:.3},prefers:'大胆创意社会议题',cats:'海报/字体/品牌/插画'},cannes:{name:'Cannes Lions',w:{c:.35,e:.25,i:.4},prefers:'品牌叙事大众传播',cats:'品牌/设计/户外/数字'},tdc:{name:'Tokyo TDC',w:{c:.25,e:.45,i:.3},prefers:'字体创新东方审美',cats:'字体/排版/海报/书籍'},if:{name:'iF Design',w:{c:.2,e:.5,i:.3},prefers:'系统完整商业可行',cats:'全品类/品牌/产品/UI'}};
const THEORY_CHECKS='网格:[致命]基线对齐[重要]跨栏完整[建议]留白整数倍 | 格式塔:[致命]信息靠近[重要]视觉区分[致命]第一眼焦点 | 动线:[致命]2秒找焦点[重要]无干扰 | 字体:[致命]≤3种字号[重要]行高≥1.4[致命]对比度≥4.5[建议]避13/15/17px | 色彩:[重要]主色≤3[致命]语义匹配[重要]色盲分辨';

// ═══ Matching Engine (Step 2 logic) ═══
function matchWorks(q){
  const sw=['我','想','做','找','一','个','张','件','的','是','请','帮','助','看'];
  const ch=q.split('').filter(c=>!sw.includes(c)&&!/\s/.test(c)).join('');
  const m=WORKS.filter(w=>{const h=w.theme+w.concept+w.tags.join(' ');for(let i=0;i<ch.length-1;i++)if(h.includes(ch.slice(i,i+2)))return true;return false});
  return m.slice(0,3);
}
function matchDesigners(q){
  const sw=['我','想','做','找','一','个','张','件','的','是'];
  const ch=q.split('').filter(c=>!sw.includes(c)&&!/\s/.test(c)).join('');
  return DESIGNERS.filter(d=>{const h=d.tags.join(' ')+d.strategies.join(' ')+d.best_for.join(' ');for(let i=0;i<ch.length-1;i++)if(h.includes(ch.slice(i,i+2)))return true;return false}).slice(0,3);
}
function getDesigner(id){return DESIGNERS.find(d=>d.id===id)}
function getSimilar(w){return WORKS.filter(x=>x.id!==w.id&&x.tags.some(t=>w.tags.includes(t))).slice(0,2)}
function scoreComps(w){
  const r=[];for(const[k,c]of Object.entries(COMPS)){
    let s=0,re=[];if(c.cats.includes(w.tags[0])||c.cats.includes(w.theme)){s+=c.w.e*5;re.push('品类匹配')}
    if(w.tags.some(t=>c.prefers.includes(t))){s+=c.w.c*5;re.push('风格匹配')}
    r.push({...c,score:s,reasons:re});
  }
  return r.sort((a,b)=>b.score-a.score);
}

// ═══ Gemini Vision ═══
async function analyzeImage(imageBase64,userQuery){
  const prompt=userQuery||'请分析这张设计作品：描述画面内容，识别设计风格，推荐2-3位风格相关的设计师（从知识库中），并给出优化建议。';
  return new Promise((resolve,reject)=>{
    const body=JSON.stringify({model:'Qwen/Qwen2-VL-7B-Instruct',messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:'data:image/jpeg;base64,'+imageBase64}}]}],max_tokens:800,temperature:0.7});
    const r=https.request({hostname:'api.siliconflow.cn',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+VISION_KEY,'Content-Length':Buffer.byteLength(body)}},res=>{
      let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{const j=JSON.parse(d);resolve(j.choices?.[0]?.message?.content||'无法分析')}catch(e){resolve('无法分析')}});
    });r.on('error',e=>reject(e));r.write(body);r.end();
  });
}

// Feishu image download
async function downloadFeishuImage(imageKey,token){
  return new Promise((resolve,reject)=>{
    const r=https.request({hostname:'open.feishu.cn',path:'/open-apis/im/v1/images/'+imageKey,method:'GET',headers:{'Authorization':'Bearer '+token}},res=>{
      const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve(Buffer.concat(chunks).toString('base64')));
    });r.on('error',reject);r.end();
  });
}
const hist=new Map();
const seenMsgs=new Set();
let lastEvent='none'; // dedup Feishu messages
function askDeepSeek(systemPrompt,userMsg,chatId){
  if(!hist.has(chatId))hist.set(chatId,[]);
  const h=hist.get(chatId);h.push({role:'user',content:userMsg});
  const msgs=[{role:'system',content:systemPrompt},...h.slice(-10)];
  return new Promise((resolve,reject)=>{
    const body=JSON.stringify({model:'deepseek-chat',messages:msgs,temperature:.7,max_tokens:800});
    const r=https.request({hostname:'api.deepseek.com',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+DEEPSEEK_KEY,'Content-Length':Buffer.byteLength(body)}},res=>{
      let d='';res.on('data',c=>d+=c);res.on('end',()=>{
        try{const j=JSON.parse(d);const ans=j.choices[0].message.content;h.push({role:'assistant',content:ans});if(h.length>16)h.splice(0,2);resolve(ans)}catch(e){reject(e)}
      });
    });r.on('error',reject);r.write(body);r.end();
  });
}

// ═══ Process query with Step 2 + AI ═══
async function processQuery(q,chatId){
  // Intent routing
  const intentPatterns=[
    {re:/参考|灵感|有没有|找找|我想做|主题是/i,type:'inspire'},
    {re:/分析|拆解|为什么好|怎么做的/i,type:'deconstruct'},
    {re:/方向|思路|创意|方案|怎么设计/i,type:'direct'},
    {re:/比赛|参赛|投哪个|适合什么/i,type:'compete'},
    {re:/审|检查|帮我看|问题|批评/i,type:'critique'},
  ];
  let intent='inspire';for(const p of intentPatterns){if(p.re.test(q)){intent=p.type;break}}
  
  // Run Step 2 matching
  const works=matchWorks(q);
  const designers=matchDesigners(q);
  let context=`## 精确匹配结果（知识库查询）\n`;
  if(works.length){context+=`\n匹配到 ${works.length} 件作品：\n`;works.forEach(w=>{const d=getDesigner(w.designer);context+=`- ${w.title}（${w.comp}）· 主题:${w.theme} · 概念:${w.concept} · 视觉:${w.visual} · 标签:${w.tags.join(' ')} · 设计师:${d?d.name:''}\n`})}
  else context+=`\n未匹配到相关作品。\n`;
  if(designers.length){context+=`\n匹配到 ${designers.length} 位设计师：\n`;designers.forEach(d=>context+=`- ${d.name} · 标签:${d.tags.join(' ')} · 策略:${d.strategies.join(' ')} · 擅长:${d.best_for.join(' ')}\n`)}
  
  // Add competition scores if relevant
  if(intent==='compete'&&works.length){
    const scores=scoreComps(works[0]);
    context+=`\n比赛评分（针对 ${works[0].title}）：\n`;scores.forEach(s=>context+=`- ${s.name}: 匹配度${s.score>5?'★高':s.score>2?'☆中':'低'} · ${s.reasons.length?s.reasons.join(' '):'无直接匹配'}\n`);
  }
  
  // Add theory checks if critique
  if(intent==='critique'){context+=`\n审查清单：${THEORY_CHECKS}\n`}
  
  const system=`你是设计评论家。根据下方知识库匹配结果回答用户问题。规则：
1. 必须引用匹配结果中的**具体作品名、设计师名、比赛名**
2. 匹配结果如果有就用，如果没有诚实说「知识库中无完美匹配，以下是最近似参考」
3. 绝对不编造作品名或设计师名——只引用匹配结果中出现的
4. 输出结构化但不死板——有分析有叙事

${context}`;

  return askDeepSeek(system,q,chatId);
}

// ═══ Feishu helpers ═══
async function getToken(){
  return new Promise((resolve,reject)=>{
    const b=JSON.stringify({app_id:APP_ID,app_secret:APP_SECRET});
    const r=https.request({hostname:'open.feishu.cn',path:'/open-apis/auth/v3/tenant_access_token/internal',method:'POST',headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(b)}},res=>{
      let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve(JSON.parse(d).tenant_access_token)}catch(e){reject(e)}});
    });r.on('error',reject);r.write(b);r.end();
  });
}
async function sendMsg(openId,text){
  const token=await getToken();
  // Use Feishu card message for rich UI
  const card={
    config:{wide_screen_mode:true},
    header:{title:{tag:'plain_text',content:'设计智能体'},template:'purple'},
    elements:[{tag:'div',text:{tag:'lark_md',content:text}}]
  };
  const b=JSON.stringify({receive_id:openId,msg_type:'interactive',content:JSON.stringify(card)});
  return new Promise((resolve,reject)=>{
    const r=https.request({hostname:'open.feishu.cn',path:'/open-apis/im/v1/messages?receive_id_type=open_id',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token,'Content-Length':Buffer.byteLength(b)}},res=>{let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve())});
    r.on('error',reject);r.write(b);r.end();
  });
}

// ═══ Server ═══
const server=http.createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end()}
  if(req.method==='GET'&&req.url==='/'){res.writeHead(200);return res.end('OK')}
  if(req.method==='GET'&&req.url==='/debug'){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({lastEvent}))}
  if(req.method==='GET'&&req.url==='/test-vision'){
    try{
      const result=await new Promise((resolve,reject)=>{
        const body=JSON.stringify({model:'Qwen/Qwen2-VL-7B-Instruct',messages:[{role:'user',content:'say ok'}],max_tokens:20});
        const r=https.request({hostname:'api.siliconflow.cn',path:'/v1/chat/completions',method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+VISION_KEY,'Content-Length':Buffer.byteLength(body)}},res=>{
          let d='';res.on('data',c=>d+=c);res.on('end',()=>{try{resolve(JSON.parse(d).choices?.[0]?.message?.content||d)}catch(e){resolve(d)}})
        });r.on('error',e=>resolve('NET:'+e.message));r.write(body);r.end();
      });
      res.writeHead(200,{'Content-Type':'text/plain'});res.end(result);
    }catch(e){res.writeHead(500);res.end('err:'+e.message)}
    return;
  }
  if(req.method==='GET'&&req.url.startsWith('/test/')){
    const q=decodeURIComponent(req.url.slice(6));
    const w=matchWorks(q);const d=matchDesigners(q);
    res.writeHead(200,{'Content-Type':'application/json'});
    return res.end(JSON.stringify({query:q,works:w.map(x=>x.title),designers:d.map(x=>x.name)}));
  }
  
  // Frontend API
  if(req.method==='POST'&&req.url==='/api/chat'){
    let body='';req.on('data',c=>body+=c);
    req.on('end',async()=>{
      try{const data=JSON.parse(body);const answer=await processQuery(data.message,data.chatId||'web');res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({answer}))}
      catch(e){console.error(e);res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:e.message}))}
    });return;
  }

  // Feishu webhook
  if(req.method==='POST'&&req.url==='/feishu'){
    let body='';req.on('data',c=>body+=c);
    req.on('end',async()=>{
      console.log('[FEISHU]',body.substring(0,400));
      try{const data=JSON.parse(body);
        if(data.type==='url_verification'||data.challenge){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({challenge:data.challenge||data.token}))}
        const h=data.header||(data.event||{}).header||{};
        const et=h.event_type||data.type||'';
        const ev=data.event||data;
        const msg=ev.message||data.message||{};
        let text='';try{text=typeof msg.content==='string'?JSON.parse(msg.content).text:''}catch(e){}
        let imageKey='';try{imageKey=typeof msg.content==='string'?JSON.parse(msg.content).image_key:''}catch(e){}
        const oid=ev.sender?.sender_id?.open_id||data.sender?.open_id||'';
        lastEvent={time:new Date().toISOString(),et:et,text:text,hasImage:!!imageKey,imgKey:imageKey||'none',body:body.substring(0,500)};
        if(et==='im.message.receive_v1'){
          const msgId=ev.message?.message_id||data.message?.message_id||'';
          if(seenMsgs.has(msgId)){res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({code:0}))}
          seenMsgs.add(msgId);if(seenMsgs.size>200)seenMsgs.clear();
          const oid=ev.sender?.sender_id?.open_id||data.sender?.open_id||'';
          // Handle image messages
          let imageKey='';
          try{imageKey=typeof msg.content==='string'?JSON.parse(msg.content).image_key:''}catch(e){}
          if(imageKey&&oid){
            console.log('[FEISHU] analyzing image...');
            try{
              const token=await getToken();
              const imgBase64=await downloadFeishuImage(imageKey,token);
              const analysis=await analyzeImage(imgBase64,'分析这张设计作品');
              lastEvent.imgResult='ok:'+analysis.substring(0,100);
              await sendMsg(oid,analysis);
            }catch(e){lastEvent.imgResult='err:'+e.message;await sendMsg(oid,'图片分析失败：'+e.message)}
            lastEvent.imgResult=lastEvent.imgResult||'sent';
          }else if(text&&oid){
            const answer=await processQuery(text,oid);await sendMsg(oid,answer);
          }
        }
        res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({code:0}));
      }catch(e){console.error('[FEISHU ERR]',e.message);res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({code:0}))}
    });return;
  }
  res.writeHead(404);res.end();
});

server.listen(PORT,()=>console.log('Design Agent :'+PORT));
