type BusClass = {
  emit: (name: string) => void;
  on: (name: string, callback: Function) => void;
};

type ParamsKey = string | number | symbol;

type List = { 
  [key: ParamsKey]: Array<Function>;
};
class Bus implements BusClass {
  list: List;
  constructor() {
    this.list = {};
  }
  // 发布
  emit(name: string, ...args: Array<any>) {
    // console.log(this.list[name]);
    let eventName: Array<Function> = this.list[name];
    // 发布给每一个
    if (eventName) {
      eventName.forEach((fn) => {
        fn.apply(this, args);
      });
    }
  }

  // 订阅
  on(name: string, callback: Function) {
    // 多次注册时，如果已经注册过了则返回注册过的，反之首次注册则返回空数组
    let fn: Array<Function> = this.list[name] || [];
    fn.push(callback);
    this.list[name] = fn;
  }
  off(name: string) {
    if (this.list[name]) {
      delete this.list[name];
    }
  }
}

export default new Bus();
