import { Color } from "three";
import { SkinEditor } from ".";

class ToolBox {
    public DRAWING: boolean = false;
    private SkinEditor: SkinEditor;

    private ctx: any;
    private curSelectTool: any;
    public curTool: any;
    public curColor: any;
    public history: any;
    public brush: any;
    public bucket: any;
    public eraser: any;
    public dropper: any;
    static instance: ToolBox;


    constructor(SkinEditor: SkinEditor) {
        this.SkinEditor = SkinEditor;
        ToolBox.instance = this;

        this.curSelectTool = this.brush;
        this.curTool = 'brush'
        this.history = new History(SkinEditor);

        this.brush = new Brush(ToolBox.instance);
        this.bucket = new Bucket(ToolBox.instance);
        this.eraser = new Eraser(ToolBox.instance);
        this.dropper = new Dropper(ToolBox.instance);

        // console.log(SkinEditor)
    }

    // 切换工具 创造监听
    changeTool = (toolName: String) => {

        // $(".tool").removeClass("active");
        // $(this).addClass("active");
        if (toolName == 'brush') {
            this.curTool = 'brush'
            this.curSelectTool = this.brush;
        } else if (toolName == 'bucket') {
            this.curTool = 'bucket'
            this.curSelectTool = this.bucket;

        } else if (toolName == 'eraser') {
            this.curTool = 'eraser'
            this.curSelectTool = this.eraser;

        } else if (toolName == 'dropper') {
            this.curTool = 'dropper'
            this.curSelectTool = this.dropper;
        }

        // console.log(this.curTool, this.curSelectTool);


    }

    // 亮度
    brightness = (e: any) => {

    }

    // 颜色
    drawing = (e: any) => {
        // 判断是触摸点击 还是 鼠标点击
        if (typeof (e.touches) !== 'undefined') {
            e = e.touches[0]
        }
        let plane = this.SkinEditor.cast_ray(e.pageX, e.pageY);

        if (typeof (plane?.object) !== 'undefined') {
            let parent = (plane.object?.parent?.parent as any);
            let texture = parent.object.textureCoordinate(plane.object.userData.planeId);
            let data = this.curSelectTool.draw(this.ctx, texture.x, texture.y, parent, plane.object, this.SkinEditor.color);
            // console.log(Controling);
            if (typeof (data.update) !== 'undefined') {
                if (data.update) {
                    this.history.push(this.ctx, texture.x, texture.y, parent, plane.object, this.SkinEditor.color, this.curSelectTool, data);
                    this.SkinEditor.render();
                }
                // console.log(parent.object)
                return true;
            }

        } else {
            return false;
        }
    }

    setCtx = (ctx: any) => {
        this.ctx = ctx
    }

    move = (e: any) => {
        !this.DRAWING || e.touches && 1 != e.touches.length || this.drawing(e)
    }

    startDrawing = (e: any) => {
        return this.drawing(e) && (this.DRAWING = true);

    }

    stopDrawing = () => {
        this.DRAWING = false;
    }

    dblClick = (e: any) => {
        if (this.curSelectTool.dblClick) {
            // this.history.undo();
            // let historyLength = this.history.length();

            // 获取 当前工具 双击时使用的工具
            let curSelectTool = this.curSelectTool;

            this.curSelectTool = curSelectTool.dblClick;
            this.drawing(e);

            // 绘画完毕后返回
            this.curSelectTool = curSelectTool;

            // if (historyLength == this.history.length()) {
            //     this.history.redo();
            // }
        }
        e.preventDefault();
    }

}


export const rgbToHex = (r: any, g: any, b: any) => {
    if (255 < r || 255 < g || 255 < b) throw "Invalid color component";
    return "#" + ("000000" + (r << 16 | g << 8 | b).toString(16)).slice(- 6)
}

class History {
    private SkinEditor: SkinEditor;
    public undoHistoryJSON: any;
    public redoHistoryJSON: any;
    private timer: any;
    constructor(SkinEditor: SkinEditor) {
        this.SkinEditor = SkinEditor;
        this.undoHistoryJSON = new Array;
        this.redoHistoryJSON = new Array;

        // 初始化 监听器
        this.initHistoryListener('.undo', this.undo);
        this.initHistoryListener('.redo', this.redo);

    }

    initHistoryListener = (className: string, fun: any) => {
        let timer: any = null;
        document.querySelector(className)?.addEventListener('mousedown', (event: any) => {
            fun();
            timer = window.setInterval(fun, 100);
        })
        document.querySelector(className)?.addEventListener('click', (event: any) => {
            event.preventDefault()
        })
        document.addEventListener('mouseup', (event: any) => {
            timer && (window.clearInterval(timer), timer = null);
        })
    }

    undo = () => {
        let e = this.undoHistoryJSON.pop();
        if (e) {
            console.log('undo')
            this.redoHistoryJSON.push(e);
            e.curSelectTool.undo(e.ctx, e.x, e.y, e.parent, e.plane, e.color, e.data);
            e.parent.object.update();
        }
        this._pushLoaded(this.undoHistoryJSON.length, this.redoHistoryJSON.length);
        this.isNotSkinToSkin();
        this.SkinEditor.render()
    };

    redo = () => {
        let e = this.redoHistoryJSON.pop();
        if (e) {
            console.log('redo')
            this.undoHistoryJSON.push(e);
            e.curSelectTool.draw(e.ctx, e.x, e.y, e.parent, e.plane, e.color, e.data);
            e.parent.object.update();
        }
        this._pushLoaded(this.undoHistoryJSON.length, this.redoHistoryJSON.length);
        this.isNotSkinToSkin();
        this.SkinEditor.render()
    };

    push = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, curSelectTool: any, data: any) => {
        this.undoHistoryJSON.push({
            ctx: ctx,
            x: x,
            y: y,
            parent: parent,
            plane: plane,
            color: color,
            curSelectTool: curSelectTool,
            data: data
        });
        this.redoHistoryJSON = [];
        // console.log(this.undoHistoryJSON)
        this._pushLoaded(this.undoHistoryJSON.length, this.redoHistoryJSON.length);
        this.isNotSkinToSkin();
    }


    _pushLoaded = (undoHistoryLength: number, redoHistoryLength: number) => { };

    pushLoaded = (call: (undoHistoryLength: number, redoHistoryLength: number) => void) => {
        this._pushLoaded = call;
    };

    isNotSkinToSkin = () => {
        if (!this.SkinEditor.isSKIN) {
            if (!this.SkinEditor.toSKIN) {
                if (this.undoHistoryJSON.length > 0 && this.head() !== null && this.head().data.tool !== 'modelChangeTool') {
                    this.SkinEditor.toSKIN = true;
                }
            } else if (this.SkinEditor.toSKIN) {
                if (this.undoHistoryJSON.length == 0) {
                    this.SkinEditor.toSKIN = false;
                }
            }
        }
        // console.log(this.SkinEditor.toSKIN)

    }
    head = () => {
        return 0 < this.undoHistoryJSON.length ? this.undoHistoryJSON[this.undoHistoryJSON.length - 1] : null
    };

    length = () => {
        return this.undoHistoryJSON.length;
    }
}

class Brush {
    ToolBox: ToolBox
    dblClick: Bucket;
    constructor(ToolBox: ToolBox) {
        this.ToolBox = ToolBox;
        this.dblClick = new Bucket(this.ToolBox);
    }
    draw = (ctx: any, x: any, y: any, parent: any, plane: any, color: any) => {
        let imageData = ctx.getImageData(x, y, 1, 1).data;
        let imageColor = imageData[3] < 255 && parent.object.overlay ? null : rgbToHex(imageData[0], imageData[1], imageData[2]);
        if (imageColor == color) {
            return { update: false };
        }
        // 对图片进行
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
        // console.log(plane.material)
        // 对皮肤
        plane.material.color = new Color(color);
        if (parent.userData.type === 'overlay' && !plane.material.visible) {
            plane.material.visible = true;
            plane.material.opacity = 1;
        }

        return { tool: 'brush', prevColor: imageColor, update: true };
    };

    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        if (data.prevColor === null) {
            console.log('brush undo null')
            this.ToolBox.eraser.draw(ctx, x, y, parent, plane, color, data);
        } else {
            ctx.fillStyle = data.prevColor;
            ctx.fillRect(x, y, 1, 1);
            plane.material.color = new Color(data.prevColor);
        }
    };

}

class Bucket {
    ToolBox: ToolBox
    dblClick: DbBucket;
    constructor(ToolBox: ToolBox) {
        this.ToolBox = ToolBox;
        this.dblClick = new DbBucket(this.ToolBox);
    }

    draw = (ctx: any, x: any, y: any, parent: any, plane: any, color: any) => {
        let toward = plane.name;
        let selectPlane: any = null;
        let Face = parent.object.boxFace(plane.userData.planeId);
        let sizeOffset = Face.offset(parent.object.size);
        sizeOffset.add(parent.object.texture_offset);

        let faceX = parent.object.size[Face.x];
        let faceY = parent.object.size[Face.y];
        let originImageData = ctx.getImageData(sizeOffset.x, sizeOffset.y, faceX, faceY);
        let state = !1;
        // 记录当前整个面的状态
        for (let f = 0; f < faceX; f++) {
            for (let E = 0; E < faceY; E++) {
                let d = 4 * (f + E * faceX);
                if (rgbToHex(originImageData.data[d], originImageData.data[1 + d], originImageData.data[2 + d]) != color || 255 != originImageData.data[3 + d]) {
                    state = !0;
                    break
                }
            }
            if (state) break
        }

        // console.log(parent, selectPlane);

        if (state) {
            // 绘画
            for (let plane of parent.children) {
                if (plane.name === toward) {
                    selectPlane = plane;
                    break;
                }
            }
            if (selectPlane !== null) {
                // 对图片进行
                ctx.fillStyle = color;
                ctx.fillRect(sizeOffset.x, sizeOffset.y, faceX, faceY);
                // 皮肤
                for (let plane of selectPlane.children) {
                    if (plane.material.color !== new Color(color)) {
                        plane.material.color = new Color(color);
                        if (parent.userData.type === 'overlay' && !plane.material.visible) {
                            plane.material.visible = true;
                            plane.material.opacity = 1;
                        }
                    }
                }
                return {
                    tool: 'bucket', update: true, offset: sizeOffset, original: originImageData
                }
            } else {
                return { update: false };
            }
        } else {
            return { update: false };
        }

    }

    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        ctx.putImageData(data.original, data.offset.x, data.offset.y);
    }
}
class DbBucket {
    ToolBox: ToolBox
    constructor(ToolBox: ToolBox) {
        this.ToolBox = ToolBox;
    }

    draw = (ctx: any, x: any, y: any, parent: any, plane: any, color: any) => {
        let box = parent.object;
        let sizeOffset = box.size;
        let boxX = 2 * sizeOffset.z + 2 * sizeOffset.x;
        let boxY = sizeOffset.y + sizeOffset.z;
        let originImageData = ctx.getImageData(box.texture_offset.x, box.texture_offset.y, boxX, boxY);
        let state = !1;
        // 记录当前整个BOX的状态
        for (let f = 0; f < boxX; f++) {
            for (let E = 0; E < boxY; E++) {
                let d = 4 * (f + E * boxX);
                if (rgbToHex(originImageData.data[d], originImageData.data[1 + d], originImageData.data[2 + d]) != color || 255 != originImageData.data[3 + d]) {
                    state = !0;
                    break
                }

                if (state) break
            }
        }

        if (state) {
            // 绘画
            // 对图片进行
            ctx.fillStyle = color;
            ctx.fillRect(box.texture_offset.x, box.texture_offset.y, boxX, boxY)

            for (let group of parent.children) {
                for (let plane of group.children) {
                    if (plane.material.color !== new Color(color)) {
                        // 对皮肤
                        plane.material.color = new Color(color);
                        if (parent.userData.type === 'overlay' && !plane.material.visible) {
                            plane.material.visible = true;
                            plane.material.opacity = 1;
                        }
                    }
                }
            }
            return {
                tool: 'dbBucket', update: true, offset: box.texture_offset, original: originImageData
            }
        } else {
            return { update: false };
        }

    }

    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        ctx.putImageData(data.original, data.offset.x, data.offset.y);
    }
}

class Eraser {
    ToolBox: ToolBox;
    dblClick: DbEraser;
    constructor(ToolBox: ToolBox) {
        this.ToolBox = ToolBox;
        this.dblClick = new DbEraser(this.ToolBox);
    }
    draw = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {

        if (!parent.object.overlay) {
            return false;
        }
        let imageData = ctx.getImageData(x, y, 1, 1).data;
        let imageColor = imageData[3] < 255 ? null : rgbToHex(imageData[0], imageData[1], imageData[2]);
        // console.log(imageColor)

        if (imageColor !== null) {
            if (parent.object.overlay) {
                ctx.clearRect(x, y, 1, 1);
                plane.material.color = new Color(1, 1, 1);
                plane.material.visible = false;
                plane.material.opacity = 0;
            } else if (!parent.object.overlay) {
                // let color = new Color(1, 1, 1);
                // ctx.fillStyle = color
                // ctx.fillRect(x, y, 1, 1);
                // plane.material.color = color;
            }
            return { tool: 'eraser', update: true, prevColor: imageColor };
        } else {
            return { update: false };
        }

    }
    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        ctx.fillStyle = data.prevColor;
        ctx.fillRect(x, y, 1, 1);
        plane.material.color = new Color(data.prevColor);
    }

}

class DbEraser {
    ToolBox: ToolBox
    constructor(ToolBox: ToolBox) {
        this.ToolBox = ToolBox;
    }
    draw = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        // let box = parent.object;
        // let sizeBoxOffset = box.size;
        // let boxX = 2 * sizeBoxOffset.z + 2 * sizeBoxOffset.x;
        // let boxY = sizeBoxOffset.y + sizeBoxOffset.z;
        // let originBoxImageData = ctx.getImageData(box.texture_offset.x, box.texture_offset.y, boxX, boxY);
        // let state = !1;

        // for (let f = 0; f < boxX; f++) {
        //     for (let E = 0; E < boxY; E++) {
        //         if (0 !== originImageData.data[3 + 4 * (f + E * boxX)]) {
        //             state = !0;
        //             break
        //         }
        //     }
        //     if (state) break
        // }

        let toward = plane.name;
        let Face = parent.object.boxFace(plane.userData.planeId);
        let sizeFaceOffset = Face.offset(parent.object.size);
        sizeFaceOffset.add(parent.object.texture_offset);
        let faceX = parent.object.size[Face.x];
        let faceY = parent.object.size[Face.y];
        let originFaceImageData = ctx.getImageData(sizeFaceOffset.x, sizeFaceOffset.y, faceX, faceY);
        let state = !1;

        if (!parent.object.overlay) {
            return false;
        }

        for (let f = 0; f < faceX; f++) {
            for (let E = 0; E < faceY; E++) {
                let d = 4 * (f + E * faceX);
                if (originFaceImageData.data[3 + d] !== 0) {
                    state = !0;
                    break;
                }
            }
            if (state) break;
        }

        if (state) {

            // 这里对整个BOX 清除
            // 对图片进行
            // ctx.clearRect(box.texture_offset.x, box.texture_offset.y, boxX, boY);
            // 对皮肤
            // for (let group of parent.children) {
            //     for (let plane of group.children) {
            //         console.log(plane.material.visible)
            //         if (plane.material.visible) {

            //             plane.material.color = new Color(0, 0, 0);
            //             plane.material.visible = false;
            //             plane.material.opacity = 0;
            //         }
            //     }
            // }

            // 对单个面进行清楚
            ctx.clearRect(sizeFaceOffset.x, sizeFaceOffset.y, faceX, faceY);
            for (let group of parent.children) {
                if (group.name === toward) {
                    for (let plane of group.children) {
                        plane.material.color = new Color(1, 1, 1);
                        plane.material.visible = false;
                        plane.material.opacity = 0;
                    }
                    break;
                }
            }



            return {
                tool: 'dbEraser', update: true, offset: sizeFaceOffset, original: originFaceImageData
            }
            // return {
            //     tool: 'dbEraser', update: true, offset: box.texture_offset, original: originFaceImageData
            // }

        } else {
            return false;
        }
    }
    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        ctx.putImageData(data.original, data.offset.x, data.offset.y);
    }

}

class Dropper {
    ToolBox: ToolBox
    require_color = !0
    _dropperLoaded = (color: any) => { }

    constructor(ToolBox: ToolBox) {
        this.ToolBox = ToolBox;
    }
    draw = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        let imageData = ctx.getImageData(x, y, 1, 1).data;
        let imageColor = imageData[3] < 255 && parent.object.overlay ? null : rgbToHex(imageData[0], imageData[1], imageData[2]);
        let prevColor = this.ToolBox.curColor;
        // console.log(this.ToolBox.curColor)

        if (imageColor !== null) {
            this.ToolBox.curColor = imageColor;

            this._dropperLoaded(this.ToolBox.curColor);

            return { tool: 'dropper', update: true, prevColor: prevColor };
        } else {
            return false;
        }
    };

    undo = (ctx: any, x: any, y: any, parent: any, plane: any, color: any, data: any) => {
        // console.log(data);
        this.ToolBox.curColor = data.prevColor;
        this._dropperLoaded(this.ToolBox.curColor);
    }

    dropperLoaded = (call: (color: any) => void) => {
        this._dropperLoaded = call;
    }
}

export { ToolBox }