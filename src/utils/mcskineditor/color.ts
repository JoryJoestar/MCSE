/**
 * 
 * @param str 
 * @returns 
 */
export const HexToRgb = (str: any) => {
  let r = /^\#?[0-9A-F]{6}$/;
  //test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false
  if (!r.test(str)) return alert('输入错误的hex颜色值');
  //replace替换查找的到的字符串
  str = str.replace("#", "");
  //match得到查询数组
  let hxs = str.match(/../g);
  for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
  return hxs;
}

/**
 * 
 * @param r 
 * @param g 
 * @param b 
 * @returns 
 */
export const RgbToHex = (r: any, g: any, b: any) => {
  let reg = /^\d{1,3}$/;
  if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return alert('输入错误的hex颜色值');
  let hexs = [r.toString(16), g.toString(16), b.toString(16)];
  for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
  return "#" + hexs.join("");
}

/**
 * 
 * @param color 
 * @param level 
 * @returns 
 */
export const getDarkColor = (color: string, level: number) => {
  let r = /^\#?[0-9A-F]{6}$/;
  if (!r.test(color)) return alert('输入错误的hex颜色值');
  let rgbc = HexToRgb(color);
  //floor 向下取整
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
  return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}

/**
 * 
 * @param color 
 * @param level 
 * @returns 
 */
export const getLightColor = (color: string, level: number) => {
  let r = /^\#?[0-9A-F]{6}$/;
  if (!r.test(color)) return alert('输入错误的hex颜色值');
  let rgbc = HexToRgb(color);
  for (let i = 0; i < 3; i++) rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
  return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
}
