class TinyColorExtractor {
  /**
   * TinyColorExtractor constructor function
   *
   * @param {Object} options - See README
   * @constructor
   */
  constructor(options, callback){
    if(typeof options === 'object'){
      if(typeof options.src !== 'string') throw new Error('The value of src is incorrect');
      if(options.quality <= 0|| options.quality > 10|| typeof options.quality !== 'number') throw new Error('The value of quality is incorrect');
      if(options.tolerance <= 0|| options.tolerance > 100|| typeof options.tolerance !== 'number') throw new Error('The value of tolerance is incorrect');
      if(options.colorCount <= 0|| typeof options.colorCount !== 'number') throw new Error('The value of colorCount is incorrect');
      this.imgURL = options.src;
      this.quality = options.hasOwnProperty('quality') ? 11 - options.quality : 5;
      this.tolerance = options.hasOwnProperty('tolerance') ? options.tolerance : 10;
      this.colorCount = options.hasOwnProperty('colorCount') ? options.colorCount : 5;
    } else {
      if(typeof options !== 'string') throw new Error('The value of src is incorrect');
      this.imgURL = options;
      this.quality = 5;
      this.tolerance = 10;
      this.colorCount = 5;
    }

    let image = new Image();
    image.crossOrigin = '*';
    image.src = this.imgURL;
    image.addEventListener('load',()=>{
      this.pixels = new CanvasImage(image).getPixels();
      this.getColorData().then((colorData)=>{
        if(this.colorCount > colorData.length) throw new Error('ColorCount value beyond the range');
        let result = [];
        for(let m = 0, color, preColor, rTol, gTol, bTol, flag = true; m < this.colorCount; m++){
          if(result.length > 0){
            color = colorData[m][0].split(',');
            for(let n = 0; n < result.length; n++){
              rTol = Math.abs(color[0] - result[n][0]);
              gTol = Math.abs(color[1] - result[n][1]);
              bTol = Math.abs(color[2] - result[n][2]);
              if(rTol < this.tolerance || gTol < this.tolerance || bTol < this.tolerance){
                flag = false;
                break;
              }else{
                flag = true;
              }
            }
            if(flag){
              result.push(color);
            }else if(this.colorCount < colorData.length){
              this.colorCount += 1;
            }else{
              console.warn('tolerance overcounted, failed to gain enough data');
              this.colorCount = colorData.length;
            }
          }else{
            result.push(colorData[m][0].split(','));
          }
        }
        callback(result);
      });
    });
  }
  getColorData(){
    let colors = {};
    let colorData = [];
    this.colorMap(rgb=>{
       colors[rgb] = rgb in colors? colors[rgb] += 1: 1;
    })
    for(let item in colors){
      colorData.push([item,colors[item]]);
    }
    return new Promise((resolve,reject)=>{
      resolve(colorData.sort((x,y)=>{
        return y[1] - x[1];
      }))
    })
  }
  colorMap(callback){
    for(let i = 0; i < this.pixels.length; i += 4 * this.quality){
      if(this.pixels[i+3] < ( 1 << 8 ) / 2 ) continue;
      callback(this.rgbFormat(i));
    }
  }
  rgbFormat(offset){
    return `${this.pixels[offset]},${this.pixels[offset+1]},${this.pixels[offset+2]}`;
  }
}

class CanvasImage {
  constructor(image){
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = this.width = image.width;
    this.canvas.height = this.height = image.height;

    this.context.drawImage(image,0,0,image.width,image.height);
  }
  getPixels(){
    return this.context.getImageData(0,0,this.width,this.height).data;
  }
}
