# 智能机械臂微课平台 - 前端项目 (`web_project`)

## 🚀 项目简介

`web_project` 目录包含了本“智能机械臂微课平台”的交互式前端代码。这是一个基于 Web 的微课学习平台，旨在提供一个直观、动态的环境，帮助学生理解和学习基于大模型驱动的具身智能机械臂系统。

平台集成了 3D 仿真、思维导图、知识闪卡、PDF/PPT 嵌入等功能，通过现代 Web 技术（HTML, CSS, JavaScript）实现了丰富用户体验。

## ✨ 主要功能

-   **系统架构可视化**: 通过交互式卡片和流程图展示 AI Agent 的“大脑”、“眼睛”、“手”架构。
-   **3D 仿真模拟**: 基于 Three.js 实现的机械臂工作台模拟环境，允许用户通过输入指令来观察虚拟机械臂的抓取、移动、放置等动作，并实时显示系统日志。
-   **知识结构思维导图**: 动态生成和展开/折叠的思维导图，帮助学生梳理和理解复杂的知识体系。
-   **知识点闪卡自测**: 提供交互式问答闪卡，用于巩固学习和自我检测。
-   **文档与视频集成**: 直接嵌入项目 PDF 报告、PPT 演示文稿和微课教学视频。
-   **响应式设计**: 页面布局适应不同设备，提供良好的用户体验。

## 🛠️ 技术栈

-   **前端框架**: HTML5, CSS3, JavaScript (ES6+)
-   **UI 框架**: Bootstrap 5 (响应式布局和组件)
-   **3D 渲染**: [Three.js](https://threejs.org/) (用于机械臂仿真环境)
-   **图标**: Font Awesome
-   **字体**: Google Fonts (Space Grotesk, Source Sans 3)
-   **后端**: 本项目纯前端，通过本地 HTTP 服务器运行即可。

## 📦 文件结构

```
web_project/
├── index.html              # 平台主页，包含所有内容的结构和布局
├── style.css               # 全局样式表，定义了 UI 风格、动画和响应式规则
├── script.js               # 核心 JavaScript 逻辑，包括：
│                           # - Mind Map (思维导图) 渲染与交互
│                           # - Flashcards (知识闪卡) 渲染与逻辑
│                           # - 3D Simulation (Three.js 仿真) 初始化与交互
│                           # - Modals (弹窗) 和导航切换逻辑
├── demo.mp4                # 微课教学视频文件
├── Embodied_AI_Robotics_Project.pdf  # 项目详细文档 PDF
├── Embodied_AI_Robotics_Project.pptx # 项目演示文稿 PPTX
├── logo.png                # 平台 Logo 文件
├── 3logo20250804.png       # 备用 Logo 文件
└── models/                 # 3D 模型文件
    └── robot_arm.glb       # 机械臂的 3D 模型
```

## 🚀 运行指南

本项目是纯前端应用，可以通过任何 HTTP 服务器直接在浏览器中打开。

### 使用 Python 快速启动 (推荐)

如果您安装了 Python (3.x 版本)，可以在 `web_project` 目录下快速启动一个本地 HTTP 服务器：

```bash
# 进入 web_project 目录
cd d:\Linfeng\MyData\多媒体技术作业\实验微课平台\web_project

# 启动一个本地 HTTP 服务器 (默认端口 8000)
python3 -m http.server 8000
```

然后，在您的 Web 浏览器中访问 `http://localhost:8000` 即可。

### 直接打开 `index.html`

您也可以直接双击 `web_project/index.html` 文件在浏览器中打开。
**注意**: 由于浏览器同源策略（CORS）限制，某些功能（如加载本地 3D 模型 `robot_arm.glb` 或视频 `demo.mp4`）可能无法正常工作。推荐使用上述的本地 HTTP 服务器方式。

## 💡 使用说明

-   **导航栏**: 用于在不同学习模块（系统架构、思维导图、项目详解、微课视频、详细流程、知识闪卡、交互演示）之间切换。
-   **系统架构**: 通过点击卡片可以弹出详细的 3D 演示和描述。
-   **思维导图**: 点击节点可以展开或折叠子内容。
-   **知识闪卡**: 左右滑动切换卡片，点击卡片可翻转查看答案。
-   **交互演示**: 在 3D 模拟环境中添加方块，并在下方输入框输入指令，点击“执行”按钮可模拟机械臂的响应。
