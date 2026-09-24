---
title: 赛博扫盲与 AI 使用入门
published: 2026-09-21 15:58:00
description: 从文件管理、快捷键、提问方式这些最基本的电脑习惯讲起，再讲 VPN、账号注册、VSCode 环境配置、DeepSeek 与 GPT 的入门用法，以及学工科为什么建议用 Windows。结合作者本机的真实配置写成。
image: ./cover.png
tags: [赛博扫盲, AI, DeepSeek, GPT, VSCode, 教程]
category: 教程
author: max1337
slug: cyber-literacy-and-ai-guide
pinned: true
draft: false
---

## 写在前面

本文分两大块：

1. **赛博扫盲**——电脑上最基础、但大学里没人教的东西：文件怎么管、快捷键怎么用、问题怎么问、软件怎么卸。
2. **AI 使用入门**——从翻墙、注册账号、配环境开始，一直到把 DeepSeek 和 GPT 真正用起来。

**说明**：本文的**赛博扫盲**与 **AI 使用入门**两部分，是在一份公开分享视频（B站 BV1Cye26tEJy）的基础上**重新组织、补充和扩写**的；准备篇（VPN、账号与环境、AI 工具、系统选择）、AI 工具的具体操作与本机配置均由作者重写或新增，并结合作者自己这台电脑的真实环境写成。

后面的 AI 教程部分，加入了 DeepSeek API、DeepSeek Harness、GPT 中转与 Codex 插件的详细上手步骤，这部分是个人的使用经验总结。

---

# 第一部分　赛博扫盲

## 1. 基本思维

所谓"会电脑"，不是会点某个软件，而是**遇到没见过的问题能自己解决**。它靠的是三件很朴素的事：

- **知道自己在做什么**：动手前先能用一句话说清目标，以及"怎样算做完了"。
- **知道东西在哪**：文件在哪个盘、哪个文件夹，程序装在哪，配置放在哪。
- **知道出错怎么查**：出问题先读提示文字，再看日志，最后才是问人。

几条能省下大量时间的习惯：

- **先备份，再操作**。任何"删除、覆盖、格式化、刷机"之前，先复制一份。重要的东西不存在"应该没事"。
- **不确定就复制一份再试**。改配置、改代码之前先复制文件，改坏了直接换回来。
- **自己动手查一次**。把报错原文原封不动粘到搜索框里，通常前三个结果就能解决 80% 的问题。
- **把坑记下来**。踩过的坑写成一句话笔记，攒到十几条，你就比周围人快很多。
- **别怕命令行**，但要知道每条命令在干什么。看不懂的命令不要直接回车。

## 2. 文件管理

### 命名

| 命名建议 | 示例 / 说明 |
| --- | --- |
| **版本号递增** | `报告_v01.docx`、`报告_v02.docx`、`报告_final.pdf` |
| **避免含糊名称** | 少用"新建文档""最终版2""那个文件" |
| **避免特殊字符** | 跨平台共享时尽量少用 `\ / : * ? " < > \|` |
| **统一日期格式** | 推荐 `YYYY-MM-DD`，便于按时间排序 |
| **路径与文件名尽量全英文** | 工程目录、文件名、软件安装路径都用英文 + 数字，不要中文和空格 |

> [!WARNING]
> **这条务必听进去：工程文件路径、文件名、软件安装路径，全部用英文。**
>
> 很多编译工具链、脚本和第三方库对中文路径支持很差：**Keil / EIDE / Vivado / CMake / Makefile / Python 包** 遇到中文或带空格的路径，轻则报"找不到文件""乱码"，重则直接编译失败；命令行工具还会因为路径里的空格把参数截断。
>
> 建议统一放在一个短的英文根目录下，例如 `F:\path\c_c++\`、`F:\path\project\`。**不要**放在桌面或"我的文档"里，也**不要**放在用中文用户名建成的目录下。

### 删除、移动和备份

- **删除前确认**：确认路径、文件名和内容。重要资料不要只放在回收站里，清空回收站后恢复会更困难。
- **备份遵循 3-2-1**：至少 **3 份副本**、**2 种介质**、**1 份放在不同位置**。例如电脑 + 移动硬盘 + 云盘。
- **同步不等于备份**：同步软件可能把误删同步到所有设备。重要版本仍要保留独立、只读或离线副本。
- **发送前打包**：多个文件用 ZIP 打包，并附一份说明；检查压缩包能否打开、内容是否齐全。

> [!TIP]
> **最实用的习惯**：每个项目都放一个 `README.md` 或说明文档，写清项目用途、打开方式、依赖软件和当前进度。三个月后的你会感谢现在的你。

### 目录结构参考

```text
项目名/
├── README.md          # 这个项目是干什么的、怎么打开
├── docs/              # 文档、报告（带版本号）
├── src/               # 源码
├── assets/            # 图片、图标
├── data/              # 原始数据、测试数据
└── outputs/           # 生成的结果、导出文件
```

## 3. 文件后缀

文件后缀通常位于文件名最后一个点号之后，用来提示系统和软件如何打开它。后缀**不是绝对安全证明**，陌生文件仍要谨慎。

| 类别 | 后缀 | 说明 | 常见软件 |
| --- | --- | --- | --- |
| 文本 | `.txt` / `.md` | 纯文本 / Markdown 文档 | 记事本、VS Code、Typora |
| 办公文档 | `.docx` | 文字文档 | Word、WPS |
| 表格 | `.xlsx` / `.csv` | 电子表格 / 逗号分隔数据 | Excel、WPS、文本编辑器 |
| 演示文稿 | `.pptx` | 幻灯片 | PowerPoint、WPS |
| 固定版式 | `.pdf` | 跨设备阅读和打印的固定版式文档 | 浏览器、PDF 阅读器 |
| 图片 | `.png` / `.jpg` / `.svg` | 无损截图 / 照片 / 矢量图 | 图片查看器、浏览器、设计软件 |
| 音视频 | `.mp3` / `.wav` / `.mp4` | 音频和视频文件 | 播放器、剪辑软件 |
| 压缩包 | `.zip` / `.7z` / `.rar` | 把多个文件压缩成一个包 | 系统工具、7-Zip、WinRAR |
| 程序 | `.exe` / `.msi` | Windows 程序 / 安装包 | 双击运行或安装，来源要可信 |
| 脚本 | `.bat` / `.ps1` | 命令脚本 / PowerShell 脚本 | 命令提示符、PowerShell |
| 代码 | `.c` / `.cpp` / `.py` | C / C++ / Python 源代码 | IDE、VS Code、解释器/编译器 |
| FPGA/HDL | `.v` / `.sv` / `.xdc` | Verilog / SystemVerilog / Vivado 约束 | Vivado、Quartus 等工具链 |

> [!WARNING]
> **扩展名陷阱**：Windows 可能默认隐藏已知文件类型的扩展名。建议在文件资源管理器中打开"查看 → 显示 → 文件扩展名"，这样能看清文件到底是 `报告.pdf` 还是伪装成文档的 `报告.pdf.exe`。

## 4. 常用快捷键

先把最常用的记住，剩下的在用的过程中自然会形成肌肉记忆。

### Ctrl 组

| 快捷键 | 作用 |
| --- | --- |
| `Ctrl + C` / `Ctrl + V` / `Ctrl + X` | 复制 / 粘贴 / 剪切 |
| `Ctrl + Z` / `Ctrl + Y` | 撤销 / 重做 |
| `Ctrl + A` | 全选 |
| `Ctrl + S` | 保存（**养成随手按的习惯**） |
| `Ctrl + F` | 查找 |
| `Ctrl + H` | 替换 |
| `Ctrl + P` | 打印；在 VS Code 里是快速打开文件 |
| `Ctrl + W` / `Ctrl + Shift + T` | 关闭当前标签 / 恢复刚关掉的标签（对浏览器极有用） |
| `Ctrl + T` | 新标签页 |
| `Ctrl + Tab` | 切换标签页 |
| `Ctrl + Shift + Esc` | 直接打开任务管理器 |
| `Ctrl + Backspace` / `Ctrl + Delete` | 按词删除 |
| `Ctrl + 方向键` | 按词移动光标 |
| `Ctrl + Shift + S`（部分软件） | 另存为 |

### Win 组

| 快捷键 | 作用 |
| --- | --- |
| `Win` | 开始菜单 |
| `Win + E` | 打开文件资源管理器 |
| `Win + D` | 显示桌面 |
| `Win + L` | **锁屏**（离座必按） |
| `Win + Shift + S` | 区域截图（最常用） |
| `Win + PrtSc` | 全屏截图并直接保存 |
| `Win + V` | 剪贴板历史 |
| `Win + Tab` | 任务视图 |
| `Win + Ctrl + D` / `Win + Ctrl + ←→` | 新建 / 切换虚拟桌面 |
| `Win + 方向键` | 窗口贴靠（左半屏、右半屏、最大化、最小化） |
| `Win + I` | 设置 |
| `Win + R` | 运行（`cmd`、`devmgmt.msc` 等） |
| `Win + X` | 快捷菜单（设备管理器、终端、磁盘管理） |
| `Win + .` | 表情与符号面板 |
| `Win + 数字键` | 打开/切换到任务栏第 N 个程序 |

### Alt 组与其他

| 快捷键 | 作用 |
| --- | --- |
| `Alt + Tab` / `Alt + Shift + Tab` | 切换窗口 / 反向切换 |
| `Alt + F4` | 关闭当前窗口 |
| `Alt + Enter` | 查看属性 |
| `Alt + ←` / `Alt + →` | 后退 / 前进 |
| `F2` | 重命名 |
| `F5` | 刷新 |
| `PrtSc` / `Alt + PrtSc` | 全屏到剪贴板 / 当前窗口到剪贴板 |
| `Shift + Delete` | 彻底删除（不进回收站，慎用） |

## 5. 截图与附件

### 截图

| 方式 | 说明 |
| --- | --- |
| `Win + Shift + S` | 区域截图，截图后点右下角通知可编辑并保存 |
| `PrtSc` | 全屏截图到剪贴板，需要粘贴到画图/聊天窗口 |
| `Alt + PrtSc` | 只截当前窗口 |
| `Win + PrtSc` | 全屏截图并自动保存到"图片 → 屏幕截图" |
| `Win + Alt + PrtSc` | 游戏栏截图（录屏用 `Win + Alt + R`） |
| QQ / 微信 `Ctrl + Alt + A` / `Alt + A` | 带标注的截图，适合发给别人 |

### 附件与提交

- **文件名写清楚**：`学号-姓名-实验3报告.pdf`，别叫"新建 Microsoft Word 文档.docx"。
- **格式选对**：截图用 PNG（清晰、无损），照片用 JPG（体积小），交材料统一导成 PDF（不会串版）。
- **多文件先打包**：ZIP 压缩，必要时加密码，并在正文里说明解压密码。
- **发之前检查**：压缩包能不能打开、有没有漏文件、内容是不是最新版本。
- **不要用手机拍屏幕交作业**：摩尔纹、反光、歪斜，老师看着痛苦，你也容易被扣分。

## 6. 如何描述问题：提问的智慧

**提问的质量，决定了你能得到多少帮助。**

一个好的提问模板：

```text
【我想做什么】一句话说明目标。
【我做了什么】按顺序列出操作步骤，包括输入的命令/参数。
【我期望什么】正常情况应该出现什么结果。
【实际发生了什么】完整粘贴报错原文，或附截图。
【环境信息】操作系统版本、软件版本、硬件型号。
【我已经试过什么】查过什么资料、试过哪些办法、结果如何。
```

几个反面例子，基本得不到有效帮助：

- ❌ "电脑坏了""软件打不开"——没有任何信息量。
- ❌ 只发一句"在吗"，然后等对方回复。
- ❌ 拍一张模糊的手机照片当报错信息。
- ❌ 只发报错的最后一行，把上下文全截掉。

> [!TIP]
> **先搜索，再提问**。把报错原文**整句**粘进搜索框（不要自己改写），加上软件名和版本号。搜索时优先看官方文档、Stack Overflow、GitHub Issues。
>
> **警惕 X-Y 问题**：你问的往往是你以为的解法（Y），而不是真正的问题（X）。先把你真正想达成什么讲清楚，别人可能直接给你一条更好的路。

## 7. 安全与规范

### 账号安全

- **密码不要复用**。一个网站泄露，撞库会把你所有账号撞一遍。推荐用密码管理器（Bitwarden、KeePass 等）。
- **开启二次验证（2FA）**，Google、GitHub、QQ、邮箱优先开。
- **公共电脑上不保存密码**，用完手动退出登录。
- 不要把验证码、身份证照片、银行卡照片发给任何人。

### 下载与运行

- **来路不明的 `.exe`、`.bat`、`.ps1` 一律不要运行**，尤其是群里发的"破解版""激活工具""绿色版"——挖矿木马和勒索软件的重灾区。
- 软件尽量去**官网**下，或使用 WinGet、Microsoft Store、Scoop 这类有来源校验的渠道。
- **U 盘交叉感染**：接别人 U 盘前先杀毒、关闭"自动播放"，实验室打印机旁的 U 盘尤其危险。

### 隐私与截图

- 截图前检查画面里有没有**学号、姓名、身份证号、手机号、聊天记录、API Key**。
- 打码要打彻底，不要让透明图层、历史记录把你卖了。
- 分享代码/配置前，把 API Key、Token、密码换成 `你的key`。

### 硬件与供电

> [!CAUTION]
> **用拓展坞，别把开发板、调试器、移动硬盘、充电器一股脑全插在电脑的接口上——电流倒灌是会烧主板的。**

- **为什么不能用电脑接口硬扛**：笔记本的 USB 口供电有限，全插满容易电压不稳、掉盘、掉设备；接口和主板供电电路长期过载也会老化。
- **真正的风险是倒灌**：开发板自己接了外部电源（12V 适配器、电机驱动、实验电源），同时又用 USB 连着电脑时，**外部电源可能经 USB 口倒灌回电脑，烧掉 USB 控制器甚至整块主板**。这不是小概率事件，实验室里年年都有。
- **正确做法**：
  - 买一个**带独立供电的拓展坞**，外设插拓展坞、拓展坞再连电脑，让它分担供电；
  - 开发板**尽量单独供电**，接 USB 前先断电、先共地；
  - **不要**一边用电脑 USB 供电、一边又接外部电源；
  - 插拔调试器（ST-Link / DAPLink / J-Link）前，先断开目标板电源。
- 顺手两条：不要用手直接摸电路板背面（静电）；实验室电源接板子前，先确认电压档位和正负极。

### 实验室规范

- 不动别人的开发板、电源、接线；不确定就断电再问。
- 不在实验室电脑上安装来源不明的软件、不插不明 U 盘。
- 借用设备要登记，走之前恢复原状、断电、收拾干净。

## 8. 软件卸载

软件装多了、装错了，卸载也有讲究。以下六种方式，从易到难：

| # | 方式 | 做法 | 适用场景 |
| --- | --- | --- | --- |
| ① | 设置 → 应用 | 在设置的应用列表中找到软件，打开菜单后点"卸载" | 最通用，首选 |
| ② | 控制面板 → 程序和功能 | 选择软件后点"卸载"或"卸载/更改" | 传统桌面程序 |
| ③ | 开始菜单右键 | 在开始菜单中右键软件名称，选择"卸载" | 快捷入口，有时会跳转到设置 |
| ④ | 安装目录自带卸载程序 | 在安装目录寻找 `uninstall.exe` 或 `unins000.exe` | 绿色软件、老软件 |
| ⑤ | Microsoft Store | 从设置的已安装应用列表或开始菜单卸载 | 商店应用 |
| ⑥ | winget 命令行 | `winget list` 查名称，再 `winget uninstall 软件名称` | 进阶，批量清理 |

```powershell
# 列出已安装的软件（可配合 findstr 过滤）
winget list

# 卸载指定软件（名称要准确，可先用 winget list 查）
winget uninstall 软件名称
```

> [!NOTE]
> Windows 10/11 的具体文字可能因版本不同略有差异。步骤参考：微软官方《在 Windows 中卸载或删除应用和程序》。
>
> 卸载后建议顺手检查两处：`C:\Program Files`（或 `Program Files (x86)`）下有没有残留目录，以及注册表自启动项（任务管理器 → 启动）。

## 9. 日常清单

每周花十分钟走一遍，电脑会一直处在"随时能用"的状态：

- [ ] **文件**：下载目录清空一次；桌面只留正在做的事；项目资料归档并写 README。
- [ ] **命名**：检查有没有"新建文档""最终版2"这类名字，顺手改掉。
- [ ] **备份**：重要资料按 3-2-1 检查一遍，确认移动硬盘/云盘上有副本。
- [ ] **更新**：系统更新、驱动更新、常用软件更新。
- [ ] **安全**：确认二次验证都开着；清理不用的账号和授权。
- [ ] **清理**：卸载已经用不到的软件；清空回收站前再确认一次。
- [ ] **习惯**：离座按 `Win + L` 锁屏；拔 U 盘前先安全弹出。

---

# 第二部分　AI 使用入门

## 1. VPN 的使用

<p style="font-size:1.12em;font-weight:700;line-height:2">
先说结论：<strong>搞工科，尤其是电子信息，VPN 基本是刚需。</strong>不是"想上外网看看"的问题，而是<strong>不翻墙很多正经资料根本打不开</strong>。
</p>

<p style="font-size:1.12em;font-weight:700;line-height:2">
Google、GitHub、Stack Overflow 的部分页面、Arduino / ESP32 / STM32 的官方文档、各大芯片原厂的 Datasheet、Hugging Face、arXiv、VS Code 插件市场、npm 和 pip 的部分源……<strong>这些页面在国内直连要么打不开，要么慢到没法用。</strong>你以后查资料、找代码、下 SDK、装依赖，会一次又一次撞到这道墙。没有它，别人十分钟查完的东西，你可能要花一下午找二手转载。
</p>

> [!IMPORTANT]
> **需要"魔法"的同学：有需要可以群内私信交流。**
>
> 这里**不放链接**——一来容易被扫到，二来放久了也容易失效。**加群后私信管理员说明用途**（查资料 / 下 SDK / 访问 GitHub 等）就行，会给你可用的方案和图文教程。
>
> **使用中遇到任何问题，也可以私信交流**，不要在群里公开发。不要自己瞎折腾到把节点搞封了。

<p style="font-size:1.12em;font-weight:700;line-height:2">
⚠️ <strong>群内提问时，请注意用词：不要出现"翻墙""VPN""梯子"这类敏感词汇，一律用"魔法"代替。</strong>这是为了保护群——敏感词被扫到，群可能直接就没了。比如你可以说"我的魔法今天连不上""魔法节点怎么换"。
</p>

<p style="font-size:1.12em;font-weight:700;line-height:2">
⚠️ <strong>请合理、合规地使用：不要把魔法用在任何不该用的地方，不要在外网发表、转发、评论任何敏感话题。</strong>你的账号是你自己的，出了问题只能自己承担。
</p>

> [!CAUTION]
> **特此声明：本文只提供工具思路，不构成任何建议。因个人使用产生的任何后果，与本文作者无关，作者概不负责。** 请自行了解并遵守所在地的相关法律法规。

---

## 2. 学会注册谷歌账号、GitHub 账号，下载 VSCode 并配置环境

### 2.1 为什么这两个账号是必备的

| 账号 | 你能得到什么 |
| --- | --- |
| **Google** | Gmail 邮箱、Google Drive 云盘、学术搜索、Colab 免费 GPU、Android / Flutter / Chrome 官方文档、YouTube 上的课程 |
| **GitHub** | 代码托管、看开源项目源码、下载别人的工程、GitHub Actions 白嫖 CI、Copilot、以后找实习时的"简历" |

说白了：**GitHub 是你的技术名片，Google 账号是你打开外网服务的通行证。** 两个都没有，等于一直站在门外。

### 2.2 注册谷歌账号

**前置条件：先按第 1 节把"魔法"配好，并且全程保持开启。**

1. 打开 <https://accounts.google.com/signup>（或 Gmail 首页点"创建账号"）。
2. 填写**姓名、出生日期、用户名、密码**。
   - 用户名建议用规范英文，例如 `姓名拼音 + 数字`，**不要**用 `woaini1314`、`asdfgh123` 这种——这个邮箱以后会用来投简历、注册学术服务。
   - 密码用密码管理器生成并保存，别用你 QQ 的那套密码。
3. **手机号验证**。填 `+86` 手机号有时能收到验证码，有时会提示"此电话号码无法用于验证"。
4. 登录后**立刻做三件事**：
   - 打开 **两步验证（2FA）**；
   - 添加**恢复邮箱**和**恢复手机号**；
   - 生成并保存**备用验证码**（账号丢了就靠它）。

> [!TIP]
> **手机号验证失败的常见处理**：换一个节点再试（尽量选稳定、少人用的节点）、换一个时间段再试（避开高峰）、用浏览器无痕窗口重来、别在短时间内反复提交。实在不行，用朋友的号先注册，之后再改绑自己的。

### 2.3 注册 GitHub 账号

1. 打开 <https://github.com/signup>，用**刚注册的 Gmail** 注册。
2. **用户名要认真取**（英文/数字/连字符）。它会出现在你所有仓库地址、提交记录、简历里，**改起来很麻烦**，别用中二 ID。
3. 收邮件完成邮箱验证。
4. **开启两步验证**：Settings → Password and authentication → Two-factor authentication。
5. 配置 Git 身份与 SSH 免密（这一步做了，以后 push 不用输密码）：

```bash
# 1) 配置提交身份（改成你自己的）
git config --global user.name "你的名字"
git config --global user.email "你的Gmail@gmail.com"

# 2) 生成 SSH 密钥（一路回车即可，passphrase 可留空）
ssh-keygen -t ed25519 -C "你的Gmail@gmail.com"

# 3) 查看公钥内容并复制
cat ~/.ssh/id_ed25519.pub
```

把复制的公钥粘贴到 GitHub：**Settings → SSH and GPG keys → New SSH key**，标题随便写，Key 粘贴进去保存。

```bash
# 4) 验证是否配置成功（出现 Hi 你的用户名! 就成功了）
ssh -T git@github.com
```

### 2.4 下载并配置 VSCode

**下载**：<https://code.visualstudio.com/>（打不开就先检查魔法）。安装时建议勾选：

- 添加到 PATH（能在命令行用 `code .` 打开当前目录）
- "通过 Code 打开"添加到资源管理器的目录上下文菜单

**基础配置**：

1. 装**中文语言包**：扩展市场搜 `Chinese (Simplified)`。
2. 登录账号同步配置（可选，但换电脑很方便）。
3. 打开设置（`Ctrl + ,`），调字体大小、自动保存。

#### 我这台电脑的实际配置

下面是我本机的真实环境，可以直接照着装：

| 项目 | 版本 / 配置 |
| --- | --- |
| VS Code | 1.138.0 |
| 主题 | Light Modern |
| 编辑器字号 | 22（`editor.fontSize`，外接显示器看着舒服） |
| Node.js | v24.19.0 |
| npm | 11.17.0 |
| Python | 3.14.7 |
| Git | 2.55.0 |

`settings.json` 里比较关键的自定义项（都在 `C:\Users\Administrator\AppData\Roaming\Code\User\settings.json`）：

```jsonc
{
  "workbench.colorTheme": "Light Modern",
  "editor.fontSize": 22,

  // C/C++：把 Keil 的头文件路径加进来，写 STM32 / 51 的代码才有补全
  "C_Cpp.default.includePath": [
    "${workspaceFolder}/**",
    "E:/keil5/ARM/Pack/Keil/**",   // STM32
    "E:/keil5/C51/INC/**"          // C51
  ],
  // C51 的怪异关键字要让 IntelliSense 认识，否则满屏红波浪线
  "C_Cpp.default.defines": [
    "__C51__", "__VSCODE_C51__", "reentrant=", "compact=", "small=", "large=",
    "data=", "idata=", "pdata=", "bdata=", "xdata=", "code=",
    "bit=char", "sbit=char", "sfr=char", "sfr16=int",
    "interrupt=", "using=", "_at_=", "_priority_=", "_task_="
  ],

  // EIDE（单片机开发插件）指向本机 Keil 与工具链
  "EIDE.ARM.ARMCC5.InstallDirectory": "E:\\keil5\\ARM\\ARMCC",
  "EIDE.ARM.ARMCC6.InstallDirectory": "E:\\keil5\\ARM\\ARMCLANG",
  "EIDE.ARM.INI.Path": "E:\\keil5\\UV4\\UV4.exe",
  "EIDE.C51.INI.Path": "E:\\keil5\\UV4\\UV4.exe",
  "EIDE.ARM.GCC.InstallDirectory": "E:\\path\\C_C++\\arm-none-eabi-gcc",
  "EIDE.STLink.ExePath": "${userHome}/.eide/tools/st_cube_programer/bin/STM32_Programmer_CLI.exe",
  "EIDE.OpenOCD.ExePath": "${userHome}/.eide/tools/openocd_7a1adfbec_mingw32/bin/openocd.exe",

  // MSPM0（TI 单片机）工具链
  "mspm0.gccPath": "E:/path/C_C++/arm-none-eabi-gcc/bin",
  "mspm0.makePath": "C:/Users/Administrator/.eide/bin/builder/msys/bin",
  "mspm0.openocdPath": "C:/Users/Administrator/.eide/tools/openocd_7a1adfbec_mingw32/bin",
  "mspm0.defaultProbe": "cmsis-dap",

  // K230 CanMV（勘智 K230）的 Python 存根，用于补全
  "python.analysis.extraPaths": [
    "C:\\Users\\Administrator\\.kendryte\\k230_canmv_stubs\\8f620e570e90363678bd2fb9fdb22f4e16ba8fbf"
  ],
  "python.analysis.diagnosticSeverityOverrides": { "reportMissingModuleSource": "none" },

  // 远程开发：实验室那台 Linux 机器
  "remote.SSH.remotePlatform": { "172.23.41.75": "linux" }
}
```

#### 我装的插件（共 55 个，按用途分组）

**Python / 通用编程**

| 插件 ID | 用途 |
| --- | --- |
| `ms-python.python` | Python 官方支持 |
| `ms-python.vscode-pylance` | 类型检查与智能补全 |
| `ms-python.debugpy` | Python 调试器 |
| `ms-python.vscode-python-envs` | 虚拟环境管理 |
| `donjayamanne.python-extension-pack` | Python 扩展合集 |
| `donjayamanne.python-environment-manager` | 环境管理 |
| `kevinrose.vsc-python-indent` | 修正 Python 缩进 |
| `njpwerner.autodocstring` | 自动生成 docstring |
| `batisteo.vscode-django` | Django 支持 |
| `wholroyd.jinja` | Jinja2 模板语法 |
| `ms-vscode.powershell` | PowerShell 脚本支持 |
| `ms-dotnettools.vscode-dotnet-runtime` | .NET 运行时（部分插件依赖） |

**C / C++ / 构建工具**

| 插件 ID | 用途 |
| --- | --- |
| `ms-vscode.cpptools` | C/C++ 官方支持（补全、调试） |
| `ms-vscode.cpptools-extension-pack` | C/C++ 扩展合集 |
| `ms-vscode.cpp-devtools` | C++ 开发工具 |
| `ms-vscode.cpptools-themes` | 配套主题 |
| `hars.cppsnippets` | C++ 代码片段 |
| `ms-vscode.cmake-tools` | CMake 工程支持 |
| `twxs.cmake` | CMake 语法高亮 |
| `josetr.cmake-language-support-vscode` | CMake Language Support |

**单片机 / 嵌入式**

| 插件 ID | 用途 |
| --- | --- |
| `cl.eide` | **EIDE**：单片机工程管理（Keil/ARMCC/arm-gcc 通吃，本机主力） |
| `marus25.cortex-debug` | Cortex-M 在线调试 |
| `mcu-debug.debug-tracker-vscode` | 调试跟踪 |
| `mcu-debug.memory-view` | 内存查看 |
| `mcu-debug.peripheral-viewer` | 外设寄存器查看 |
| `mcu-debug.rtos-views` | RTOS 任务视图（FreeRTOS 等） |
| `espressif.esp-idf-extension` | **ESP-IDF**：ESP32 全家桶开发 |
| `espressif.esp-idf-web` | ESP-IDF Web 配置 |
| `kendryte747.canmv-vscode` | K230 CanMV（勘智 K230） |
| `singtown.openmv` | OpenMV 机器视觉 |

**FPGA / Verilog**

| 插件 ID | 用途 |
| --- | --- |
| `czh.czh-verilog-snippet` | Verilog 代码片段 |
| `ericsonj.verilogformat` | Verilog 格式化 |
| `isaact.verilog-formatter` | Verilog 格式化 |
| `tzylee.verilog-highlight` | Verilog 语法高亮 |
| `truecrab.verilog-testbench-instance` | 自动生成 testbench 实例化 |

**机器人 / ROS**

| 插件 ID | 用途 |
| --- | --- |
| `jaehyunshim.vscode-ros` | ROS 开发支持 |
| `pijar.ros-snippets` | ROS 代码片段 |
| `sweilz.ros-snippets` | ROS 代码片段 |

**AI 编程助手**

| 插件 ID | 用途 |
| --- | --- |
| `openai.chatgpt` | **OpenAI 官方插件（Codex）**，写代码最常用的一个 |
| `anthropic.claude-code` | Claude Code 官方插件 |
| `saoudrizwan.claude-dev` | Cline：可接多种 API 的编程助手 |
| `hybridtalentcomputing.cline-chinese` | Cline 汉化版 |
| `moonshot-ai.kimi-code` | Kimi Code |

**远程开发 / 版本控制**

| 插件 ID | 用途 |
| --- | --- |
| `ms-vscode-remote.remote-ssh` | SSH 连远程 Linux 服务器 |
| `ms-vscode-remote.remote-ssh-edit` | 编辑 SSH 配置 |
| `ms-vscode-remote.remote-wsl` | 连 WSL2 |
| `ms-vscode-remote.remote-containers` | 连 Docker 容器 |
| `ms-vscode.remote-explorer` / `remote-repositories` / `remote-server` | 远程资源管理 |
| `github.remotehub` / `ms-vscode.azure-repos` | 直接在 GitHub 仓库里浏览代码 |

**文档与其他**

| 插件 ID | 用途 |
| --- | --- |
| `shd101wyy.markdown-preview-enhanced` | Markdown 增强预览（写报告神器） |
| `tomoki1207.pdf` | 在 VSCode 里直接看 PDF（看 datasheet 方便） |
| `ms-ceintl.vscode-language-pack-zh-hans` | 简体中文语言包 |

> [!TIP]
> **一次性装好**：把上面的 ID 存成一行行文本，然后用下面这条命令批量安装。
>
> ```powershell
> Get-Content extensions.txt | ForEach-Object { code --install-extension $_ }
> ```

**环境配置的三个补充**：

- **Python**：装完插件后，`Ctrl + Shift + P` → `Python: Select Interpreter` 选解释器。做项目一定用虚拟环境（`python -m venv .venv`），别把包装进全局。pip 慢就换国内源（清华/阿里）。
- **Node / pnpm**：装 Node 后 `npm i -g pnpm`。前端和很多 CLI 工具都靠它。
- **C/C++ 交叉编译**：单片机开发推荐装 `arm-none-eabi-gcc`；配合 EIDE 使用，本项目里路径就是 `E:\path\C_C++\arm-none-eabi-gcc`。

### 环境安装图文教程（PDF，强烈建议照着做）

嵌入式这套环境（MinGW、C/C++ 插件、EIDE、编译器和烧录器）是最容易卡人的地方。这里放一份写得很细的图文教程，跟着做基本不会踩坑：

[**📄 EIDE 环境配置教程（PDF，26 页）**](/downloads/eide-setup-guide.pdf)

它覆盖的步骤大致是：

1. **装 MinGW**：从 `niXman/mingw-builds-binaries` 下载 Windows 版，后缀选 **UCRT**，解压到固定的英文路径，例如 `F:\path\c_c++\mingw64`。
2. **配环境变量**：`Win + I` → 系统 → 系统信息 → 高级系统设置 → 环境变量，在**系统变量**的 `Path` 里新建一条 `F:\path\c_c++\mingw64\bin`；然后 `Win + R` 输入 `cmd`，执行 `gcc --version`，有输出就说明配好了。
3. **装 C/C++ Extension Pack**：扩展市场直接装合集，它会自动把依赖装齐。
4. **配置 `settings.json`**：把 Keil 的头文件目录加进 `C_Cpp.default.includePath`（如 `D:/Keil_v5/ARM/Packs/Keil/**`、`D:/Keil_v5/C51/INC/**`），再补上 C51 的宏定义——**就是我上面那份配置**。
5. **装 EIDE 插件**：扩展市场搜 `EIDE` 安装，它会自动拉取运行依赖（.NET 6 等，网络不好会比较慢）。
6. **配编译器与烧录器**：ARMCC5 / ARMCC6 / `UV4.exe` 路径、`arm-none-eabi-gcc`，以及 `cortex-debug` 的 `armToolchainPath`、`openocdPath`。
7. **导入工程**：Keil C51、Keil MDK（标准库 / HAL 库）、CubeMX Makefile 工程分别怎么导入，Flash 空间参数从哪里抄。
8. **烧录与调试**：C51 用 `stcgal`；STM32 用 ST-Link（STM32 Cube Programmer CLI，必要时用 `STLinkUpgrade.jar` 升级固件）或 DAPLink（OpenOCD）；调试用 Cortex Debug 生成 launch 配置。

> [!TIP]
> 教程里的路径可以照抄，但记得换成你自己的盘符。**再强调一次：安装路径最后全都用英文。**

> [!NOTE]
> 环境配置没有"标准答案"，上面是我这台机器的方案。**卡住了就在群里问，最好带上：你装到哪一步、报了什么错（截图或原文）。** 详见第一部分第 6 节的提问模板。

---

## 3. 如何开启 AI 的使用

### 3.1 常见的 AI

<table>
<thead>
<tr><th style="width:70px">图标</th><th>名称</th><th>出品方</th><th>定位</th><th>网址</th></tr>
</thead>
<tbody>
<tr><td><img src="/ai-logos/deepseek.svg" width="26" height="26"></td><td><strong>DeepSeek</strong></td><td>深度求索（国内）</td><td>推理与代码能力强，API 便宜，国内直连可用</td><td>chat.deepseek.com</td></tr>
<tr><td><img src="/ai-logos/kimi.svg" width="26" height="26"></td><td><strong>Kimi</strong></td><td>月之暗面（国内）</td><td>长文本阅读、资料整理</td><td>kimi.com</td></tr>
<tr><td><img src="/ai-logos/glm.svg" width="26" height="26"></td><td><strong>GLM / 智谱清言</strong></td><td>智谱 AI（国内）</td><td>对话与多模态，GLM 系列模型开放</td><td>chatglm.cn</td></tr>
<tr><td><img src="/ai-logos/openai.svg" width="26" height="26"></td><td><strong>ChatGPT（GPT）</strong></td><td>OpenAI（国外）</td><td>综合能力第一梯队，生态最全</td><td>chatgpt.com</td></tr>
<tr><td><img src="/ai-logos/claude.svg" width="26" height="26"></td><td><strong>Claude</strong></td><td>Anthropic（国外）</td><td>长文写作、代码理解，风格稳重</td><td>claude.ai</td></tr>
<tr><td><img src="/ai-logos/gemini.svg" width="26" height="26"></td><td><strong>Gemini</strong></td><td>Google（国外）</td><td>多模态，和 Google 生态打通</td><td>gemini.google.com</td></tr>
<tr><td><img src="/ai-logos/codex.svg" width="26" height="26"></td><td><strong>Codex / Claude Code</strong></td><td>OpenAI / Anthropic</td><td>会自己读写文件、跑命令的编程 Agent</td><td>见第 3.3 节</td></tr>
</tbody>
</table>

> [!NOTE]
> 以上图标来自各厂商的公开品牌资源（[Simple Icons](https://simpleicons.org/) / [LobeHub Icons](https://icons.lobehub.com/)），版权归各自公司所有，此处仅用于识别说明。
>
> 除此之外，国内还有**通义千问、豆包、文心一言、腾讯元宝**等，国外还有 **Copilot、Perplexity** 等，选择哪个其实差别不大，**先用起来最重要**。

### 3.2 国内推荐：DeepSeek

国内 AI 里我最推荐 **DeepSeek**：直连能上、中文好、代码和推理强、API 便宜到几乎可以忽略成本。网页版打开 <https://chat.deepseek.com> 手机号注册就能聊，这里不展开。

下面**只讲一条最实用的路线**：在官网拿到 DeepSeek 的 API Key，然后接到 **DSH Desktop（DeepSeek Harness 桌面端）** 里，当成日常干活的工具用。这是我自己一直在用的组合。

#### 第一步：在官网拿一个 API Key

1. 打开 <https://platform.deepseek.com>，手机号注册并登录。
2. 左侧菜单 **API keys → 创建 API key**，起个名字（比如 `dsh-desktop`）。
3. **Key 只显示一次，立刻复制保存到密码管理器。** 泄露了就马上删除重建。
4. 在 **充值 / Top up** 里充一点钱（按 token 计费，具体价格以官网为准，先充最小额度试水）。

> [!WARNING]
> API Key 就是你的钱包：**不要发给任何人、不要提交到 GitHub、不要写进网页前端**。截图分享时也要把 `sk-` 开头的那串打码。

#### 第二步：下载 DSH Desktop

**DSH Desktop 是社区开源的 DeepSeek Harness 桌面客户端**——把 DeepSeek Harness 的本地 Web UI、Host 服务和插件系统打包成原生桌面应用，**不用装 Node.js、不用敲命令**，下载安装就能用。

| 项目 | 地址 |
| --- | --- |
| **官方发布版（DeepSeek 官方，Windows x64）** | <https://download.deepseek.com/dsh-desk/bin/win-x64/deepseek-harness-0.1.7-rc.1.20260924.1-win-x64.exe> |
| **官网（推荐）** | <https://dshdesktop.cn> |
| Windows 直接下载 | <https://www.dshdesktop.cn/api/downloads/windows> |
| GitHub 仓库 / Releases | <https://github.com/anywhere-labs/deepseek-harness-desktop> |

> [!NOTE]
> 三点说明，免得搞混：
> - **DSH Desktop 是独立社区项目，与深度求索（DeepSeek）没有隶属、合作或背书关系**；它基于上游开源项目 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 构建，遵循 MIT 协议。
> - 它**完全开源免费**，如果有人向你收费，直接拒绝。
> - 上游的 DeepSeek Harness 本身是命令行工具，想折腾命令行再去上游仓库看。

#### 第三步：安装并完成首次配置

1. 下载 Windows 安装包（NSIS），双击按提示安装，一路下一步即可。
2. 首次启动会弹出 **Setup Wizard**（原生设置向导）：窗口模式、系统材质、插件市场、通知、是否用系统默认浏览器打开、Web 访问范围等，按自己习惯选，懒得看就跳过。
3. 进入设置，把**第一步拿到的 API Key** 填进去；模型选 `deepseek-chat`（通用对话）或 `deepseek-reasoner`（深度思考）。
4. 桌面设置里会显示本机的访问地址——默认**只监听本机回环地址**（`127.0.0.1`）。

> [!CAUTION]
> **不要把 Web 访问范围开成局域网。** 官方文档写得很明确：向局域网开放**不提供任何鉴权**，同一网络下任何人都能直接打开 DSH 并操作你的电脑。只在完全可信的网络里才考虑这个选项。

#### 第四步：日常怎么用

1. **先选工作区（Workspace）**——也就是让它"在哪个文件夹里干活"。建议一个项目开一个工作区，不要直接对着整个 D 盘。
2. **用自然语言下任务**，例如：
   - "读一下 `src/main.c`，解释这个状态机在做什么"
   - "把 `README.md` 的安装步骤补全，并跑一遍构建确认没错"
   - "这个报错是什么原因？给出最小修改方案，先别动文件"
3. 它会自己决定**读哪些文件、跑什么命令**，过程中你可以随时打断、追加要求。
4. 干完活它会汇报：改了哪些文件、跑了什么命令、结果如何。**你要自己复核，不要只看它的总结。**

**几个必须知道的概念**：

| 概念 | 说明 |
| --- | --- |
| **工作区** | Agent 能看到的文件夹范围，**这是第一道安全边界** |
| **会话** | 一次连续对话，可以随时恢复；历史存在 `~/.dsh/sessions` |
| **技能（Skills）** | 预先写好的任务说明书，放 `~/.dsh/skills`，让它按你的规范做事 |
| **审批策略** | 关键操作（删文件、跑危险命令）是否先问你。**建议保持"每次都要问"** |
| **沙箱模式** | `read-only` 只读 / `workspace-write` 只能改工作区（推荐日常用）/ `danger-full-access` 全盘可写（**只在明确知道风险时用**） |
| **后台任务** | 长命令（编译、装依赖）放到后台跑，你可以同时继续做别的 |
| **插件与插件市场** | 模型、工具、界面、工作流都能做成插件；已内置社区插件市场，可浏览并一键安装 |
| **配置文件位置** | `C:\Users\<用户名>\.dsh\`：`settings.yaml` 行为设置、`.credentials.yaml` 凭据、`sessions\` 会话、`skills\` 技能 |

> [!TIP]
> **用 DSH 的三条经验**：
> 1. **先让它"只看不动"**：新项目先让它读代码、给方案，确认思路对了再让它动手。
> 2. **重要仓库先 commit**：这样它改坏了，你一句 `git checkout .` 就能回退。
> 3. **任务里说清边界**：明确告诉它哪些文件不能动、哪些操作必须先问你。

#### 常见问题

| 现象 | 原因 / 处理 |
| --- | --- |
| 返回 402 | 余额不足，去 platform 充值 |
| 返回 429 | 请求过快被限速，等一会儿或降低并发 |
| 一直转圈连不上 | 检查网络；部分功能可能需要先开魔法 |
| 提示上下文超长 | 不要让它一次读整个项目，先让它读相关文件 |
| 安装或更新失败 | 去官网重新下载安装包覆盖安装，或到 GitHub Releases 手动下载 |

### 3.3 国外推荐：GPT

**GPT 有两种买法：直充和中转站。**

**方案 A：直充（官方订阅）**

在 <https://chatgpt.com> 订阅 Plus。优点是**最稳、最正规、功能最全**；缺点是**需要海外支付方式**（国外信用卡或虚拟卡），对普通学生门槛偏高——**我自己用不起直充，所以用的是方案 B**。

**方案 B：中转站（我实际在用的）**

<p style="font-size:1.08em;font-weight:700;line-height:2">
我推荐的中转站是：<a href="https://www.yyapi.cloud/">https://www.yyapi.cloud/</a>（<strong>需要先打开魔法</strong>）
</p>

用法很简单：

1. 打开 <https://www.yyapi.cloud/>，**网站顶部就有详细的使用教程**，照着做即可，这里不重复。
2. 大致流程是：注册 → 充值（人民币即可）→ 在后台生成令牌 / API Key。
3. 把拿到的 **Base URL + API Key** 填进你的客户端（中转站基本都是 OpenAI 兼容格式，要填的就三样：接口地址、API Key、模型名）。

> [!WARNING]
> **中转站的注意事项**：
> - 中转站本质是**别人替你转发请求**，所以**不要通过它提交任何敏感、私密、涉密的内容**。
> - 选口碑好、开得久的中转站，小额多次充值，别一次充很多。
> - Key 一样不能外传；发现异常消耗立刻换 key。

**我推荐的组合：VSCode 的 Codex 插件 + 桌面端 GPT**

- **在 VSCode 里写代码**：装 OpenAI 官方插件（本机装的就是它，插件 ID `openai.chatgpt`，即 **Codex**）。它可以在编辑器里直接改代码、跑命令，是日常写代码用得最多的一个。
  - 如果你更习惯 Claude，也可以装 `anthropic.claude-code`（Claude Code 官方插件）。
  - Cline（`saoudrizwan.claude-dev`）的好处是**什么 API 都能接**，换服务商只要改个地址就行。
- **在桌面上随手问**：**桌面端 GPT 在微软应用商店（Microsoft Store）里直接搜 "ChatGPT" 就能下载安装**，装完登录即可。比每次开浏览器方便，也支持快捷键唤起。

> [!TIP]
> 桌面端 App 从微软商店装的好处是：**自动更新、不用自己找安装包**。登录时如果转圈连不上，先检查魔法是否正常。

---

## 4. 学工科，尤其电子信息，为什么推荐 Windows

**一句话结论：主力机买 Windows，极其不推荐 macOS。**

原因很直接：**工科的专业软件生态，基本是围着 Windows 建的。**

| 方向 | 主流软件 | macOS 情况 |
| --- | --- | --- |
| 单片机 / 嵌入式 | Keil MDK、IAR、STM32CubeMX、TI CCS、MSPM0 SDK、ESP-IDF | 多数没有原生版本，或体验很差 |
| FPGA | Vivado、Quartus、ModelSim、Libero | **基本没有原生版本**（Vivado 从未支持 macOS） |
| PCB / 电路 | Altium Designer、立创 EDA 专业版、Cadence、LTspice、Multisim | 大多没有，或只能跑网页版 |
| 仿真 / 建模 | MATLAB（工具箱全）、SolidWorks、AutoCAD | 有但工具箱/插件不全，SolidWorks 没有 |
| 烧录 / 上位机 | ST-Link Utility、FlyMcu、各类 USB 转串口驱动、厂商上位机 | 大量国产工具只有 Windows 版 |

**macOS 不是"不能用"，而是"处处要绕路"**：你会在需要装 Keil 的那天开始装虚拟机，在需要 Vivado 的那天开始远程连实验室电脑。更麻烦的是 Apple Silicon（M 系列）芯片跑 x86 Windows 虚拟机本身就有额外的兼容问题，驱动和 USB 设备透传经常出幺蛾子。**花同样的钱，你会把时间花在折腾环境上，而不是做项目。**

**鸿蒙 PC**：生态还在建设中。写文档、上网、轻办公完全没问题；但 Keil、Vivado、Altium 这类专业软件基本没有原生版本，能用的方案有限。**"可能有问题，但问题不大"**——当主力生产力工具要慎重，当第二台机器没问题。

---

# 第三部分　把 AI 用明白

下面这部分讲的是**方法论**：理解 AI 是什么、什么时候该用它、怎么提要求、怎么核验结果。

## 1. 先理解 AI：把它当作一种能力

人工智能（AI）是一个很大的领域。日常聊天、写作、总结中常说的"AI"，通常指能理解和生成文字、图片、声音或代码的模型，以及围绕模型搭建的应用服务。

| 角色 | 说明 |
| --- | --- |
| **模型：能力核心** | 模型从训练数据中学习模式，收到输入后生成结果。它擅长归纳、改写、解释和提出候选方案，但**生成得流畅不等于事实一定正确**。 |
| **应用：把能力变好用** | 应用会提供对话界面、文件上传、记忆、搜索或其他功能。不同应用接入的模型、工具和数据处理方式可能不同。 |
| **人：目标与责任主体** | 人来决定目标、补充背景、检查结果和承担后果。AI 可以协助思考，但**不能替你确认现实，也不能替你承担责任**。 |

> [!TIP]
> **简单理解**：把 AI 看作一个反应很快、知识面很广，但有时会自信出错的协作者。让它帮助你推进工作，同时保留自己的判断。

## 2. AI、Web 端、Agent：不是同一类东西

这三个词经常一起出现，但它们描述的是不同层面：底层能力、使用入口、以及完成任务的工作方式。它们不是互相排斥的三个产品类别。

1. **AI / 模型能力**——负责理解输入并生成内容。它可以通过网页、手机 App、桌面软件或 API 被调用。→ *谁在提供智能能力？*
2. **Web 端 / 使用入口**——通过浏览器访问的网站或在线服务。它通常负责登录、对话界面、文件交互、历史记录和功能设置。→ *我从哪里使用？*
3. **Agent / 任务执行方式**——围绕目标拆解步骤，按需调用模型、搜索、代码或其他工具，再根据结果继续推进任务。→ *它怎样一步步做事？*

```text
你提出目标  →  Web 应用 / Agent  →  模型与工具
说明需求与边界    接收任务、调用功能    生成、检索、执行
```

结果返回后**仍要由你检查**；是否能联网、读文件或执行操作，取决于具体产品的功能与授权。

| 概念 | 它是什么 | 常见例子 | 需要留意 |
| --- | --- | --- | --- |
| **AI / 模型** | 理解和生成内容的能力核心 | 解释概念、整理文字、生成代码草稿 | 可能遗漏背景、编造细节或算错 |
| **Web 端** | 你访问它的入口 | 浏览器里的对话框、在线文档助手 | 会记录历史，上传的内容可能被用于服务改进 |
| **Agent** | 会自己动手的执行者 | 能读文件、跑命令、调工具的编程助手 | 权限越大风险越大，**一定要先划边界** |

> [!NOTE]
> **关系举例**：你可以在 Web 端和普通 AI 对话；某个 Web 产品也可能提供 Agent 功能。Agent 通常会用到 AI 模型，但**"用了 AI"不代表它就是 Agent**。

## 3. 什么时候用普通对话，什么时候用 Agent？

| 普通 AI 对话更合适 | Agent 更合适 |
| --- | --- |
| 解释知识点、头脑风暴、润色文字 | 任务需要多个步骤，且步骤之间有依赖 |
| 任务边界清楚，一两轮交流就能完成 | 需要使用工具，如搜索资料、分析文件、运行代码 |
| 你希望自己掌控每一步，只把 AI 当参谋 | 你能明确说明允许它做什么、哪些操作必须先问你 |

> [!WARNING]
> **别为了"更自动"就选 Agent**：如果任务简单，普通对话更直接；如果涉及**删除、覆盖、发送、发布、购买或改动线上系统**，先缩小授权范围，并要求执行前确认。

## 4. 怎样提问更有效

把要求写成"可执行的说明"：交代背景、给定材料、划清约束、指明输出形式，并约定如何核验。

```text
背景：谁会使用结果？当前情况是什么？
材料：请基于下面提供的内容，不要补充缺失信息。
约束：语气 / 长度 / 技术范围 / 不能做的事。
输出：请按什么结构给我结果？
核验：把关键假设和不确定之处单独列出。
```

**从模糊要求改成可执行要求**：

| 比较模糊 | 更清楚的说法 | 为什么更好 |
| --- | --- | --- |
| 讲讲 Agent | 面向第一次接触 AI 的同学，用 3 个生活化例子解释 Agent，并说明它和普通聊天的差别。 | 补充受众、范围和期望形式 |
| 帮我改代码。 | 先解释这段代码的行为，再指出最可能的 bug；未经我同意不要改文件。 | 明确先诊断，并设定行动边界 |
| 查一下这个结论。 | 请找可靠来源核对这个结论，给出出处、发布日期，并区分来源事实和你的推断。 | 明确证据要求和表达方式 |

## 5. 一个稳妥的 AI 使用工作流

1. **先自己定义问题**：用一句话写出目标，以及怎样算完成。
2. **给必要背景**：提供相关材料、受众、已有尝试和限制条件。
3. **让 AI 先给草案**：复杂任务先要计划或提纲，不急着一次生成最终稿。
4. **分轮修改**：指出哪一部分不合适，给具体反馈，逐步收敛。
5. **核对关键内容**：事实看来源，代码要运行，计算要复算，结论要看适用条件。
6. **由自己决定是否采用**：把 AI 输出当作候选方案，而不是自动生效的答案。

> [!TIP]
> **学习时特别有用**：可以让 AI 先给提示、拆解思路或出练习题，再由自己完成；最后请它指出错误并解释原因。**这样比直接索要最终答案更能留下自己的理解。**

## 6. Agent 会行动，所以要管理权限和影响

普通对话通常只返回文字；Agent 可能进一步**读取文件、运行命令、编辑内容或调用外部服务**。具体能力取决于产品和被授予的权限，不能只凭"Agent"这个名字判断。所以给出任务前，先把边界划清楚：

**建议在指令里写明的"允许 / 禁止"清单**

- 允许：读取本目录文件、运行测试与构建、修改 `src/` 下的源码。
- 禁止：删除文件、`git push`、修改 `.env` / 密钥文件、访问工作区以外的目录、联网下载并执行未知脚本。
- 必须先问我：安装依赖、改动数据库、批量重命名、涉及线上配置的操作。

**执行前的四个准备**

1. **先提交代码**（`git commit`），保证随时能回退。
2. **确认工作区范围**，一个项目一个目录，别把整个盘交给它。
3. **重要数据先备份**，尤其是没有版本管理的文档、数据文件。
4. **看不懂的命令不要批准**——先让它解释这条命令在做什么。

**执行后的检查**

- 看它到底改了哪些文件（`git diff` / `git status`），不要只看它的总结。
- 关键产物自己复现一遍：编译一次、跑一次测试、打开文件确认内容。

## 7. 正确使用 AI

**该做的**

- **把它当协作者，不是答案机**：让它帮你梳理思路、找盲点、做重复劳动。
- **用 AI 学，而不是用 AI 交差**：让它出题考你、解释错因，比直接抄答案有用得多。
- **自己先写一版初稿**，再让它补充和挑错——你对内容的判断力，才是 AI 帮你的前提。
- **保护隐私和涉密信息**：学号、身份证、未公开的实验数据、导师的课题材料，不要往公开的 AI 里贴。

**不该做的**

- ❌ 把 AI 生成的内容**不加核验**直接交作业、写进论文（学术诚信问题，查重和事实错误都躲不过）。
- ❌ 让 AI 替你**做你自己不懂的关键决策**（电路选型、器件参数、安全相关的操作）。
- ❌ 全盘接受它给的代码就上机器跑——**尤其是涉及电源、电机、高压的部分**。
- ❌ 把不会的题直接扔给 AI 抄答案——短期省事，长期能力退化。
- ❌ 把 API Key、密码、Token 贴进对话。

> [!IMPORTANT]
> **底线**：AI 可以帮你更快地到达"你本来能到达的地方"，但它**不能替你建立能力**。你可以让它解释、陪你练、帮你查漏，但**最终的理解和判断必须是你自己的**。

## 8. 快速自检

交付任何 AI 相关成果之前，问自己这几个问题：

**内容层面**

- [ ] 目标写清楚了吗？我知道"怎样算完成"吗？
- [ ] 关键结论有来源吗？数字、日期、引用核对过吗？
- [ ] 有没有它编出来的、我无法确认的内容？

**代码层面**

- [ ] 代码真的跑起来了吗？不是"看起来应该能跑"？
- [ ] 我逐行看懂它改了什么吗？（`git diff` 看过没有）
- [ ] 边界情况（空输入、超长输入、异常）考虑了吗？

**安全层面**

- [ ] 有没有把不该外传的材料贴进去？
- [ ] 有没有把密钥、密码留在代码或截图里？
- [ ] Agent 的操作权限，我划清了吗？

**诚信层面**

- [ ] 这份成果，我能讲清楚自己做了什么吗？
- [ ] 引用和致谢做了吗？有没有把别人的东西当成自己的？

---

## 结语

赛博扫盲这部分看起来很"基础"，但它决定了你后面折腾一切东西的速度——**文件管得住、问题问得清、软件卸得干净**，这三件事做顺了，你会发现别人卡半天的环境问题，你十分钟就过去了。

AI 这部分则更像是"把工具用顺手"：先用起来（DeepSeek 网页版），再把它接进你的工作流（API + VSCode 插件 + DSH），最后建立起自己的判断标准。

> **AI 是杠杆，不是替身。你懂的东西越多，它能帮你撬动的越多。**

有问题欢迎在群里问，或者直接找我讨论。

---

**说明**：本文的“赛博扫盲”与“AI 使用入门”两部分，在一份公开分享视频（B站 BV1Cye26tEJy）的基础上**整理、改写与补充**而成，并非原文转载；准备篇、AI 工具的具体操作、本机配置与全部经验总结由作者撰写。文中提及的第三方软件、服务与商标，版权归各自权利人所有。

