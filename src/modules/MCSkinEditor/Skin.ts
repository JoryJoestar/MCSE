
import { Object3D, Vector2, Vector3 } from "three";
import { BodyPart } from "./BodyPart";
import { addClass, hasKey, removeClass } from "@/utils/js/index";

class Skin {
  private SKIN_WIDTH = 64;
  private SKIN_HEIGHT = 64;
  private SKIN_LEGACY_HEIGHT = 32;

  private poseTimer: any;
  private positions: any;
  private POSE_STEPS = 10;
  private POSE_INTERVAL = 10;

  private curSkinModelCanvas: any = {};
  public curSkinModelCtx: any;

  private normalSkinModelCanvas: any = {};
  private normalSkinModelCtx: any = {};

  private legacySkinModelCanvas: any = {};
  private legacySkinModelCtx: any = {};

  public object!: Object3D;
  public headObject!: Object3D;
  public curModel!: string;
  public bodyparts: any;
  public torso: any;
  public head: any;
  public left_arm: any;
  public right_arm: any;
  public left_leg: any;
  public right_leg: any;
  public skinImage: any;
  public skinCtx: any;

  constructor(skinImage: any) {
    // console.log('1')
    this.skinImage = skinImage;

    this.initSkinModel();

    this.initBodyParts(false);

  }

  initSkinModel = () => {

    this.legacySkinModelCanvas = document.createElement("canvas");
    this.legacySkinModelCanvas.width = this.SKIN_WIDTH;
    this.legacySkinModelCanvas.height = this.SKIN_LEGACY_HEIGHT;
    this.legacySkinModelCtx = this.legacySkinModelCanvas.getContext("2d", { willReadFrequently: true });

    // 正常模型 皮肤
    this.normalSkinModelCanvas = document.createElement("canvas");
    this.normalSkinModelCanvas.width = this.SKIN_WIDTH;
    this.normalSkinModelCanvas.height = this.SKIN_HEIGHT;
    this.normalSkinModelCtx = this.normalSkinModelCanvas.getContext("2d", { willReadFrequently: true });

    // 当前编辑 模型 皮肤
    this.curSkinModelCanvas = document.createElement("canvas");
    this.curSkinModelCanvas.width = this.SKIN_WIDTH;
    this.curSkinModelCanvas.height = this.SKIN_HEIGHT;

    this.curSkinModelCtx = this.skinCtx = this.curSkinModelCanvas.getContext("2d", { willReadFrequently: true });
    this.skinCtx.drawImage(this.skinImage, 0, 0);

    // console.log(this.skinCtx)
    // 如果图片高度为 32
    if (this.skinImage.height == this.SKIN_LEGACY_HEIGHT) {

      this.legacySkinModelCtx.translate(64, 0);
      this.legacySkinModelCtx.scale(- 1, 1);
      this.legacySkinModelCtx.drawImage(this.curSkinModelCanvas, 0, 0);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 52, 20, 12, 12, 16, 52, 12, 12);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 48, 20, 4, 12, 28, 52, 4, 12);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 52, 16, 4, 4, 24, 48, 4, 4);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 56, 16, 4, 4, 20, 48, 4, 4);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 48, 20, 4, 12, 28, 52, 4, 12);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 52, 16, 4, 4, 24, 48, 4, 4);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 12, 20, 12, 12, 32, 52, 12, 12);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 8, 20, 4, 12, 44, 52, 4, 12);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 12, 16, 4, 4, 40, 48, 4, 4);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 12, 16, 4, 4, 40, 48, 4, 4);
      this.skinCtx.drawImage(this.legacySkinModelCanvas, 16, 16, 4, 4, 36, 48, 4, 4);

    } else {

      // 判断模型
      if (this.skinCtx.getImageData(50, 16, 1, 1).data[3] === 0) {

        for (let element of (document.getElementsByClassName("bodypart") as any)) {
          addClass(element, "alex");
        }
        this.curModel = 'Alex';
      } else {
        for (let element of (document.getElementsByClassName("bodypart") as any)) {
          removeClass(element, "alex");
        }
        this.curModel = 'Steve';
      }


    }
  }

  initBodyParts = (e: any) => {
    this.object = new Object3D();


    this.bodyparts = [];
    this.head = null;
    this.torso = null;
    this.left_arm = null;
    this.left_leg = null;
    this.right_arm = null;
    this.right_leg = null;

    this.head = new BodyPart({
      name: "head",
      size: new Vector3(8, 8, 8),
      texture_offset: new Vector2(0, 0),
      overlay_texture_offset: new Vector2(32, 0),
      origin: new Vector3(0, 8, 0),
      position: new Vector3(0, 4, 0),
      texture: this.skinCtx,
      parent: this,
      overlay: 1
    });
    this.torso = new BodyPart({
      name: "torso",
      size: new Vector3(8, 12, 4),
      texture_offset: new Vector2(16, 16),
      overlay_texture_offset: new Vector2(16, 32),
      origin: new Vector3(0, 2, 0),
      position: new Vector3(0, 0, 0),
      texture: this.skinCtx,
      parent: this,
      overlay: .95
    });
    this.left_leg = new BodyPart({
      name: "left_leg",
      size: new Vector3(4, 12, 4),
      texture_offset: new Vector2(16, 48),
      overlay_texture_offset: new Vector2(0, 48),
      origin: new Vector3(2, -4, 0),
      position: new Vector3(0, -6, 0),
      texture: this.skinCtx,
      parent: this,
      overlay: 1
    });
    this.right_leg = new BodyPart({
      name: "right_leg",
      size: new Vector3(4, 12, 4),
      texture_offset: new Vector2(0, 16),
      overlay_texture_offset: new Vector2(0, 32),
      origin: new Vector3(-2, -4, 0),
      position: new Vector3(0, -6, 0),
      texture: this.skinCtx,
      parent: this,
      overlay: 1.01
    });
    if (this.curModel === 'Steve') {
      this.left_arm = new BodyPart({
        name: "left_arm",
        size: new Vector3(4, 12, 4),
        texture_offset: new Vector2(32, 48),
        overlay_texture_offset: new Vector2(48, 48),
        origin: new Vector3(4, 8, 0),
        position: new Vector3(2, -6, 0),
        texture: this.skinCtx,
        parent: this,
        overlay: 1.05
      });
      this.right_arm = new BodyPart({
        name: "right_arm",
        size: new Vector3(4, 12, 4),
        texture_offset: new Vector2(40, 16),
        overlay_texture_offset: new Vector2(40, 32),
        origin: new Vector3(- 4, 8, 0),
        position: new Vector3(- 2, -6, 0),
        texture: this.skinCtx,
        parent: this,
        overlay: 1.05
      })

    } else if (this.curModel === 'Alex') {
      this.left_arm = new BodyPart({
        name: "left_arm",
        size: new Vector3(3, 12, 4),
        texture_offset: new Vector2(32, 48),
        overlay_texture_offset: new Vector2(48, 48),
        origin: new Vector3(3.5, 8, 0),
        position: new Vector3(2, -6, 0),
        texture: this.skinCtx,
        parent: this,
        overlay: 1.05
      });
      this.right_arm = new BodyPart({
        name: "right_arm",
        size: new Vector3(3, 12, 4),
        texture_offset: new Vector2(40, 16),
        overlay_texture_offset: new Vector2(40, 32),
        origin: new Vector3(- 3.5, 8, 0),
        position: new Vector3(- 2, -6, 0),
        texture: this.skinCtx,
        parent: this,
        overlay: 1.05
      })

    }

    this.bodyparts = [this.head, this.torso, this.left_arm, this.right_arm, this.left_leg, this.right_leg];

    this.initSkinImageVisible(e);
  }

  initHeadObjet = () => {

  }

  initSkinImageVisible = (e: any) => {
    for (let t in this.bodyparts) {
      let bodypart = this.bodyparts[t];

      if (e) {
        bodypart.base.update();
        bodypart.overlay.update();
        let eleOverlay = document.querySelector("div[data-layer=overlay][data-bodypart=" + bodypart.name + "]")
        let eleBase = document.querySelector("div[data-layer=base][data-bodypart=" + bodypart.name + "]")

        bodypart.overlay.toggleVisibility(!hasKey(eleOverlay, "hidden", 'className'));
        bodypart.base.toggleVisibility(!hasKey(eleBase, "hidden", 'className'));
      }

      else {
        if (bodypart.overlay.object.children[0].userData.visible) {
          bodypart.overlay.toggleVisibility(true);
          let ele = document.querySelector("div[data-layer=overlay][data-bodypart=" + bodypart.name + "]") || null;
          if (ele !== null) {
            removeClass(ele, "hidden");
          }

        } else {
          bodypart.overlay.toggleVisibility(false);
          let ele = document.querySelector("div[data-layer=overlay][data-bodypart=" + bodypart.name + "]") || null;
          if (ele !== null) {
            addClass(ele, "hidden");
          }
        }

      }

    }
    // console.log(this.bodyparts)
  }

  /**
   * @description 更新模型
   * @param modelType 模型类型
   */
  updateModel = (modelType: string) => {
    this.curModel = modelType;
    // 重新渲染 部分身体结构
    this.initBodyParts(true);

  };

  /**
   * @description 当前皮肤 dataURL
   * @returns 皮肤 图片 dataURl
   */
  skinCanvas = () => {
    this.normalSkinModelCtx.clearRect(0, 0, this.SKIN_WIDTH, this.SKIN_HEIGHT);
    for (const e in this.bodyparts) {
      const t = this.bodyparts[e];
      const r = 2 * t.size.x + 2 * t.size.z;
      const i = t.size.z + t.size.y;
      this.normalSkinModelCtx.putImageData(this.skinCtx.getImageData(t.texture_offset.x, t.texture_offset.y, r, i), t.texture_offset.x, t.texture_offset.y);
      t.overlay.visible && this.normalSkinModelCtx.putImageData(this.skinCtx.getImageData(t.overlay_texture_offset.x, t.overlay_texture_offset.y, r, i), t.overlay_texture_offset.x, t.overlay_texture_offset.y)
    }
    return this.normalSkinModelCanvas;
  };

  headCanvas = () => {
    const headModelCanvas = document.createElement("canvas");
    const head = this.bodyparts[0];

    // scale 放大 清晰度
    let scale = 4;
    // console.log(head, head.overlay.visible);
    headModelCanvas.width = 8 * scale;
    headModelCanvas.height = 8 * scale;

    const ctx = headModelCanvas.getContext("2d", { willReadFrequently: true }) as any;

    ctx.clearRect(0, 0, head.size.x, head.size.y);

    // 首层双循环 是拿到皮肤data

    // 次层双循环 用于 增强清晰度
    for (let i = 0; i < head.size.x; i++) {
      for (let j = 0; j < head.size.y; j++) {
        let baseImageData = this.skinCtx.getImageData(8 + i, 8 + j, 1, 1)
        let overlayImageData = this.skinCtx.getImageData(8 + head.overlay_texture_offset.x + i, 8 + head.overlay_texture_offset.y + j, 1, 1);
        // overlay
        if (overlayImageData.data[3] === 255 && head.overlay.visible) {
          if (scale > 1) {
            for (let m = 0; m < scale; m++) {
              let x = m + (i * scale);
              for (let n = 0; n < scale; n++) {
                let y = n + (j * scale);
                // console.log(x, y)
                ctx.putImageData(overlayImageData, x, y)
              }
            }
            // console.log('i,j:', i, j)
          } else if (scale === 1) {
            ctx.putImageData(overlayImageData, i, j)
          }

        } else {
          // base
          if (scale > 1) {
            for (let m = 0; m < scale; m++) {
              let x = m + (i * scale);
              for (let n = 0; n < scale; n++) {
                let y = n + (j * scale);
                ctx.putImageData(baseImageData, x, y)
              }
            }
          } else if (scale === 1) {
            ctx.putImageData(baseImageData, i, j);
          }
        }
      }
    }

    return headModelCanvas;
  }

  // 修改动作
  apply = (bobyparts: any) => {
    if (bobyparts) {
      for (const name in this.bodyparts) {

        const onepart = this.bodyparts[name];
        const position = bobyparts[onepart.name];

        onepart.object.rotation.x = position.x;
        onepart.object.rotation.y = position.y;
        onepart.object.rotation.z = position.z;

        // console.log(onepart.name)
      }
    } else {
      this.poseTimer && window.clearInterval(this.poseTimer);
      let a = 0;
      const n: any = {};
      const s = this.positions;
      for (const name in this.bodyparts) {
        const onepart = this.bodyparts[name];
        n[onepart.name] = new Vector3(onepart.object.rotation.x, onepart.object.rotation.y, onepart.object.rotation.z)
      }
      this.poseTimer = window.setInterval(() => {
        for (const name in a++,
          this.bodyparts) {
          const onepart = this.bodyparts[name];
          const r = n[onepart.name].clone();
          const i = s[onepart.name].clone();
          i.sub(r);
          i.multiplyScalar(a / this.POSE_STEPS);
          r.add(i);
          onepart.object.rotation.x = r.x;
          onepart.object.rotation.y = r.y;
          onepart.object.rotation.z = r.z;
        }
        this.POSE_STEPS <= a && (window.clearInterval(this.poseTimer), this.poseTimer = null)
      },
        this.POSE_INTERVAL)
    }
  }

}

export { Skin }
