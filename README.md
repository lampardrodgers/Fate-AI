<p align="center">
  <a href="https://fate.emmm.si"><img src="docs/banner.jpg" alt="FATE/AI — 型月 AI 圣杯战争 · 完全体设定集"></a>
</p>

<p align="center">
  <b>型月 AI 圣杯战争 · 完全体设定集</b><br>
  <i>The TYPE-MOON AI Holy Grail War — Complete Material</i><br>
  <i>型月AI聖杯戦争・完全版設定資料集</i>
</p>

<p align="center">
  <a href="https://fate.emmm.si">🌐 在线访问 fate.emmm.si</a> ·
  中文 / English / 日本語 · Dark / Light
</p>

---

## 这是什么

**FATE/AI** 是一个以《Fate/Zero》为主、参考 FGO 等型月作品设定与风格的**同人二创设定集网页**：
把当下的 AI 大模型与它们背后的公司 / 人物，写成一场争夺「AGI 圣杯」的圣杯战争。

| 层级 | 职阶 | 从者 / 存在 | 御主 / 所属 |
| --- | --- | --- | --- |
| 上三骑 | Saber | Gemini | 哈萨比斯 & Google |
| 上三骑 | Archer | Qwen | 阿里高层 / 通义原研 |
| 上三骑 | Lancer | Kimi | 杨植麟 |
| 下四骑 | Rider | GPT | Sam Altman |
| 下四骑 | Caster | Claude | Dario Amodei |
| 下四骑 | Assassin | GLM | 智谱 |
| 下四骑 | Berserker | Grok | Elon Musk |
| Extra | Ruler | DeepSeek | 梁文锋 |
| 灾厄 | Unbeast / Beast VII | 懂王 | MAGA / 白宫 |
| 局外人 | 第二法魔法使 | 老黄 | NVIDIA |

每位角色都有完整的「从者资料卡」：型月模板、召唤圣遗物、六维面板（雷达图 + 条形图）、御主档案、保有技能、宝具与阵营剧本。

## 截图

<table>
  <tr>
    <td width="50%"><img src="docs/caster.jpg" alt="从者资料卡 · 暗色 · 中文"><br><sub>从者资料卡 · 暗色模式 · 中文</sub></td>
    <td width="50%"><img src="docs/light.jpg" alt="Servant sheet · light mode · English"><br><sub>Servant sheet · Light mode · English</sub></td>
  </tr>
  <tr>
    <td colspan="2"><img src="docs/roster.jpg" alt="参戦者名簿 · 日本語"><br><sub>参戦者名簿 · ダークモード · 日本語</sub></td>
  </tr>
</table>

## 功能

- **型月风格主题**：Fate/Zero 式暗夜金红配色、旋转魔法阵首屏、令咒纹章、FATE/AI 圣剑斜杠 Logo
- **背景音乐**：右上角音乐按钮开关（默认关闭，首次访问按钮会轻微闪烁提示），淡入淡出、循环播放，记住开关状态
- **亮色 / 暗色模式**：右上角一键切换，记住选择（亮色为羊皮纸「资料集」风格）
- **三种语言**：中文 / English / 日本語，右上角切换，切换时保持当前阅读位置；首次访问按浏览器语言自动选择，也可用 `?lang=zh|en|ja` 指定
- **左侧导览条**（宽屏）：头像 + 职阶目录、当前章节高亮、阅读进度条
- **立绘大图查看**：点击立绘放大，`←` `→` 切换角色，`Esc` 关闭
- **座次总览 + 六维面板横向对照**：点击行直接跳转到对应角色
- 响应式布局，手机可读；纯静态页面，无构建步骤、无框架依赖

## 目录结构

```
.
├── index.html            # 整个网页（样式、中文设定数据 DATA、渲染逻辑都在这里）
├── i18n/
│   ├── zh.json           # 从 index.html 抽取出的中文可翻译内容（翻译用的底稿）
│   ├── en.json / ja.json # 英文 / 日文翻译（结构与 zh.json 完全一致）
│   └── en.js / ja.js     # 由 json 生成，网页实际加载的文件
├── scripts/
│   ├── extract-zh.js     # 从 index.html 抽取中文内容 → i18n/zh.json
│   ├── check-i18n.js     # 检查 en/ja 翻译结构是否与 zh.json 一致
│   └── build-i18n.js     # i18n/*.json → i18n/*.js
├── assets/
│   ├── logo.svg          # FATE/AI Logo（矢量源文件）
│   ├── audio/bgm.m4a     # 背景音乐（Fate/Zero OST I - Track 01 "Point Zero"）
│   └── thumbs/           # 立绘缩略图（首页、目录、表格使用）
├── docs/                 # README 用的截图
├── 纯立绘/               # 原始立绘（详情页与大图使用）
└── 角色设定图/           # 角色设定图原图
```

## 本地预览

直接双击 `index.html` 即可打开；或者起一个本地服务器：

```bash
python3 -m http.server 8765
# 浏览器打开 http://localhost:8765
```

## 修改设定 / 翻译

中文是唯一的「原稿」，英文 / 日文跟着中文走。改完内容按下面四步走：

| 步骤 | 做什么 | 命令 |
| --- | --- | --- |
| ① 改中文 | 编辑 `index.html` 里的 `const DATA = [...]`（每个角色一个对象，支持 `**加粗**`） | — |
| ② 抽取原稿 | 把中文可翻译内容同步到 `i18n/zh.json` | `node scripts/extract-zh.js index.html i18n/zh.json` |
| ③ 改翻译 | 在 `i18n/en.json`、`i18n/ja.json` 的对应位置改译文，然后检查结构 | `node scripts/check-i18n.js` |
| ④ 生成 | 生成网页实际加载的 `i18n/en.js`、`i18n/ja.js` | `node scripts/build-i18n.js` |

小贴士：

- 只改文字、不增删技能 / 宝具时，第 ② 步可以省略，直接改三种语言对应的位置即可。
- **增删了技能、宝具、段落**时，三份 json 的数组长度必须一致，否则 `check-i18n.js` 会逐条报出哪里对不上。
- 某条翻译暂时缺失也不会崩：网页会自动回退显示中文。
- 网址支持 `?lang=zh|en|ja`、`?theme=light|dark` 与 `#角色id`（如 `#caster`）直达；加 `&shot` 可进入截图模式（只渲染该章节、隐藏右上角按钮），README 截图就是这样生成的。
- 让 Claude 帮忙时，可以直接说「把 xx 改成 yy，并同步英文日文」，它会按这个流程走完。
- 界面文字（按钮、表头、标题等）在 `index.html` 的 `const UI = {...}` 中，三种语言各一份。

## 部署

站点是纯静态文件，任何静态服务器都能托管。当前线上环境为 Caddy：

```caddy
fate.emmm.si {
	root * /var/www/fate-ai
	encode zstd gzip
	file_server {
		hide .git .gitignore
	}
}
```

更新线上版本：

```bash
git push
ssh root@<server> 'cd /var/www/fate-ai && git pull'
```

## 声明

- 本项目为**同人二创 / 讽刺娱乐**作品，所有设定均为戏仿与玩梗，不代表对任何真实人物、公司或产品的事实陈述。
- Fate 系列及相关角色、名词版权归 **TYPE-MOON** 所有；背景音乐出自《Fate/Zero》原声带（作曲：梶浦由记），版权归原权利人所有，如有侵权请联系删除。
- 文中出现的公司与产品名称均为其各自所有者的商标。
