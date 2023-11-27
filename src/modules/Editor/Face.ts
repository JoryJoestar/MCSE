class Face {
    name: any;
    x: any;
    y: any;
    _offset: any;
    mirror: any;
    constructor(e?: any, t?: any, r?: any, i?: any, o?: any) {
        this.name = e;
        this.x = t;
        this.y = r;
        this._offset = i;
        this.mirror = !!o;
    }
    faces = (e: any) => {
        return e[this.x] * e[this.y]
    };
    offset = (e: any) => {
        const t = e.clone();
        return t.applyMatrix3(this._offset),
            t
    };
    position = (e: any, t: any) => {
        const r = this.offset(e);
        return this.mirror ? (r.x += Math.floor(t) % e[this.x], r.y += e[this.y] - 1 - Math.floor(t / e[this.x])) : (r.x += Math.floor(t) % e[this.x], r.y += Math.floor(t / e[this.x])),
            r
    };
}

export { Face }