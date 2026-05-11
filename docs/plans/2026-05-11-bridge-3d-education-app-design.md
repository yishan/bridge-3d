# Bridge 3D Structure Education App - Product Plan

## 1. Product Direction

This app is a teaching-oriented 3D bridge structure viewer. Its first goal is not engineering calculation or BIM management, but helping beginners understand what a bridge is made of, where each component sits, what each component does, and how loads are transferred through the structure.

The first version should let a user understand the basic composition and force transfer path of a beam bridge within 3 to 5 minutes.

Primary audience:

- Students learning bridge engineering basics
- Teachers explaining bridge structure composition
- Public science exhibits or engineering outreach demos
- Junior engineering staff who need a fast visual overview

Recommended first bridge type:

- Beam bridge, preferably a simple-span or continuous girder bridge

Reason:

- The component hierarchy is clear.
- The load path is easy to explain.
- The model complexity is manageable for an MVP.

## 2. MVP Scope

The MVP should be a usable interactive viewer, not a marketing landing page. The first screen should open directly into the bridge viewer.

Core MVP features:

- Full bridge 3D viewing
- Component navigation by structural category
- Component click and highlight
- Right-side educational detail panel
- Label display toggle
- Layered viewing by structure type
- Basic 2D / 3D mode switch
- Load path teaching animation
- Quiz mode entry point

Features to postpone:

- Login and user accounts
- Learning progress tracking
- BIM-level parameter management
- Engineering calculation
- Multi-bridge-type switching
- Advanced section cutting
- Backend content management
- Real-time collaboration

## 3. Information Architecture

Top navigation:

- Overall View
- Superstructure
- Substructure
- Foundation
- Knowledge Cards
- Quiz Mode
- Help
- Settings
- Fullscreen

Main layout:

- Left panel: component navigation
- Center canvas: 3D / 2D bridge viewer
- Right panel: selected component details
- Bottom toolbar: teaching and view controls
- Bottom status bar: current view and selected component

Recommended structural categories:

### Superstructure

- Guardrail
- Deck slab
- Main girder
- Cross beam
- Bearing

### Substructure

- Pier
- Abutment

### Foundation

- Pile cap
- Pile foundation
- Soil / ground layer

The first version can use 8 to 10 components. This is enough to create a complete learning loop without making the 3D interaction too heavy.

## 4. Page And View Planning

### 4.1 Overall View

Purpose:

- Give users a complete understanding of the whole bridge.

Main content:

- Full bridge model
- Component labels
- Component highlight on hover and click
- Current selected component detail panel

Key interactions:

- Rotate, pan, zoom
- Reset camera
- Select component by clicking the model
- Select component from the left list
- Toggle labels
- Switch between 2D and 3D
- Enter fullscreen

### 4.2 Superstructure View

Purpose:

- Explain the bridge elements that directly support the deck and traffic loads.

Highlighted components:

- Guardrail
- Deck slab
- Main girder
- Cross beam
- Bearing

Interaction behavior:

- Superstructure remains solid and highlighted.
- Substructure and foundation become transparent.
- Users can isolate one component at a time.

Teaching focus:

- Vehicle and pedestrian loads first act on the deck.
- The deck transfers loads to girders and cross beams.
- Bearings transfer loads into lower structures.

### 4.3 Substructure View

Purpose:

- Explain how the bridge is supported above ground.

Highlighted components:

- Pier
- Abutment
- Bearing

Interaction behavior:

- Piers and abutments are highlighted.
- The bridge deck can remain semi-transparent.
- Users can compare pier and abutment functions.

Teaching focus:

- Piers support spans in the middle.
- Abutments support bridge ends and connect the bridge to the road embankment.
- Bearings sit between upper and lower structures.

### 4.4 Foundation View

Purpose:

- Explain how bridge loads enter the ground.

Highlighted components:

- Pile cap
- Pile foundation
- Soil / ground layer

Interaction behavior:

- Soil can be shown as transparent or sectioned.
- Underground piles should be visible.
- Load path animation should continue down to the ground.

Teaching focus:

- Foundation components transfer bridge loads into stable ground.
- Pile foundations are used when shallow soil is not strong enough.

### 4.5 Knowledge Cards

Purpose:

- Provide a structured learning library for all bridge components.

Each card should include:

- Component name
- Category
- Simple definition
- Location
- Main function
- Common materials
- Related components
- Common problems or damage examples, optional in MVP

Card behavior:

- Clicking a card selects the related component in the 3D model.
- Cards can be filtered by structure category.
- Cards can be opened from the right-side detail panel.

### 4.6 Quiz Mode

Purpose:

- Turn passive viewing into active learning.

MVP quiz types:

- Identify component: "Click the main girder."
- Match function: "Which component transfers loads to the pier?"
- Category recognition: "Which of these belongs to the foundation?"

Interaction behavior:

- Labels can be hidden during the quiz.
- Correct selection briefly highlights green.
- Incorrect selection briefly highlights red and shows a short explanation.
- The right panel can show progress and explanation.

## 5. Key Interaction Design

### 5.1 Component Selection

Selection sources:

- 3D model click
- Numbered label click
- Left navigation click
- Knowledge card click

Selection result:

- Selected component becomes blue or accent-colored.
- Related components can receive a softer secondary highlight.
- Right detail panel updates.
- Bottom status bar updates.
- Camera can optionally focus on the component.

### 5.2 Hover Preview

Hover behavior:

- Component outline appears.
- Label becomes more prominent.
- Cursor changes to indicate clickability.

The hover state should not open the detail panel. It should only preview the component.

### 5.3 Layered Viewing

Layer modes:

- Show all
- Superstructure only
- Substructure only
- Foundation only
- Custom isolated component

Recommended visual treatment:

- Active layer: solid and saturated
- Inactive layers: 15% to 30% opacity
- Hidden underground components can become visible when foundation mode is active

### 5.4 Structure Decomposition

The decomposition mode should separate bridge components slightly in space.

MVP behavior:

- Superstructure moves upward slightly.
- Substructure remains centered.
- Foundation moves downward slightly.
- Labels stay attached to components.

This should be a teaching tool, not an exaggerated animation.

### 5.5 Load Path Animation

Recommended sequence:

1. Vehicle or surface load appears on deck slab.
2. Deck slab highlights.
3. Main girder and cross beam highlight.
4. Bearings highlight.
5. Pier or abutment highlights.
6. Pile cap and pile foundation highlight.
7. Ground layer highlights.

Visual style:

- Use moving lines, glowing arrows, or sequential highlight.
- Keep the animation slow enough for explanation.
- Allow pause, replay, and step-by-step mode.

Teaching text should be short and tied to the current highlighted step.

### 5.6 2D / 3D Switch

3D mode:

- Main interactive mode.
- Used for spatial understanding.

2D mode:

- Shows elevation or section diagrams.
- Used to explain names, hierarchy, and force path.

MVP approach:

- 2D can start as a simplified SVG or canvas diagram.
- It does not need to derive automatically from the 3D model in version one.

## 6. Component Detail Panel

The right detail panel should stay consistent for every component.

Recommended fields:

- Name
- Number
- Category
- Short explanation
- Function
- Location
- Common materials
- Related components
- View knowledge card button

Example: Main Girder

- Name: Main Girder
- Category: Superstructure
- Explanation: The main girder is the primary load-bearing component of a beam bridge.
- Function: It receives loads from the deck and transfers them through bearings to the substructure.
- Location: Below the deck slab, arranged along the bridge span direction.
- Common materials: Steel, prestressed concrete, reinforced concrete.
- Related components: Deck slab, cross beam, bearing, pier, abutment.

Writing style:

- Short
- Concrete
- Beginner-friendly
- Avoid dense engineering jargon in the first layer

## 7. Data Model Suggestion

Use a structured component data file, such as `components.json` or a TypeScript object.

Suggested fields:

```json
{
  "id": "main-girder",
  "number": 3,
  "name": "Main Girder",
  "nameZh": "主梁",
  "category": "superstructure",
  "modelNodeNames": ["MainGirder_Left", "MainGirder_Right"],
  "shortDescription": "The main girder is the primary load-bearing component of a beam bridge.",
  "function": [
    "Receives loads from the deck slab",
    "Transfers loads to bearings and lower structures"
  ],
  "location": "Below the deck slab, arranged along the bridge span direction.",
  "materials": ["Steel", "Prestressed concrete", "Reinforced concrete"],
  "relatedComponentIds": ["deck-slab", "cross-beam", "bearing"],
  "quizPrompts": [
    "Click the component that mainly carries span loads."
  ]
}
```

Important implementation note:

- The `modelNodeNames` field should match mesh names inside the 3D model.
- This allows the UI data and 3D model to stay connected without hard-coding every interaction.

## 8. Suggested Technical Approach

Frontend:

- React or Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui for interface primitives

3D:

- Three.js
- React Three Fiber
- Drei helpers for camera controls, labels, and loaders
- GLB / glTF model format

State management:

- Zustand for selected component, active view, labels, layer mode, and quiz state

Model pipeline:

- Create or obtain a simplified bridge model
- Export as `.glb`
- Ensure mesh names match component IDs
- Keep each major component as a separate mesh or mesh group

Recommended runtime state:

```ts
type ViewerState = {
  selectedComponentId: string | null;
  activeView: "overall" | "superstructure" | "substructure" | "foundation";
  mode: "3d" | "2d";
  labelsVisible: boolean;
  decompositionEnabled: boolean;
  loadPathStep: number | null;
  quizActive: boolean;
};
```

## 9. Visual Design Direction

The interface should feel clear, modern, and educational.

Recommended style:

- White or light gray canvas background
- Blue as the main interaction color
- Muted grays for inactive components
- Subtle grid background for technical clarity
- Clean icon buttons
- Compact but readable side panels

Avoid:

- Overly decorative landing page treatment
- Dense engineering dashboards in the MVP
- Heavy gradients that distract from the model
- Too many colors competing with component highlights

Suggested category colors:

- Superstructure: blue
- Substructure: green
- Foundation: orange

These colors should help learning, not dominate the whole UI.

## 10. MVP Development Phases

### Phase 1: Static Interactive Viewer

Goal:

- Build the core app shell and component selection loop.

Deliverables:

- Main layout
- 3D model loading
- Camera controls
- Component data file
- Left component navigation
- Right detail panel
- Component click highlight
- Label toggle

### Phase 2: Teaching Views

Goal:

- Add structural learning modes.

Deliverables:

- Overall view
- Superstructure view
- Substructure view
- Foundation view
- Layer transparency
- Camera focus presets
- 2D diagram placeholder

### Phase 3: Guided Learning

Goal:

- Explain structure behavior, not just names.

Deliverables:

- Load path animation
- Step-by-step explanation text
- Structure decomposition mode
- Knowledge cards page

### Phase 4: Quiz Mode

Goal:

- Make learning active and measurable.

Deliverables:

- Identify-component quiz
- Correct / incorrect feedback
- Score and progress
- Review explanation after each question

## 11. Success Criteria

The MVP is successful if:

- A first-time user can identify major bridge components without instruction.
- Clicking a component clearly explains what it is and what it does.
- Layer modes make the difference between superstructure, substructure, and foundation obvious.
- Load path animation makes force transfer understandable.
- The interface remains smooth and uncluttered on a laptop screen.
- The same content can later support mobile or tablet interaction.

## 12. Open Decisions

Decisions to make before implementation:

- Whether the first model is hand-built, procedurally generated, or imported from a 3D tool.
- Whether Chinese-only content is enough for MVP, or bilingual content is needed.
- Whether 2D diagrams are manually drawn or generated from the model.
- Whether quiz mode should be included in the first build or treated as a second milestone.
- Whether voice narration is required in MVP or only prepared as a future feature.

## 13. Recommended Next Step

Create the first Web prototype with the following minimum route:

- One full-screen viewer page
- A simplified bridge model
- 8 to 10 component records
- Click-to-highlight interaction
- Right-side explanation panel
- Layer mode switch

Once this is working, the product will already communicate the core idea clearly. More advanced teaching interactions can then be added without redesigning the foundation.

## 14. Reference Image Alignment

The provided reference image is a strong match for the recommended MVP. The Web version should preserve its basic layout logic:

- Top: global module navigation
- Left: component hierarchy and teaching tips
- Center: 3D bridge scene with labels
- Right: selected component detail
- Bottom center: teaching controls
- Bottom edge: current context and version/status

Recommended Chinese interface title:

- 桥梁结构交互式导览

Recommended top navigation:

- 整体视图
- 上部结构
- 下部结构
- 基础结构
- 知识卡片
- 测验模式
- 帮助
- 设置
- 全屏

Top navigation behavior:

- The current module uses a filled blue tab.
- Other modules remain flat but visible.
- Fullscreen, help, and settings stay on the right as utility actions.

Left panel title:

- 构件导航

Left panel groups:

- 上部结构: 护栏, 桥面板, 主梁, 横梁, 支座
- 下部结构: 桥墩, 桥台
- 基础结构: 承台, 桩基, 地基/土层

Left panel behavior:

- The selected row uses a blue background.
- Each component has a number badge matching the 3D scene label.
- Each group can collapse and expand.
- A filter icon can later support searching by component name or category.

Center viewer behavior:

- The bridge model should be shown in a three-quarter perspective similar to the reference.
- Selected components should use a saturated blue overlay.
- Non-selected components remain physically readable instead of disappearing.
- Number labels should use blue circular badges and thin leader lines.
- The background can use a faint grid to support an engineering learning atmosphere.

Right panel title:

- 构件详情

Right panel behavior:

- The selected component number appears in a large circular badge.
- The component name is the dominant heading.
- The explanation should be short enough to scan in 10 seconds.
- A small diagram area can show a section/elevation illustration of the selected component.
- A table presents structured knowledge: 作用, 位置, 常见材料, 关联构件.
- A primary button opens the full knowledge card.

Bottom toolbar actions:

- 显示标签
- 分层查看
- 结构拆解
- 受力路径
- 语音讲解
- 测验模式

Bottom status bar:

- 当前视图: 整体视图
- 已选择构件: 主梁
- 版本: v1.0.0

## 15. Chinese Content Draft

The first MVP can use the following Chinese copy directly. Keep descriptions beginner-friendly and avoid heavy engineering terminology.

### 15.1 护栏

- 分类: 上部结构
- 简介: 护栏位于桥面两侧，用于保护车辆和行人，降低越界坠落风险。
- 作用: 提供安全防护, 引导交通边界, 辅助划分桥面空间。
- 位置: 桥面板两侧，沿桥梁纵向连续布置。
- 常见材料: 钢材, 混凝土, 金属栏杆组合件。
- 关联构件: 桥面板, 主梁。

### 15.2 桥面板

- 分类: 上部结构
- 简介: 桥面板是车辆和行人直接通过的承载面。
- 作用: 承受桥面荷载, 将荷载传递给主梁和横梁, 提供平整通行表面。
- 位置: 桥梁最上部，铺装层和栏杆下方。
- 常见材料: 钢筋混凝土, 预应力混凝土, 钢桥面板。
- 关联构件: 护栏, 主梁, 横梁。

### 15.3 主梁

- 分类: 上部结构
- 简介: 主梁是梁桥中承担主要荷载的核心受力构件。
- 作用: 承受来自桥面板的荷载, 沿桥跨方向传力, 将荷载传递至支座和下部结构。
- 位置: 桥面板下方，沿桥梁纵向布置。
- 常见材料: 钢材, 预应力混凝土, 钢筋混凝土。
- 关联构件: 桥面板, 横梁, 支座, 桥墩, 桥台。

### 15.4 横梁

- 分类: 上部结构
- 简介: 横梁连接多片主梁，帮助桥梁横向整体受力。
- 作用: 分配横向荷载, 增强整体稳定性, 协调主梁共同工作。
- 位置: 主梁之间，通常沿桥梁横向布置。
- 常见材料: 钢材, 钢筋混凝土。
- 关联构件: 主梁, 桥面板, 支座。

### 15.5 支座

- 分类: 上部结构 / 下部结构连接构件
- 简介: 支座位于上部结构和下部结构之间，是荷载传递的关键节点。
- 作用: 将主梁荷载传给桥墩或桥台, 允许结构产生必要位移或转动, 减少局部应力集中。
- 位置: 主梁端部下方，桥墩或桥台顶部。
- 常见材料: 橡胶支座, 钢支座, 盆式支座。
- 关联构件: 主梁, 桥墩, 桥台。

### 15.6 桥墩

- 分类: 下部结构
- 简介: 桥墩支撑桥跨中间部分，是桥梁竖向承重的重要构件。
- 作用: 承受来自支座的荷载, 将荷载传递至承台和基础, 保持桥跨稳定。
- 位置: 桥跨之间，位于地面或水面以上。
- 常见材料: 钢筋混凝土, 预应力混凝土。
- 关联构件: 支座, 承台, 桩基。

### 15.7 桥台

- 分类: 下部结构
- 简介: 桥台位于桥梁两端，连接桥梁与路基。
- 作用: 支撑桥跨端部, 承受桥头土压力, 连接道路与桥梁结构。
- 位置: 桥梁起点和终点处。
- 常见材料: 钢筋混凝土, 片石混凝土。
- 关联构件: 主梁, 支座, 路基, 基础。

### 15.8 承台

- 分类: 基础结构
- 简介: 承台位于桥墩或桥台下方，用于汇集并分配上部荷载。
- 作用: 将桥墩荷载分配给多根桩基, 增强基础整体性。
- 位置: 桥墩底部与桩基顶部之间。
- 常见材料: 钢筋混凝土。
- 关联构件: 桥墩, 桥台, 桩基。

### 15.9 桩基

- 分类: 基础结构
- 简介: 桩基深入地下，将桥梁荷载传递到更稳定的土层或岩层。
- 作用: 提高承载能力, 控制沉降, 保证桥梁基础稳定。
- 位置: 承台下方，埋入地下。
- 常见材料: 钢筋混凝土灌注桩, 预制混凝土桩, 钢管桩。
- 关联构件: 承台, 地基/土层。

### 15.10 地基/土层

- 分类: 基础结构
- 简介: 地基是承受桥梁最终荷载的自然或处理后土体。
- 作用: 承接基础传来的荷载, 为桥梁提供整体支承条件。
- 位置: 桩基或浅基础周围及下方。
- 常见材料: 天然土层, 加固土层, 岩层。
- 关联构件: 桩基, 承台。

## 16. Visual Confirmation Prompt

Use the following prompt to generate a concept image for visual confirmation. The generated image is for design alignment only and should not be treated as the final UI implementation.

Prompt:

```text
Use case: ui-mockup
Asset type: Web application interface concept mockup
Primary request: Create a high-fidelity desktop web UI mockup for a Chinese educational 3D bridge structure interactive viewer. Match the layout logic of a technical teaching app: top blue navigation bar, left component navigation panel, central 3D bridge model viewer, right component detail panel, bottom teaching toolbar.
Scene/backdrop: Clean light technical interface with a faint grid background behind the central viewer.
Subject: A realistic but simplified 3D beam bridge cutaway model with deck, guardrail, main girder, cross beam, bearing, pier, abutment, pile cap, pile foundation, and soil layer. Selected component is the main girder, highlighted in blue.
UI text: Chinese labels. Main title "桥梁结构交互式导览". Navigation labels "整体视图", "上部结构", "下部结构", "基础结构", "知识卡片". Right panel title "构件详情", selected component "主梁". Bottom controls "显示标签", "分层查看", "结构拆解", "受力路径", "语音讲解", "测验模式".
Composition: 16:9 desktop dashboard, three-panel layout, center viewer largest, left and right panels fixed width, bottom floating toolbar. Use numbered circular labels with leader lines attached to bridge components.
Style: polished modern Chinese education software, blue and white color system, restrained shadows, clear readable hierarchy, engineering illustration quality, no marketing hero layout.
Avoid: decorative gradients, cartoon style, dark theme, unrelated city skyline, excessive text, cluttered controls, illegible tiny text, photorealistic construction site.
```
