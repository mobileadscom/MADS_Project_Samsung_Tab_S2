/*
 *
 * ytComponent - version 1
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var ytComponent = function (options) {

  this.player;
  this.replay = false;
  this.container = options.container;
  this.width = options.width;
  this.height = options.height;
  this.videoId = options.videoId;

  this.tracker = options.tracker || function () {};
  this.autoplay = options.autoplay || false;

  this.realTime;
  this.playTimeDone = [];

  this.loadAPI()
};

/*
 * Javascript Currying
 * For more info - http://www.dustindiaz.com/javascript-curry/
 */
ytComponent.prototype.curry = function (fn, scope /*, arguments */ ) {
  scope = scope || window;
  var actualArgs = arguments;

  return function () {
    var args = [];
    for (var j = 0; j < arguments.length; j++) {
      args.push(arguments[j]);
    }

    for (var i = 2; i < actualArgs.length; i++) {
      args.push(actualArgs[i]);
    }

    return fn.apply(scope, args);
  };
};

ytComponent.prototype.loadAPI = function () {
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


};

ytComponent.prototype.loadVideo = function () {
  this.player = new YT.Player(this.container, {
    width: this.width,
    height: this.height,
    videoId: this.videoId,
    events: {
      'onReady': this.curry(this.onPlayerReady, this),
      'onStateChange': this.curry(this.onPlayerStateChange, this)
    }
  });
};

/* On Youtube Player Ready*/
ytComponent.prototype.onPlayerReady = function (event, test) {
  /* autoplay */
  if (this.autoplay) {
    event.target.playVideo();
  }
};
/* Youtube Player State Change Events */
ytComponent.prototype.onPlayerStateChange = function (event) {
  /*
  -1 – unstarted
  0 – ended
  1 – playing
  2 – paused
  3 – buffering
  5 – video cued
  */

  if (event.data == 0) {
    /* next play is replay */
    this.replay = true;

    /* tracking */
    this.tracker.tracker('E', 'end');

    /* skip tracking */
    if (this.playTimeDone.indexOf(25) == -1 || this.playTimeDone.indexOf(50) == -1 || this.playTimeDone.indexOf(75) == -1) {
      this.tracker.tracker('E', 'skip');

      if (this.playTimeDone.indexOf(25) == -1) {
        this.tracker.tracker('E', 'play_25');
      }
      if (this.playTimeDone.indexOf(50) == -1) {
        this.tracker.tracker('E', 'play_50');
      }
      if (this.playTimeDone.indexOf(75) == -1) {
        this.tracker.tracker('E', 'play_75');
      }
    }

  } else if (event.data == 1) {

    /* tracking */
    if (!this.replay) {
      /* Start RealTime */
      this.realTime = setInterval(this.curry(this.videoPlayLength, this), 100);

      this.tracker.tracker('E', 'playing');
    } else {
      this.tracker.tracker('E', 'replay');
    }
  } else if (event.data == 2) {

    /* Clear RealTime */
    clearInterval(this.realTime);
    /* tracking */
    this.tracker.tracker('E', 'paused');
  }
};

/*
 * Video play length algorithm
 *
 */
ytComponent.prototype.videoPlayLength = function () {
  /* Stop if its replay */
  if (this.replay) {
    clearInterval(this.realTime);
    return;
  }

  var duration = this.player.getDuration();
  var current = this.player.getCurrentTime();

  /* Calc percentage in quater of 0, 25, 50, 75, 100 */
  var perc = (Math.round(current / duration * 4) / 4).toFixed(2) * 100;

  if (perc == 25 && this.playTimeDone.indexOf(perc) == -1) {
    /* tracking */
    this.tracker.tracker('E', 'play_25');
  } else if (perc == 50 && this.playTimeDone.indexOf(perc) == -1) {
    /* tracking */
    this.tracker.tracker('E', 'play_50');
  } else if (perc == 75 && this.playTimeDone.indexOf(perc) == -1) {
    /* tracking */
    this.tracker.tracker('E', 'play_75');
  }
  this.playTimeDone.push(perc);

  /* Stop if completed */
  var complete = this.player.getPlayerState() == 0;
  if (complete) {
    clearInterval(this.realTime);
  }

};



/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */
var mads = function (options) {

  var _this = this;

  this.render = options.render;

  /* Body Tag */
  this.bodyTag = document.getElementsByTagName('body')[0];

  /* Head Tag */
  this.headTag = document.getElementsByTagName('head')[0];

  /* json */
  if (typeof json == 'undefined' && typeof rma != 'undefined') {
    this.json = rma.customize.json;
  } else if (typeof json != 'undefined') {
    this.json = json;
  } else {
    this.json = '';
  }

  /* fet */
  if (typeof fet == 'undefined' && typeof rma != 'undefined') {
    this.fet = rma.customize.fet;
  } else if (typeof json != 'undefined') {
    this.fet = fet;
  } else {
    this.fet = [];
  }

  this.fetTracked = false;

  /* load json for assets */
  this.loadJs(this.json, function () {
    _this.data = json_data;

    _this.render.render();
  });

  /* Get Tracker */
  if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
    this.custTracker = rma.customize.custTracker;
  } else if (typeof custTracker != 'undefined') {
    this.custTracker = custTracker;
  } else {
    this.custTracker = [];
  }

  /* CT */
  if (typeof ct == 'undefined' && typeof rma != 'undefined') {
    this.ct = rma.ct;
  } else if (typeof ct != 'undefined') {
    this.ct = ct;
  } else {
    this.ct = [];
  }

  /* CTE */
  if (typeof cte == 'undefined' && typeof rma != 'undefined') {
    this.cte = rma.cte;
  } else if (typeof cte != 'undefined') {
    this.cte = cte;
  } else {
    this.cte = [];
  }

  /* tags */
  if (typeof tags == 'undefined' && typeof tags != 'undefined') {
    this.tags = this.tagsProcess(rma.tags);
  } else if (typeof tags != 'undefined') {
    this.tags = this.tagsProcess(tags);
  } else {
    this.tags = '';
  }

  /* Unique ID on each initialise */
  this.id = this.uniqId();

  /* Tracked tracker */
  this.tracked = [];
  /* each engagement type should be track for only once and also the first tracker only */
  this.trackedEngagementType = [];
  /* trackers which should not have engagement type */
  this.engagementTypeExlude = [];
  /* first engagement */
  this.firstEngagementTracked = false;

  /* RMA Widget - Content Area */
  this.contentTag = document.getElementById('rma-widget');

  /* URL Path */
  this.path = typeof rma != 'undefined' ? rma.customize.src : '';

  /* Solve {2} issues */
  for (var i = 0; i < this.custTracker.length; i++) {
    if (this.custTracker[i].indexOf('{2}') != -1) {
      this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
    }
  }
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

  return new Date().getTime();
}

mads.prototype.tagsProcess = function (tags) {

  var tagsStr = '';

  for (var obj in tags) {
    if (tags.hasOwnProperty(obj)) {
      tagsStr += '&' + obj + '=' + tags[obj];
    }
  }

  return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

  if (typeof url != "undefined" && url != "") {

    if (typeof this.ct != 'undefined' && this.ct != '') {
      url = this.ct + encodeURIComponent(url);
    }

    if (typeof mraid !== 'undefined') {
      mraid.open(url);
    } else {
      window.open(url);
    }
  }
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {
  console.log(type, tt)

  /*
   * name is used to make sure that particular tracker is tracked for only once
   * there might have the same type in different location, so it will need the name to differentiate them
   */
  name = name || type;

  if (tt == 'E' && !this.fetTracked) {
    for (var i = 0; i < this.fet.length; i++) {
      var t = document.createElement('img');
      t.src = this.fet[i];

      t.style.display = 'none';
      this.bodyTag.appendChild(t);
    }
    this.fetTracked = true;
  }

  if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
    for (var i = 0; i < this.custTracker.length; i++) {
      var img = document.createElement('img');

      if (typeof value == 'undefined') {
        value = '';
      }

      /* Insert Macro */
      var src = this.custTracker[i].replace('{{rmatype}}', type);
      src = src.replace('{{rmavalue}}', value);

      /* Insert TT's macro */
      if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
        src = src.replace('tt={{rmatt}}', '');
      } else {
        src = src.replace('{{rmatt}}', tt);
        this.trackedEngagementType.push(tt);
      }

      /* Append ty for first tracker only */
      if (!this.firstEngagementTracked && tt == 'E') {
        src = src + '&ty=E';
        this.firstEngagementTracked = true;
      }

      /* */
      img.src = src + this.tags + '&' + this.id;

      img.style.display = 'none';
      this.bodyTag.appendChild(img);

      this.tracked.push(name);
    }
  }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
  var script = document.createElement('script');
  script.src = js;

  if (typeof callback != 'undefined') {
    script.onload = callback;
  }

  this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
  var link = document.createElement('link');
  link.href = href;
  link.setAttribute('type', 'text/css');
  link.setAttribute('rel', 'stylesheet');
  this.headTag.appendChild(link);
}

// Comparison Component - Draft for our modular/component pattern
// Still immature will need to rewrite to a better one
// But to reveal or share the structure of how it works is here
var ComparisonComponent = (function () {
  var left = document.createElement('div');
  left.id = 'left';
  var right = document.createElement('div');
  right.id = 'right';
  var thumb = document.createElement('div');
  thumb.id = 'thumb';
  var next = document.createElement('div');
  next.id = 'next'
  var video = document.createElement('div')
  video.id = 'video'
  var last = document.createElement('div')
  last.id = 'last'
  last.style.display = 'none'
  last.innerHTML = '<img src="img/last.png" />'
  var learnmore = document.createElement('div')
  learnmore.id = 'learnmore'
  learnmore.innerHTML = '<img src="img/learnmore-icn.png" />'
  last.appendChild(learnmore)

  var twittercon = document.createElement('div')
  twittercon.id = 'twittercon'
  twittercon.innerHTML = '<img src="img/twitter-icn.png" />'
  last.appendChild(twittercon)

  var fbcon = document.createElement('div')
  fbcon.id = 'fbcon'
  fbcon.innerHTML = '<img src="img/fb-icn.png" />'
  last.appendChild(fbcon)

  left.innerHTML = '<img src="img/left.png" />'
  right.innerHTML = '<img src="img/right.png" />'
  next.innerHTML = '<img src="img/next-icn.png" />'
  video.innerHTML = '<iframe id="video-yt" width="249" height="187" src="https://www.youtube.com/embed/_xwPX1lAlxs?rel=0&amp;showinfo=0&amp;enablejsapi=1" frameborder="0" allowfullscreen></iframe>'
  right.appendChild(video)
  right.appendChild(next)
  thumb.innerHTML = '<img src="img/slider-icn.png" />'


  function ComparisonComponent() {
    this.elements = {
      'right': right,
      'left': left,
      'thumb': thumb,
      'last': last
    }
    this.template = document.createElement('div');
    for (var el in this.elements) {
      this.template.appendChild(this.elements[el]);
    }
    this.template.id = 'ComparisonComponent'
    this.placement = 'default'
    this.style = '#ComparisonComponent { position: absolute; left: 0; top: 0; } ' +
      '#ComparisonComponent > * { position: absolute; overflow: hidden; }' +
      '#thumb { left: 0px; top: 186px; width: 320px; height: 187px; }' +
      '#thumb img { position: absolute; top: 75px; pointer-events: none; }' +
      '#next { position: absolute; bottom: 10px; right: 29px; }' +
      '#video { position: absolute; left: 34px; top: 186px; width: 249px; height: 187px; overflow: hidden;}' +
      '#learnmore {position: absolute; bottom: 22px; right: 18px;}' +
      '#twittercon { position: absolute; left: 115px; bottom: 22px;}' +
      '#fbcon { position: absolute; left: 68px; bottom: 22px; }'
  }

  ComparisonComponent.prototype.events = function (tpl, path, b) {
    var w = 320
    var split = Math.round(w / 2)
    var right = tpl.querySelector('#left')
    var left = tpl.querySelector('#right')
    var thumb = tpl.querySelector('#thumb')
    var next = tpl.querySelector('#next')
    var last = tpl.querySelector('#last')
    var learnmore = tpl.querySelector('#learnmore')
    var fbcon = tpl.querySelector('#fbcon')
    var twittercon = tpl.querySelector('#twittercon')


    learnmore.addEventListener('click', function () {
      b.tracker('E', 'learnmore')
      b.linkOpener('http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=20&mc=click&pli=19607784&PluID=0&ord=[timestamp]')
    })

    fbcon.addEventListener('click', function () {
      b.tracker('E', 'fb')
      var text = encodeURIComponent("Super productivity everywhere with Samsung Galaxy Tab S2 #LiveSuper. More info https://goo.gl/WTAQVx")
      var fburl = encodeURIComponent('https://goo.gl/WTAQVx')
      var title = encodeURIComponent("Samsung Galaxy Tab S2 #LiveSuper")
      var desc = encodeURIComponent("Super productivity everywhere with Samsung Galaxy Tab S2 #LiveSuper")
      b.linkOpener('https://www.facebook.com/sharer/sharer.php?u='+fburl+'&quote=' + text + '&caption='+text+'&title='+title+'&description='+desc)
    })

    twittercon.addEventListener('click', function () {
      b.tracker('E', 'twitter')
      var text = encodeURIComponent("Super productivity everywhere with Samsung Galaxy Tab S2 #LiveSuper. More info")
      var referrer = encodeURIComponent("http://www.samsung.com/id/galaxytabs2/?cid=ID_mobile_IMX_TabS2Product_20161117__MobileRMB_25-45MF__TabS2_MobileDevices")
      var url = encodeURIComponent("https://goo.gl/WTAQVx")
      b.linkOpener('https://twitter.com/intent/tweet?text='+text+'&original_referer='+referrer+'&url='+url+'&tw_p=tweetbutton&via=samsung_id')
      // b.linkOpener('https://twitter.com/samsung_id')
    })

    right.style.width = split + 'px'
    thumb.childNodes[0].style.left = (split - (117 / 2)) + 'px'

    thumb.childNodes[0].style.opacity = 1;

    function clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    }

    //requestAnimationFrame polyfill | Milos Djakonovic ( @Miloshio ) | MIT | https://github.com/milosdjakonovic/requestAnimationFrame-polyfill
    ! function (a) {
      for (var b = 1e3 / 60, c = [], d = !1, e = !1, f = [], g = function (a) {
          for (var b = 0; b < f.length; b++)
            if (f[b] === a) return f.splice(b, 1), !0
        }, h = function () {
          d = !1;
          var b = c;
          c = [];
          for (var f = 0; f < b.length; f++) {
            if (e === !0 && g(b[f])) return void(e = !1);
            b[f].apply(a, [(new Date).getTime()])
          }
        }, i = function (e) {
          return c.push(e), d === !1 && (a.setTimeout(h, b), d = !0), e
        }, j = function (a) {
          f.push(a), e = !0
        }, k = ["ms", "moz", "webkit", "o"], l = 0; l < k.length && !a.requestAnimationFrame; ++l) a.requestAnimationFrame = a[k[l] + "RequestAnimationFrame"], a.cancelAnimationFrame = a[k[l] + "CancelAnimationFrame"] || a[k[l] + "CancelRequestAnimationFrame"];
      a.requestAnimationFrame || (a.requestAnimationFrame = i), a.cancelAnimationFrame || (a.cancelAnimationFrame = j)
    }(window);

    function fadeOut(el, flag) {
      el.style.opacity = el.style.opacity || 1;

      (function fade() {
        if ((el.style.opacity -= .1) < 0.3) {
          if (flag)
            el.style.display = "none";
        } else {
          requestAnimationFrame(fade);
        }
      })();
    }

    // fade in

    function fadeIn(el, display) {
      el.style.opacity = el.style.opacity || 0;

      (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
          el.style.opacity = val;
          requestAnimationFrame(fade);
        }
      })();
    }

    next.addEventListener('click', function () {
      if (right.style.display === 'none') {
        fadeOut(left, true)
        last.style.opacity = 0
        last.style.display = 'block'
        fadeIn(last)
        b.tracker('E', 'next')
      } else {
        fadeOut(right, true)
        fadeOut(thumb, true)
      }
    })

    var thumbdown = false;

    thumb.addEventListener('mousedown', function () {
      thumbdown = true
      thumb.childNodes[0].src = path + 'img/thumb.png'
      fadeIn(thumb.childNodes[0])
      b.tracker('E', 'slidestart')
    })
    thumb.addEventListener('touchstart', function () {
      thumbdown = true
      thumb.childNodes[0].src = path + 'img/thumb.png'
      fadeIn(thumb.childNodes[0])
      b.tracker('E', 'slidestart')
    })

    thumb.addEventListener('mouseup', function () {
      thumbdown = false
      fadeOut(thumb.childNodes[0])
    })
    thumb.addEventListener('touchend', function () {
      thumbdown = false
      fadeOut(thumb.childNodes[0])
    })

    var thumbmousemove = function (e) {
      if (!thumbdown) return
      var rectRight = right.getBoundingClientRect()
      var rightOffset = {
        top: rectRight.top + document.body.scrollTop,
        left: rectRight.left + document.body.scrollLeft
      }
      var offX = (e.offsetX || e.clientX - rightOffset.left)
      right.style.width = offX + 'px'
      thumb.childNodes[0].style.left = clamp((offX - (43 / 2)), -20, 300) + 'px'
      if (20 > offX) {
        b.tracker('E', 'reveal')
        fadeOut(right, true)
        fadeOut(thumb, true)
        thumb.style.display = 'none'
        thumb.removeEventListener('mousemove', thumbmousemove)
      }
    }

    var thumbtouchmove = function (e) {
      if (!thumbdown) return
      var rectRight = right.getBoundingClientRect()
      var rightOffset = {
        top: rectRight.top + document.body.scrollTop,
        left: rectRight.left + document.body.scrollLeft
      }
      var rectThumb = thumb.getBoundingClientRect()
      var thumbOffset = {
        top: rectThumb.top + document.body.scrollTop,
        left: rectThumb.left + document.body.scrollLeft
      }
      var touch = e.touches[0] || e.changedTouches[0];
      var x = touch.pageX - thumbOffset.left
      var y = touch.pageY - thumbOffset.top

      var offX = (x || touch.clientX - rightOffset.left)
      right.style.width = offX + 'px'
      thumb.childNodes[0].style.left = clamp((offX - (43 / 2)), -20, 300) + 'px'
      if (20 > offX) {
        b.tracker('E', 'reveal')
        fadeOut(right, true)
        fadeOut(thumb, true)
        thumb.style.display = 'none'
        thumb.removeEventListener('touchmove', thumbtouchmove)
      }
    }

    thumb.addEventListener('mousemove', thumbmousemove)

    thumb.addEventListener('touchmove', thumbtouchmove)

  }

  return new ComparisonComponent;
})();


// The main component
var HTML5Ad = (function () {
  var bootstrap = new mads({
    'render': this
  })

  var HTML5Ad = function (options) {
    this.components = []
    this.bootstrap = bootstrap;
    if (options && options.components) {
      this.components = options.components
    }
    this.styles = {
      width: '320',
      height: '480'
    }
    this.render();
  }

  HTML5Ad.prototype.style = function (css) {
    if (!css) {
      css = 'body { margin: 0; padding: 0; } #adContainer { background: #ccc; position: absolute; left: 0; top: 0; width:' + this.styles.width + 'px; height:' + this.styles.height + 'px; }'
    }

    head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }

  HTML5Ad.prototype.events = function () {

    for (var i in this.components) {
      this.components[i].events(bootstrap.contentTag, bootstrap.path, bootstrap);
    }

  }

  HTML5Ad.prototype.render = function () {
    this.style();
    var adContainer = document.createElement('div');
    adContainer.id = "adContainer";
    for (var i in this.components) {
      this.style(this.components[i].style);
      this.components[i]["template"].innerHTML = this.components[i]["template"].innerHTML.replace(/src\=\"/g, 'src="' + bootstrap.path)
      adContainer.appendChild(this.components[i]["template"]);
    }
    bootstrap.contentTag.innerHTML = '';
    bootstrap.contentTag.appendChild(adContainer);
    this.events();

    window.np = new ytComponent({
      container: 'video-yt',
      videoId: '_xwPX1lAlxs',
      tracker: bootstrap
    })

  }

  return HTML5Ad;
})();


var samsungAd = new HTML5Ad({
  components: [
    ComparisonComponent
  ]
});

function onYouTubeIframeAPIReady() {
  np.loadVideo()
}
