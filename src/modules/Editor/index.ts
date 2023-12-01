/**
 * @description 皮肤编辑器
 *
 */

import { hasKey, offset, siblings, toggle, toggleClass } from '@/utils/js/index';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Skin } from './Skin';
import { PerspectiveCamera, Raycaster, Scene, Vector3, WebGLRenderer, sRGBEncoding } from 'three';
import { ModelChangeTool } from './ModelChangeTool';
import { ToolBox } from './ToolBox';
import { download, resizedCanvas } from '@/utils/mcskineditor/canvas';

class SkinEditor {
  public WEBGL = WebGL.isWebGLAvailable();
  public WIDTH = 0; // 宽度
  public HEIGHT = 0; // 高度
  public MULTISAMPLING = 1;
  public SKIN_WIDTH = 64; // 皮肤宽度
  public SKIN_HEIGHT = 64; // 皮肤宽度
  public SKIN_LEGACY_HEIGHT = 32; // 标准高度
  public DEFAULT_SKIN_URL = `${import.meta.env.VITE_BASE_URL}` + "/images/skin/default_skin.png"; // 默认皮肤
  public ALEX_SKIN_URL = `${import.meta.env.VITE_BASE_URL}` + "/images/skin/alex.png"; // alex
  private SKIN_URL: string = ''; // 用户上传的皮肤
  private SKIN_IMAGE: any; // 用户上传的皮肤
  private SCROLLABLE_BORDER_FACTOR = 1 / 16;
  private SCROLLABLE_BORDER_MIN = 30;
  private LEGACY_MODE = !1;
  private BACKGROUND_COLOR = 15724527;
  private OVERLAP = 1;
  private GRID_OFFSET = this.WEBGL ? .01 : .1;
  private POSE_STEPS = 10;
  private POSE_INTERVAL = 10;
  private DOUBLETAP_INTERVAL = 150;
  private COLOR_STEPS = 12;
  private null_vector = new Vector3(0, 0, 0);
  private pi = Math.PI;
  private Poses: any;
  public isSKIN: any;
  public toSKIN: any;

  static instance: SkinEditor;
  public orbitControls!: OrbitControls;
  public renderer!: WebGLRenderer;
  public scene!: Scene;
  public camera!: PerspectiveCamera;
  public canvas!: HTMLElement;
  public skin!: Skin;
  public toolBox!: ToolBox;
  public modelChangeTool!: ModelChangeTool;
  public color!: any;

  private grid_enabled = true;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLElement;

    SkinEditor.instance = this;

    this.toolBox = new ToolBox(this);

  }

  public init() {
    this.countRect();

    this.initRenderer();

    this.initScene();

    this.initCamera();

    this.initOrbitControls();

    this.initListener();
  }

  private initScene() {
    this.scene = new Scene();
  }

  private initCamera() {
    this.camera = new PerspectiveCamera(45, this.WIDTH / this.HEIGHT, .1, 1e3);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 50;

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
    // 窗口重新渲染
    // this.render();

  }

  private initOrbitControls() {
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.orbitControls.saveState();

    this.orbitControls.addEventListener('change', this.render);
  }

  private initListener() {
    // 随浏览器窗口大小发生变化
    window.addEventListener("resize", this.onWindowResize);

    // canvas
    this.initCanvasListener();

    // bodypart
    this.initBodyPartListener();

    // tools
    this.initToolsListener();

  }


  grabbing: boolean = false

  private initCanvasListener = () => {

    // 鼠标右键 抓取
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
      let drawing = this.toolBox.startDrawing(event);
      if (event.button === 0 || event.button === 2) {
        if (!drawing) {
          this.canvas.style.cursor = 'grab';
          this.grabbing = true;
          this.canvas.onmousemove = () => {
            this.canvas.style.cursor = 'grabbing';
          }
        }
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      this.canvas.style.cursor = 'default';
      this.grabbing = false;
      this.canvas.onmousemove = null;
    })

    // 进入canvas 点击 识别位置 配合绘画工具 若是皮肤正确位置则进行 绘制操作
    this.canvas.addEventListener('mousedown', (event: MouseEvent) => {

      if (event.button === 0) {
        let drawing = this.toolBox.startDrawing(event);

        if (drawing) {
          this.orbitControls.enabled = false;
        }

      }
      // console.log(event)
    })
    let timeStamp: any;
    this.canvas.addEventListener('touchstart', (event: TouchEvent) => {
      if (1 == event.touches.length && event.timeStamp - timeStamp < this.DOUBLETAP_INTERVAL) {
        // this.toolBox.dblclick(event);
      } else {
        if (1 == event.touches.length) {
          let r = (document.querySelector("#canvas") as any);
          let i = event.touches[0].pageX - (offset(r) as any).left;
          let o = Math.max(this.SCROLLABLE_BORDER_FACTOR * this.WIDTH, this.SCROLLABLE_BORDER_MIN);
          i < o || this.WIDTH - o < i && this.mobileVersion();
          return;
        }

        else if (1 < event.touches.length) {
          this.toolBox.startDrawing(event);
          timeStamp = event.timeStamp;
          if (this.toolBox.DRAWING) {
            this.orbitControls.enabled = false;
          } else {
            timeStamp = event.timeStamp;
          }
        }
      }

    })

    document.addEventListener('mouseup', (event: any) => {
      this.toolBox.stopDrawing();
      if (!this.toolBox.DRAWING) {
        this.orbitControls.enabled = true;
      }

    })
    document.addEventListener('touchend', (event: any) => {
      this.toolBox.stopDrawing();
      this.orbitControls.enabled = true;
    })

    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      this.updateGrid(event);
      this.toolBox.move(event);
    });
    this.canvas.addEventListener('touchmove', (event: TouchEvent) => {
      this.updateGrid(event);
      this.toolBox.move(event);

    });

    // 进入canvas 识别到 皮肤位置 渲染网格
    this.canvas.addEventListener('mouseout', (event: any) => {
      this.updateGrid(!1);
    });
    this.canvas.addEventListener('touchend', (event: any) => {
      this.updateGrid(!1);
    });

    this.canvas.addEventListener('dblclick', (event: any) => {
      this.toolBox.dblClick(event);
    });

    // document.querySelector('.upgrade')?.addEventListener('click', (event: any) => {
    //   return (document.querySelector("#upgrade_file") as any).click();
    // });

    (document.querySelector("#upgrade_file") as any).addEventListener('change', (event: any) => {
      let file = (document.querySelector("#upgrade_file") as any).files[0];
      let reader = new FileReader()

      // 上传图片读取成功回调函数
      // 这里传给后端
      reader.onload = (event: any) => {
        this.scene.remove(this.skin.object);
        let imageURL = event.target.result
        this.initSkin(imageURL);
      };

      reader.readAsDataURL(file);
      // (document.querySelector("#upload_form") as any).submit()
    });


    // document.querySelector('.download')?.addEventListener('click', (event: any) => {
    //   console.log('下载');
    //   let imageURL = this.skin.skinCanvas().toDataURL();
    //   download(imageURL);
    // })

    // document.querySelector('.upload')?.addEventListener('click', (event: any) => {
    //   //  设置localStorage
    //   let imageURL = this.skin.skinCanvas().toDataURL();
    //   setSkin(imageURL);

    //   let skinURL = resizedCanvas(this.renderer.domElement, 0.6).toDataURL("image/png", 2.0);
    //   // download(skinURL);
    //   let headURL = resizedCanvas(this.skin.headCanvas(), 1).toDataURL("image/png", 2.0);
    //   // download(headURL)
    //   console.log(`本地存储皮肤原图:${imageURL}`);
    //   console.log(`全身截图:`, skinURL);
    //   console.log(`头部原图:${headURL}`);
    // })

  }

  private initToolsListener = () => {
    document.querySelector('.center')?.addEventListener('mousedown', (event: any) => {
      this.backToCenter();
    })
    document.querySelector('.zoom-in')?.addEventListener('mousedown', (event: any) => {
      this.zoomIn();
    })
    document.querySelector('.zoom-out')?.addEventListener('mousedown', (event: any) => {
      this.zoomOut();
    })
  }

  public uninstallListener = () => {
    window.removeEventListener('resize', this.onWindowResize)
  }

  private initBodyPartListener = () => {
    const bodypart = document.getElementsByClassName("bodypart");
    for (let element of (bodypart as any)) {
      element.addEventListener('click', (event: any) => {
        const t = element.dataset.bodypart;
        const r = element.dataset.layer;
        toggleClass(element, "hidden");
        this.toggleBodyPart(t, r, !hasKey(element, "hidden", 'className'));

      })
    }

    // 预览模型 开关
    const toggle_select = document.getElementsByClassName('body-selector')[0];
    // toggle bodypart
    toggle_select.addEventListener('click', (event: any) => {
      event.preventDefault();
      toggleClass(toggle_select, "active");
      const selector_overlay = siblings(toggle_select, "className", "selector-overlay")[0]
      toggle(selector_overlay);
    })
  }


  // 计算canvas 宽 高
  private countRect() {

    const editorCanvas = (document.getElementById("editorCanvas") as HTMLDivElement).getBoundingClientRect();

    let width = editorCanvas.width;
    let height = editorCanvas.height;

    if (width != this.WIDTH || height != this.HEIGHT) {
      this.WIDTH = width;
      this.HEIGHT = height;
    };

  }

  public onWindowResize = () => {
    // (this.renderer.setSize(this.WIDTH * this.MULTISAMPLING, this.HEIGHT), this.camera.aspect = this.WIDTH / this.HEIGHT, this.camera.updateProjectionMatrix())
    this.countRect();
    // console.log(this.renderer)
    this.renderer.setSize(this.WIDTH * this.MULTISAMPLING, this.HEIGHT * this.MULTISAMPLING);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();

    this.render();
  }

  // 渲染场景
  public render = () => {
    this.renderer.render(this.scene, this.camera);
  };


  frameHandle: number = 0;
  /**
 * @description 逐帧渲染 frame(帧)
 */
  private frameByFrame = () => {
    this.frameHandle = requestAnimationFrame(() => this.frameByFrame());
    this.orbitControls.update();
    this.render();
  }

  /**
   *  @description 停止逐帧渲染
   */
  stopFrame() {
    cancelAnimationFrame(this.frameHandle);
    this.frameHandle = 0;
  }


  // 判断用户端
  private mobileVersion = () => {
    return !(document.getElementsByClassName(".sidebar")[0] as any).is(":visible")
  };

  // 导入皮肤图片 开始加载
  public initSkin = (url?: string) => {
    // console.log("皮肤加载,e:" + url);

    this.isSKIN = !!url;
    this.toSKIN = !!url;

    url = url || this.DEFAULT_SKIN_URL;

    (this.SKIN_IMAGE = new Image).src = url;

    // 导入成功 开始初始化人物模型
    this.SKIN_IMAGE.onload = () => {

      this.skin = new Skin(this.SKIN_IMAGE);
      this.scene.add(this.skin.object);

      this.toolBox.setCtx(this.skin.skinCtx);
      this.modelChangeTool = new ModelChangeTool(this, this.scene, this.skin, this.toolBox);
      // 开始渲染
      this.render();

      // 初始化模型默认动作
      this.initPoses();

      this._initSkinLoaded(this.skin.curModel, this.toolBox.curTool)
    }
    // 导入图片出错
    this.SKIN_IMAGE.onerror = () => {
      this.SKIN_IMAGE.url != this.DEFAULT_SKIN_URL ? this.SKIN_IMAGE.src = this.DEFAULT_SKIN_URL : console.log("无法加载默认皮肤文件");
    }
  };

  _initSkinLoaded = (curModel: string, curTool: string) => { };

  initSkinLoaded = (call: (curModel: string, curTool: string) => void) => {
    this._initSkinLoaded = call;
  }

  initPoses = () => {
    this.Poses = {
      Default: {
        "head": this.null_vector,
        "torso": this.null_vector,
        "left_arm": this.null_vector,
        "right_arm": this.null_vector,
        "left_leg": this.null_vector,
        "right_leg": this.null_vector
      },
      Hug: {
        "head": this.null_vector,
        "torso": this.null_vector,
        "left_arm": new Vector3(0, 0, this.pi / 2),
        "right_arm": new Vector3(0, 0, -this.pi / 2),
        "left_leg": new Vector3(0, 0, .2),
        "right_leg": new Vector3(0, 0, -.2)
      },
      Walk: {
        "head": this.null_vector,
        "torso": this.null_vector,
        "left_arm": new Vector3(- .2, 0, .1),
        "right_arm": new Vector3(.2, 0, -.1),
        "left_leg": new Vector3(.2, 0, 0),
        "right_leg": new Vector3(- .2, 0, 0)
      },
      Run: {
        "head": new Vector3(- .2, 0, 0),
        "torso": this.null_vector,
        "left_arm": new Vector3(1.4, 0, .1),
        "right_arm": new Vector3(- 1.4, 0, -.1),
        "left_leg": new Vector3(- .5, 0, 0),
        "right_leg": new Vector3(.5, 0, 0)
      },
      Fly: {
        "head": new Vector3(- .2, 0, 0),
        "torso": this.null_vector,
        "left_arm": new Vector3(.2, 0, .3),
        "right_arm": new Vector3(- .2, 0, -.1),
        "left_leg": new Vector3(0, 0, .5),
        "right_leg": new Vector3(0, 0, -.5),
      }
    }
  }

  // 获取场景坐标
  public cast_ray = (e: any, t: any, r?: any) => {
    if (!this.skin) return null;
    let i = (offset((document.getElementById("canvas") as any)) as any);
    let position = new Vector3((e - i.left) / this.WIDTH * 2 - 1, 1 - (t - i.top) / this.HEIGHT * 2, .5);
    // 将坐标转变到场景中
    position.unproject(this.camera);
    const raycaster = new Raycaster(this.camera.position, position.sub(this.camera.position).normalize()).intersectObjects([this.skin.object], !0);
    let plane = new Array;

    for (const r of raycaster) {
      // console.log(object)
      // return object;
      if ((!(r.object as any).ignore_intersect) && (r?.object?.parent?.parent as any).object.visible) {
        plane.push(r)
      }
    }
    return plane[0];
  };

  isInSkinGrid = !(this.cast_ray);

  // 判断是否启用模型网格
  private updateGrid = (e: any) => {
    let t: any;
    let type: any;
    // 判断用户端
    if (typeof (e.touches) !== 'undefined') {
      e = e.touches[0]
      type = 'touch';
    } else {
      type = 'mouse';
    }

    if (this.grabbing) return

    if (this.cast_ray(e.pageX, e.pageY)) {
      this.canvas.style.cursor = 'crosshair';
    } else {
      this.canvas.style.cursor = 'default';
    }

    if (type === 'mouse' && this.grid_enabled && !1 !== e ? e && (t = !!this.cast_ray(e.pageX, e.pageY)) : t = !1, t != this.isInSkinGrid) {
      for (const r in this.isInSkinGrid = t, this.skin.bodyparts) {
        if (!(this.isInSkinGrid && this.skin.bodyparts[r].overlay.visible)) {
          this.skin.bodyparts[r].base.grid.box.visible = this.isInSkinGrid && this.skin.bodyparts[r].base.visible;
        }
        this.skin.bodyparts[r].overlay.grid.box.visible = this.isInSkinGrid && this.skin.bodyparts[r].overlay.visible;
      }
      this.render();
    }

    if (type === 'touch') {
      console.log('touch');
    }

  };

  // 清空场景
  public removeTheScene = (obj: any) => {
    // console.log(obj)

    while (obj.children.length > 0) {
      this.removeTheScene(obj.children[0])
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

    this._removeTheSceneCallBack();

  }

  _removeTheSceneCallBack = () => { };
  removeTheSceneCallBack(call: VoidFunction) {
    this._removeTheSceneCallBack = call;
  }

  // 判断部分模型 是否显示
  public toggleBodyPart = (bodypart: string, type: string, HIDDEN: boolean) => {
    // @ts-ignore
    this.skin[bodypart][type].toggleVisibility(HIDDEN);
    this.render();
  };

  // 判断Grid 是否启用
  public toggleGrid = (e: any) => {
    this.grid_enabled != e && (this.grid_enabled = e, this.render())
  };

  // 切换模型动作
  public changeStance = (val: any) => {
    this.skin.apply(this.Poses[val]);
    this.render();
  }

  // 切换模型
  public changeModel = (val: any) => {
    this.modelChangeTool.changeModel(val);
    this.render();
  }

  // 切换画板 当前颜色
  public changeColor = (val: any) => {
    this.color = val;
    this.toolBox.curColor = val;
  }



  public backToCenter = () => {
    this.orbitControls.reset();
  }

  public zoomIn = () => {
    if (this.camera.zoom > 1.5) return
    this.camera.zoom += 0.1;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  public zoomOut = () => {
    if (this.camera.zoom < 0.5) return
    this.camera.zoom -= 0.1;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  public uploadSkin = () => {
    return (document.querySelector("#upgrade_file") as any).click();
  }

  public backToDraft = (skinURL: string) => {
    this.scene.remove(this.skin.object);
    this.initSkin(skinURL);
  }

  public downloadSkin = () => {
    let imageURL = this.skin.skinCanvas().toDataURL();
    download(imageURL);
  }

  public downloadSkinHead = () => {
    let headURL = resizedCanvas(this.skin.headCanvas(), 1).toDataURL("image/png", 2.0);
    download(headURL);
  }

  public downloadCanvasCut = () => {
    let cavansCutURL = resizedCanvas(this.renderer.domElement, 1).toDataURL("image/png", 2.0);
    download(cavansCutURL);
  }

  getSkinURL = () => {
    return this.skin.skinCanvas().toDataURL();
  }

  getCanvasPicURL = () => {
    return resizedCanvas(this.renderer.domElement, 1).toDataURL("image/png", 2.0);
  }

  getHeadURL = () => {
    return resizedCanvas(this.skin.headCanvas(), 1).toDataURL("image/png", 2.0);
  }

  // 重置皮肤为ALex和Steve
  public resetSkin = () => {

    // console.log(this.skin.curModel)
    let imageUrl;
    // console.log(this.scene)
    this.scene.remove(this.skin.object);

    if (this.skin.curModel === 'Steve') {
      imageUrl = this.DEFAULT_SKIN_URL
    } else if (this.skin.curModel === 'Alex') {
      imageUrl = this.ALEX_SKIN_URL
    }

    this.initSkin(imageUrl);
  }

}



export { SkinEditor };
