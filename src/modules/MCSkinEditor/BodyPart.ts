import { Object3D } from "three";
import { Box } from "./Box";

class BodyPart {
    name: any;
    size: any;
    texture_offset: any;
    overlay_texture_offset: any;
    origin: any;
    position: any;
    texture: any;
    parent: any;
    overlay_size: any;
    object: any;

    base!: Box;
    overlay!: Box;

    constructor(e: any) {
        this.name = e.name;
        this.size = e.size;
        this.texture_offset = e.texture_offset;
        this.overlay_texture_offset = e.overlay_texture_offset;
        this.origin = e.origin;
        this.position = e.position;
        this.texture = e.texture;
        this.parent = e.parent;
        this.overlay_size = e.overlay;

        const t = this;
        // console.log(t)
        t.object = new Object3D();
        t.object.name = t.name + " bodypart";
        t.object.position.x = t.origin.x;
        t.object.position.y = t.origin.y;
        t.object.position.z = t.origin.z;
        (t.object.object = t).parent.object.add(t.object);

        t.base = new Box({
            name: t.name,
            size: t.size,
            position: t.position,
            texture_offset: t.texture_offset,
            texture: t.texture,
            parent: t,
            adjustment: t.overlay_size - 1
        });
        t.overlay = new Box({
            name: t.name + " overlay",
            size: t.size,
            position: t.position,
            texture_offset: t.overlay_texture_offset,
            texture: t.texture,
            parent: t,
            overlay: t.overlay_size
        });
    }
}

export { BodyPart }
