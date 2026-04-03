# 🪐 Interactive Particle Saturn

> 🎬 A cinematic interactive particle system built with Three.js  
> 用粒子系统重新演绎一个“有生命感”的土星

An interactive Three.js artwork that transforms Saturn into a cinematic particle field with orbital motion, energy bursts, dust haze, shockwaves, and responsive lighting.

这是一个基于 Three.js 的交互式网页作品，将土星表现为一个具有轨道运动、能量爆发、尘埃雾环、冲击波与动态光照的粒子系统。

---

## 🌍 Live Demo

👉 https://1379475267-svg.github.io/interactive-particle-saturn/

---

## ✨ Highlights

- 🌌 Dense particle core with layered orbital rings  
  高密度粒子核心与多层轨道环结构  

- 🪐 Kepler-inspired orbital motion & radius-dependent speed  
  参考开普勒直觉的轨道运动与速度变化  

- 💡 Brightness growth tied to scale expansion  
  随尺度变化动态增强的亮度表现  

- 💥 Chaos burst near the camera  
  靠近镜头时的混沌爆发效果  

- 🌫 Dust haze ring for spatial depth  
  用于增强空间层次的尘埃雾环  

- 🌊 Shockwave pulse across the ring plane  
  沿环面扩散的冲击波脉冲  

- 🖱 Pointer-driven parallax & lighting response  
  基于指针的视差与光照反馈  

- 📱 Minimal overlay for both desktop & mobile  
  同时适配桌面与移动端的极简说明层  

---

## 🎮 Interaction

| Action | Effect |
|------|--------|
| 🖱 Mouse wheel | Scale Saturn in / out |
| 🖐 Drag | Rotate the view |
| 💥 Double-click / Space | Trigger energy burst |
| ℹ `I` key | Toggle info panel |
| 🖥 Fullscreen | Enter presentation mode |

---

## 🎬 Visual System

### 🪐 Orbital System

Ring particles follow elliptical orbital parameters and time-based angular motion, avoiding the look of a flat rotating texture.

环粒子使用椭圆轨道参数与时间驱动角运动，使整体更接近真实轨道群，而不是简单的旋转贴图。

---

### 💥 Cinematic Burst

When energy is triggered, the system simultaneously pushes:

- Scale  
- Exposure  
- Light intensity  
- Color temperature  
- Orbital stability  

从而形成更强烈的电影镜头感与视觉冲击。

---

### 🌌 Motion Layers

The visual stack is composed of multiple motion layers:

- Main ring particles  
- Ring trail particles  
- Dust haze ring  
- Core particle sphere  
- Shockwave pulse  

视觉效果由多个运动层叠加构成：

- 主环粒子  
- 轨道拖尾粒子  
- 尘埃雾环  
- 核心粒子球  
- 冲击波  

---

## 🛠 Tech Stack

- ⚡ Three.js (WebGL rendering)  
- 🎨 Custom particle shaders  
- ✨ Additive blending for glow effects  
- 🎯 Damped interaction system  
- 🧠 Physically-inspired orbital approximation  

---

## 📦 Project Structure

```text
interactive-particle-saturn/
├─ index.html
├─ style.css
├─ main.js
└─ README.md