import { Scene } from "three";
import { Skin } from "./Skin";
import { ToolBox } from "./ToolBox";
import { SkinEditor } from ".";
import { addClass, removeClass, toggleClass } from "@/utils/js/index";

class ModelChangeTool {
    private alexSkinImage: any;
    public skinCtx: any;
    public history: any;
    private skineditor: SkinEditor;
    private skin: Skin;
    private scene: Scene;
    private toolBox: ToolBox;
    constructor(skineditor: SkinEditor, scene: Scene, skin: Skin, toolBox: ToolBox) {
        this.skineditor = skineditor;
        this.scene = scene;
        this.skin = skin;
        this.skinCtx = skin.skinCtx;
        this.toolBox = toolBox;

        (this.alexSkinImage = new Image).src = this.skineditor.ALEX_SKIN_URL;

    }

    u = (x: any, y: any, r: any) => {
        r && this.changeImageData(x + 5, y, 3, 4, -1);
        this.changeImageData(x + 8 + r, y, 3, 4, -1 - r);
        r && this.changeImageData(x + 5, y + 4, 3, 12, -1);
        this.changeImageData(x + 8, y + 4, 4, 12, -1);
        this.changeImageData(x + 13 - r, y + 4, 3, 12, r - 2);
        this.skinCtx.clearRect(x + 10, y + 0, 2, 4);
        this.skinCtx.clearRect(x + 14, y + 4, 2, 12);

    }

    p = (x: any, y: any, r: any) => {
        this.changeImageData(x + 8 + r, y, 3, 4, -1 - r, 1);
        r && this.changeImageData(x + 5, y, 3, 4, -1, 1);
        this.changeImageData(x + 13 - r, y + 4, 3, 12, r - 2, 1);
        this.changeImageData(x + 8, y + 4, 4, 12, -1, 1);
        r && this.changeImageData(x + 5, y + 4, 3, 12, -1, 1);
        if (r) {
            this.fillRect(x + 4, y, 16);
            this.fillRect(x + 8, y, 4);
            this.fillRect(x + 15, y + 4, 12);
        } else {
            this.fillRect(x + 7, y, 16);
            this.fillRect(x + 11, y, 4);
            this.fillRect(x + 12, y + 4, 12);
        }
    }

    changeImageData = (x: any, y: any, sizeX: any, sizeY: any, o: any, a?: any) => {
        a = a || 0;
        this.skinCtx.putImageData(this.skinCtx.getImageData(x + o * a, y, sizeX, sizeY), x, y)
    }

    fillRect = (x: any, y: any, sizeY: any) => {
        this.skinCtx.fillStyle = this.skinCtx.color;
        this.skinCtx.fillRect(x, y, 1, sizeY);
    }

    initModel = () => {
        this.skineditor.removeTheScene(this.skin.object);

        this.scene.remove(this.skin.object);
        this.skin.updateModel(this.skin.curModel);
        this.skineditor.changeStance('Default')
        this.scene.add(this.skin.object);

        this.skineditor.render();

        this._initModelLoaded(false);
    }


    _initModelLoaded = (modelSelect: boolean) => { }

    initModelLoaded = (call: (modelSelect: boolean) => void) => {
        this._initModelLoaded = call;
    }

    changeModel = (model: string) => {
        if (model === 'Alex') {
            this.skin.curModel = model
            // console.log(this.scene, this.skin.object);
            for (let element of (document.getElementsByClassName("bodypart") as any)) {
                addClass(element, "alex");
            }
        } else if (model === 'Steve') {
            this.skin.curModel = model
            for (let element of (document.getElementsByClassName("bodypart") as any)) {
                removeClass(element, "alex");
            }
        }

        if (this.toolBox.history.head() && this.toolBox.history.head().curSelectTool == this) {
            this.toolBox.history.undo();
        } else {
            let data = this.skinCtx.getImageData(0, 0, this.skineditor.SKIN_WIDTH, this.skineditor.SKIN_HEIGHT);
            this.toolBox.history.push(this.skinCtx, null, null, { object: { update: function () { } } }, null, null, this, { imageData: data, update: true, tool: 'modelChangeTool' });
            this.draw();
        }
    }

    draw = () => {
        // console.log(this.skineditor.toSKIN)
        if (!this.skineditor.toSKIN) {
            this.skinCtx.drawImage(this.alexSkinImage, 0, 0);
        } else {
            if (this.skin.curModel === 'Alex') {
                this.u(40, 16, 1);
                this.u(40, 32, 1);
                this.u(32, 48, 0);
                this.u(48, 48, 0);

            } else if (this.skin.curModel === 'Steve') {
                this.p(40, 16, 1);
                this.p(40, 32, 1);
                this.p(32, 48, 0);
                this.p(48, 48, 0);
            }
        }
        this.initModel();
    }

    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        ctx.clearRect(0, 0, this.skineditor.SKIN_WIDTH, this.skineditor.SKIN_HEIGHT);
        ctx.putImageData(data.imageData, 0, 0);
        this.initModel();
    }

}

export { ModelChangeTool }