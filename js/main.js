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

    if (typeof mraid !== 'undefined') {
      mraid.open(url);
    } else {
      window.open(url);
    }
  }
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {

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
  left.style.left = '0px'
  var right = document.createElement('div');
  right.id = 'right';
  right.style.left = '0px'

  left.innerHTML = '<img src="img/left.png" />'
  right.innerHTML = '<img src="img/right.png" />'

  function ComparisonComponent() {
    this.elements = {
      'right': right,
      'left': left
    }
    this.template = document.createElement('div');
    for (var el in this.elements) {
      this.template.appendChild(this.elements[el]);
    }
    this.template.id = 'ComparisonComponent'
    this.placement = 'default'
  }

  ComparisonComponent.prototype.style = function () {
    return '#ComparisonComponent { position: absolute; left: 0; top: 0; }' +
      '#ComparisonComponent > * { position: absolute; overflow: hidden; }';
  }
  ComparisonComponent.prototype.events = function (tpl) {
    var w = 320
    var split = Math.round(w/2)
    var right = tpl.querySelector('#left')
    right.style.width = split + 'px'
    this.template.addEventListener('mousemove', function(e) {
      var rectRight = right.getBound  ingClientRect()
      var rightOffset = {
        top: rectRight.top + document.body.scrollTop,
        left: rectRight.left + document.body.scrollLeft
      }
      var offX = (e.offsetX || e.clientX - rightOffset.left)
      right.style.width = offX + 'px'
    })
  }

  return new ComparisonComponent;
})();


// The main component
var HTML5Ad = (function () {
  var bootstrap = new mads({
    'render': this
  })

  var HTML5Ad = function (options) {
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
    console.log('inserted style');
  }

  HTML5Ad.prototype.events = function () {
    for (var i in this.components) {
      this.components[i].events(bootstrap.contentTag);
    }
  }

  HTML5Ad.prototype.render = function () {
    this.style();
    var adContainer = document.createElement('div');
    adContainer.id = "adContainer";
    for (var i in this.components) {
      this.style(this.components[i].style());
      this.components[i]["template"].innerHTML = this.components[i]["template"].innerHTML.replace(/src\=\"/g, 'src="' + bootstrap.path)
      adContainer.appendChild(this.components[i]["template"]);
    }
    bootstrap.contentTag.innerHTML = '';
    bootstrap.contentTag.appendChild(adContainer);
    this.events();
    console.log('rendered');
  }

  return HTML5Ad;
})();

var samsungAd = new HTML5Ad({
  components: [
    ComparisonComponent
  ]
});

console.log(samsungAd);
