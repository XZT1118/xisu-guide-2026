/* ============================================================
   西安外国语大学 · 2026 新生通关宝典
   交互脚本：导航滚动联动 / 开学必备清单（localStorage 自动保存）
   ============================================================ */

(function () {
  'use strict';

  /* ---------------- 导航滚动高亮 ---------------- */
  var nav = document.getElementById('nav');
  var navChips = Array.prototype.slice.call(nav.querySelectorAll('.nav-chip'));
  var sections = navChips
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = '#' + entry.target.id;
      navChips.forEach(function (chip) {
        chip.classList.toggle('active', chip.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---------------- 回到顶部 ---------------- */
  var backTop = document.getElementById('back-top');
  window.addEventListener('scroll', function () {
    backTop.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- 滚动渐入动画 ---------------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    'main .card, main .sub-title, main .section-head, main .tip, main .acc, main .warn-box'
  );
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ================= 开学必备清单 ================= */
  var STORAGE_KEY = 'xisu2026-checklist-v1';

  var CHECKLIST = [
    {
      id: 'docs', emoji: '📄', name: '证件材料',
      items: [
        { id: 'doc-1', text: '录取通知书', note: '报到必备，多检查几遍' },
        { id: 'doc-2', text: '身份证 + 复印件', note: '复印件可多备几份' },
        { id: 'doc-3', text: '准考证', note: '与录取通知书、身份证姓名须完全一致' },
        { id: 'doc-4', text: '一寸免冠照片 10 张', note: '光面、平版、半身、同底版' },
        { id: 'doc-5', text: '户口迁移证（迁户同学）', note: '迁户自愿；西安市十一区两县生源不迁' },
        { id: 'doc-6', text: '党/团组织关系转接确认', note: '团组织通过"智慧团建"线上办理' },
        { id: 'doc-7', text: '学籍档案', note: '按高中学校要求携带或邮寄' }
      ]
    },
    {
      id: 'bed', emoji: '🛏️', name: '床上与洗漱',
      items: [
        { id: 'bed-1', text: '被褥 / 床垫 / 枕头', note: '可选购学校床品或邮寄到校' },
        { id: 'bed-2', text: '床单被罩三件套', note: '建议备两套换洗' },
        { id: 'bed-3', text: '洗漱用品（牙具、洗面奶等）' },
        { id: 'bed-4', text: '毛巾 / 浴巾', note: '多备几条，洗澡用' },
        { id: 'bed-5', text: '洗发水 / 沐浴露 / 洗衣液' },
        { id: 'bed-6', text: '拖鞋', note: '建议准备洗澡专用防滑拖鞋' },
        { id: 'bed-7', text: '镜子 / 梳子 / 指甲刀' }
      ]
    },
    {
      id: 'daily', emoji: '🧺', name: '生活用品',
      items: [
        { id: 'daily-1', text: '衣架 + 晾衣夹' },
        { id: 'daily-2', text: '收纳盒 / 收纳箱' },
        { id: 'daily-3', text: '插线板', note: '注意宿舍限电功率要求' },
        { id: 'daily-4', text: '小锁', note: '锁衣柜抽屉用' },
        { id: 'daily-5', text: '挂钩 / 粘钩' },
        { id: 'daily-6', text: '雨伞', note: '西安秋天多雨，提前备好' },
        { id: 'daily-7', text: '水杯', note: '军训要备大容量水杯' },
        { id: 'daily-8', text: '纸巾 / 湿巾' },
        { id: 'daily-9', text: '剪刀 / 胶带 / 针线包' }
      ]
    },
    {
      id: 'study', emoji: '📚', name: '学习用品',
      items: [
        { id: 'study-1', text: '书包' },
        { id: 'study-2', text: '笔 / 笔袋 / 笔记本' },
        { id: 'study-3', text: '文件袋', note: '装证件材料，报到当天用' },
        { id: 'study-4', text: 'U 盘', note: '交作业、打印常用' },
        { id: 'study-5', text: '台灯', note: '熄灯后学习必备' },
        { id: 'study-6', text: '书立 / 文件夹' }
      ]
    },
    {
      id: 'elec', emoji: '🔌', name: '电子产品',
      items: [
        { id: 'elec-1', text: '手机 + 充电器' },
        { id: 'elec-2', text: '充电宝', note: '军训和出门必备' },
        { id: 'elec-3', text: '数据线（多备一条）' },
        { id: 'elec-4', text: '耳机' },
        { id: 'elec-5', text: '电脑', note: '按专业需要准备，不急可开学后买' }
      ]
    },
    {
      id: 'med', emoji: '💊', name: '常用药品',
      items: [
        { id: 'med-1', text: '感冒药' },
        { id: 'med-2', text: '退烧药' },
        { id: 'med-3', text: '肠胃药' },
        { id: 'med-4', text: '创可贴 / 碘伏棉签' },
        { id: 'med-5', text: '口罩' },
        { id: 'med-6', text: '体温计' },
        { id: 'med-7', text: '个人常备药（过敏药等）', note: '校医院可就诊买药，医保咨询 206 室' }
      ]
    },
    {
      id: 'army', emoji: '💪', name: '军训特供',
      items: [
        { id: 'army-1', text: '防晒霜', note: '建议 SPF50+，随身补涂' },
        { id: 'army-2', text: '大容量水杯' },
        { id: 'army-3', text: '软鞋垫', note: '站军姿的救命神器' },
        { id: 'army-4', text: '藿香正气水 / 防暑药' },
        { id: 'army-5', text: '湿巾 / 纸巾' },
        { id: 'army-6', text: '润喉糖', note: '拉歌喊口号护嗓' }
      ]
    }
  ];

  var groupsEl = document.getElementById('cl-groups');
  var ringEl = document.getElementById('cl-ring');
  var percentEl = document.getElementById('cl-percent');
  var countEl = document.getElementById('cl-count');
  var navProgressEl = document.getElementById('nav-progress');

  /* 读取已保存进度 */
  function loadChecked() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      return (data && typeof data === 'object' && Array.isArray(data.checked)) ? data.checked : [];
    } catch (e) {
      return [];
    }
  }

  var checked = loadChecked();

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ checked: checked, updatedAt: Date.now() }));
    } catch (e) { /* 隐私模式下静默失败 */ }
  }

  function flattenItems() {
    var all = [];
    CHECKLIST.forEach(function (g) { all = all.concat(g.items); });
    return all;
  }

  function updateProgress() {
    var all = flattenItems();
    var done = checked.length;
    var total = all.length;
    var pct = total ? Math.round(done / total * 100) : 0;
    ringEl.style.setProperty('--p', pct + '%');
    percentEl.textContent = pct + '%';
    countEl.textContent = '已准备 ' + done + ' / ' + total + ' 项';
    navProgressEl.textContent = pct > 0 ? pct + '%' : '';
    navProgressEl.style.display = pct > 0 ? '' : 'none';

    CHECKLIST.forEach(function (g) {
      var gDone = g.items.filter(function (it) { return checked.indexOf(it.id) !== -1; }).length;
      var gPct = g.items.length ? Math.round(gDone / g.items.length * 100) : 0;
      var bar = groupsEl.querySelector('[data-bar="' + g.id + '"]');
      var count = groupsEl.querySelector('[data-count="' + g.id + '"]');
      if (bar) bar.style.width = gPct + '%';
      if (count) count.textContent = gDone + '/' + g.items.length;
    });
  }

  function renderChecklist() {
    groupsEl.innerHTML = '';
    CHECKLIST.forEach(function (g) {
      var group = document.createElement('div');
      group.className = 'cl-group';

      var head = document.createElement('div');
      head.className = 'cl-group-head';
      head.innerHTML =
        '<span class="cl-group-emoji">' + g.emoji + '</span>' +
        '<span class="cl-group-name">' + g.name + '</span>' +
        '<span class="cl-group-count" data-count="' + g.id + '">0/' + g.items.length + '</span>' +
        '<span class="cl-group-bar"><i data-bar="' + g.id + '"></i></span>';
      group.appendChild(head);

      var items = document.createElement('div');
      items.className = 'cl-items';
      g.items.forEach(function (it) {
        var wrap = document.createElement('div');
        wrap.className = 'cl-item';
        var isOn = checked.indexOf(it.id) !== -1;
        wrap.innerHTML =
          '<input type="checkbox" id="' + it.id + '" ' + (isOn ? 'checked' : '') + '>' +
          '<label for="' + it.id + '">' +
            '<span class="cl-box">✓</span>' +
            '<span class="cl-text">' + it.text +
              (it.note ? '<span class="cl-note">' + it.note + '</span>' : '') +
            '</span>' +
          '</label>';
        var input = wrap.querySelector('input');
        input.addEventListener('change', function () {
          var idx = checked.indexOf(it.id);
          if (input.checked && idx === -1) checked.push(it.id);
          if (!input.checked && idx !== -1) checked.splice(idx, 1);
          save();
          updateProgress();
        });
        items.appendChild(wrap);
      });
      group.appendChild(items);
      groupsEl.appendChild(group);
    });
    updateProgress();
  }

  document.getElementById('cl-reset').addEventListener('click', function () {
    if (!window.confirm('确定要清空清单进度吗？此操作不可撤销。')) return;
    checked = [];
    save();
    renderChecklist();
  });

  /* ================= 清单多格式下载 ================= */
  var fmtSel = document.getElementById('cl-format');
  var dlBtn = document.getElementById('cl-download');
  var TODAY = new Date().toISOString().slice(0, 10);

  function isChecked(id) { return checked.indexOf(id) !== -1; }
  function fileBase() { return '西外新生通关宝典-必备清单-' + TODAY; }

  function downloadBlob(filename, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 400);
  }
  function downloadText(filename, content, mime) {
    downloadBlob(filename, new Blob([content], { type: (mime || 'text/plain') + ';charset=utf-8' }));
  }

  function mdContent() {
    var out = ['# 🎒 开学必备清单（西安外国语大学 · 2026 新生通关宝典）', '',
      '> 生成时间：' + new Date().toLocaleString('zh-CN'),
      '> 来源：https://xzt1118.github.io/xisu-guide-2026/', ''];
    CHECKLIST.forEach(function (g) {
      out.push('## ' + g.emoji + ' ' + g.name, '');
      g.items.forEach(function (it) {
        out.push((isChecked(it.id) ? '- [x] ' : '- [ ] ') + it.text + (it.note ? '　' + it.note : ''));
      });
      out.push('');
    });
    return out.join('\n');
  }

  function csvContent() {
    var rows = [['分类', '物品', '备注', '是否准备']];
    CHECKLIST.forEach(function (g) {
      g.items.forEach(function (it) {
        rows.push([g.name, it.text, it.note || '', isChecked(it.id) ? '是' : '否']);
      });
    });
    /* \ufeff BOM 保证 Excel 打开中文不乱码 */
    return '\ufeff' + rows.map(function (r) {
      return r.map(function (c) {
        var s = String(c).replace(/"/g, '""');
        return /[",\n]/.test(s) ? '"' + s + '"' : s;
      }).join(',');
    }).join('\r\n');
  }

  function jsonContent() {
    return JSON.stringify({
      app: '西外新生通关宝典', exportAt: new Date().toISOString(),
      url: 'https://xzt1118.github.io/xisu-guide-2026/', checked: checked
    }, null, 2);
  }

  function htmlContent() {
    var body = [];
    CHECKLIST.forEach(function (g) {
      body.push('<h2>' + g.emoji + ' ' + g.name + '</h2><ul>');
      g.items.forEach(function (it) {
        var done = isChecked(it.id);
        body.push('<li class="' + (done ? 'ok' : '') + '">' + (done ? '✓ ' : '☐ ') + it.text +
          (it.note ? ' <small>' + it.note + '</small>' : '') + '</li>');
      });
      body.push('</ul>');
    });
    return '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1"><title>开学必备清单</title>' +
      '<style>body{font-family:"PingFang SC","Microsoft YaHei",sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#333}' +
      'h1{color:#c8102e}h2{color:#9e0c24;font-size:18px;margin-top:22px}ul{list-style:none;padding:0}' +
      'li{padding:6px 0;border-bottom:1px dashed #eee}.ok{color:#2f9e63;font-weight:700}small{color:#999}' +
      '@media print{li{break-inside:avoid}}</style></head><body>' +
      '<h1>🎒 开学必备清单</h1><p>西安外国语大学 · 2026 新生通关宝典 ｜ ' + new Date().toLocaleString('zh-CN') + '</p>' +
      body.join('') + '<p style="color:#999;margin-top:24px">来源：https://xzt1118.github.io/xisu-guide-2026/</p>' +
      '</body></html>';
  }

  /* 清单渲染为 PNG 图片 */
  function pngBlob(cb) {
    var pad = 32, lineH = 30, headH = 96, catH = 44;
    var itemTotal = flattenItems().length;
    var width = 780;
    var height = headH + 20 + CHECKLIST.length * (catH + 8) + itemTotal * lineH + 40;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    var grad = ctx.createLinearGradient(0, 0, 0, headH);
    grad.addColorStop(0, '#9e0c24');
    grad.addColorStop(1, '#c8102e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, headH);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px "Microsoft YaHei","PingFang SC",sans-serif';
    ctx.fillText('🎒 开学必备清单', pad, 42);
    ctx.font = '15px "Microsoft YaHei","PingFang SC",sans-serif';
    ctx.fillStyle = '#f4d9a8';
    ctx.fillText('西安外国语大学 · 2026 新生通关宝典', pad, 74);
    var y = headH + 18;
    CHECKLIST.forEach(function (g) {
      ctx.fillStyle = '#fdeef0';
      ctx.fillRect(pad, y - 20, width - pad * 2, catH);
      ctx.fillStyle = '#c8102e';
      ctx.font = 'bold 18px "Microsoft YaHei","PingFang SC",sans-serif';
      ctx.fillText(g.emoji + ' ' + g.name, pad + 12, y + 2);
      y += catH;
      g.items.forEach(function (it) {
        var done = isChecked(it.id);
        ctx.fillStyle = done ? '#2f9e63' : '#444';
        ctx.font = (done ? 'bold ' : '') + '16px "Microsoft YaHei","PingFang SC",sans-serif';
        var label = (done ? '✓ ' : '☐ ') + it.text;
        ctx.fillText(label, pad + 24, y);
        if (it.note) {
          ctx.fillStyle = '#999';
          ctx.font = '13px "Microsoft YaHei","PingFang SC",sans-serif';
          ctx.fillText(it.note, pad + 24 + ctx.measureText(label).width + 18, y);
        }
        y += lineH;
      });
      y += 8;
    });
    canvas.toBlob(function (blob) { cb(blob); }, 'image/png');
  }

  dlBtn.addEventListener('click', function () {
    var fmt = fmtSel.value;
    var base = fileBase();
    if (fmt === 'txt') {
      var lines = [];
      CHECKLIST.forEach(function (g) {
        lines.push('【' + g.emoji + ' ' + g.name + '】');
        g.items.forEach(function (it) {
          lines.push((isChecked(it.id) ? '☑ ' : '☐ ') + it.text + (it.note ? '（' + it.note + '）' : ''));
        });
        lines.push('');
      });
      downloadText(base + '.txt', lines.join('\n'), 'text/plain');
    } else if (fmt === 'md') {
      downloadText(base + '.md', mdContent(), 'text/markdown');
    } else if (fmt === 'csv') {
      downloadText(base + '.csv', csvContent(), 'text/csv');
    } else if (fmt === 'json') {
      downloadText(base + '.json', jsonContent(), 'application/json');
    } else if (fmt === 'html') {
      downloadText(base + '.html', htmlContent(), 'text/html');
    } else if (fmt === 'png') {
      pngBlob(function (blob) { downloadBlob(base + '.png', blob); });
    }
  });

  /* 打印前自动展开所有折叠内容，便于浏览器打印完整内容 */
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('details.acc').forEach(function (d) { d.setAttribute('open', ''); });
  });

  renderChecklist();
})();
