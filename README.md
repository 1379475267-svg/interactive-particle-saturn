# Interactive Particle Saturn

Live demo: https://1379475267-svg.github.io/interactive-particle-saturn/

English | 中文

## English

Interactive Particle Saturn is a browser-based Three.js artwork that reimagines Saturn as a dense particle field with orbital motion, brightness scaling, and a controlled chaos burst near the camera.

### Highlights

- Dense particle core and layered particle rings
- Kepler-inspired orbital motion for ring particles
- Brightness that grows with scale
- Chaotic burst behavior when the planet expands toward the viewer
- Mouse wheel and pointer drag interaction
- Fullscreen presentation mode
- Designed for GitHub Pages deployment

### Controls

- Mouse wheel: expand or contract Saturn
- Vertical drag: change energy and apparent scale
- Horizontal drag: change viewing angle
- Fullscreen button: switch to presentation mode

### Tech Notes

- Built with Three.js
- Ring particles use elliptical orbital parameters with radius-dependent angular velocity
- Near the expansion limit, the system blends in random perturbation and outward burst offsets
- The scene prioritizes visual richness over optimization

### Local Run

Serve the project over HTTP instead of opening it with `file://`.

```powershell
cd C:\Users\Mechrevo\Desktop\interactive-particle-saturn
py -3 -m http.server 8000
```

Then open `http://localhost:8000`.

## 中文

Interactive Particle Saturn 是一个基于 Three.js 的浏览器交互作品。它将土星重新表达为高密度粒子场，并结合环轨运动、尺度驱动亮度变化，以及靠近镜头时的混沌爆散状态。

### 项目特点

- 由高密度粒子构成的核心与多层粒子环
- 参考开普勒直觉的环轨运动
- 随尺度变化的亮度响应
- 接近镜头时出现高频混沌与爆散效果
- 支持鼠标滚轮与拖拽交互
- 支持全屏展示模式
- 适合部署到 GitHub Pages

### 交互方式

- 鼠标滚轮：控制土星放大或收缩
- 垂直拖拽：改变能量感与视觉尺度
- 水平拖拽：改变观察角度
- 全屏按钮：切换演示模式

### 技术说明

- 使用 Three.js 构建
- 环粒子基于椭圆轨道参数和随半径变化的角速度近似更新
- 当尺度接近极限时，系统逐步叠加随机扰动和向外爆散偏移
- 当前版本优先追求画面表现，而非性能优化

### 本地运行

请通过本地 HTTP 服务打开项目，不要直接使用 `file://`。

```powershell
cd C:\Users\Mechrevo\Desktop\interactive-particle-saturn
py -3 -m http.server 8000
```

然后访问 `http://localhost:8000`。
