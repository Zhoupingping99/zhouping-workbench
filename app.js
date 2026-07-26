/* ========== 周萍工作台 · 应用逻辑 ========== */

const app = document.getElementById('app');

/* ---------- Tab配置 ---------- */
const TABS = [
  { id: 'overview', name: '今日概览', icon: '?' },
  { id: 'douyin', name: '抖音热点', icon: '?' },
  { id: 'accounts', name: '抖音号管理', icon: '?' },
  { id: 'todo', name: '今日待办', icon: '?' },
  { id: 'recipe', name: '今日菜谱', icon: '?' },
  { id: 'running', name: '运动打卡', icon: '??♀?' },
  { id: 'notes', name: '备忘录', icon: '?' },
  { id: 'budget', name: '每日记账', icon: '?' },
  { id: 'gift', name: '份子钱账本', icon: '?' },
];

/* ---------- 渲染顶部栏 ---------- */
function renderTopbar() {
  const now = new Date();
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`;
  const dayStr = days[now.getDay()];
  const timeStr = now.toTimeString().slice(0,5);
  return `
    <div class="topbar">
      <div class="topbar-inner">
        <div class="topbar-title">
          <div class="avatar">周</div>
          <div>
            <h1>周萍工作台</h1>
            <div class="subtitle">婚纱摄影门市销售 · 每日工作台</div>
          </div>
        </div>
        <div class="topbar-right">
          <div class="date-block">
            <div class="big" id="current-time">${timeStr}</div>
            <div class="small">${dateStr} ${dayStr}</div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---------- 渲染左侧导航 ---------- */
function renderNav(activeTab) {
  const todoCount = WORKBENCH_DATA.todos.filter(t => !t.done).length;
  return `
    <div class="nav-sidebar">
      ${TABS.map(t => `
        <button class="nav-item ${t.id === activeTab ? 'active' : ''}" onclick="switchTab('${t.id}')">
          <span class="nav-icon">${t.icon}</span>
          <span class="nav-text">${t.name}</span>
          ${t.id === 'todo' && todoCount > 0 ? `<span class="badge">${todoCount}</span>` : ''}
        </button>
      `).join('')}
    </div>`;
}

/* ---------- 渲染概览 ---------- */
function renderOverview() {
  const todos = WORKBENCH_DATA.todos;
  const doneCount = todos.filter(t => t.done).length;
  const totalCount = todos.length;
  const hotCount = WORKBENCH_DATA.douyinHot.length;
  const runDone = WORKBENCH_DATA.run.today >= WORKBENCH_DATA.run.target;

  return `
    <div class="overview-grid">
      <div class="overview-card">
        <div class="icon pink">?</div>
        <div class="info">
          <div class="label">今日待办</div>
          <div class="value">${doneCount}/${totalCount}</div>
          <div class="extra">${doneCount < totalCount ? `还有${totalCount-doneCount}项待完成` : '全部完成 ?'}</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="icon blue">?</div>
        <div class="info">
          <div class="label">抖音热点</div>
          <div class="value">${hotCount}</div>
          <div class="extra">条可二创内容</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="icon purple">??♀?</div>
        <div class="info">
          <div class="label">跑步打卡</div>
          <div class="value">${runDone ? '已完成' : '未完成'}</div>
          <div class="extra">目标${WORKBENCH_DATA.run.target}分钟 · 已连续${WORKBENCH_DATA.run.streak}天</div>
        </div>
      </div>
      <div class="overview-card">
        <div class="icon green">?</div>
        <div class="info">
          <div class="label">今日菜谱</div>
          <div class="value">${WORKBENCH_DATA.recipes.length}</div>
          <div class="extra">道家常菜做法</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>今日重点</div>
      </div>
      <div class="todo-list">
        ${todos.filter(t => t.priority === 'high' && !t.done).map(t => `
          <div class="todo-item" onclick="toggleTodo(${t.id})">
            <div class="todo-checkbox ${t.done ? 'checked' : ''}"></div>
            <div class="todo-text">${t.text}</div>
            <div class="todo-priority high">紧急</div>
            <div class="todo-time">${t.time}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ---------- 渲染抖音热点 ---------- */
function renderDouyin() {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>抖音婚纱摄影热点 · 可二创视频</div>
        <div class="card-actions">
          <button class="btn btn-sm" onclick="refreshHot()">? 刷新热点</button>
        </div>
      </div>
      <div class="hot-grid">
        ${WORKBENCH_DATA.douyinHot.map(h => `
          <div class="hot-card">
            <div class="hot-video" style="background:linear-gradient(135deg, ${getHotBgColor(h.rank)})">
              <div class="video-bg">${h.img}</div>
              <div class="video-gradient"></div>
              <div class="video-top">
                <span class="rank-badge">? 第${h.rank}位</span>
                <span class="hot-label">抖音热榜</span>
              </div>
              <div class="video-screenshot">${h.screenshot}</div>
              <div class="video-bottom">
                <div class="video-account">
                  <span class="acc-emoji">${h.accountAvatar}</span>
                  <span>${h.account}</span>
                </div>
                <div class="video-title">${h.title}</div>
                <div class="video-stats">
                  <span>?? ${h.likes}</span>
                  <span>? ${h.comments}</span>
                  <span>? ${h.shares}</span>
                </div>
              </div>
            </div>
            <div class="hot-body">
              <div class="hot-desc">${h.desc}</div>
              <div class="hot-tags">${h.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
              <div style="margin-top:10px;padding:8px 10px;background:#fff8e1;border-radius:6px;font-size:11px;color:#856404;line-height:1.6">
                ? <strong>\u4e8c\u521b\u5efa\u8bae\uff1a</strong>${h["\u4e8c\u521b\u5efa\u8bae"]}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getHotBgColor(rank) {
  const colors = [
    '#d63384,#e879a6', '#6f42c1,#a674e0', '#dc3545,#f0857a',
    '#fd7e14,#ffb866', '#28a745,#5fc77a', '#17a2b8,#5dd5e6',
    '#ffc107,#ffd966', '#e83e8c,#f085b0'
  ];
  return colors[(rank - 1) % colors.length];
}

/* ---------- 渲染抖音号管理 ---------- */
function renderAccounts() {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>我的抖音号管理</div>
        <div class="card-actions">
          <span style="font-size:12px;color:var(--text-light)">4个号 · 实时数据</span>
        </div>
      </div>
      <div class="account-grid">
        ${WORKBENCH_DATA.accounts.map(a => `
          <div class="account-card">
            <div class="acc-header">
              <div class="acc-avatar ${a.avatarClass}">${a.avatar}</div>
              <div>
                <div class="acc-name">${a.name}</div>
                <div class="acc-type">${a.type}</div>
                <div style="font-size:11px;color:var(--text-light);margin-top:2px">抖音号：${a.douyinId || '-'}</div>
              </div>
            </div>
            <div style="font-size:12px;color:var(--text-light);line-height:1.5;margin-bottom:10px;padding:8px;background:var(--bg);border-radius:6px">
              <strong>简介：</strong>${a.bio}
            </div>
            <div class="acc-stats">
              <div class="acc-stat"><div class="num">${a.followers}</div><div class="lbl">粉丝</div></div>
              <div class="acc-stat"><div class="num">${a.likes}</div><div class="lbl">总点赞</div></div>
              <div class="acc-stat"><div class="num">${a.works}</div><div class="lbl">作品数</div></div>
            </div>
            <div class="acc-suggest"><strong>? 运营建议：</strong>${a.suggestion}</div>
            <div class="acc-suggest" style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--border)"><strong>?? 近期问题：</strong>${a.recentIssue}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>发布优化复盘</div>
      </div>
      <div style="font-size:13px;line-height:1.8;color:var(--text-light)">
        <p><strong>1. 发布时间优化：</strong>建议固定发布时间：早上7:30-8:30（早安）、中午12:00-12:30（午休）、晚上20:00-22:00（睡前高峰）。特别是主号成品号，晚上8点发布客片转化率最高。</p>
        <p style="margin-top:10px"><strong>2. 标题优化模板：</strong>前3秒必须有钩子。推荐开头：①"万州备婚姐妹看过来！"②"在万州拍10年婚纱照，发现…"③"千万不要这样拍婚纱！"④"新人第一视角vlog｜从紧张到…"</p>
        <p style="margin-top:10px"><strong>3. 话题标签组合：</strong>每条视频带5-8个标签。例：#万州婚纱照 #万州婚纱摄影 #万州备婚 #婚纱照花絮 #重庆婚纱照 #万州探店 #备婚攻略 #客片分享</p>
        <p style="margin-top:10px"><strong>4. 四账号联动：</strong>生活号（萍萍萍周周）→ 主号（夏目摄影工作室）→ 花絮号（万州夏目摄影花絮号）→ Vlog号（月亮邮递员）。每个视频结尾或评论区置顶互相@，形成闭环。</p>
        <p style="margin-top:10px"><strong>5. 变现链路：</strong>个人号挂橱窗做咖啡等生活方式带货；工作号主号挂团购/门店/私信引流；其他工作号全部导流到主号。私信话术统一为"私信发【套餐】获取报价"。</p>
      </div>
    </div>
  `;
}

/* ---------- 渲染待办 ---------- */
function renderTodo() {
  const groups = {};
  WORKBENCH_DATA.todos.forEach(t => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });
  const groupIcons = { '工作':'?', '文案':'??', '抖音':'?', '回访':'?', '运动':'??♀?', '生活':'?' };
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>今日待办事项</div>
        <div class="card-actions">
          <button class="btn btn-sm" onclick="showToast('长按任务可编辑')">? 新增</button>
        </div>
      </div>
      ${Object.keys(groups).map(cat => `
        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:600;color:var(--text-light);margin-bottom:8px">${groupIcons[cat]||'?'} ${cat}</div>
          <div class="todo-list">
            ${groups[cat].map(t => `
              <div class="todo-item ${t.done ? 'done' : ''}" onclick="toggleTodo(${t.id})">
                <div class="todo-checkbox ${t.done ? 'checked' : ''}"></div>
                <div class="todo-text">${t.text}</div>
                <div class="todo-priority ${t.priority}">${t.priority === 'high' ? '紧急' : t.priority === 'mid' ? '常规' : '不急'}</div>
                <div class="todo-time">${t.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 渲染菜谱 ---------- */
function renderRecipe() {
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>今日10道家常菜</div>
        <div class="card-actions">
          <button class="btn btn-sm" onclick="showToast('点击菜品卡片可查看详细做法')">? 使用提示</button>
        </div>
      </div>
      <div class="recipe-grid">
        ${WORKBENCH_DATA.recipes.map((r, i) => `
          <div class="recipe-card" onclick="toggleRecipe(${i})">
            <div class="recipe-img" style="background:linear-gradient(135deg, ${getRecipeColor(i)})">${r.emoji}</div>
            <div class="recipe-body">
              <div class="recipe-name">${r.name}</div>
              <div class="recipe-tags">
                <span class="tag">${r.difficulty}</span>
                ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
              <div class="recipe-time">?? ${r.time}</div>
              <div class="recipe-detail">
                <strong>食材：</strong>${r.ingredients}<br><br>
                <strong>做法：</strong><br>${r.steps}<br><br>
                <strong>小贴士：</strong>${r.tip}
              </div>
              <div class="recipe-toggle"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getRecipeColor(i) {
  const colors = ['#fff3cd,#ffe08a', '#fce4ec,#f8bbd0', '#d1ecf1,#b8dbe5', '#d4edda,#b8dfc6', '#e2d5f1,#d1b3e8', '#fff3cd,#ffe08a', '#fce4ec,#f8bbd0', '#d1ecf1,#b8dbe5', '#d4edda,#b8dfc6', '#e2d5f1,#d1b3e8'];
  return colors[i % colors.length];
}

/* ---------- 渲染跑步 ---------- */
function renderRunning() {
  const r = WORKBENCH_DATA.run;
  const progress = Math.min(100, (r.today / r.target) * 100);
  const weekTotal = r.week.reduce((s, v) => s + v, 0);
  const weekDays = ['周一','周二','周三','周四','周五','周六','周日'];
  return `
    <div class="run-card">
      <div class="run-icon">??♀?</div>
      <div class="run-info">
        <h3>今日跑步打卡</h3>
        <p>目标：跑步机 ${r.target} 分钟 · 连续打卡 ${r.streak} 天</p>
        <div class="run-progress-bar">
          <div class="run-progress-fill" style="width:${progress}%"></div>
        </div>
        <div class="run-stats">
          <div class="run-stat"><div class="val">${r.today}</div><div class="lbl">今日(分钟)</div></div>
          <div class="run-stat"><div class="val">${r.streak}</div><div class="lbl">连续天数</div></div>
          <div class="run-stat"><div class="val">${weekTotal}</div><div class="lbl">本周累计</div></div>
          <div class="run-stat"><div class="val">${r.total}</div><div class="lbl">本月累计</div></div>
        </div>
      </div>
      <button class="btn btn-primary" style="background:#fff;color:#764ba2;border:none;padding:12px 24px;font-size:14px;font-weight:600" onclick="completeRun()">
        ${r.today >= r.target ? '? 今日已完成' : '??♀? 完成打卡'}
      </button>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>本周跑步记录</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;text-align:center">
        ${r.week.map((v, i) => `
          <div style="padding:12px 4px;border-radius:8px;background:${v > 0 ? '#d4edda' : '#f8f9fa'}">
            <div style="font-size:11px;color:var(--text-light)">${weekDays[i]}</div>
            <div style="font-size:16px;font-weight:700;margin:4px 0">${v > 0 ? v + "'" : '—'}</div>
            <div style="font-size:10px;color:${v >= r.target ? '#28a745' : '#dc3545'}">${v >= r.target ? '?' : v > 0 ? '半' : '休'}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>30分钟跑步机建议方案</div>
      </div>
      <div style="font-size:13px;line-height:2;color:var(--text-light)">
        <p><strong>0-5分钟（热身）：</strong>速度4km/h，坡度0，慢走热身</p>
        <p><strong>5-10分钟（过渡）：</strong>速度5.5km/h，坡度2，快走过渡到慢跑</p>
        <p><strong>10-25分钟（燃脂）：</strong>速度7-8km/h，坡度3-5，匀速跑（心率130-150）</p>
        <p><strong>25-28分钟（冲刺）：</strong>速度8-9km/h，坡度2，加速跑</p>
        <p><strong>28-30分钟（放松）：</strong>速度4km/h，坡度0，慢走放松</p>
        <p style="margin-top:10px;color:var(--primary-dark)">? 坚持就是胜利！连续打卡${r.streak}天了，今天也要加油鸭 ?</p>
      </div>
    </div>
  `;
}

/* ---------- 渲染备忘录 ---------- */
function renderNotes() {
  const notes = getNotes();
  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>备忘录</div>
        <div class="card-actions">
          <span style="font-size:12px;color:var(--text-light)">自动保存 · 共${notes.length}条</span>
        </div>
      </div>
      <div style="margin-bottom:16px">
        <textarea id="note-input" placeholder="写点什么...（客人备注、灵感、待办提醒、突然想到的事）" style="width:100%;min-height:80px;padding:12px;border:1px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;resize:vertical;outline:none"></textarea>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <input id="note-tag" placeholder="标签（如：客人/灵感/提醒）" style="padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;width:140px;outline:none">
          <button class="btn btn-primary" style="padding:8px 20px" onclick="addNote()">? 添加</button>
        </div>
      </div>
      <div id="notes-list">
        ${notes.length === 0 ? `
          <div style="text-align:center;padding:40px 0;color:var(--text-light)">
            <div style="font-size:40px;margin-bottom:10px">?</div>
            <div>还没有备忘，写第一条吧～</div>
          </div>
        ` : notes.map((n, i) => `
          <div class="note-item" style="border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px;background:#fff;position:relative">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
              <span style="font-size:11px;padding:2px 8px;border-radius:8px;background:var(--primary-light);color:var(--primary-dark);font-weight:600">${n.tag || '备忘'}</span>
              <span style="font-size:11px;color:var(--text-light)">${n.time}</span>
            </div>
            <div style="font-size:14px;line-height:1.7;white-space:pre-wrap;color:var(--text)">${escapeHtml(n.content)}</div>
            <div style="margin-top:8px;text-align:right">
              <button class="btn btn-sm" onclick="copyNote(${i})">? 复制</button>
              <button class="btn btn-sm" style="color:var(--danger);border-color:#f8d7da" onclick="deleteNote(${i})">?? 删除</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getNotes() {
  try { return JSON.parse(localStorage.getItem('zhouping_notes') || '[]'); } catch(e) { return []; }
}
function saveNotes(notes) { localStorage.setItem('zhouping_notes', JSON.stringify(notes)); }
function addNote() {
  const input = document.getElementById('note-input');
  const tagInput = document.getElementById('note-tag');
  const content = input.value.trim();
  if (!content) { showToast('?? 内容不能为空'); return; }
  const notes = getNotes();
  const now = new Date();
  notes.unshift({ content, tag: tagInput.value.trim() || '备忘', time: `${now.getMonth()+1}/${now.getDate()} ${now.toTimeString().slice(0,5)}` });
  saveNotes(notes);
  showToast('? 备忘已保存');
  render();
}
function deleteNote(index) {
  const notes = getNotes();
  notes.splice(index, 1);
  saveNotes(notes);
  showToast('?? 已删除');
  render();
}
function copyNote(index) {
  const notes = getNotes();
  const content = notes[index].content;
  navigator.clipboard.writeText(content).then(() => showToast('? 已复制')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = content;
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('? 已复制');
  });
}
function escapeHtml(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ---------- 渲染每日记账 ---------- */
const DAILY_BUDGET = 100;
function getBudgetData() { try { return JSON.parse(localStorage.getItem('zhouping_budget') || '{}'); } catch(e) { return {}; } }
function saveBudgetData(data) { localStorage.setItem('zhouping_budget', JSON.stringify(data)); }
function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}
function formatDateCN(dateStr) { const p = dateStr.split('-'); return `${p[1]}/${p[2]}`; }

function renderBudget() {
  const data = getBudgetData();
  const today = getTodayStr();
  function getYesterdayStr(d) {
    const date = new Date(d + 'T00:00:00');
    date.setDate(date.getDate() - 1);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  const yesterday = getYesterdayStr(today);
  const yesterdayRecords = data[yesterday] || [];
  const yesterdayTotal = yesterdayRecords.reduce((s, r) => s + r.amount, 0);
  const yesterdayRemain = DAILY_BUDGET - yesterdayTotal;
  const todayBudget = DAILY_BUDGET + yesterdayRemain;
  const todayRecords = data[today] || [];
  const todayTotal = todayRecords.reduce((s, r) => s + r.amount, 0);
  const todayRemain = todayBudget - todayTotal;
  const allDates = Object.keys(data).sort().reverse();
  const historyDates = allDates.filter(d => d !== today).slice(0, 7);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0,0,0,0);
  let weekTotal = 0;
  allDates.forEach(d => { const dateObj = new Date(d); if (dateObj >= weekStart) { weekTotal += (data[d]||[]).reduce((s,r)=>s+r.amount,0); } });
  let monthTotal = 0;
  allDates.forEach(d => { if (d.startsWith(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`)) { monthTotal += (data[d]||[]).reduce((s,r)=>s+r.amount,0); } });
  const isOver = todayTotal > todayBudget;
  const hasYesterday = yesterdayRecords.length > 0;

  return `
    <div class="budget-today-card ${isOver ? 'over' : 'ok'}">
      <div class="budget-today-top">
        <div>
          <div class="budget-today-label">? ${today.replace(/-/g,'/')} 今日预算</div>
          <div class="budget-today-amount">?${todayBudget.toFixed(1)}</div>
          ${hasYesterday ? `<div style="font-size:11px;opacity:0.85;margin-top:4px">${yesterdayRemain >= 0 ? `? 含昨日结余 ?${yesterdayRemain.toFixed(1)}` : `?? 含昨日超支 ?${Math.abs(yesterdayRemain).toFixed(1)}`}</div>` : ''}
        </div>
        <div style="text-align:right">
          <div class="budget-today-label">${isOver ? '?? 已超支' : '? 还能花'}</div>
          <div class="budget-today-remain ${isOver ? 'text-over' : 'text-ok'}">${isOver ? '-' : ''}?${Math.abs(todayRemain).toFixed(1)}</div>
        </div>
      </div>
      <div class="budget-progress-bar">
        <div class="budget-progress-fill ${isOver ? 'over' : 'ok'}" style="width:${Math.min(100, (todayTotal/todayBudget)*100)}%"></div>
      </div>
      <div class="budget-today-stats">
        <div class="budget-stat"><div class="val">?${todayTotal.toFixed(1)}</div><div class="lbl">今日已花</div></div>
        <div class="budget-stat"><div class="val">${todayRecords.length}</div><div class="lbl">笔数</div></div>
        <div class="budget-stat"><div class="val">?${weekTotal.toFixed(1)}</div><div class="lbl">本周累计</div></div>
        <div class="budget-stat"><div class="val">?${monthTotal.toFixed(1)}</div><div class="lbl">本月累计</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">??</span>记一笔</div>
      </div>
      <div class="budget-input-row">
        <select id="budget-category" class="budget-select">
          <option value="餐饮">? 餐饮</option>
          <option value="交通">? 交通</option>
          <option value="买菜">? 买菜</option>
          <option value="购物">?? 购物</option>
          <option value="咖啡">? 咖啡</option>
          <option value="零食">? 零食</option>
          <option value="日用">? 日用</option>
          <option value="其他">? 其他</option>
        </select>
        <input id="budget-amount" type="number" step="0.1" placeholder="金额" class="budget-amount-input">
        <input id="budget-note" placeholder="备注（选填）" class="budget-note-input">
        <button class="btn btn-primary budget-add-btn" onclick="addBudgetRecord()">? 记账</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>今日明细</div>
        <div class="card-actions"><span style="font-size:12px;color:var(--text-light)">共${todayRecords.length}笔 · ?${todayTotal.toFixed(1)}</span></div>
      </div>
      ${todayRecords.length === 0 ? `
        <div style="text-align:center;padding:30px;color:var(--text-light)">
          <div style="font-size:32px;margin-bottom:8px">?</div>
          <div style="font-size:13px">今天还没记账，记第一笔吧～</div>
        </div>
      ` : todayRecords.map((r, i) => `
        <div class="budget-record-item">
          <span class="budget-record-cat">${r.category}</span>
          <span class="budget-record-note">${r.note ? escapeHtml(r.note) : ''}</span>
          <span class="budget-record-time">${r.time}</span>
          <span class="budget-record-amount">-?${r.amount.toFixed(1)}</span>
          <button class="budget-record-del" onclick="deleteBudgetRecord('${today}', ${i})">?</button>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>历史记录（最近7天）</div>
      </div>
      ${historyDates.length === 0 ? `<div style="text-align:center;padding:20px;color:var(--text-light);font-size:13px">暂无历史记录</div>` : historyDates.map(d => {
        const records = data[d] || [];
        const total = records.reduce((s, r) => s + r.amount, 0);
        const remain = DAILY_BUDGET - total;
        const dayOver = total > DAILY_BUDGET;
        const dayDate = new Date(d);
        const dayNames = ['周日','周一','周二','周三','周四','周五','周六'];
        return `
          <div class="budget-history-item">
            <div class="budget-history-date">
              <span style="font-weight:600">${formatDateCN(d)}</span>
              <span style="font-size:11px;color:var(--text-light);margin-left:6px">${dayNames[dayDate.getDay()]}</span>
              <span style="font-size:11px;color:var(--text-light);margin-left:6px">${records.length}笔</span>
            </div>
            <div class="budget-history-amount">
              <span style="color:var(--text);font-weight:600">?${total.toFixed(1)}</span>
              <span class="budget-history-status ${dayOver ? 'over' : 'ok'}">${dayOver ? `超支 ?${Math.abs(remain).toFixed(1)}` : `结余 ?${remain.toFixed(1)}`}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>记账说明</div>
      </div>
      <div style="font-size:13px;line-height:1.9;color:var(--text-light)">
        <p>? 每日预算：<strong>?${DAILY_BUDGET}</strong></p>
        <p>? 每天记录支出后，自动计算当天总和与剩余</p>
        <p>? 今日预算含昨日结余（或扣除昨日超支），滚动计算</p>
        <p>? 超出预算显示红色，有结余显示绿色</p>
        <p>? 数据存在手机本地，不会丢失</p>
      </div>
    </div>
  `;
}

function addBudgetRecord() {
  const category = document.getElementById('budget-category').value;
  const amount = parseFloat(document.getElementById('budget-amount').value);
  const note = document.getElementById('budget-note').value.trim();
  if (!amount || amount <= 0) { showToast('?? 请输入有效金额'); return; }
  const data = getBudgetData();
  const today = getTodayStr();
  if (!data[today]) data[today] = [];
  const now = new Date();
  data[today].push({ category, amount, note, time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` });
  saveBudgetData(data);
  showToast(`? 已记账 ?${amount.toFixed(1)}`);
  render();
}
function deleteBudgetRecord(date, index) {
  const data = getBudgetData();
  if (data[date]) { data[date].splice(index, 1); if (data[date].length === 0) delete data[date]; saveBudgetData(data); showToast('?? 已删除'); render(); }
}

/* ---------- 渲染份子钱账本 ---------- */
function getGiftData() { try { return JSON.parse(localStorage.getItem('zhouping_gifts') || '[]'); } catch(e) { return []; } }
function saveGiftData(data) { localStorage.setItem('zhouping_gifts', JSON.stringify(data)); }

function renderGift() {
  const gifts = getGiftData();
  const totalIn = gifts.filter(g => g.type === '收').reduce((s, g) => s + g.amount, 0);
  const totalOut = gifts.filter(g => g.type === '送').reduce((s, g) => s + g.amount, 0);
  const balance = totalIn - totalOut;
  const countIn = gifts.filter(g => g.type === '收').length;
  const countOut = gifts.filter(g => g.type === '送').length;
  const sorted = [...gifts].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  return `
    <div class="gift-summary-card ${balance >= 0 ? 'positive' : 'negative'}">
      <div class="gift-summary-top">
        <div>
          <div style="font-size:12px;opacity:0.9">? 份子钱总账</div>
          <div style="font-size:32px;font-weight:700;margin-top:4px">${balance >= 0 ? '+' : ''}?${balance.toFixed(0)}</div>
          <div style="font-size:11px;opacity:0.85;margin-top:2px">${balance >= 0 ? '收大于送，美滋滋' : '送多了，心疼…'}</div>
        </div>
        <div style="text-align:right"><div style="font-size:11px;opacity:0.85">共 ${gifts.length} 笔</div></div>
      </div>
      <div class="gift-stats-row">
        <div class="gift-stat"><div class="val">?${totalIn.toFixed(0)}</div><div class="lbl">? 收到 (${countIn}笔)</div></div>
        <div class="gift-stat"><div class="val">?${totalOut.toFixed(0)}</div><div class="lbl">? 送出 (${countOut}笔)</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><span class="emoji">??</span>记一笔份子钱</div></div>
      <div class="gift-input-area">
        <div class="gift-input-row">
          <select id="gift-type" class="gift-type-select"><option value="收">? 收到</option><option value="送">? 送出</option></select>
          <input id="gift-amount" type="number" step="100" placeholder="金额（元）" class="gift-amount-input">
          <input id="gift-name" placeholder="对方姓名" class="gift-name-input">
        </div>
        <div class="gift-input-row">
          <input id="gift-event" placeholder="什么事（结婚/满月/乔迁…）" class="gift-event-input">
          <input id="gift-date" type="date" class="gift-date-input">
          <button class="btn btn-primary gift-add-btn" onclick="addGiftRecord()">? 记录</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><span class="emoji">?</span>份子钱明细</div>
        <div class="card-actions"><span style="font-size:12px;color:var(--text-light)">共${gifts.length}笔</span></div>
      </div>
      ${sorted.length === 0 ? `
        <div style="text-align:center;padding:30px;color:var(--text-light)">
          <div style="font-size:32px;margin-bottom:8px">?</div>
          <div style="font-size:13px">还没有记录，记第一笔吧～</div>
        </div>
      ` : sorted.map(g => `
        <div class="gift-record-item">
          <div class="gift-record-type ${g.type === '收' ? 'in' : 'out'}">${g.type === '收' ? '?' : '?'} ${g.type}</div>
          <div class="gift-record-info">
            <div class="gift-record-name">${escapeHtml(g.name)} <span style="font-size:11px;color:var(--text-light)">· ${escapeHtml(g.event || '未填写')}</span></div>
            <div class="gift-record-date">${g.date || '未填日期'}</div>
          </div>
          <div class="gift-record-amount ${g.type === '收' ? 'in' : 'out'}">${g.type === '收' ? '+' : '-'}?${g.amount.toFixed(0)}</div>
          <button class="gift-record-del" onclick="deleteGiftRecord('${g.id}')">?</button>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title"><span class="emoji">?</span>使用说明</div></div>
      <div style="font-size:13px;line-height:1.9;color:var(--text-light)">
        <p>? 记录每笔份子钱：收到/送出、金额、对方姓名、什么事</p>
        <p>? 自动统计总收入、总送出、结余</p>
        <p>? 结余为正=收大于送，结余为负=送多了</p>
        <p>? 数据存在手机本地，不会丢失</p>
      </div>
    </div>
  `;
}

function addGiftRecord() {
  const type = document.getElementById('gift-type').value;
  const amount = parseFloat(document.getElementById('gift-amount').value);
  const name = document.getElementById('gift-name').value.trim();
  const event = document.getElementById('gift-event').value.trim();
  const date = document.getElementById('gift-date').value;
  if (!amount || amount <= 0) { showToast('?? 请输入金额'); return; }
  if (!name) { showToast('?? 请输入对方姓名'); return; }
  const gifts = getGiftData();
  const now = new Date();
  gifts.push({ id: 'g' + Date.now(), type, amount, name, event, date: date || getTodayStr(), time: `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}` });
  saveGiftData(gifts);
  showToast(`? 已记录 ${type} ?${amount.toFixed(0)}`);
  render();
}
function deleteGiftRecord(id) {
  const gifts = getGiftData();
  const index = gifts.findIndex(g => g.id === id);
  if (index >= 0) { gifts.splice(index, 1); saveGiftData(gifts); showToast('?? 已删除'); render(); }
}

/* ---------- 待办状态本地存储 ---------- */
function getTodoDoneState() {
  try {
    const saved = JSON.parse(localStorage.getItem('zhouping_todos') || '{}');
    if (saved.date !== getTodayStr()) return {};
    return saved.done || {};
  } catch(e) { return {}; }
}
function saveTodoDoneState(doneMap) { localStorage.setItem('zhouping_todos', JSON.stringify({ date: getTodayStr(), done: doneMap })); }
function restoreTodoState() {
  const doneMap = getTodoDoneState();
  WORKBENCH_DATA.todos.forEach(t => { t.done = !!doneMap[t.id]; });
}

/* ---------- 交互逻辑 ---------- */
let currentTab = 'overview';
function switchTab(tabId) { currentTab = tabId; render(); }
function toggleTodo(id) {
  const todo = WORKBENCH_DATA.todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    const doneMap = {};
    WORKBENCH_DATA.todos.forEach(t => { if (t.done) doneMap[t.id] = true; });
    saveTodoDoneState(doneMap);
    render();
    if (todo.done) showToast('? 完成一项！继续加油');
  }
}
function toggleRecipe(i) { const cards = document.querySelectorAll('.recipe-card'); if (cards[i]) cards[i].classList.toggle('expanded'); }
function completeRun() {
  if (WORKBENCH_DATA.run.today < WORKBENCH_DATA.run.target) {
    WORKBENCH_DATA.run.today = WORKBENCH_DATA.run.target;
    WORKBENCH_DATA.run.streak += 1;
    render();
    showToast('? 跑步打卡完成！真棒');
  } else { showToast('今日已完成打卡'); }
}
function refreshHot() { showToast('? 热点每小时更新，请稍后刷新'); }
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

/* ---------- 主渲染 ---------- */
function render() {
  const content = {
    overview: renderOverview,
    douyin: renderDouyin,
    accounts: renderAccounts,
    todo: renderTodo,
    recipe: renderRecipe,
    running: renderRunning,
    notes: renderNotes,
    budget: renderBudget,
    gift: renderGift,
  };
  app.innerHTML = renderTopbar() + `<div class="layout">` + renderNav(currentTab) + `<div class="main"><div class="tab-content active">${content[currentTab]()}</div></div></div>`;
}

/* ---------- 时钟 ---------- */
function updateClock() {
  const el = document.getElementById('current-time');
  if (el) { const now = new Date(); el.textContent = now.toTimeString().slice(0, 5); }
}

/* ---------- 启动 ---------- */
restoreTodoState();
render();
setInterval(updateClock, 60000);
