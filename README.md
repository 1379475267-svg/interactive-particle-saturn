# 🪐 Interactive Particle Saturn

> 🎬 A cinematic, gesture-driven particle system built with Three.js
> 一个基于 Three.js 的“有生命感”的土星粒子交互作品

---

## 🌍 Live Demo

👉 https://1379475267-svg.github.io/interactive-particle-saturn/

---

## ✨ Highlights｜亮点

* 🪐 Particle-based Saturn (core + orbital rings)
  粒子构成的土星（核心 + 多层轨道环）

* 🖐️ Real-time hand gesture control
  基于摄像头的实时手势控制（张手 / 握拳）

* 🪐 Kepler-inspired orbital motion
  参考开普勒直觉的轨道运动

* 💥 Chaos burst near camera
  靠近屏幕时的混沌爆散效果

* 🌫 Multi-layer motion system
  多层粒子运动系统（核心 / 环 / 拖尾 / 尘埃）

* 🎛 Smooth cinematic transitions
  平滑过渡的电影感动态变化

---

## 🎮 Interaction｜交互方式

| Action                  | Effect                              |
| ----------------------- | ----------------------------------- |
| 🖐️ Open hand           | Expand Saturn & increase brightness |
| ✊ Close hand            | Contract Saturn & stabilize system  |
| 🖱️ Drag                | Rotate camera view                  |
| 💥 Double click / Space | Trigger chaos burst                 |
| ⛶ Fullscreen            | Enter immersive mode                |

| 操作         | 效果        |
| ---------- | --------- |
| 🖐️ 张开手    | 放大土星，提高亮度 |
| ✊ 收拢手      | 收缩系统，恢复稳定 |
| 🖱️ 拖拽     | 旋转视角      |
| 💥 双击 / 空格 | 触发能量爆发    |
| ⛶ 全屏       | 进入沉浸模式    |

---

## 🧠 How It Works｜原理说明

### 1️⃣ Gesture Detection｜手势识别

* Uses MediaPipe Hand Landmarker
* Tracks hand landmarks in real time
* Converts hand openness into a normalized value

使用 MediaPipe 手部识别模型
实时获取手部关键点
并计算“手掌张开程度”作为控制变量

---

### 2️⃣ Interaction Mapping｜交互映射

* `openRatio → scale`
* `openRatio → brightness`
* `openRatio → chaos`

手势张开程度映射为：

* 尺度变化
* 亮度变化
* 混沌强度

---

### 3️⃣ Particle System｜粒子系统

* Core: dense spherical particle cluster
* Rings: layered orbital particle bands
* Dust & trail: enhance depth and motion

由多个层次构成：

* 核心粒子球
* 多层轨道环
* 拖尾与尘埃增强空间感

---

### 4️⃣ Chaos System｜混沌系统

* Triggered near screen or by interaction
* Breaks orbital stability into controlled disorder

在接近屏幕或交互增强时触发
打破轨道秩序，形成可控的混沌状态

---

## 🧩 Tech Stack｜技术栈

* Three.js (WebGL rendering)
* MediaPipe (Hand Landmarker)
* Custom GLSL shaders
* ES Modules
* GitHub Pages

---

## ⚠️ Notes｜注意事项

* Camera permission is required
  需要开启摄像头权限

* Best experience on desktop Chrome
  推荐使用桌面端 Chrome 浏览器

* First load may take a few seconds
  首次加载需要时间（模型加载）

---

## 🔥 Future Work｜未来优化

* More gesture types
  更多手势交互

* Multi-hand interaction
  双手控制

* Audio-reactive mode
  音频驱动模式

* Better chaos choreography
  更精细的混沌演出

---

## 📄 License

MIT
