import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from "three";

const materialsGridOverlay = new MeshBasicMaterial({
    color: 15658734,
    wireframe: !0,
    wireframeLinewidth: .6
})
const materialsGridBase = new MeshBasicMaterial({
    color: 4473924,
    wireframe: !0,
    wireframeLinewidth: .6
})

class Grid {
    name: string;
    size: Vector3;
    box_size: Vector3;
    parent: any;
    GRID_OFFSET = .01;
    box_geometry: any;
    box: any;

    constructor(e: any) {
        this.name = e.name;
        this.size = e.size;
        this.box_size = e.box_size;
        this.parent = e.parent;

        this.box_size.add(new Vector3(this.GRID_OFFSET, this.GRID_OFFSET, this.GRID_OFFSET));
        this.box_geometry = new BoxGeometry(this.box_size.x, this.box_size.y, this.box_size.z, this.size.x, this.size.y, this.size.z);
        if (this.parent.overlay) {
            this.box = new Mesh(this.box_geometry, materialsGridOverlay);
        } else {
            this.box = new Mesh(this.box_geometry, materialsGridBase);
        }
        this.box.name = this.name + " grid";
        this.box.ignore_intersect = !0;
        this.box.visible = !1;

        this.parent.object.add(this.box);
    }
}

export { Grid }
