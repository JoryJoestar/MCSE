import { Face } from "./Face";
import { Grid } from "./Grid";
import { Color, Group, Matrix3, Object3D, Vector3 } from "three";
import { Plane } from "./Plane";

const FACES = [
    new Face("left", "z", "y", new Matrix3().set(1, 0, 1, 0, 0, 1, 0, 0, 0)),
    new Face("right", "z", "y", new Matrix3().set(0, 0, 0, 0, 0, 1, 0, 0, 0)),
    new Face("top", "x", "z", new Matrix3().set(0, 0, 1, 0, 0, 0, 0, 0, 0)),
    new Face("bottom", "x", "z", new Matrix3().set(1, 0, 1, 0, 0, 0, 0, 0, 0), !0),
    new Face("front", "x", "y", new Matrix3().set(0, 0, 1, 0, 0, 1, 0, 0, 0)),
    new Face("back", "x", "y", new Matrix3().set(1, 0, 2, 0, 0, 1, 0, 0, 0))
];

class Box {
    name: any;
    size: any;
    position: any;
    texture_offset: any;
    texture: any;
    parent: any;
    overlay: any;
    visible: any;
    adjustment: any;

    box_geometry!: any;
    box_size!: Vector3;
    box!: any;
    object: any;
    grid: Grid;

    left_plane!: Plane;
    right_plane!: Plane;
    top_plane!: Plane;
    bottom_plane!: Plane;
    front_plane!: Plane;
    back_plane!: Plane;

    constructor(e: any) {

        this.name = e.name;
        this.size = e.size;
        this.position = e.position;
        this.texture_offset = e.texture_offset;
        this.texture = e.texture;
        this.parent = e.parent;
        this.overlay = e.overlay || !1;
        this.visible = !this.overlay;
        this.adjustment = e.adjustment || 0;

        this.object = new Object3D();
        this.object.name = this.name;
        this.object.position.x = this.position.x;
        this.object.position.y = this.position.y;
        this.object.position.z = this.position.z;
        (this.object.object = this).parent.object.add(this.object);
        this.box_size = this.size.clone();
        this.overlay ? this.box_size.add(new Vector3(this.overlay, this.overlay, this.overlay)) : this.adjustment && this.box_size.add(new Vector3(this.adjustment, this.adjustment, this.adjustment));
        this.t();
        this.grid = new Grid({
            name: this.name,
            size: this.size,
            box_size: this.box_size,
            parent: this
        });
        // console.log(this)

    }

    t() {
        this.box = new Group();
        this.box.name = this.name;
        this.box.visible = this.visible;
        (this.box.object = this).object.add(this.box);

        let offset_x = this.box_size.x / 2;
        let offset_y = this.box_size.y / 2;
        let offset_z = this.box_size.z / 2;

        if (this.overlay) {
            this.left_plane = new Plane(this.box_size.z, this.box_size.y, this.size.z, this.size.y, 'left', 'z', 'y', offset_x, 'overlay');
            this.box.add(this.left_plane.plane);
            this.right_plane = new Plane(this.box_size.z, this.box_size.y, this.size.z, this.size.y, 'right', 'z', 'y', offset_x, 'overlay');
            this.box.add(this.right_plane.plane);
            this.top_plane = new Plane(this.box_size.x, this.box_size.z, this.size.x, this.size.z, 'top', 'x', 'z', offset_y, 'overlay');
            this.box.add(this.top_plane.plane);
            this.bottom_plane = new Plane(this.box_size.x, this.box_size.z, this.size.x, this.size.z, 'bottom', 'x', 'z', offset_y, 'overlay');
            this.box.add(this.bottom_plane.plane);
            this.front_plane = new Plane(this.box_size.x, this.box_size.y, this.size.x, this.size.y, 'front', 'x', 'y', offset_z, 'overlay');
            this.box.add(this.front_plane.plane);
            this.back_plane = new Plane(this.box_size.x, this.box_size.y, this.size.x, this.size.y, 'back', 'x', 'y', offset_z, 'overlay');
            this.box.add(this.back_plane.plane);
            this.box.userData.type = 'overlay';
        } else {
            this.left_plane = new Plane(this.box_size.z, this.box_size.y, this.size.z, this.size.y, 'left', 'z', 'y', offset_x, 'normal');
            this.box.add(this.left_plane.plane);
            this.right_plane = new Plane(this.box_size.z, this.box_size.y, this.size.z, this.size.y, 'right', 'z', 'y', offset_x, 'normal');
            this.box.add(this.right_plane.plane);
            this.top_plane = new Plane(this.box_size.x, this.box_size.z, this.size.x, this.size.z, 'top', 'x', 'z', offset_y, 'normal');
            this.box.add(this.top_plane.plane);
            this.bottom_plane = new Plane(this.box_size.x, this.box_size.z, this.size.x, this.size.z, 'bottom', 'x', 'z', offset_y, 'normal');
            this.box.add(this.bottom_plane.plane);
            this.front_plane = new Plane(this.box_size.x, this.box_size.y, this.size.x, this.size.y, 'front', 'x', 'y', offset_z, 'normal');
            this.box.add(this.front_plane.plane);
            this.back_plane = new Plane(this.box_size.x, this.box_size.y, this.size.x, this.size.y, 'back', 'x', 'y', offset_z, 'normal');
            this.box.add(this.back_plane.plane);
            this.box.userData.type = 'base';
        }

        let sum = 0;
        let id = 0;
        // console.log(this.box)
        for (let group of this.box.children) {
            group.userData.planeNum = group.children.length;
            sum += group.userData.planeNum;
            for (let plane of group.children) {
                plane.userData.planeId = id++;
                let texture = this.textureCoordinate(plane.userData.planeId);
                let imageData = this.texture.getImageData(texture.x, texture.y, 1, 1).data;

                if (imageData[3] === 255) {
                    // console.log(imageData);
                    let color = new Color(0);
                    color.setRGB(imageData[0] / 255, imageData[1] / 255, imageData[2] / 255, "srgb");
                    
                    plane.material.color = color;

                    if (this.box.userData.type === 'overlay') {
                        plane.material.visible = true;
                        plane.material.opacity = 1;
                        // 判断当前部分overlay是否显示
                        this.box.userData.visible = true;
                    }
                }
                // console.log(color, plane.material.color)
                // console.log(plane)
            }
        }
        this.box.userData.planeNum = sum;

    }

    onefaceToColor = () => {

    }

    update = () => {
        this.object.remove(this.box);
        this.t();
    };
    toggleVisibility = (e: any) => {
        this.visible = e;
        this.box.visible = e;
    };
    textureCoordinate = (e: any, t?: any) => {
        let r: any;
        for (r in FACES) {
            let i = FACES[r].faces(this.size);
            if (e < i) break;
            e -= i
        }
        if (r = FACES[(r as any)], t) return r;
        let o = r.position(this.size, e);
        return o.add(this.texture_offset),
            o
    };
    boxFace = (e: any) => {
        return this.textureCoordinate(e, !0)
    };
    facesOnFace = (e: any) => {
        let t: any;
        let r = 0;
        for (t in FACES) {
            const i = FACES[t].faces(this.size);
            if (FACES[t] == e) break;
            r += i
        }
        return this.box_geometry.faces.slice(r, r + FACES[t].faces(this.size))
    };

}





export { Box }