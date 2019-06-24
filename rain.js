/*
    Matrix Rain Generator. 
    Copyright (C) 2019 Reiji Yoshikuro.
    
    this program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.
     
    this program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

function Color(rgb, a = 1, limit = 0) {
    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];

    this.a = a;
    this.rainbow = false;
    this.rainbow_speed = 1;
    this.rainbow_limit = limit;
}

Color.prototype.set = function(rgb, a = this.a) {
    this.r = rgb[0];
    this.g = rgb[1];
    this.b = rgb[2];
    if(rgb.length > 2) this.a = rgb[3];
    if(rgb.length > 3) this.rainbow = rgb[4];
    else this.a = a;
}

Color.prototype.rgb = function(lock_rainbow = false) {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
}

Color.prototype.rgba = function(lock_rainbow = false) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
}

Color.prototype.nextColor = function() {
    let t = [this.r, this.g, this.b], changed = false;
    for(let i = 0; i < 3; i++) {
        if(t[(i + 1)%3] == 255 && t[i] > this.rainbow_limit) {
            t[i] = (t[i] - this.rainbow_speed < this.rainbow_limit) ? this.rainbow_limit : t[i] - this.rainbow_speed; 
            changed = true;
            break;
        }
    }
    for(let i = 0; i < 3 && !changed; i++) {
        if(t[i] == 255) {
            t[(i+1)%3] = (t[(i+1)%3] + this.rainbow_speed > 255) ? 255 : t[(i+1)%3] + this.rainbow_speed; 
            changed = true;
            break;
        }
    }
    if(!changed) t[0] = 255;
    this.r = t[0], this.g = t[1], this.b = t[2];
}

Color.requestRainbows = function(list) {
    for(let i = 0; i < list.length; i++) if(list[i].rainbow) list[i].nextColor();
}

randomFloat = function(min, max) {
    return Math.random() * ( max - min ) + min;
}

randomInt = function(min, max) {
    return Math.floor(Math.random() * ( max - min ) + min);
}

var Rain = function(w, h) {
    var cva = document.createElement('canvas'),
    cvb = document.createElement('canvas'),
    cvc = document.createElement('canvas');

    this.options = {
        pointArr: [],
        isStarted: false,
        reloading: false,
        raw_size: {
            w: w,
            h: h
        },
        size: {
            w: (w && {}.toString.call(w) === '[object Function]') ? w() : w,
            h: (h && {}.toString.call(h) === '[object Function]') ? h() : h
        },
        resize_timer: 100,
        listen_on: [],
        backwards: false,
        speed_min: 0.6,
        speed_max: 1.4,
        particles_amount: 1,
        disable_heads: false,
        disable_tails: false,
        max_columns: 0,
        count_fps: false,
        fps_ticks: 0,
        fps: 0,
        font_size: 15,
        font_style: 'san-serif',
        canvas: {
            a: cva,
            ctx_a: cva.getContext('2d'),
            b: cvb,
            ctx_b: cvb.getContext('2d'),
            c: cvc,
            ctx_c: cvc.getContext('2d')
        },
        charArr: `アカサタナハマヤラワイキシチニヒミリヰウクスツヌフムユルエケセテネヘメレヱオコソトノホモヨロヲンあかさたなはまやらわいきしちにひみりゐうくすつぬふむゆるえけせてねへめれゑおこそとのほもよろをん0123456789`,
        color: {
            back: new Color([0, 0, 0], 0.15, this.options),
            heads: new Color([200, 200, 200], 0.8, this.options),
            tails: new Color([102, 102, 102], 1, this.options)
        },
        timers: {
            fps: null,
        },
        proto: {},
    };

    var fpsCounter = function(opt) {
        opt.fps = opt.fps_ticks;
        console.log(opt.fps);
        opt.fps_ticks = 0;
    }

    this.countFps = function(state, opt = null) {
        if(opt == null) opt = this.options;
        if(!opt) return;
        if(opt.count_fps == state && !!opt.timers.fps == state) return;
        if(opt.timers.fps) {
            clearInterval(opt.timers.fps);
            opt.timers.fps = null;
        }
        if(state) opt.timers.fps = setInterval((opt_ = opt)=>{fpsCounter(opt_);}, 1000);
        opt.count_fps = state;
    }
    this.options.proto.countFps = this.countFps;

    this.reload = function(opt) {
        opt.reloading = true;
        opt.canvas.a.width = (opt.canvas.b.width = (opt.canvas.c.width = opt.size.w));
        opt.canvas.a.height = (opt.canvas.b.height = (opt.canvas.c.height = opt.size.h));
        if(opt.count_fps) opt.proto.countFps(1, opt);

        opt.pointArr = [];
        opt.max_columns = opt.size.w/(opt.font_size);

        let pos = ()=>{return randomFloat(opt.size.h * (opt.backwards ? 2 : -1),opt.backwards ? opt.size.h : 0);}
        let speed = ()=>{return randomFloat(opt.font_size * opt.speed_min, opt.font_size * opt.speed_max);}

        for(var i = 0; i < opt.max_columns ; i++) {
            opt.pointArr.push(new Point(i*opt.font_size,pos(), speed()));   
            let j = opt.particles_amount;
            while(randomInt(0, j--)) opt.pointArr.push(new Point(i*opt.font_size,pos(), speed()));   
        }
        opt.reloading = false;
    }

    var resizeListener = function(opt, fnc) {
        for(let i = 0; i < opt.listen_on.length; i++) {
            let size = parseInt(opt.raw_size[opt.listen_on[i]]());
            if(size != opt.size[opt.listen_on[i]]) {
                opt.size[opt.listen_on[i]] = size;
                fnc(opt);
            }
        }
    }

    if(w && h && {}.toString.call(w) === '[object Function]' || {}.toString.call(h) === '[object Function]') {
        if({}.toString.call(w) === '[object Function]') this.options.listen_on.push('w');
        if({}.toString.call(h) === '[object Function]') this.options.listen_on.push('h');
        setInterval((opt = this.options, fnc = this.reload) => {resizeListener(opt, fnc);}, this.options.resize_timer);
    }
    else this.options.size.w = w, this.options.size.h = h;

    this.update_ = function(opt) {
        if(opt.reloading) return;
        if(opt.count_fps) opt.fps_ticks++;
        opt.canvas.ctx_a.fillStyle = opt.color.back.rgba();
        opt.canvas.ctx_a.fillRect(0,0,opt.size.w,opt.size.h);
    
        opt.canvas.ctx_b.clearRect(0,0,opt.size.w,opt.size.h);
    
        for(let i = 0; i < opt.pointArr.length; i++) opt.pointArr[i].draw(opt);
    
        Color.requestRainbows([opt.color.back, opt.color.heads, opt.color.tails]);
        opt.canvas.ctx_c.clearRect(0,0,opt.size.w,opt.size.h);
        opt.canvas.ctx_c.drawImage(opt.canvas.a, 0, 0);
        opt.canvas.ctx_c.drawImage(opt.canvas.b, 0, 0);
    }

    this.start = function(options, callback) {
        let opt = this.options;
        if(options) for(let key in options) if(opt[key] !== undefined) {
            if(key == 'color') { for(let subkey in options.color) if(opt.color[subkey]) {
                    if(options.color[subkey].rgb) opt.color[subkey].set(options.color[subkey].rgb); 
                    if(options.color[subkey].a) opt.color[subkey].a = options.color[subkey].a; 
                    if(options.color[subkey].rainbow) opt.color[subkey].rainbow = options.color[subkey].rainbow; 
                    if(options.color[subkey].rainbow_speed) opt.color[subkey].rainbow_speed = options.color[subkey].rainbow_speed; 
                    if(options.color[subkey].rainbow_limit) opt.color[subkey].rainbow_limit = options.color[subkey].rainbow_limit; 
                }
                        
            }
            else opt[key] = options[key];
        }
        this.reload(opt);
        
        if(opt.isStarted) return console.error('This object is started already!');
        opt.isStarted = true;
        var te = function(timestamp, update_, opt) {
            update_(opt);
            if(callback) callback(opt.canvas.c);
    
            if(opt && opt.isStarted) requestAnimationFrame((timestamp, update = update_, opt_ = opt)=>{te(timestamp, update, opt_)});
            else console.log(opt);
        }
        te(0, this.update_, opt);
        return opt.canvas.c;
    }
}

Rain.prototype.stop = function() {
    this.options.isStarted = false;
}

var Point = function(x, y, speed, opt) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.options = opt;
}

Point.prototype.draw = function(opt){
    let char = opt.charArr[randomInt(0,opt.charArr.length-1)].toUpperCase();

    if(!opt.disable_heads) {
        opt.canvas.ctx_b.fillStyle = opt.color.heads.rgba();
        opt.canvas.ctx_b.font = `${opt.font_size}px ${opt.font_style}`;
        opt.canvas.ctx_b.fillText(char,this.x,this.y);
    }
    
    if(!opt.disable_tails) {
        opt.canvas.ctx_a.fillStyle = opt.color.tails.rgba();
        opt.canvas.ctx_a.font = `${opt.font_size}px ${opt.font_style}`;
        opt.canvas.ctx_a.fillText(char,this.x,this.y);
    }
    
    this.y += opt.backwards ? -this.speed : this.speed;
    if(opt.backwards ? (this.y < 0) : (this.y > opt.size.h)) {
        this.y = randomFloat(opt.backwards ? opt.size.h + 100 : -100, opt.backwards ? opt.size.h : 0);
        this.speed = randomFloat(opt.font_size * opt.speed_min, opt.font_size * opt.speed_max);
    }
}