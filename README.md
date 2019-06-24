# Matrix-Rain-Generator
Generating canvas animation of matrix digital rain effect

# Usage:

# 1. Include ‘rain.js’ script:

```js
<script type='text/javascript' src='https://reiji.xyz/rain/rain.js'></script> 
```

# 2. Create new Rain object with static size as parameters or functions returning size for auto resizing:

```js
<script type='text/javascript'>
  function Init() {
    //static definition
    var static_rain = new Rain(200, 200);

    //auto resizing on change of w or h var
    var w = 200, h = 200;
    var auto_rain = new Rain(
      ()=>{return w;},
      ()=>{return h;});

    //auto resizing on window resize
    var window_scalable_rain = new Rain(
      ()=>{return window.innerWidth;},
      ()=>{return window.innerHeight;});
  }
</script>
...
<body onload='Init()'>

</body>
```

# 3. Call start() method of Rain to enable rain and get canvas element as result or load canvas as dataURL string using callback function:

```js
 <script type='text/javascript'>
  function Init() {
    var rain = new Rain(200, 200);
    
    //canvas appending option
    var canvas = rain.start({/*options*/});
    document.body.appendChild(canvas);


    //callback option
    var canvas = rain.start({/*options*/}, canvas => {
      document.body.style.background = url(${canvas.toDataURL()});
    });

    ...
    //to stop digital rain use:
    rain.stop();

  }
</script> 
```


# Available options:

- *backwards*: true / false ~ changes direction of digital rain
- **speed_min**: float ~ minimal speed of single digit
- speed_max: float ~ maximal speed of single digit (must be higher than speed_min) 
- particles_amount: int ~ defines max number of heads per column
- count_fps: true / false ~ counts fps and displays those as logs in console
- font_size: int ~ size of font displayed in digital rain
- font_style: style of font displayed in digital rain
- charArr: string ~ string array of characters displayed in digital rain
- disable_heads: true / false ~ discards first digit from being drawn on canvas
- disable_tails: true / false ~ discards tail of digits from being drawn on canvas
- color.[back / heads / tails]: {
- rgb: [int(0 – 255), int(0 – 255), int(0 – 255)] ~ rgb color of element
- a: float(0.0 – 0.1) ~ alpha channel (opacity) of element
- rainbow: true / false ~ determines if color of element should be modified every frame
- rainbow_speed: int(0-255) ~ determines how fast color of element should be modified
- rainbow_limit: int(0-255) ~ determines rgb lowest color limit (it won’t fall under that amount) }



# Default configuration:
```js
{
  backwards: false,
  speed_min: 0.6,
  speed_max: 1.4,
  particles_amount: 1,
  count_fps: false,
  font_size: 15,
  font_style: 'san-serif',
  charArr: 'アカサタナハマヤラワイキシチニヒミリヰウクスツヌフムユルエケセテネヘメレヱオコソトノホモヨロヲンあかさたなはまやらわいきしちにひみりゐうくすつぬふむゆるえけせてねへめれゑおこそとのほもよろをん0123456789',
  disable_heads: false,
  disable_tails: false,
  color: {
    back: {
      rgb: [0, 0, 0],
      a: 0.15,
      rainbow: false,
      rainbow_speed: 1,
      rainbow_limit: 0
    }, 
    heads: {
      rgb: [200, 200, 200],
      a: 0.8,
      rainbow: false,
      rainbow_speed: 1,
      rainbow_limit: 0
    },
    tails: {
      rgb: [102, 102, 102],
      a: 1,
      rainbow: false,
      rainbow_speed: 1,
      rainbow_limit: 0
    }
  }  
}
```
