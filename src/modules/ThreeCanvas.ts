/**
 * @description threejs webgl 初始化 hook
 */

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { AxesHelper, Clock, GridHelper, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { GUI } from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

export class ThreeCanvas {
    static instance: ThreeCanvas;

    private WIDTH: number = 0;
    private HEIGHT: number = 0;
    private MULTISAMPLING = 1;
    private frameHandle: number = 0;

    private canvas!: HTMLElement;
    private orbitControls!: OrbitControls;
    private renderer!: WebGLRenderer;
    private scene!: Scene;
    private camera!: PerspectiveCamera;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        ThreeCanvas.instance = this;
    }


    _initThreeCanvasCallBack = () => { };

    public initThreeCanvas = async () => {
        await this.countRect();
        await this.initScene();
        await this.initCamera()
        await this.initRenderer()
        await this.initOrbitControls()
        await this.initCanvasListener()
        await this.frameByFrame();

        this._initThreeCanvasCallBack()

    }

    public initThreeCanvasCallBack(call: VoidFunction) {
        this._initThreeCanvasCallBack = call;
    }

    private initScene() {
        this.scene = new Scene();
    }

    private initCamera() {
        this.camera = new PerspectiveCamera(75, this.WIDTH / this.HEIGHT, 0.1, 1000);
        this.camera.position.x = 5;
        this.camera.position.y = 5;
        this.camera.position.z = 5;
        this.camera.lookAt(new Vector3(0, 0, 0));
    }

    public setCameraPos(x: number, y: number, z: number) {
        this.camera.position.set(x, y, z);
    }

    private initRenderer() {
        this.renderer = new WebGLRenderer({
            alpha: !0,
            antialias: !0,
            preserveDrawingBuffer: true,
            logarithmicDepthBuffer: true,
        });

        this.renderer.setSize(this.WIDTH * this.MULTISAMPLING, this.HEIGHT * this.MULTISAMPLING);
        // this.renderer.setClearColor(this.BACKGROUND_COLOR, 1);
        this.canvas.append(this.renderer.domElement);
    }


    private initOrbitControls() {
        this.orbitControls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.orbitControls.addEventListener('change', this.render);
    }



    private initCanvasListener() {
        // 随浏览器窗口大小发生变化
        window.addEventListener("resize", this.onWindowResize);

    }
    // 计算canvas 宽 高
    private countRect() {
        let width = this.canvas.offsetWidth;
        let height = this.canvas.offsetHeight;
        if (width != this.WIDTH || height != this.HEIGHT) {
            this.WIDTH = width;
            this.HEIGHT = height;
        };
    }
    private onWindowResize = () => {
        this.countRect();
        this.renderer.setSize(this.WIDTH * this.MULTISAMPLING, this.HEIGHT), this.camera.aspect = this.WIDTH / this.HEIGHT, this.camera.updateProjectionMatrix();
    }

    // 渲染场景
    private render = () => {
        this.renderer.render(this.scene, this.camera);
    };


    // animation
    private clock = new Clock();
    private delta = 0; // 时间间隔
    private fps_60 = 60
    private fps_30 = 30
    private runAnimate = true;
    protected _animation: VoidFunction = () => { };
    /**
     * @description 逐帧渲染 frame(帧)
     */
    private frameByFrame = () => {
        this.frameHandle = requestAnimationFrame(this.frameByFrame);
        // 计算与上一帧的时间差
        this.delta += this.clock.getDelta();
        // 如果时间差小于 16.7 毫秒，则等待剩余时间
        if (this.delta > 1 / this.fps_60) {

            this.runAnimate && this._animation();
            this.orbitControls.update();
            this.render();

            this.delta = 0;
        }


    }
    animation(call: VoidFunction) {
        this._animation = call;
    }

    /**
     *  @description 停止逐帧渲染
     */
    public stopFrame() {
        cancelAnimationFrame(this.frameHandle);
        this.frameHandle = 0;
    }

    // Scene Api
    public addObject(...object: Object3D[]) {
        this.scene.add(...object);
    }
    public removeObject(...object: Object3D[]) {
        this.scene.remove(...object);
    }

    /**
     * @description 移除Scene
     */
    _removeSceneCallBack = () => { };
    public removeScene = (obj: any) => {
        // console.log(obj)

        while (obj.children.length > 0) {
            this.removeScene(obj.children[0])
            obj.remove(obj.children[0]);
        }
        if (obj.geometry) obj.geometry.dispose()

        if (obj.material) {
            //in case of map, bumpMap, normalMap, envMap ...
            Object.keys(obj.material).forEach(prop => {
                if (!obj.material[prop])
                    return
                if (typeof obj.material[prop].dispose === 'function')
                    obj.material[prop].dispose()
            })
            obj.material.dispose()
        }

        this._removeSceneCallBack();

    }

    public removeSceneCallBack(call: VoidFunction) {
        this._removeSceneCallBack = call;
    }


    // 辅助工具

    public gui!: GUI;
    public guidom!: HTMLElement;
    _initGuiCallBack = () => { };
    public initGui() {

        if (process.env.NODE_ENV === "development") {
            //热更新会创建多个实例 删除之前的实例
            const oldInst = document.querySelector(".dg.main");
            oldInst?.parentElement?.removeChild(oldInst);
        };

        this.gui = new GUI();

        document.querySelector('.canvas')!.appendChild(this.gui.domElement);
        this.gui.domElement.style.position = 'absolute';
        this.gui.domElement.style.top = '0';
        this.gui.domElement.style.right = '0';
        this._initGuiCallBack();
    }

    public initGuiCallBack(call: VoidFunction) {
        this._initGuiCallBack = call;
    }

    /**
     * @description 选择框
     * @param options 
     * @param defaultValue 
     * @param name 
     * @returns gui add api
     */
    public guiOptions = (options: any[], defaultValue: any, name: string) => {
        return this.gui.add({ [name]: defaultValue }, name).options(options);
    };

    private stats!: Stats;
    public initStats = () => {
        //防止热重载初始化多个
        if (this.stats) return;
        const stats = new Stats();
        this.stats = stats;

        document.querySelector('.canvas')!.appendChild(stats.dom);
        stats.dom.style.top = "auto";
        stats.dom.style.bottom = "0";
        stats.dom.style.left = "auto";
        stats.dom.style.right = "0";
    }
    public updateStats = () => {
        this.stats && this.stats.update();
    }


    private axesHelper!: AxesHelper;
    public initAxesHelper = () => {
        // 坐标辅助
        this.axesHelper = new AxesHelper(length || 10);
        this.axesHelper.position.set(0, 0, 0);
        // 让辅助显示 射线交集 为空 就不会被识取到
        this.axesHelper.raycast = () => { };

        this.scene.add(this.axesHelper);

        this.axesHelper.visible = false;

        const params = {
            showAxesHelper: false,
        };

        this.gui.add(params, 'showAxesHelper').name('Axes Helper').onChange((value) => {
            this.axesHelper.visible = value;
        })


    }

    private gridHelper!: GridHelper;
    public initGridHelper = () => {
        // 地板网格 辅助显示
        this.gridHelper = new GridHelper(100, 10, 'rgb(200,200,200)', 'rgb(100,100,100)');
        this.gridHelper.raycast = () => { };

        this.scene.add(this.gridHelper);

        this.gridHelper.visible = false;

        const params = {
            showGridHelper: false,
        };

        this.gui.add(params, 'showGridHelper').name('Grid Helper').onChange((value) => {
            this.gridHelper.visible = value;
        })
    }
}
