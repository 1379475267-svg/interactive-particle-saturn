# Interactive Particle Saturn

Live demo: https://1379475267-svg.github.io/interactive-particle-saturn/

## ✨ Overview

Interactive Particle Saturn is a browser-based Three.js artwork that treats Saturn as a living particle field instead of a fixed model. As you push the interaction harder, the scene becomes brighter, less stable, and eventually collapses into a deliberate chaos burst near the camera.

这是一个基于 Three.js 的浏览器交互作品。它把土星重新表达为一个“活着的”粒子场，而不是静态模型。随着交互强度提升，场景会逐渐变亮、失稳，并在靠近镜头时进入有意设计的混沌爆散状态。

## 🌌 Demo

- GitHub Pages: https://1379475267-svg.github.io/interactive-particle-saturn/

## 🎮 Interaction

- `Mouse wheel` / 鼠标滚轮: expand or contract Saturn / 控制土星放大或收缩
- `Drag vertically` / 垂直拖拽: change energy and apparent scale / 改变能量感与视觉尺度
- `Drag horizontally` / 水平拖拽: change viewing angle / 改变观察角度
- `Double-click` or `Space` / 双击或空格: trigger an energy burst / 触发一次能量爆发
- `I` key / `Info` button: open or close the info panel / 打开或关闭说明层
- `Fullscreen` / 全屏按钮: switch to presentation mode / 切换演示模式

## 🚀 Highlights

- Dense particle core plus layered orbital rings
- Kepler-inspired angular motion for ring particles
- Brightness response tied to scale
- High-frequency burst state near the camera
- Pointer-driven parallax, lighting response, and energy pulse
- Minimal overlay UI for both desktop and mobile viewing

### 中文亮点

- 高密度粒子核心与多层轨道粒子环
- 参考开普勒直觉的环轨速度变化
- 尺度驱动的亮度响应
- 靠近镜头时的高频混沌爆散效果
- 基于指针的视差、光照反馈与能量脉冲
- 面向桌面与手机统一优化的极简说明层

## 🛠 Tech Notes

- Built with `Three.js`
- Ring particles use elliptical orbital parameters with radius-dependent angular velocity
- Chaos is blended in with random perturbation and outward burst offsets
- The scene is intentionally optimized for visual impact over raw performance

### 中文技术说明

- 使用 `Three.js` 构建
- 环粒子基于椭圆轨道参数和随半径变化的角速度近似更新
- 混沌状态通过随机扰动与向外爆散偏移逐步叠加
- 当前版本优先追求画面表现，而不是极致性能优化

## 📦 Run Locally

Serve the project over HTTP instead of opening it via `file://`.

```powershell
cd C:\Users\Mechrevo\Desktop\interactive-particle-saturn
py -3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### 中文

请通过本地 HTTP 服务运行项目，不要直接使用 `file://` 打开。

## 📱 Notes

- The page now uses a single `Info` panel instead of multiple fixed boxes
- Mobile keeps the canvas much cleaner than before
- Desktop still gives the strongest visual depth and interaction feel

## 🪐 Why This Project

This piece started as an interaction experiment around gesture-driven particles, then evolved into a cleaner public demo focused on motion, instability, and atmosphere.

这个项目最初源于一个围绕粒子交互的实验，后来逐步演变成一个更适合公开展示的网页作品，重点放在运动、失稳和空间氛围上。
