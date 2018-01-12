# TinyColorExtractor
Gain img-color according to pixel-frequency, self-define quality, color-count, tolerance.

## install

```
$ npm install tiny-color-extractor
```

## Quick Start

```html
<script src="dist/tiny-color-extractor.min.js"></script>
```

```js
var TCE = new TinyColorExtractor(imgURl,function(data){
  console.log(data) // [[r,g,b],[r,g,b],...]
});
```

## Usage

#### options

- src
  - {String} Necessary.
- colorCount
  - {Number} Optional. Set quantities.
- quality
  - {Number} Optional. Color-quality, 1-10,Range 1-10,10 is the highest.
- tolerance
  - {Number} Optional. The bigger numerical value, the bigger color tolerance of the picture

```js
var TCE = new TinyColorExtractor({
  src: imgURL,
  colorCount: 10,
  quality: 5,
  tolerance: 10
},function(data){
  console.log(data) // Array([[r,g,b],[r,g,b],...])
});
```
