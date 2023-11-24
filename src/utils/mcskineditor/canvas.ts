/**
 * @description 关于一些canvas操作功能封装
 * 
 */

// 修改图片大小
export const resizedCanvas = (canvas: HTMLCanvasElement, scale: number, w?: number, h?: number) => {
    let resizedCanvas = document.createElement("canvas");
    let resizedContext = resizedCanvas.getContext("2d") as CanvasRenderingContext2D;

    let width = w || canvas.width;
    let height = h || canvas.height;

    resizedCanvas.width = width * scale;
    resizedCanvas.height = height * scale;

    resizedCanvas.style.width = width + 'px';
    resizedCanvas.style.height = height + 'px';

    resizedContext.scale(scale, scale);

    resizedContext.drawImage(canvas, 0, 0, width, height);

    return resizedCanvas;
}

// 裁剪图片
export const cutCanvas = (canvas: HTMLCanvasElement, cx?: number, cy?: number, cw?: number, ch?: number, ix?: number, iy?: number, iw?: number, ih?: number) => {
    let cutCanvas = document.createElement("canvas");
    let cutContext = cutCanvas.getContext("2d") as CanvasRenderingContext2D;

    let canvasSPX = cx || null;
    let canvasSPY = cy || null;
    let canvasWidth = cw || null;
    let canvasHeight = ch || null;

    let imageSPX = ix || null;
    let imageSPY = iy || null;
    let imageWidth = iw || null;
    let imageHeight = ih || null;

    if (canvasSPX !== null && canvasSPY !== null && canvasWidth !== null && canvasHeight !== null && imageSPX !== null && imageSPY !== null && imageWidth !== null && imageHeight !== null) {
        cutContext.drawImage(canvas, canvasSPX, canvasSPY, canvasWidth, canvasHeight, imageSPX, imageSPY, imageWidth, imageHeight);
    }


}

// base64 转成 图片格式输出
export const base64ToBlob = (imageURL: string) => {
    const arr = imageURL.split(',');
    // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
    // image/png
    const mime = (arr[0] as any).match(/:(.*?);/)[1]; // image/png
    // [image,png] 获取图片类型后缀
    const suffix = mime.split('/')[1]; // png
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `skin.${suffix}`, {
        type: mime,
    });
}

export const download = (imageURL: string) => {
    const blob = base64ToBlob(imageURL);
    const blobUrl = window.URL.createObjectURL(blob);
    // 这里的文件名根据实际情况从响应头或者url里获取
    const filename = blob.name;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.click();
}