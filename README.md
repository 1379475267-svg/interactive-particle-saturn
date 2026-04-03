# Interactive Particle Saturn

An interactive Three.js artwork that turns Saturn into a cinematic particle field with orbital motion, burst energy, dust haze, shockwaves, and responsive lighting.

一个基于 Three.js 的交互式网页作品：将土星表现为具有轨道运动、能量爆发、尘埃雾环、冲击波与动态光照的电影感粒子场。

## Live Demo

- GitHub Pages: https://1379475267-svg.github.io/interactive-particle-saturn/

## Showcase

- Dense particle core with layered orbital rings
- Kepler-inspired orbital motion and radius-dependent angular speed
- Brightness growth tied to scale expansion
- Chaos burst near the camera
- Ring trail rendering for stronger motion feel
- Dust haze ring for richer spatial depth
- Shockwave pulse expanding across the ring plane
- Pointer-driven parallax and light response
- Minimal `Info` overlay for both desktop and mobile

### 中文亮点

- 高密度粒子核心与多层轨道环
- 参考开普勒直觉的轨道运动与速度变化
- 随尺度增长而增强的亮度表现
- 靠近镜头时的混沌爆发效果
- 用于增强动态感的轨道拖尾
- 提升空间层次的尘埃雾环
- 沿环面扩散的冲击波脉冲
- 基于指针的视差与光照反馈
- 同时适配桌面端与移动端的极简说明层

## Interaction

- `Mouse wheel`: scale Saturn in or out
- `Drag`: rotate the view around Saturn
- `Double-click`: trigger an energy burst
- `Space`: trigger an energy burst
- `I`: open or close the info panel
- `Fullscreen`: switch to presentation mode

### 中文交互

- `鼠标滚轮`：控制土星放大或缩小
- `按住拖拽`：旋转观察视角
- `双击`：触发一次能量爆发
- `空格`：触发一次能量爆发
- `I` 键：打开或关闭说明层
- `全屏按钮`：切换展示模式

## Visual Features

### 1. Orbital System

The ring particles use elliptical orbital parameters and time-based angular motion so the ring does not feel like a flat spinning decal.

环粒子使用椭圆轨道参数与时间驱动的角运动，因此不会像一张简单旋转贴图，而更接近真实轨道群。

### 2. Cinematic Burst

When energy is triggered, the scene pushes scale, exposure, light intensity, color temperature, and orbital disorder at the same time.

当能量爆发被触发时，场景会同时推动尺度、曝光、光照强度、色温偏移与轨道失稳，形成更强的电影镜头感。

### 3. Motion Layers

The visual stack is built from multiple motion layers:

- Main ring particles
- Ring trail particles
- Dust haze ring
- Core particle sphere
- Shockwave pulse

视觉层次由多个运动层共同构成：

- 主环粒子
- 环轨拖尾粒子
- 尘埃雾环
- 核心粒子球
- 冲击波脉冲

## Technical Notes

- Built with `Three.js`
- Uses custom particle shaders for the core and ring systems
- Uses additive blending for glow-heavy rendering
- Uses damped interaction targets to keep camera and object movement stable
- Optimized for visual richness rather than strict performance constraints

### 中文技术说明

- 使用 `Three.js` 构建
- 核心与环轨采用自定义粒子着色器
- 通过加色混合实现更强的发光质感
- 使用缓动目标值来保持视角与物体运动稳定
- 当前版本优先追求画面表现，而不是极限性能优化

## Project Structure

```text
interactive-particle-saturn/
├─ index.html
├─ style.css
├─ main.js
└─ README.md
```

## Run Locally

Serve the project over HTTP instead of opening it via `file://`.

```powershell
cd C:\Users\Mechrevo\Desktop\interactive-particle-saturn
py -3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### 中文运行方式

请通过本地 HTTP 服务运行项目，不要直接使用 `file://` 打开。

## Best Viewing Experience

- Desktop gives the strongest visual depth and interaction precision
- Mobile is cleaner than before and keeps the scene more visible
- Fullscreen mode is recommended for presentation

### 中文建议

- 桌面端可以获得更强的空间层次与交互精度
- 移动端目前已经尽量减少说明层遮挡
- 建议使用全屏模式进行展示

## Why This Project

This project started as an interaction experiment and gradually evolved into a polished public demo focused on motion, instability, atmosphere, and spectacle.

这个项目最初源于一次交互实验，随后逐步演变成一个面向公开展示的网页作品，重点放在运动感、失稳感、空间氛围与视觉冲击力上。
