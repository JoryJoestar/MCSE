import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from "three";

class Plane {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
    boxPlanePos: string;
    widthIndex: string;
    heightIndex: string;
    object: any;
    parent: any;

    singlePlaneSize: Vector2;
    plane: any;
    offset: any;
    type: any;

    constructor(width: number, height: number, widthSegments: number, heightSegments: number, boxPlanePos: string, widthIndex: string, heightIndex: string, offset: number, type: string) {
        this.width = width;
        this.height = height;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.boxPlanePos = boxPlanePos;
        this.widthIndex = widthIndex;
        this.heightIndex = heightIndex;
        this.offset = offset;
        this.type = type;
        this.plane = new Group();
        this.plane.name = this.boxPlanePos;
        this.singlePlaneSize = new Vector2((this.width / this.widthSegments), (this.height / this.heightSegments));
        // console.log(boxPlanePos, this.singlePlaneSize);
        this.planeSegments();

    }

    planeSegments = () => {
        for (let i = 0; i < this.heightSegments; i++) {
            for (let j = 0; j < this.widthSegments; j++) {
                let geometry = new PlaneGeometry(this.width / this.widthSegments, this.height / this.heightSegments);
                let material: any;
                if (this.type === 'normal') {
                    material = new MeshBasicMaterial({
                        vertexColors: !1,
                        side: 2,
                        // wireframe: !0,
                        // wireframeLinewidth: .3
                    });

                } else if (this.type === 'overlay') {
                    material = new MeshBasicMaterial({
                        vertexColors: !1,
                        visible: !1,
                        opacity: 0,
                        side: 2,
                    })
                }
                let mesh = new Mesh(geometry, material);
                mesh.userData.planePos = new Vector2(i, j);
                mesh.name = this.boxPlanePos;
                this.addPlaneGroup(mesh, i, j);
            }
        }

    }

    addPlaneGroup = (mesh: Mesh, i: number, j: number) => {
        if (this.boxPlanePos === 'left') {
            mesh.position.x += this.offset
            mesh.rotation.y += Math.PI / 2;

            mesh.position.y += (this.height - this.singlePlaneSize.y) / 2;
            mesh.position.z += (this.width - this.singlePlaneSize.x) / 2;

            mesh.position.y -= this.singlePlaneSize.y * i;
            mesh.position.z -= this.singlePlaneSize.x * j;


        }

        else if (this.boxPlanePos === 'right') {
            mesh.position.x -= this.offset
            mesh.rotation.y -= Math.PI / 2;

            mesh.position.y += (this.height - this.singlePlaneSize.y) / 2;
            mesh.position.z -= (this.width - this.singlePlaneSize.x) / 2;

            mesh.position.y -= this.singlePlaneSize.y * i;
            mesh.position.z += this.singlePlaneSize.x * j;

        }

        else if (this.boxPlanePos === 'top') {
            mesh.position.y += this.offset
            mesh.rotation.x += Math.PI / 2;

            mesh.position.z -= (this.height - this.singlePlaneSize.y) / 2;
            mesh.position.x -= (this.width - this.singlePlaneSize.x) / 2;

            mesh.position.z += this.singlePlaneSize.y * i;
            mesh.position.x += this.singlePlaneSize.x * j;

        }

        else if (this.boxPlanePos === 'bottom') {
            mesh.position.y -= this.offset;
            mesh.rotation.x -= Math.PI / 2;

            mesh.position.z += (this.height - this.singlePlaneSize.y) / 2;
            mesh.position.x -= (this.width - this.singlePlaneSize.x) / 2;

            mesh.position.z -= this.singlePlaneSize.y * i;
            mesh.position.x += this.singlePlaneSize.x * j;

        }

        else if (this.boxPlanePos === 'front') {
            mesh.position.z += this.offset

            mesh.position.y += (this.height - this.singlePlaneSize.y) / 2;
            mesh.position.x -= (this.width - this.singlePlaneSize.x) / 2;

            mesh.position.y -= this.singlePlaneSize.y * i;
            mesh.position.x += this.singlePlaneSize.x * j;

        }

        else if (this.boxPlanePos === 'back') {
            mesh.position.z -= this.offset;

            mesh.position.y += (this.height - this.singlePlaneSize.y) / 2;
            mesh.position.x += (this.width - this.singlePlaneSize.x) / 2;

            mesh.position.y -= this.singlePlaneSize.y * i;
            mesh.position.x -= this.singlePlaneSize.x * j;
        }

        // console.log(mesh)

        this.plane.add(mesh)
    }



}

export { Plane }