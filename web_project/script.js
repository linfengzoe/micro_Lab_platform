// --- 思维导图数据 ---
const mindMapData = {
    title: "智能机械臂垃圾分类系统",
    children: [
        {
            title: "实验目标",
            children: [
                { title: "理解六轴机械臂硬件与Agent逻辑" },
                { title: "分析VLM视觉识别与坐标转换算法" },
                { title: "Python编程实现感知-决策-执行闭环" },
                { title: "分析误差来源并构思创新应用" }
            ]
        },
        {
            title: "系统架构 (ReAct模式)",
            children: [
                { title: "大脑 (Agent)" },
                { title: "眼睛 (Perception)" },
                { title: "手 (Execution)" }
            ]
        },
        {
            title: "核心算法",
            children: [
                {
                    title: "仿射变换 (Affine Transformation)",
                    children: [
                        { title: "像素坐标转物理坐标" },
                        { title: "消除透视畸变" },
                        { title: "最小二乘法求解矩阵" }
                    ]
                }
            ]
        },
        {
            title: "多区域标定",
            children: [
                { title: "抓取区域 (Grabbing Area)" },
                { title: "放置区域 (Placement Area)" }
            ]
        },
        {
            title: "关键步骤与工具",
            children: [
                {
                    title: "核心工具 (tools.py)",
                    children: [
                        { title: "take_photo: 调用标定拍照" },
                        { title: "grab_object: 识别并执行抓取序列" },
                        { title: "move_to: 支持坐标与语义移动" }
                    ]
                },
                {
                    title: "手眼标定流程",
                    children: [
                        { title: "物理打点记录机械臂坐标" },
                        { title: "视觉采样记录像素坐标" },
                        { title: "更新config.json参数" }
                    ]
                }
            ]
        },
        {
            title: "实验分析与改进",
            children: [
                {
                    title: "常见问题",
                    children: [
                        { title: "抓取位置偏差 (标定不精/位移)" },
                        { title: "识别延迟高 (云端API限制)" },
                        { title: "Z轴高度适应差 (高度固定)" }
                    ]
                },
                {
                    title: "优化措施",
                    children: [
                        { title: "视觉伺服闭环微调" },
                        { title: "部署边缘端轻量级模型" },
                        { title: "引入RGB-D深度相机" }
                    ]
                }
            ]
        },
        {
            title: "创新应用场景",
            children: [
                { title: "实验室危险品自动化处理助手" },
                { title: "智能家庭整理收纳机器人" }
            ]
        }
    ]
};

// --- 系统架构模块逻辑 ---
const designModalContent = {
    // 三要素卡片
    'brain': {
        title: '大脑 (The Agent)',
        icon: 'fa-brain',
        color: 'text-purple',
        desc: '<strong>核心：DeepSeek LLM</strong><br>部署于 Jetson Nano 边缘计算平台。<br><br>它负责将人类的自然语言指令（如“把红色方块扔掉”）转化为结构化的逻辑步骤。它不直接操作电机，而是生成工具调用链 (Tool Chain)，例如：先拍照、再识别、最后抓取。'
    },
    'eyes': {
        title: '眼睛 (Perception)',
        icon: 'fa-eye',
        color: 'text-primary',
        desc: '<strong>核心：Qwen-VL 视觉大模型</strong><br>通过 USB 摄像头获取环境图像。<br><br>不同于传统 OpenCV 颜色识别，VLM 具备语义理解能力，能识别“鱼骨头”、“电池”等复杂物体，并返回其在图像中的像素坐标 (Bounding Box)。'
    },
    'hand': {
        title: '手 (Execution)',
        icon: 'fa-robot',
        color: 'text-success',
        desc: '<strong>核心：MyCobot 280 六轴机械臂</strong><br>执行物理动作的终端。<br><br>它接收来自 Python 脚本计算出的物理坐标 (x, y, z) 和关节角度，执行精确的逆运动学运动。末端配备气泵吸盘或夹爪进行抓取。'
    },
    // 数据流步骤
    'step_user': {
        title: '1. 用户指令 (User Command)',
        icon: 'fa-user',
        color: 'text-secondary',
        desc: '<strong>输入：</strong> 自然语言指令（语音/文本）。<br><strong>详解：</strong> 这是交互的起点。用户通过键盘或麦克风输入非结构化指令，例如“把蓝色的方块捡起来放到红色盒子里”。系统不限制词汇，而是依赖大模型的理解能力。<br><br><span class="badge bg-light text-dark border">数据流</span> 文本字符串 -> Agent.py'
    },
    'step_ai': {
        title: '2. AI 推理 (Reasoning)',
        icon: 'fa-brain',
        color: 'text-purple',
        desc: '<strong>引擎：</strong> DeepSeek-V3 / GPT-4o (ReAct Agent)<br><strong>详解：</strong> 這是“大脑”。Agent 接收文本，进行思维链 (Chain-of-Thought) 推理：<br>1. <strong>Thought:</strong> 用户想抓蓝色物体。<br>2. <strong>Action:</strong> 我不知道在哪，先调用 <code>take_photo</code> 工具看看。<br>3. <strong>Observation:</strong> 收到图片坐标。<br>4. <strong>Final Answer:</strong> 生成抓取计划。<br><br><span class="badge bg-light text-dark border">输出</span> JSON 格式的工具调用请求'
    },
    'step_vlm': {
        title: '3. 视觉感知 (Perception)',
        icon: 'fa-camera',
        color: 'text-primary',
        desc: '<strong>模型：</strong> Qwen-VL / CLIP<br><strong>详解：</strong> 這是“眼睛”。不同于传统 OpenCV 颜色阈值，VLM 是多模态大模型，能理解“被压在下面的那个”、“稍微大一点的”等语义描述。它接收图片，返回物体的边界框 (Bounding Box)。<br><br><span class="badge bg-light text-dark border">输出</span> 像素坐标列表 [[x1,y1,x2,y2], ...]'
    },
    'step_calc': {
        title: '4. 坐标计算 (Bridge)',
        icon: 'fa-calculator',
        color: 'text-warning',
        desc: '<strong>核心算法：</strong> 仿射变换 (Affine Transformation)<br><strong>详解：</strong> 这是连接虚拟与现实的桥梁。由于摄像头安装角度和镜头畸变，图像像素 (u,v) 与机械臂物理空间 (x,y) 不是线性对应的。我们通过预先标定的矩阵 <strong>M</strong>，将像素中心点映射为机械臂的底座坐标。<br><br><span class="badge bg-light text-dark border">公式</span> Robot_XY = Matrix @ Pixel_XY'
    },
    'step_act': {
        title: '5. 物理执行 (Action)',
        icon: 'fa-hand-paper',
        color: 'text-success',
        desc: '<strong>硬件：</strong> MyCobot 280 Pi<br><strong>详解：</strong> 这是“手”。底层 Python 脚本接收到目标坐标 (x,y,z) 后，进行<strong>逆运动学 (Inverse Kinematics)</strong> 解算，算出 6 个关节各自需要的旋转角度，驱动伺服电机运动。末端执行器（吸泵/夹爪）配合完成抓取。<br><br><span class="badge bg-light text-dark border">动作</span> Move -> Grip -> Lift -> Release'
    }
};

window.showDesignModal = function(type) {
    const data = designModalContent[type];
    if(!data) return;

    const overlay = document.getElementById('designModalOverlay');
    const body = document.getElementById('designModalBody');
    
    // 注入弹窗内容（含 3D 画布容器）
    body.innerHTML = `
        <div class="text-center mb-4">
            <i class="fas ${data.icon} fa-4x ${data.color} mb-3"></i>
            <h3 class="fw-bold">${data.title}</h3>
        </div>
        
        <!-- 3D 画布容器 -->
        <div id="modal-3d-canvas" style="width: 100%; height: 300px; background: #f8f9fa; border-radius: 12px; margin-bottom: 20px; overflow: hidden; position: relative;"></div>

        <p class="lead fs-6 text-secondary">${data.desc}</p>
        <div class="mt-4 text-center">
            <button class="btn btn-outline-secondary rounded-pill px-4" onclick="closeDesignModal()">关闭</button>
        </div>
    `;
    
    overlay.classList.add('active');

    // 按类型初始化 3D 场景（立即加载，无延迟）
    requestAnimationFrame(() => initModal3D(type));
};

// --- 弹窗 3D 逻辑 ---
let modalRenderer, modalScene, modalCamera, modalReqId, modalControls;

function cleanupModal3D() {
    if (modalReqId) cancelAnimationFrame(modalReqId);
    if (modalRenderer) {
        modalRenderer.dispose();
        const canvas = modalRenderer.domElement;
        if(canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
    if (modalControls) {
        modalControls.dispose();
    }
    modalScene = null;
    modalCamera = null;
    modalRenderer = null;
    modalControls = null;
}

function initModal3D(type) {
    cleanupModal3D(); // Safety clear

    const container = document.getElementById('modal-3d-canvas');
    if(!container) return;

    // --- 配色方案 ---
    const colors = {
        blue: 0x4285F4,
        red: 0xEA4335,
        yellow: 0xFBBC04,
        green: 0x34A853,
        grey: 0xF1F3F4,
        dark: 0x202124,
        white: 0xffffff,
        purple: 0xA142F4
    };

    // 初始化
    modalScene = new THREE.Scene();
    modalScene.background = new THREE.Color(0xe0e3e7); // Darker grey for better white contrast
    
    const pixelRatio = Math.min(window.devicePixelRatio, 2);

    modalCamera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    modalCamera.position.set(0, 0, 50);

    modalRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    modalRenderer.setPixelRatio(pixelRatio);
    modalRenderer.setSize(container.clientWidth, container.clientHeight);
    modalRenderer.shadowMap.enabled = true;
    container.appendChild(modalRenderer.domElement);

    // 交互控制器
    modalControls = new THREE.OrbitControls(modalCamera, modalRenderer.domElement);
    modalControls.enableDamping = true;
    modalControls.dampingFactor = 0.05;
    modalControls.enablePan = false;

    // 基础高可见度灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Reduced for contrast
    modalScene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0); // Stronger key light
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    modalScene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight2.position.set(-10, 10, -10);
    modalScene.add(dirLight2);

    const clock = new THREE.Clock();
    let animateFunc = null;

    // --- 场景逻辑 ---

    if (type === 'brain' || type === 'step_ai') {
        // --- 大脑：极简神经网络簇 ---
        modalCamera.position.set(0, 0, 40);

        const group = new THREE.Group();
        const nodeCount = 40;
        const nodes = [];
        
        // 材质：使用更深的蓝色，增强与浅灰背景的对比
        const nodeMat = new THREE.MeshStandardMaterial({ 
            color: 0x1967d2, 
            roughness: 0.2, 
            metalness: 0.1,
            emissive: 0x1967d2,
            emissiveIntensity: 0.2
        });
        const activeNodeMat = new THREE.MeshStandardMaterial({
            color: colors.red,
            emissive: colors.red,
            emissiveIntensity: 0.5
        });

        // 几何体
        const geo = new THREE.SphereGeometry(0.6, 32, 32);

        // 创建节点
        for(let i=0; i<nodeCount; i++) {
            const mesh = new THREE.Mesh(geo, nodeMat.clone()); // Clone for individual color changes
            // 在球体内分布
            const r = 12 * Math.cbrt(Math.random()); // Even distribution inside sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            mesh.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            
            // 随机轻微运动参数
            mesh.userData = {
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5,
                basePos: mesh.position.clone()
            };
            
            group.add(mesh);
            nodes.push(mesh);
        }

        // 连接线：更深的线条以提升可见性
        const lineMat = new THREE.LineBasicMaterial({ color: 0x5f6368, transparent: true, opacity: 0.4 });
        const linesGeo = new THREE.BufferGeometry();
        const linePos = [];
        // 使用静态连接构造基础结构（动态更新开销较大）
        for(let i=0; i<nodes.length; i++) {
            for(let j=i+1; j<nodes.length; j++) {
                if(nodes[i].position.distanceTo(nodes[j].position) < 6) {
                    linePos.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
                    linePos.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
                }
            }
        }
        linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        const lines = new THREE.LineSegments(linesGeo, lineMat);
        group.add(lines);

        modalScene.add(group);

        animateFunc = () => {
            const t = clock.getElapsedTime();
            
            // 轻微旋转簇
            group.rotation.y = t * 0.05;
            group.rotation.z = Math.sin(t * 0.1) * 0.05;

            // 节点脉冲
            nodes.forEach((n, i) => {
                const s = 1 + 0.2 * Math.sin(t * 3 + n.userData.phase);
                n.scale.setScalar(s);
                
                // 颜色脉冲（模拟“激活/放电”效果）
                if (Math.sin(t * 2 + n.userData.phase) > 0.9) {
                    n.material.color.setHex(colors.yellow);
                    n.material.emissive.setHex(colors.yellow);
                } else {
                    n.material.color.setHex(0x1967d2);
                    n.material.emissive.setHex(0x1967d2);
                }
            });
        };

    } else if (type === 'eyes' || type === 'step_vlm') {
        // --- 眼睛：现代扫描器 ---
        modalCamera.position.set(30, 20, 30);
        modalCamera.lookAt(0, 0, 0);

        const group = new THREE.Group();
        modalScene.add(group);

        // 1. 相机（极简）
        const camGroup = new THREE.Group();
        camGroup.position.set(0, 10, 0);
        group.add(camGroup);

        const bodyGeo = new THREE.BoxGeometry(4, 4, 6);
        const bodyMat = new THREE.MeshStandardMaterial({ color: colors.white, roughness: 0.3 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        camGroup.add(body);

        const lensGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
        const lensMat = new THREE.MeshStandardMaterial({ color: colors.dark, roughness: 0.1, metalness: 0.5 });
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.rotation.x = Math.PI/2;
        lens.position.z = 3.5;
        camGroup.add(lens);

        // 2. 目标物体
        const targetGeo = new THREE.BoxGeometry(6, 6, 6);
        const targetMat = new THREE.MeshStandardMaterial({ color: colors.red, roughness: 0.4 });
        const target = new THREE.Mesh(targetGeo, targetMat);
        target.position.set(0, -10, 15);
        target.castShadow = true;
        group.add(target);

        // 3. 扫描视锥（锥体）
        const frustumGeo = new THREE.ConeGeometry(8, 20, 4, 1, true); // Open ended pyramid-ish
        const frustumMat = new THREE.MeshBasicMaterial({ 
            color: colors.blue, 
            transparent: true, 
            opacity: 0.1, 
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const frustum = new THREE.Mesh(frustumGeo, frustumMat);
        frustum.rotation.x = -Math.PI/2; // Point forward
        frustum.rotation.y = Math.PI/4; // Align corners
        frustum.position.z = 12; // Length/2 + offset
        camGroup.add(frustum);

        animateFunc = () => {
            const t = clock.getElapsedTime();

            // 相机朝向
            camGroup.lookAt(target.position);
            
            // 目标漂浮
            target.rotation.y = t * 0.5;
            target.rotation.x = Math.sin(t) * 0.2;
            target.position.y = -10 + Math.sin(t * 2) * 1;
            
            // 视锥透明度脉冲
            frustum.material.opacity = 0.1 + 0.05 * Math.sin(t * 5);
        };

    } else if (type === 'step_calc') {
        // --- 计算：清晰的数据映射演示 ---
        modalCamera.position.set(0, 10, 40);
        modalCamera.lookAt(0, 0, 0);

        const group = new THREE.Group();
        modalScene.add(group);

        // 材质
        const planeMat = new THREE.MeshStandardMaterial({ color: colors.white, side: THREE.DoubleSide, transparent: true, opacity: 0.9, roughness: 0.2 });
        const gridMat = { color: 0xe8eaed, transparent: true, opacity: 0.5 };
        const pointMat = new THREE.MeshBasicMaterial({ color: colors.blue });
        const point2Mat = new THREE.MeshBasicMaterial({ color: colors.green });

        // 1. 像素平面（左侧，平面）
        const p1Group = new THREE.Group();
        p1Group.position.x = -12;
        const p1Mesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), planeMat);
        const p1Grid = new THREE.GridHelper(12, 6, colors.blue, 0xe8eaed);
        p1Grid.rotation.x = Math.PI/2;
        p1Group.add(p1Mesh);
        p1Group.add(p1Grid);
        
        const dot1 = new THREE.Mesh(new THREE.CircleGeometry(0.6, 32), pointMat);
        dot1.position.z = 0.1;
        p1Group.add(dot1);
        group.add(p1Group);

        // 2. 世界平面（右侧，倾斜）
        const p2Group = new THREE.Group();
        p2Group.position.x = 12;
        p2Group.rotation.set(-Math.PI/4, Math.PI/6, 0); // Tilted 3D
        
        const p2Mesh = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), planeMat);
        const p2Grid = new THREE.GridHelper(12, 6, colors.green, 0xe8eaed);
        p2Grid.rotation.x = Math.PI/2;
        p2Group.add(p2Mesh);
        p2Group.add(p2Grid);

        const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 32), point2Mat);
        dot2.position.z = 0.1;
        p2Group.add(dot2);
        group.add(p2Group);

        // 3. 映射连线
        const lineGeo = new THREE.BufferGeometry();
        const lineMat = new THREE.LineDashedMaterial({ color: colors.dark, dashSize: 1, gapSize: 1, scale: 1 });
        const mapLine = new THREE.Line(lineGeo, lineMat);
        group.add(mapLine);

        // 标识：3D 文字开销较大，这里用简单几何体/颜色块来表示类型
        // 用简单几何体表示“矩阵”
        const matrixBox = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshStandardMaterial({ color: colors.yellow, roughness: 0.2 }));
        matrixBox.position.set(0, 2, 0);
        group.add(matrixBox);

        animateFunc = () => {
            const t = clock.getElapsedTime();
            
            // 点 1 运动（圆周）
            const u = Math.sin(t) * 3;
            const v = Math.cos(t) * 3;
            dot1.position.set(u, v, 0.1);

            // 点 2 运动（映射后）
            // 伪仿射变换：缩放 + 倾斜
            dot2.position.set(u * 1.2, v * 1.2, 0.1);

            // 更新连线
            const start = new THREE.Vector3();
            dot1.getWorldPosition(start);
            const end = new THREE.Vector3();
            dot2.getWorldPosition(end);
            
            mapLine.geometry.setFromPoints([start, end]);
            mapLine.computeLineDistances(); // Needed for dashed line

            // 旋转矩阵方块
            matrixBox.rotation.x = t;
            matrixBox.rotation.y = t * 0.5;
        };

    } else if (type === 'hand' || type === 'step_act') {
        // --- 手：蓝白工业风 ---
        modalCamera.position.set(65, 55, 65); // Further zoomed out to reduce size
        modalCamera.lookAt(0, 8, 0);

        // 地面（近似无限延伸的观感）
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.1 })); // Slightly darker floor
        floor.rotation.x = -Math.PI/2;
        floor.receiveShadow = true;
        modalScene.add(floor);

        // 机器人
        const robot = new THREE.Group();
        modalScene.add(robot);

        // 材质
        const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1 }); // Pure white
        const matJoint = new THREE.MeshStandardMaterial({ color: 0xbdc1c6, roughness: 0.4, metalness: 0.2 }); // Grey Joint
        const matGrey = new THREE.MeshStandardMaterial({ color: 0x5f6368, roughness: 0.7 }); // Dark grey parts

        // 底座
        const base = new THREE.Mesh(new THREE.CylinderGeometry(6, 7, 4, 32), matWhite); // White Base
        base.position.y = 2; 
        base.castShadow = true;
        robot.add(base);
        
        // J1
        const j1 = new THREE.Group(); j1.position.y = 4; base.add(j1);
        const j1Body = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 8), matWhite);
        j1Body.position.y = 3; j1Body.castShadow = true; j1.add(j1Body);

        // J2
        const j2Pivot = new THREE.Group(); j2Pivot.position.y = 4; j1Body.add(j2Pivot);
        const j2Joint = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 9, 32), matJoint); // Grey Joint
        j2Joint.rotation.z = Math.PI/2; j2Pivot.add(j2Joint);
        
        const arm1 = new THREE.Mesh(new THREE.BoxGeometry(6, 14, 6), matWhite);
        arm1.position.y = 7; arm1.castShadow = true; j2Pivot.add(arm1);
        
        // J3
        const j3Pivot = new THREE.Group(); j3Pivot.position.y = 7; arm1.add(j3Pivot);
        const j3Joint = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 7, 32), matJoint); // Grey Joint
        j3Joint.rotation.z = Math.PI/2; j3Pivot.add(j3Joint);
        
        const arm2 = new THREE.Mesh(new THREE.BoxGeometry(5, 12, 5), matWhite);
        arm2.position.y = 6; arm2.castShadow = true; j3Pivot.add(arm2);

        // 腕部
        const wrist = new THREE.Group(); wrist.position.y = 6; arm2.add(wrist);
        const wristJoint = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 6, 32), matJoint); // Grey Joint
        wristJoint.rotation.z = Math.PI/2; wrist.add(wristJoint);

        // 夹爪
        const gripperBase = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 4), matGrey);
        gripperBase.position.y = 2;
        wrist.add(gripperBase);

        const leftF = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 3), matGrey); 
        leftF.position.set(-3, 4, 0); wrist.add(leftF);
        
        const rightF = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 3), matGrey);
        rightF.position.set(3, 4, 0); wrist.add(rightF);

        // 动画逻辑（简化的连续旋转）
        animateFunc = () => {
            const dt = 0.004;

            // 目标姿态
            const liftPos = { j1: Math.PI/4, j2: 0.3, j3: 0.5 };
            const turnPos = { j1: -Math.PI * 0.416, j2: 0.3, j3: 0.5 };

            const lerpJoints = (target, speed) => {
                j1.rotation.y += (target.j1 - j1.rotation.y) * speed;
                j2Pivot.rotation.x += (target.j2 - j2Pivot.rotation.x) * speed;
                j3Pivot.rotation.x += (target.j3 - j3Pivot.rotation.x) * speed;
                
                // 腕部逆运动学：保持夹爪垂直
                const currentJ2 = j2Pivot.rotation.x;
                const currentJ3 = j3Pivot.rotation.x;
                const targetWrist = Math.PI - (currentJ2 + currentJ3);
                wrist.rotation.x += (targetWrist - wrist.rotation.x) * speed;
            };

            const time = Date.now() * 0.001;
            const target = (Math.sin(time) > 0) ? liftPos : turnPos;
            
            lerpJoints(target, 0.03);
            
            // 保持夹爪静态张开
            leftF.position.x = -3;
            rightF.position.x = 3;
        };
    } else {
        // 兜底逻辑（当前标识下不应触发）
        const geo = new THREE.BoxGeometry(10, 10, 10);
        const mat = new THREE.MeshStandardMaterial({ color: colors.blue });
        const cube = new THREE.Mesh(geo, mat);
        modalScene.add(cube);
        animateFunc = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        };
    }

    // 动画循环
    function renderLoop() {
        modalReqId = requestAnimationFrame(renderLoop);
        if(modalControls) modalControls.update();
        if(animateFunc) animateFunc();
        if(modalRenderer && modalScene && modalCamera) {
            modalRenderer.render(modalScene, modalCamera);
        }
    }
    renderLoop();
}

window.handlePipelineClick = function(element, type) {
    // 移除全部节点的激活态
    document.querySelectorAll('.pipeline-node').forEach(node => {
        node.classList.remove('active-node');
    });
    // 为当前节点添加激活态
    element.classList.add('active-node');
    // 打开弹窗
    showDesignModal(type);
};

window.closeDesignModal = function() {
    const overlay = document.getElementById('designModalOverlay');
    overlay.classList.remove('active');
    
    // 清理 3D 资源
    cleanupModal3D();

    // 清除数据流节点高亮
    document.querySelectorAll('.pipeline-node').forEach(node => {
        node.classList.remove('active-node');
    });
};

// 点击遮罩层空白处关闭弹窗
document.getElementById('designModalOverlay').addEventListener('click', (e) => {
    if(e.target === document.getElementById('designModalOverlay')) {
        closeDesignModal();
    }
});

function initMindMap() {
    const container = document.getElementById('mindmap-container');
    if(!container) return;
    
    container.innerHTML = '';
    
    const ul = document.createElement('ul');
    ul.className = 'mindmap-ul';
    
    // 构建树结构
    // 根节点默认可见并展开
    const rootLi = createMindMapNode(mindMapData, true);
    ul.appendChild(rootLi);
    container.appendChild(ul);
}

function createMindMapNode(data, isRoot=false) {
    const li = document.createElement('li');
    li.className = 'mindmap-li';

    const content = document.createElement('div');
    content.className = 'mindmap-content';
    
    const hasChildren = data.children && data.children.length > 0;

    // 图标逻辑
    if (hasChildren) {
        content.classList.add('has-children');
        const icon = document.createElement('i');
        // 默认全部收起（加号）
        const iconClass = 'fas fa-plus-circle';
        icon.className = `${iconClass} me-2 toggle-icon`;
        content.appendChild(icon);
    } else {
        const icon = document.createElement('i');
        icon.className = 'fas fa-circle me-2 leaf-icon'; 
        icon.style.fontSize = '0.5rem';
        icon.style.verticalAlign = 'middle';
        content.appendChild(icon);
    }

    const textSpan = document.createElement('span');
    textSpan.innerText = data.title;
    content.appendChild(textSpan);
    
    li.appendChild(content);

    if (hasChildren) {
        const ul = document.createElement('ul');
        ul.className = 'mindmap-ul';
        
        // 折叠逻辑：默认全部关闭
        ul.style.display = 'none';
        
        data.children.forEach(child => {
            ul.appendChild(createMindMapNode(child, false));
        });
        li.appendChild(ul);

        // 点击切换展开/收起
        content.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNode(li, content);
        });
    }
    
    return li;
}

function toggleNode(li, content) {
    const ul = li.querySelector('.mindmap-ul');
    const icon = content.querySelector('.toggle-icon');
    
    if (ul) {
        if (ul.style.display === 'none') {
            ul.style.display = 'block';
            if(icon) {
                icon.className = 'fas fa-minus-circle me-2 toggle-icon';
            }
        } else {
            ul.style.display = 'none';
            if(icon) {
                icon.className = 'fas fa-plus-circle me-2 toggle-icon';
            }
        }
    }
}

const flashcardsData = [
    { q: "什么是智能机械臂实验中提到的“Agent”角色及其包含的内容？", a: "智能体模型（LLM）例如DeepSeek。" },
    { q: "智能机械臂实验中采用的“思维逻辑模式”被称为_____,其中包含思考(Reasoning)和行动(Acting)。", a: "ReAct" },
    { q: "在ReAct模式下，智能体模型(LLM)将所谓的“用户自然语言指令”转换为具体的？", a: "调用工具的逻辑（Tool Chain）或者直接回答的文本。" },
    { q: "智能机械臂系统架构中，用于“视觉感知”的重要模块组成是？", a: "USB摄像头和多模态大模型（VLM）API（例如Qwen-VL）。" },
    { q: "实验代码中将底层Python指令转换为“底层串口信号”的库是？", a: "pymycobot库。" },
    { q: "在视觉感知算法中，由于摄像头视角偏差，也不是正对实验桌，关键的校准方法是？", a: "坐标系转换（透视变换）。" },
    { q: "摄像头中的“像素坐标”转换为机械臂的“机械坐标”，使用的数学模型是？", a: "仿射变换（Affine Transformation）。" },
    { q: "为什么要进行仿射变换？实验中不进行会发生什么数学偏差？", a: "需用采集的对应点应数据，通过最小二乘法进行求解。" },
    { q: "为什么`eyeonhand.py`中需要分为“抓取区域”和“放置区域”两个映射函数？", a: "因为两个区域在摄像头透视下的形变不同，透视畸变会导致坐标不准，故需分别校准。" },
    { q: "在进行标定（Visual Servoing）时，需要采集“像素坐标”与“机械臂坐标”的对应点数据？", a: "采集4对对应点数据。" },
    { q: "智能机械臂的硬件构成中，作为“边缘计算核心”的控制板型号是？", a: "Jetson Nano开发板。" },
    { q: "实验中使用的六轴机械臂的具体型号是？", a: "MyCobot六轴机械臂。" },
    { q: "在开发板Linux中，用于确认开发板IP地址的Linux命令是？", a: "ifconfig | grep 172" },
    { q: "在`tools.py`中，使用注解（Decorator）让Python函数能被LLM调用的装饰器是？", a: "@register_tool" },
    { q: "在定义一个工具函数时，为何要在文档字符串中详细描述功能、参数和返回值？", a: "为了让大模型准确理解description和parameters。" },
    { q: "在`tools.py`中，`take_photo`函数除了拍照，还应用了什么图像处理技术来增强图片亮度？", a: "伽马校正（Gamma Correction）。" },
    { q: "在`move_to`函数中，当目标（target）是一个物体名称（如“trash bin”）时，会触发什么流程？", a: "触发“放置区拍照 + 视觉识别”的流程，以实现动态目标定位。" },
    { q: "手眼标定流程的第一步“物理打点”是指什么操作？", a: "控制机械臂尖端依次触碰工作纸上的四个角，并记录下这些位置的机械臂坐标。" },
    { q: "手眼标定中采集像素坐标时，需要查看摄像头的实时画面，并从哪个文件中读取数据？", a: "config.json" },
    { q: "实验中常出现抓取位置偏差，一个主要原因是什么？", a: "标定点选取不够精细、摄像头安装位置发生微小位移或透视畸变。" },
    { q: "除了抓取位置偏差外，还有一种控制方式可以在接近物体时进行动态微调，叫什么？", a: "视觉伺服（Visual Servoing）或闭环控制。" },
    { q: "实验中VLM识别会有延迟高的主要原因是什么？", a: "网络请求API耗时较长，或本地模型推理耗时较长。" },
    { q: "为了获取物体Z轴高度，对应的传感器设备通常是什么？本实验采用的是？", a: "需要RGB-D摄像头。" },
    { q: "引入大模型后，能感知和操作物理世界的智能体被称为_____？", a: "具身智能（Embodied AI）。" },
    { q: "在硬件组装时，开发板供电与机械臂电源的区别（Jetson Nano是圆头，机械臂是扁头）？", a: "机械臂电源是“直头小圆孔”，开发板电源是“直角弯头小圆孔”。" },
    { q: "系统默认登录用户名和密码是什么？", a: "用户名jetson，密码yahboom。" },
    { q: "在ReAct代理逻辑架构中，大语言模型的核职能是_____，而不是直接控制硬件。", a: "推理和规划（大脑）。" },
    { q: "在ReAct架构底层，`pymycobot`库将高层指令转换为_____，发送给机械臂。", a: "串口通信信号。" },
    { q: "ReAct架构的决策逻辑可以概括为：大模型负责“想”，Python脚本负责_____，底层驱动负责“动”。", a: "“做”（或执行逻辑连接）。" },
    { q: "将目标位置（x,y,z）转换为机械臂各个关节角度的数学计算叫什么？", a: "逆运动学求解（Inverse Kinematics）。" },
    { q: "无法连接机械臂时，应检查哪些硬件问题？", a: "检查USB线是否松动、是否有sudo权限、是否有串口占用。" },
    { q: "在开发板工具代码时，为了确保大模型传入正确的参数（如区域），可以使用什么编程约束？", a: "使用枚举（enum）或者在代码中限制可选值（如grabbing_area，placement_area）。" },
    { q: "在项目目录下，运行实验微课Agent的主程序命令是什么？", a: "sudo python3 agent.py" },
    { q: "在程序运行过程中想强制终止时，应该按什么组合键？", a: "同时按 `Ctrl` 和 `c` 键。" },
    { q: "在`grab_object`函数执行流程中，第一步是？", a: "读取拍照保存的图片（captured_image.jpg）。" },
    { q: "在手眼标定步骤中，推荐使用什么工具来精准获取图像中的像素坐标？", a: "pixspy或者画图软件的拾取工具。" },
    { q: "ReAct中的“思考-行动-观察”循环，英文是？", a: "Thought-Action-Observation循环。" },
    { q: "实验中，配置LLM模型的地址（base_url）和名称（model_name）的文件是哪个？", a: "agent.py" },
    { q: "仿射变换为了解决映射模型，能够保证几何图形的什么性质？", a: "保持直线的平直性和平行性。" },
    { q: "开发板同时连接网线和WiFi时，可能会导致什么网络问题？", a: "可能会导致IP冲突或无法ping通等故障。" },
    { q: "在ReAct代理逻辑架构中，增加“记忆”和“学习”能力，被称为什么？", a: "通过Python代码封装的工具（Tools）。" },
    { q: "为什么说引入大模型后，机械臂具备了“泛化”结构化能力？", a: "因为大模型能够理解自然语言指令，处理动态场景判断，而不是死板的写死坐标逻辑。" },
    { q: "在进行放置区标定时，有一个重要步骤是确保机械臂在拍照时的_____？", a: "姿态（主要是关节角度和坐标）一致。" },
    { q: "本实验的代码中，旋转逻辑的Python脚本文件是？", a: "eyeonhand.py" },
    { q: "在硬件连接时，显示屏的电源应接到哪里，而不是NLP实验箱？", a: "应接到实验室的USB排插上，或者是单独的USB口。" },
    { q: "在Linux系统中，哪个命令用于修改文件所有者为jetson用户？", a: "sudo chown -hR jetson:jetson dir" },
    { q: "如果开发板无法连接机械臂，MyCobot通讯库（通过`send_coords`或`send_angles`等函数）会抛出什么？", a: "串口连接错误或超时异常。" },
    { q: "大模型的Prompt设计中，生成的动作指令问题，应在哪个文件中的提示词（Prompt）？", a: "react_agent/agent.py" },
    { q: "机械臂的末端执行器（夹爪）在不同高度抓取，需要测试？", a: "在夹爪闭合前，尝试不同高度（Z轴）的测试。" }
];

function renderFlashcards() {
    const container = document.getElementById('flashcard-carousel-inner');
    const counter = document.getElementById('flashcard-counter');
    if (!container) return;
    
    container.innerHTML = '';
    
    // 数据按 2 张卡一组分页
    const chunkSize = 2;
    const totalPages = Math.ceil(flashcardsData.length / chunkSize);
    
    // 初始化计数器
    if(counter) counter.innerText = `1 / ${totalPages}`;

    for (let i = 0; i < flashcardsData.length; i += chunkSize) {
        const chunk = flashcardsData.slice(i, i + chunkSize);
        const isActive = i === 0 ? 'active' : '';
        
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${isActive}`;
        
        let rowHtml = '<div class="row justify-content-center">';
        
        chunk.forEach(item => {
            rowHtml += `
                <div class="col-md-5 mx-2">
                    <div class="flashcard-wrapper" onclick="this.classList.toggle('flipped')">
                        <div class="flashcard-inner">
                            <div class="flashcard-front">
                                <i class="fas fa-question-circle flashcard-icon"></i>
                                <p class="flashcard-text">${item.q}</p>
                                <p class="flashcard-hint">点击查看答案</p>
                            </div>
                            <div class="flashcard-back">
                                <i class="fas fa-lightbulb flashcard-icon"></i>
                                <p class="flashcard-text">${item.a}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        rowHtml += '</div>';
        carouselItem.innerHTML = rowHtml;
        container.appendChild(carouselItem);
    }
    
    // 监听翻页并更新计数
    const myCarousel = document.getElementById('flashcardCarousel');
    if(myCarousel && counter) {
        myCarousel.addEventListener('slid.bs.carousel', event => {
            const currentIndex = event.to + 1;
            counter.innerText = `${currentIndex} / ${totalPages}`;
        });
    }
}

// --- 文档跳页 ---
window.jumpToPage = function(pageNumber) {
    const iframe = document.getElementById('pdfViewer');
    const container = document.getElementById('pdf-iframe-container');
    
    if (iframe && container) {
        // 构造跳页地址
        const baseUrl = iframe.getAttribute('src').split('#')[0];
        const newUrl = `${baseUrl}#page=${pageNumber}`;
        
        // 通过替换元素强制刷新
        // （仅更新地址有时不会触发内嵌阅读器滚动）
        const newIframe = document.createElement('iframe');
        newIframe.id = 'pdfViewer';
        newIframe.className = 'w-100 h-100 border-0';
        newIframe.title = 'Project PDF';
        newIframe.src = newUrl;
        
        // 清空容器并插入新阅读器
        container.innerHTML = ''; 
        container.appendChild(newIframe);
        
        console.log(`Jumping to PDF page ${pageNumber} (Hard Reload)`);
    }
};

/**
 * 实验平台逻辑与三维模拟
 */

// --- 导航切换逻辑 ---
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#mainNav .nav-link');
    const sections = document.querySelectorAll('.app-section');

    // 渲染组件
    renderFlashcards();
    initMindMap();

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 清除全部激活态
            navLinks.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // 为当前点击项设置激活态
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if(targetSection) {
                targetSection.classList.add('active');
                
                // 交互演示页特殊处理（触发三维画布自适应）
                if (targetId === 'section-demo' && camera && renderer) {
                    setTimeout(() => {
                        onWindowResize();
                    }, 100);
                }
            }
        });
    });

    // 初始化三维模拟
    if (document.getElementById('simCanvas')) {
        initThreeJS();
    }
    // 初始化嵌入式仿射演示
    if (document.getElementById('affine-demo-container')) {
        initAffineEmbed();
    }
});

// --- 嵌入式仿射演示逻辑（竖向 / 科技风） ---
let affScene, affCam, affRenderer, affReq;
let affCore, affParticle, affTrail = [];
let affDropLineTop, affDropLineBottom;
let affState = 'idle'; // idle, flying_in, processing, flying_out
let affAnimTime = 0;
let affStartPos = new THREE.Vector3();
let affEndPos = new THREE.Vector3();
const AFF_CENTER = new THREE.Vector3(0, 0, 0);

function initAffineEmbed() {
    const container = document.getElementById('affine-demo-container');
    if (!container) return;

    // --- 1. 初始化场景（更明亮的科技风） ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222831); // Lighter dark blue-grey
    scene.fog = new THREE.FogExp2(0x222831, 0.02);

    // 相机
    let w = container.clientWidth || 400;
    let h = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
    camera.position.set(40, 25, 50); // Angle view
    camera.lookAt(0, 0, 0);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    // 修复：先设置像素比再设置尺寸，确保渲染缓冲缩放正确
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w, h);
    
    container.innerHTML = ''; 
    container.appendChild(renderer.domElement);

    // 控制器
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 20;
    controls.maxDistance = 120;

    // 灯光（增强亮度）
    const amb = new THREE.AmbientLight(0xffffff, 0.8); // Much brighter
    scene.add(amb);

    // 主光（青色）
    const keyLight = new THREE.PointLight(0x00ffff, 1.2, 100);
    keyLight.position.set(20, 20, 20);
    scene.add(keyLight);

    // 补光（紫色）
    const fillLight = new THREE.PointLight(0xbc13fe, 1.2, 100);
    fillLight.position.set(-20, -10, 20);
    scene.add(fillLight);

    affScene = scene; // Global ref

    // 尺寸变化处理（更稳健）
    const onResize = () => {
        if (!container) return;
        const newW = container.clientWidth;
        const newH = container.clientHeight;
        
        // 仅在尺寸变化或无效时更新
        if (newW > 0 && newH > 0) {
            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();
            renderer.setSize(newW, newH);
            renderer.setPixelRatio(window.devicePixelRatio || 1); // Handle screen zoom/move
        }
    };
    
    // 1. 监听尺寸变化
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    
    // 2. 强制立即同步（双重校验）
    requestAnimationFrame(onResize);
    const PLANE_SIZE = 20;
    const Y_OFFSET = 12; // Vertical spacing

    // 科技网格材质
    function createTechGrid(color, yPos, label) {
        const group = new THREE.Group();
        group.position.y = yPos;

        // 1. 网格（高对比）
        const grid = new THREE.GridHelper(PLANE_SIZE, 20, color, 0x444f5d); // Lighter grid lines
        grid.material.transparent = true;
        grid.material.opacity = 0.6; 
        grid.material.depthWrite = false;
        group.add(grid);

        // 2. 玻璃底座
        const planeGeo = new THREE.BoxGeometry(PLANE_SIZE, 0.2, PLANE_SIZE);
        const planeMat = new THREE.MeshBasicMaterial({ 
            color: color, 
            transparent: true, 
            opacity: 0.1, 
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.position.y = -0.1;
        group.add(plane);

        // 3. 边角点缀
        const cornerLen = 3;
        const cornerGeo = new THREE.BoxGeometry(cornerLen, 0.5, 0.5);
        const cornerMat = new THREE.MeshBasicMaterial({ color: color });
        
        const c1 = new THREE.Mesh(cornerGeo, cornerMat); c1.position.set(PLANE_SIZE/2, 0, PLANE_SIZE/2); group.add(c1);
        const c2 = new THREE.Mesh(cornerGeo, cornerMat); c2.position.set(-PLANE_SIZE/2, 0, PLANE_SIZE/2); group.add(c2);
        const c3 = new THREE.Mesh(cornerGeo, cornerMat); c3.position.set(PLANE_SIZE/2, 0, -PLANE_SIZE/2); group.add(c3);
        const c4 = new THREE.Mesh(cornerGeo, cornerMat); c4.position.set(-PLANE_SIZE/2, 0, -PLANE_SIZE/2); group.add(c4);

        // 4. 标签（高亮）
        const sprite = createTextSprite(label, color);
        sprite.position.set(0, 4, -PLANE_SIZE/2 - 2);
        sprite.scale.set(12, 3, 1); // Larger label
        group.add(sprite);

        return group;
    }

    // 上层：像素空间（霓虹青）
    const sourceGroup = createTechGrid(0x00ffff, Y_OFFSET, "像素坐标系 (Pixel Space)"); 
    scene.add(sourceGroup);

    // 下层：机械臂空间（霓虹绿）
    const targetGroup = createTechGrid(0x39ff14, -Y_OFFSET, "机械臂坐标系 (Robot Space)");
    scene.add(targetGroup);


    // --- 3. 变换核心（矩阵） ---
    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    // 中心核心（发光八面体）
    const coreGeo = new THREE.OctahedronGeometry(2, 0);
    const coreMat = new THREE.MeshBasicMaterial({ 
        color: 0xffcc00, 
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });
    affCore = new THREE.Mesh(coreGeo, coreMat);
    
    // 内部光晕
    const glowGeo = new THREE.OctahedronGeometry(1.2, 0);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const coreGlow = new THREE.Mesh(glowGeo, glowMat);
    affCore.add(coreGlow);
    centerGroup.add(affCore);

    // 数据流（竖向光线）
    const streamGeo = new THREE.BufferGeometry();
    const streamCount = 30;
    const streamPos = [];
    for(let i=0; i<streamCount; i++) {
        const x = (Math.random() - 0.5) * PLANE_SIZE * 0.9;
        const z = (Math.random() - 0.5) * PLANE_SIZE * 0.9;
        streamPos.push(x, Y_OFFSET, z);
        streamPos.push(x, -Y_OFFSET, z);
    }
    streamGeo.setAttribute('position', new THREE.Float32BufferAttribute(streamPos, 3));
    const streamMat = new THREE.LineBasicMaterial({ 
        color: 0x00ffff, 
        transparent: true, 
        opacity: 0.15 
    });
    const streams = new THREE.LineSegments(streamGeo, streamMat);
    scene.add(streams);


    // --- 4. 交互光标（全息风） ---
    function createHoloCursor(color) {
        const g = new THREE.Group();
        // 圆环
        const r1 = new THREE.Mesh(
            new THREE.RingGeometry(0.8, 1, 32),
            new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide })
        );
        r1.rotation.x = -Math.PI/2;
        r1.position.y = 0.1;
        g.add(r1);
        
        // 准星
        const lMat = new THREE.LineBasicMaterial({ color: color, linewidth: 2 });
        const l1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2,0.1,0), new THREE.Vector3(2,0.1,0)]), lMat);
        const l2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0.1,-2), new THREE.Vector3(0,0.1,2)]), lMat);
        g.add(l1);
        g.add(l2);
        
        return g;
    }

    const sourceCursor = createHoloCursor(0x00ffff);
    sourceGroup.add(sourceCursor);
    
    const targetCursor = createHoloCursor(0x39ff14);
    targetGroup.add(targetCursor);

    // 光束连线（连接上下光标）
    const beamGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    const beamMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    const beam = new THREE.Line(beamGeo, beamMat);
    scene.add(beam);

    // 粒子（用于动画）
    const partGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const partMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    affParticle = new THREE.Mesh(partGeo, partMat);
    affParticle.visible = false;
    scene.add(affParticle);

    // 拖尾
    for(let i=0; i<15; i++) {
        const t = new THREE.Mesh(new THREE.SphereGeometry(0.4 - i*0.02, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 - i*0.04 }));
        t.visible = false;
        scene.add(t);
        affTrail.push(t);
    }


    // --- 5. 逻辑与动画 ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isUserInteracting = false;
    
    // 命中平面（上层）：确保可被射线拾取
    const hitPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE), 
        new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false }) // Keep visible:false, Three.js raycaster hits visible:false if recursive? No, actually needs to be visible usually.
        // 说明：射线拾取默认不会命中不可见对象
        // 通过透明且不显示的材质，实现“看不见但可拾取”
    );
    hitPlane.material.visible = true;
    hitPlane.material.opacity = 0;
    hitPlane.material.transparent = true;
    hitPlane.rotation.x = -Math.PI/2;
    sourceGroup.add(hitPlane);

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        isUserInteracting = true;
    });
    container.addEventListener('mouseleave', () => isUserInteracting = false);

    const clock = new THREE.Clock();
    
    function animate() {
        affReq = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        controls.update();

        // 1. 核心动画
        affCore.rotation.x = t * 0.5;
        affCore.rotation.y = t;
        const scale = 1 + Math.sin(t*3) * 0.1;
        affCore.scale.set(scale, scale, scale);

        // 2. 光标逻辑
        let localX = 0, localZ = 0;
        
        // 射线拾取
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(hitPlane);

        if (isUserInteracting && intersects.length > 0) {
            localX = intersects[0].point.x - sourceGroup.position.x; // World to Local
            localZ = intersects[0].point.z - sourceGroup.position.z;
            document.body.style.cursor = 'crosshair';
        } else {
            // 自动模式
            document.body.style.cursor = 'default';
            localX = Math.sin(t * 0.5) * 6;
            localZ = Math.cos(t * 0.8) * 6;
        }

        const limit = PLANE_SIZE/2 - 1;
        localX = Math.max(-limit, Math.min(limit, localX));
        localZ = Math.max(-limit, Math.min(limit, localZ));

        // 更新光标
        sourceCursor.position.set(localX, 0, localZ);
        
        // 模拟矩阵变换（仿射：缩放 + 倾斜 + 旋转）
        // 仅用于视觉效果：旋转 90 度并缩放
        const angle = -Math.PI/2;
        const tx = (localX * Math.cos(angle) - localZ * Math.sin(angle)) * 0.8;
        const tz = (localX * Math.sin(angle) + localZ * Math.cos(angle)) * 0.8;
        
        targetCursor.position.set(tx, 0, tz);

        // 更新光束（视觉连接）
        const p1 = new THREE.Vector3(localX, 0, localZ); 
        p1.applyMatrix4(sourceGroup.matrixWorld);
        const p2 = new THREE.Vector3(tx, 0, tz); 
        p2.applyMatrix4(targetGroup.matrixWorld);
        
        // 光束仅在非模拟状态下激活
        if (affState === 'idle') {
            beam.visible = true;
            beam.geometry.setFromPoints([p1, p2]);
        } else {
            beam.visible = false;
        }

        // 3. 动画状态机（粒子下落）
        if (affState === 'flying') {
            affAnimTime += 0.02; // Speed
            if (affAnimTime > 1) {
                affState = 'idle';
                affParticle.visible = false;
                clearTrail();
            } else {
                // 插值
                const curr = new THREE.Vector3().lerpVectors(affStartPos, affEndPos, affAnimTime);
                
                // 添加少量“矩阵”噪声/螺旋感
                const radius = 2 * Math.sin(affAnimTime * Math.PI); // Bulge out in middle
                curr.x += Math.cos(affAnimTime * 10) * radius;
                curr.z += Math.sin(affAnimTime * 10) * radius;

                affParticle.position.copy(curr);
                affParticle.visible = true;
                
                // 拖尾
                updateTrail(curr, 0xffcc00);
            }
        }

        // 4. 更新界面显示
        const u = Math.round((localX + 10) * 32);
        const v = Math.round((localZ + 10) * 24);
        const rx = Math.round(tx * 20);
        const ry = Math.round(tz * 20);

        const uEl = document.getElementById('code-u');
        const vEl = document.getElementById('code-v');
        if(uEl) uEl.innerText = u;
        if(vEl) vEl.innerText = v;
        
        // 控制台更新（视觉节流）
        const conEl = document.getElementById('affine-console');
        if (conEl && Math.random() > 0.9) {
             if (isUserInteracting) {
                conEl.innerHTML = `> 实时映射: [${u}, ${v}] <span style="color:#39ff14">>></span> [${rx}, ${ry}]`;
            } else {
                conEl.innerHTML = `> 系统扫描中... <span style="opacity:0.5">[${u}, ${v}]</span>`;
            }
        }

        renderer.render(scene, camera);
    }

    animate();
}

function updateTrail(pos, colorHex) {
    for(let i = affTrail.length - 1; i > 0; i--) {
        affTrail[i].position.copy(affTrail[i-1].position);
        affTrail[i].visible = affTrail[i-1].visible;
        // （已禁用的调试：拖尾颜色设置）
    }
    affTrail[0].position.copy(pos);
    affTrail[0].visible = true;
    // （已禁用的调试：拖尾颜色设置）
}

function clearTrail() {
    affTrail.forEach(t => t.visible = false);
}

// 模拟触发器
window.runAffineSim = function() {
    if (affState !== 'idle') return;

    // 从场景获取当前光标位置（可能处于自动/手动移动状态）
    // 直接读取当前坐标作为输入
    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();

    // 在分组中查找光标对象
    // 源分组可能是索引 1 或 2：按名称/逻辑定位
    // 由于逻辑已确定：
    // 直接获取光束端点即可
    const line = affScene.children.find(c => c.type === 'Line' && c.geometry.attributes.position.count === 2);
    if(line) {
        const pos = line.geometry.attributes.position.array;
        p1.set(pos[0], pos[1], pos[2]); // Top
        p2.set(pos[3], pos[4], pos[5]); // Bottom
    }

    affStartPos.copy(p1);
    affEndPos.copy(p2);
    affAnimTime = 0;
    affState = 'flying';
    
    // 界面反馈
    const conEl = document.getElementById('affine-console');
    if(conEl) {
        conEl.innerHTML = `<span style="color:#ffcc00">⚠️ 正在传输数据包...</span>`;
    }
};

function createTextSprite(text, colorHex) {
    const canvas = document.createElement('canvas');
    const w = 1024; 
    const h = 256;
    canvas.width = w; 
    canvas.height = h;
    
    const ctx = canvas.getContext('2d');
    ctx.font = "Bold 80px 'Microsoft YaHei', 'Inter', sans-serif"; // Add Chinese font support
    ctx.fillStyle = "#" + new THREE.Color(colorHex).getHexString();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#" + new THREE.Color(colorHex).getHexString();
    ctx.shadowBlur = 15; // Slightly reduced blur for sharpness
    ctx.fillText(text, w/2, h/2);
    
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    return sprite;
}

// --- 3D 模拟变量 ---
let scene, camera, renderer, controls;
let robot = {}; 
let objects = []; 
let bins = [];

// 机械臂配置
// 加长长度以覆盖完整识别区域
const L1 = 180; 
const L2 = 180; 
const ARM_BASE_POS = { x: 0, y: 0, z: -100 };
const RECOGNITION_BOUNDS = { minX: -220, maxX: 0, minZ: 0, maxZ: 150 };

// 动画状态
let targetState = {
    baseRot: 0,
    shoulderRot: -0.4,
    elbowRot: 1.6,
    wristRot: -0.5,
    gripperOpen: 1
};
let currentState = { ...targetState };

// 页面元素引用
const logConsole = document.getElementById('logConsole');
const btnExecute = document.getElementById('btnExecute');
const btnClearObjects = document.getElementById('btnClearObjects'); 
const inputCommand = document.getElementById('userCommand');

// 颜色映射
const colorNameMap = {
    'blue': '蓝色',
    'red': '红色',
    'yellow': '黄色',
    'green': '绿色',
    'purple': '紫色'
};

// --- 初始化 ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    if(!container) return;

    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f3f4); // Google Grey
    scene.fog = new THREE.Fog(0xf1f3f4, 500, 1500);

    // 相机
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 2000);
    camera.position.set(0, 350, 450);
    camera.lookAt(0, 0, 0);

    // 渲染器
    const canvas = document.getElementById('simCanvas');
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 控制器
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(200, 400, 200);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; 
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // 环境
    createEnvironment();
    createRobot();
    
    // 初始方块
    addBlock('blue', -100, 50);
    addBlock('yellow', -60, 80);

    // 设置初始姿态为“完成后回位”状态（回位坐标：0, 180, -50）
    const homeSol = solveIK(0, 180, -50);
    if (homeSol) {
        targetState = { ...targetState, ...homeSol };
        currentState = { ...targetState }; // Snap immediately
        robot.lastPos = { x: 0, y: 180, z: -50 };
    }

    // 事件
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('pointerdown', onCanvasClick);
    document.getElementById('btnResetView').addEventListener('click', () => {
        controls.reset();
        camera.position.set(0, 350, 450);
        camera.lookAt(0, 0, 0);
    });

    animate();
}

function createEnvironment() {
    // 地面
    const geometry = new THREE.PlaneGeometry(2000, 2000);
    const material = new THREE.MeshStandardMaterial({ color: 0xf8f9fa });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    floor.receiveShadow = true;
    scene.add(floor);

    // 桌面区域
    const tableGeo = new THREE.BoxGeometry(600, 10, 400);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.y = -5;
    table.receiveShadow = true;
    scene.add(table);

    // 网格
    const grid = new THREE.GridHelper(600, 20, 0xdadce0, 0xeeeeee);
    grid.position.y = 0.1;
    scene.add(grid);

    // 识别区域（半透明蓝色）
    const areaW = RECOGNITION_BOUNDS.maxX - RECOGNITION_BOUNDS.minX;
    const areaD = RECOGNITION_BOUNDS.maxZ - RECOGNITION_BOUNDS.minZ;
    const areaX = (RECOGNITION_BOUNDS.maxX + RECOGNITION_BOUNDS.minX) / 2;
    const areaZ = (RECOGNITION_BOUNDS.maxZ + RECOGNITION_BOUNDS.minZ) / 2;

    const areaGeo = new THREE.PlaneGeometry(areaW, areaD);
    const areaMat = new THREE.MeshBasicMaterial({ color: 0x1a73e8, transparent: true, opacity: 0.1 });
    const area = new THREE.Mesh(areaGeo, areaMat);
    area.rotation.x = -Math.PI / 2;
    area.position.set(areaX, 0.5, areaZ);
    scene.add(area);

    // 识别区域边框
    const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(areaW, 1, areaD));
    const borderMat = new THREE.LineBasicMaterial({ color: 0x1a73e8, transparent: true, opacity: 0.3 });
    const border = new THREE.LineSegments(borderGeo, borderMat);
    border.position.set(areaX, 0.5, areaZ);
    scene.add(border);

    // 回收桶
    createBins();
}

function createBins() {
    const binConfig = [
        { color: 0x1976d2, label: 'blue', x: 200, z: -100 },  // Darker Google Blue
        { color: 0xd32f2f, label: 'red', x: 200, z: -20 },    // Darker Google Red
        { color: 0xfbc02d, label: 'yellow', x: 200, z: 60 },  // Darker Google Yellow
        { color: 0x388e3c, label: 'green', x: 270, z: -100 }, // Darker Google Green
        { color: 0x7b1fa2, label: 'purple', x: 270, z: -20 }
    ];

    binConfig.forEach(d => {
        const group = new THREE.Group();
        group.position.set(d.x, 0, d.z);

        const mat = new THREE.MeshStandardMaterial({ color: d.color });
        
        // 回收桶几何体（中空盒）
        const w=50, h=45, depth=50, thick=2;
        
        // 底部
        const bottom = new THREE.Mesh(new THREE.BoxGeometry(w, thick, depth), mat);
        bottom.position.y = thick/2;
        bottom.receiveShadow = true;
        group.add(bottom);

        // 四侧
        const side1 = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), mat); side1.position.set(0, h/2, -depth/2);
        const side2 = new THREE.Mesh(new THREE.BoxGeometry(w, h, thick), mat); side2.position.set(0, h/2, depth/2);
        const side3 = new THREE.Mesh(new THREE.BoxGeometry(thick, h, depth), mat); side3.position.set(-w/2, h/2, 0);
        const side4 = new THREE.Mesh(new THREE.BoxGeometry(thick, h, depth), mat); side4.position.set(w/2, h/2, 0);
        
        [side1, side2, side3, side4].forEach(m => {
            m.castShadow = true;
            m.receiveShadow = true;
            group.add(m);
        });

        group.userData = { isBin: true, color: d.label };
        scene.add(group);
        bins.push(group);
    });
}

function createRobot() {
    const matBody = new THREE.MeshStandardMaterial({ color: 0x5f6368, roughness: 0.4 }); // Google Grey 700
    const matJoint = new THREE.MeshStandardMaterial({ color: 0x1a73e8 }); // Google Blue
    const matDark = new THREE.MeshStandardMaterial({ color: 0x202124 });

    // 底座
    robot.base = new THREE.Group();
    robot.base.position.set(ARM_BASE_POS.x, ARM_BASE_POS.y, ARM_BASE_POS.z);
    scene.add(robot.base);

    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(35, 40, 20, 32), matDark);
    baseMesh.position.y = 10;
    baseMesh.castShadow = true;
    robot.base.add(baseMesh);

    // 肩部（绕 Y 轴旋转）
    robot.shoulder = new THREE.Group();
    robot.shoulder.position.y = 20;
    robot.base.add(robot.shoulder);

    const shMesh = new THREE.Mesh(new THREE.BoxGeometry(30, 25, 30), matBody);
    shMesh.position.y = 12.5;
    shMesh.castShadow = true;
    robot.shoulder.add(shMesh);

    // 连杆 1（绕 X 轴旋转）
    robot.arm1Pivot = new THREE.Group();
    robot.arm1Pivot.position.set(0, 25, 0);
    robot.shoulder.add(robot.arm1Pivot);

    const arm1Mesh = new THREE.Mesh(new THREE.BoxGeometry(12, L1, 12), matBody);
    arm1Mesh.position.y = L1/2;
    arm1Mesh.castShadow = true;
    robot.arm1Pivot.add(arm1Mesh);
    
    // 关节可视化
    const j1 = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 20, 16), matJoint);
    j1.rotation.z = Math.PI/2;
    robot.arm1Pivot.add(j1);

    // 连杆 2（绕 X 轴旋转）
    robot.arm2Pivot = new THREE.Group();
    robot.arm2Pivot.position.y = L1;
    robot.arm1Pivot.add(robot.arm2Pivot);

    const arm2Mesh = new THREE.Mesh(new THREE.BoxGeometry(10, L2, 10), matBody);
    arm2Mesh.position.y = L2/2;
    arm2Mesh.castShadow = true;
    robot.arm2Pivot.add(arm2Mesh);

    const j2 = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 18, 16), matJoint);
    j2.rotation.z = Math.PI/2;
    robot.arm2Pivot.add(j2);

    // 腕部
    robot.wristPivot = new THREE.Group();
    robot.wristPivot.position.y = L2;
    robot.arm2Pivot.add(robot.wristPivot);

    const wristMesh = new THREE.Mesh(new THREE.BoxGeometry(15, 8, 20), matDark);
    wristMesh.position.y = 4;
    wristMesh.castShadow = true;
    robot.wristPivot.add(wristMesh);

    // 夹爪指尖
    // 让末端更细，避免与方块穿模
    const fingerGeo = new THREE.BoxGeometry(3, 18, 5);
    
    robot.leftFinger = new THREE.Mesh(fingerGeo, matDark);
    robot.leftFinger.position.set(-6, 16, 0);
    robot.wristPivot.add(robot.leftFinger);

    robot.rightFinger = new THREE.Mesh(fingerGeo, matDark);
    robot.rightFinger.position.set(6, 16, 0);
    robot.wristPivot.add(robot.rightFinger);
}

// --- 供页面按钮调用的全局方法 ---
window.addBlock = function(color, specificX, specificZ) {
    const colorHexMap = {
        'blue': 0x4285f4,
        'red': 0xea4335,
        'yellow': 0xfbbc04,
        'green': 0x34a853,
        'purple': 0xa142f4
    };

    let x, z;
    
    if (specificX !== undefined && specificZ !== undefined) {
        x = specificX;
        z = specificZ;
    } else {
        // 随机摆放逻辑
        let attempts = 0;
        while(attempts < 50) {
            x = Math.random() * (RECOGNITION_BOUNDS.maxX - RECOGNITION_BOUNDS.minX) + RECOGNITION_BOUNDS.minX;
            z = Math.random() * (RECOGNITION_BOUNDS.maxZ - RECOGNITION_BOUNDS.minZ) + RECOGNITION_BOUNDS.minZ;
            
            // 与边界保持内缩距离（方块尺寸为 25）
            x = Math.max(Math.min(x, RECOGNITION_BOUNDS.maxX - 15), RECOGNITION_BOUNDS.minX + 15);
            z = Math.max(Math.min(z, RECOGNITION_BOUNDS.maxZ - 15), RECOGNITION_BOUNDS.minZ + 15);

            if (isPositionClear(x, z)) break;
            attempts++;
        }
        if (attempts >= 50) {
            log('系统', '放置失败：识别区已满。', 'error');
            return;
        }
    }

    const size = 25;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({ color: colorHexMap[color] });
    const block = new THREE.Mesh(geo, mat);
    
    block.position.set(x, size/2, z);
    block.castShadow = true;
    block.receiveShadow = true;
    block.userData = { isBlock: true, color: color, id: Math.random() };

    scene.add(block);
    objects.push(block);

    // 仅在手动添加时输出日志
    if (specificX === undefined) {
        log('系统', `已添加 ${colorNameMap[color]}方块。`);
    }
};

function isPositionClear(x, z) {
    // 增大安全半径至 30，避免重叠
    const threshold = 35; 
    for(let o of objects) {
        const dx = o.position.x - x;
        const dz = o.position.z - z;
        if (Math.sqrt(dx*dx + dz*dz) < threshold) return false;
    }
    return true;
}

// 点击删除
function onCanvasClick(event) {
    event.preventDefault();
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        const obj = intersects[0].object;
        scene.remove(obj);
        objects = objects.filter(o => o !== obj);
        log('系统', '已移除选定方块。');
        document.body.style.cursor = 'default';
    }
}

// 一键清空
if(btnClearObjects) {
    btnClearObjects.addEventListener('click', () => {
        objects.forEach(o => scene.remove(o));
        objects = [];
        log('系统', '已清空识别区域。');
    });
}

// --- 运动逻辑 ---

function onWindowResize() {
    if(!camera || !renderer) return;
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// 逆运动学
function solveIK(x, y, z) {
    const dx = x - ARM_BASE_POS.x;
    const dz = z - ARM_BASE_POS.z;
    const distPlanar = Math.sqrt(dx*dx + dz*dz);
    const baseAngle = Math.atan2(dx, dz);

    const r = distPlanar;
    const h = y - (ARM_BASE_POS.y + 45); // Adjust for base + shoulder offset

    const distTarget = Math.sqrt(r*r + h*h);
    if(distTarget > L1 + L2) return null;

    const alpha = Math.atan2(h, r);
    const cosShoulder = (L1*L1 + distTarget*distTarget - L2*L2) / (2 * L1 * distTarget);
    const angleShoulderInternal = Math.acos(Math.min(Math.max(cosShoulder, -1), 1));
    const cosElbow = (L1*L1 + L2*L2 - distTarget*distTarget) / (2 * L1 * L2);
    const angleElbowInternal = Math.acos(Math.min(Math.max(cosElbow, -1), 1));

    return {
        baseRot: baseAngle,
        shoulderRot: (Math.PI/2) - (alpha + angleShoulderInternal),
        elbowRot: Math.PI - angleElbowInternal,
        wristRot: Math.PI - ((Math.PI/2) - (alpha + angleShoulderInternal) + (Math.PI - angleElbowInternal))
    };
}

// 平滑运动
function executeMove(tx, ty, tz, duration = 1000) {
    return new Promise(resolve => {
        if (!robot.lastPos) robot.lastPos = { x: 0, y: 150, z: -50 };
        const start = { ...robot.lastPos };
        const end = { x: tx, y: ty, z: tz };
        const startTime = performance.now();

        function tick() {
            const now = performance.now();
            let p = (now - startTime) / duration;
            if (p > 1) p = 1;
            
            // 三次缓出，让停止更顺滑
            const ease = 1 - Math.pow(1 - p, 3);

            const cx = start.x + (end.x - start.x) * ease;
            const cy = start.y + (end.y - start.y) * ease;
            const cz = start.z + (end.z - start.z) * ease;

            const sol = solveIK(cx, cy, cz);
            if (sol) {
                currentState.baseRot = sol.baseRot;
                currentState.shoulderRot = sol.shoulderRot;
                currentState.elbowRot = sol.elbowRot;
                currentState.wristRot = sol.wristRot;
            }

            if (p < 1) requestAnimationFrame(tick);
            else {
                robot.lastPos = end;
                resolve();
            }
        }
        tick();
    });
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 夹爪动画
    currentState.gripperOpen += (targetState.gripperOpen - currentState.gripperOpen) * 0.15;
    
    // 闭合/张开间隙参数（适配方块尺寸）
    const closedGap = 13; // Half of block(12.5) + small gap
    const openGap = 20;
    const offset = closedGap + (currentState.gripperOpen * (openGap - closedGap));

    if (robot.leftFinger) robot.leftFinger.position.x = -offset;
    if (robot.rightFinger) robot.rightFinger.position.x = offset;

    // 应用关节旋转
    if (robot.shoulder) robot.shoulder.rotation.y = currentState.baseRot;
    if (robot.arm1Pivot) robot.arm1Pivot.rotation.x = currentState.shoulderRot;
    if (robot.arm2Pivot) robot.arm2Pivot.rotation.x = currentState.elbowRot;
    if (robot.wristPivot) robot.wristPivot.rotation.x = currentState.wristRot;

    // 抓取跟随逻辑
    if (robot.holdingMesh) {
        const v = new THREE.Vector3(0, 18, 0); // Tip of gripper
        v.applyMatrix4(robot.wristPivot.matrixWorld);
        robot.holdingMesh.position.copy(v);
        
        const q = new THREE.Quaternion();
        robot.wristPivot.getWorldQuaternion(q);
        robot.holdingMesh.quaternion.copy(q);
    }

    controls.update();
    renderer.render(scene, camera);
}

// --- 任务逻辑 ---

// 1. 拍照姿态
async function poseTakePhoto() {
    log('系统', '正在调整姿态进行拍照...');
    // 移动到较高的居中位置俯视
    // 使用逆运动学时，直接给定一个目标点
    const centerAreaX = (RECOGNITION_BOUNDS.maxX + RECOGNITION_BOUNDS.minX) / 2;
    const centerAreaZ = (RECOGNITION_BOUNDS.maxZ + RECOGNITION_BOUNDS.minZ) / 2;
    
    await executeMove(centerAreaX, 200, centerAreaZ - 50, 1200);
}

// 2. 抓取
async function grab(obj) {
    const name = colorNameMap[obj.userData.color];
    
    // 移动到目标上方
    await executeMove(obj.position.x, 150, obj.position.z, 1000);
    
    targetState.gripperOpen = 1; 
    await wait(300);

    // 下探
    log('系统', `正在抓取 ${name}方块...`);
    await executeMove(obj.position.x, 35, obj.position.z, 1000); // 35 height fits block size 25

    // 闭合夹爪
    targetState.gripperOpen = 0;
    await wait(600);
    robot.holdingMesh = obj;

    // 抬起
    await executeMove(obj.position.x, 180, obj.position.z, 800);
}

// 3. 放置（优化版）
async function drop(bin) {
    const name = colorNameMap[bin.userData.color];
    log('系统', `移动至 ${name}回收桶...`);

    // 移动到回收桶上方
    await executeMove(bin.position.x, 180, bin.position.z, 1500);

    // 缓慢下放
    log('系统', '正在放置...');
    // 回收桶高度为 45，在其上方一点释放
    await executeMove(bin.position.x, 60, bin.position.z, 1200);

    // 释放
    targetState.gripperOpen = 1;
    await wait(400);

    if (robot.holdingMesh) {
        // 近似物理落点的快速归位
        robot.holdingMesh.position.set(bin.position.x, 25, bin.position.z);
        robot.holdingMesh.rotation.set(0, (Math.random()-0.5), 0);
        robot.holdingMesh = null;
    }

    // 抬起回位
    await executeMove(bin.position.x, 180, bin.position.z, 800);
}

async function resolveCommandWithLLM(commandText) {
    try {
        const resp = await fetch('/api/interpret', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: commandText })
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        setLLMStatus('online');
        return data && (data.actions || data.reply) ? data : null;
    } catch (err) {
        setLLMStatus('offline');
        return null;
    }
}

// 执行指令
btnExecute.addEventListener('click', async () => {
    const cmd = inputCommand.value.trim().toLowerCase();
    if(!cmd) return;

    log('用户', cmd);
    inputCommand.value = '';

    // 解析颜色
    const colors = Object.keys(colorNameMap);
    let targetC = null;

    const llmResult = await resolveCommandWithLLM(cmd);
    if (llmResult && llmResult.reply) {
        log('智能体', llmResult.reply);
    }

    // 回退：本地关键词匹配
    if (!targetC && (!llmResult || !llmResult.actions || llmResult.actions.length === 0)) {
        for(let c of colors) {
            if(cmd.includes(c) || cmd.includes(colorNameMap[c])) {
                targetC = c;
                break;
            }
        }
    }

    if (llmResult && Array.isArray(llmResult.actions) && llmResult.actions.length > 0) {
        for (const action of llmResult.actions) {
            const actionColor = action && action.color ? action.color : null;
            const actionBin = action && action.targetBin ? action.targetBin : null;
            if (!actionColor || !colorNameMap[actionColor]) continue;

            const targets = objects.filter(o => o.userData.color === actionColor);
            if(targets.length === 0) {
                log('智能体', `在识别区未发现${colorNameMap[actionColor]}物品。`, 'error');
                continue;
            }

            const bin = bins.find(b => b.userData.color === actionBin) ||
                bins.find(b => b.userData.color === actionColor) ||
                bins[0];

            log('智能体', `收到指令。执行 ReAct 流程...`);
            
            // 步骤 1：感知
            await poseTakePhoto();
            log('系统', '调用工具 [take_photo]: 图像获取成功。');
            await wait(500);
            log('系统', 'VLM 分析完成: 确认目标位置。');

            // 步骤 2：执行
            for(let t of targets) {
                // 二次校验位置（模拟）
                if (t.position.x > RECOGNITION_BOUNDS.maxX || t.position.x < RECOGNITION_BOUNDS.minX) {
                    log('系统', '忽略超出识别区的物品。');
                    continue;
                }
                await grab(t);
                await drop(bin);
            }

            log('智能体', '任务完成。');
            await executeMove(0, 180, -50, 1000); // Return home
        }
        return;
    }

    if(targetC) {
        const targets = objects.filter(o => o.userData.color === targetC);
        if(targets.length === 0) {
            log('智能体', `在识别区未发现${colorNameMap[targetC]}物品。`, 'error');
            return;
        }

        const bin = bins.find(b => b.userData.color === targetC) || bins[0];

        log('智能体', `收到指令。执行 ReAct 流程...`);
        
        // 步骤 1：感知
        await poseTakePhoto();
        log('系统', '调用工具 [take_photo]: 图像获取成功。');
        await wait(500);
        log('系统', 'VLM 分析完成: 确认目标位置。');

        // 步骤 2：执行
        for(let t of targets) {
            // 二次校验位置（模拟）
            if (t.position.x > RECOGNITION_BOUNDS.maxX || t.position.x < RECOGNITION_BOUNDS.minX) {
                log('系统', '忽略超出识别区的物品。');
                continue;
            }
            await grab(t);
            await drop(bin);
        }

        log('智能体', '任务完成。');
        await executeMove(0, 180, -50, 1000); // Return home

    } else {
        log('智能体', '无法理解物体颜色，请明确说明 (如：红色方块)。', 'error');
    }
});

function log(src, msg, type='normal') {
    const div = document.createElement('div');
    div.className = `log-entry ${src === '用户' ? 'user' : src === '智能体' ? 'agent' : type === 'error' ? 'error' : 'system'}`;
    const time = new Date().toLocaleTimeString('zh-CN', {hour12:false});
    div.innerHTML = `<strong>[${time}] ${src}:</strong> ${msg}`;
    logConsole.appendChild(div);
    logConsole.scrollTop = logConsole.scrollHeight;
}

function setLLMStatus(state) {
    const badge = document.getElementById('llmStatusBadge');
    if (!badge) return;
    if (state === 'online') {
        badge.textContent = 'LLM 在线';
        badge.classList.remove('is-offline');
        badge.classList.add('is-online');
        return;
    }
    badge.textContent = 'LLM 离线';
    badge.classList.remove('is-online');
    badge.classList.add('is-offline');
}

async function checkLLMStatus() {
    try {
        const resp = await fetch('/api/health');
        if (!resp.ok) {
            setLLMStatus('offline');
            return;
        }
        const data = await resp.json();
        setLLMStatus(data.status === 'online' ? 'online' : 'offline');
    } catch (err) {
        setLLMStatus('offline');
    }
}

// --- 系统架构“探索”按钮 ---
document.addEventListener('DOMContentLoaded', () => {
    const exploreButtons = document.querySelectorAll('.js-design-explore');
    if (!exploreButtons.length) return;

    exploreButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-target-tab');
            if (!targetTab) return;

            const tabTrigger = document.querySelector(`[data-bs-target="${targetTab}"]`);
            if (tabTrigger && window.bootstrap) {
                const tab = new bootstrap.Tab(tabTrigger);
                tab.show();
            }

            const anchor = document.querySelector('#designTab');
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const lockedTabs = document.querySelectorAll('.tech-nav-pills.is-locked [data-bs-toggle="pill"]');
    lockedTabs.forEach((tabBtn) => {
        tabBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });

    checkLLMStatus();
    setInterval(checkLLMStatus, 15000);
});
