function Sipario(selectorOrElement, optionsObject) {

  // values
  var zIndexBase = 0;
  var childrenHeights = [];
  var currentHash = "";
  var isScrolling = false;

  // callbacks
  var cbSiparioDOMReady = null;
  var cbSiparioReady = null;

  // elements
  var siparioContainer;
  if (typeof selectorOrElement === "string") {
    siparioContainer = document.querySelector(selectorOrElement);
  } else if (selectorOrElement.querySelector) {
    siparioContainer = selectorOrElement;
  } else {
    throw ("Sipario was not able to find the container element. Please, check the element you‘ve passed to the new Sipario() function.");
  }
  var children;
  var nonFixedChildren = [];

  // references
  var siparioClass = "sipario";
  var siparioId = siparioContainer.id || "sipario-" + new Date().getTime();
  var siparioChildrenClass = "sipario__child";
  var siparioChildrenFixedClass = "sipario__child--fixed";

  // options
  var options = {};
  options.forceSiparioHeight = false;
  options.useHistory = true; // if true the history navigation is managed by the sipario logic
  options.updateHash = true; // if false the hash change will not change when navigating via anchors

  function _setOptions(optionsObject, preventUpdate) {
    for (var p in optionsObject) {
      options[p] = optionsObject[p];
    }
    if (preventUpdate !== true) {
      setup();
    }
  }

  _setOptions(optionsObject, true);

/*
   ###    ##    ##  ######  ##     ##  #######  ########   ######
  ## ##   ###   ## ##    ## ##     ## ##     ## ##     ## ##    ##
 ##   ##  ####  ## ##       ##     ## ##     ## ##     ## ##
##     ## ## ## ## ##       ######### ##     ## ########   ######
######### ##  #### ##       ##     ## ##     ## ##   ##         ##
##     ## ##   ### ##    ## ##     ## ##     ## ##    ##  ##    ##
##     ## ##    ##  ######  ##     ##  #######  ##     ##  ######
*/
  
  /**
  * manage the link to anchors both inside and outside the sipario element
  */

  function getAnchor(target, outer, changeHash) {
    var tElement = target;
    
    var localY = getOffset(tElement).top;
    var yTo = 0;
    
    if (outer === true) {
      if (tElement.classList.contains(siparioChildrenClass) === false) {
        tElement = tElement.parentNode;
        while (tElement.classList.contains(siparioChildrenClass) === false) {
          tElement = tElement.parentNode;
          if (tElement.classList.contains(siparioClass) === true) {
            tElement = target;
          }
        }
      }
      //
      var childCounter = 0;
      for (var i = 0; i < children.length; i++) {
        if (tElement === children[i]) {
          childCounter = i;    
        }
      }
      //
      for (var i = 0; i < childCounter; i++) {
        yTo += childrenHeights[i];
      }
      if (target !== tElement) {
        yTo += localY + Math.abs(children[childCounter].getBoundingClientRect().top);
      }
      yTo = -window.scrollY + yTo;
    } else {
      yTo = target.getBoundingClientRect().top; 
    }
    
    //window.scrollTo(0, yTo);
    var delta = -window.scrollY + yTo;
    var speed = Math.abs(delta) > 2000 ? 1500 : 1000;
    scrollAnimTo(yTo, 0, speed, null, target.id, changeHash);
  }
  
  function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
      left: el.left,
      top: el.top
    }
  }
  
  var siparioInnerAnchors = siparioContainer.querySelectorAll("*[id]");
  //
  for (var i = 0; i < siparioInnerAnchors.length; i++) {
    var targetElement = siparioInnerAnchors[i];
    var linkElements = document.querySelectorAll("*[href='#" + targetElement.id + "']");
    for (var j = 0; j < linkElements.length; j++) {
      var element = linkElements[j];
      if (element.getAttribute("href") && element.getAttribute("href").substr(0,1) === "#" && element.getAttribute("href").length > 1) {
        setLinkToAnchor(element, targetElement);
      }
    }
  }
  //
  var siparioOuterAnchors = document.querySelectorAll("a[href^='#']");
  for (var i = 0; i < siparioOuterAnchors.length; i++) {
    var element = siparioOuterAnchors[i];
    if (element.getAttribute("href") && element.getAttribute("href").substr(0,1) === "#" && element.getAttribute("href").length > 1) {
      var currentElement = element;
      currentElement.addEventListener("click", function(e) {
        if (e.preventDefault) { e.preventDefault(); }
        getAnchor(document.querySelector(e.currentTarget.getAttribute("href")));
      });
    }
  }

  function setLinkToAnchor(linkElement, targetElement) {
    linkElement.href = "";
    linkElement.addEventListener("click", function(e) {
      if (e.preventDefault) { e.preventDefault(); }
      getAnchor(targetElement, true);
    });
  }

  function getAnchorInOrOut(hash) {
    if (siparioContainer.querySelector(hash)) {
      return true;
    }
    return false;
  }

/*
##       ####  ######  ######## ######## ##    ## ######## ########
##        ##  ##    ##    ##    ##       ###   ## ##       ##     ##
##        ##  ##          ##    ##       ####  ## ##       ##     ##
##        ##   ######     ##    ######   ## ## ## ######   ########
##        ##        ##    ##    ##       ##  #### ##       ##   ##
##        ##  ##    ##    ##    ##       ##   ### ##       ##    ##
######## ####  ######     ##    ######## ##    ## ######## ##     ##
*/

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onResize);
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  window.addEventListener("load", onWindowLoadComplete);
  if (options.useHistory === true) {
    window.addEventListener("popstate", onHashChange);
    window.addEventListener("hashchange", onHashChange); // this one is for IE9 retrocompatibility only
  }

  function onScroll(e) {
    doScroll();
    //updateLoop();
  }

  function onResize(e) {
    doResize();
    //setupHeights();
    //updateLoop();
  }
  
  function onDOMContentLoaded(e) {
    setup();
    if(cbSiparioDOMReady) {
      cbSiparioDOMReady();
    }
  }
  
  function onWindowLoadComplete(e) {
    setup();
    if(cbSiparioReady) {
      cbSiparioReady();
    }
  }

  function onHashChange(e) {
    e.preventDefault();
    if (isScrolling === false) {
      var hash = document.location.hash;
      if (hash !== currentHash) {
        getAnchor(document.querySelector(hash), getAnchorInOrOut(hash));
      } else {
        return false;
      }
    }
  }

/*
##     ## ########  ########     ###    ######## ########
##     ## ##     ## ##     ##   ## ##      ##    ##
##     ## ##     ## ##     ##  ##   ##     ##    ##
##     ## ########  ##     ## ##     ##    ##    ######
##     ## ##        ##     ## #########    ##    ##
##     ## ##        ##     ## ##     ##    ##    ##
 #######  ##        ########  ##     ##    ##    ########
*/

  /**
  * The update loop
  * called every time the page scrolls or resizes
  */

  function updateLoop() {
    var cBox;
    // qui bisognerebbe fare i check sempre e solo sull'ultimo elemento non fixed, invece che ciclare sempre tra tutti,
    // e comunque andrebbero considerati tutti i modelli di interazione perché potrebbero saltare certe cose se si accede direttamente ad un contenuto "senza scrollare"
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      var cNext = children[i+1];
      cBox = c.getBoundingClientRect();
      if (cBox.top < window.innerHeight && cBox.bottom > 0 && c.classList.contains(siparioChildrenFixedClass) === false) {
        // console.log(i, "dentro");
        for (var j = i+1; j < children.length; j++) {
          c = children[j];
          c.classList.add(siparioChildrenFixedClass);
        }
      } else if (cBox.bottom < 0 && c.classList.contains(siparioChildrenFixedClass) === false) {
        // console.log(i, "fuori da sopra");
        // se c'è un fratello dopo all'elemento che è appena uscito da sopra allora, questo fratello, smette di essere fixed
        if (cNext && cNext.classList.contains(siparioChildrenFixedClass) === true) {
          cNext.classList.remove(siparioChildrenFixedClass);
          break;
        }
      }
    }
  }

/*
 ######  ######## ######## ##     ## ########
##    ## ##          ##    ##     ## ##     ##
##       ##          ##    ##     ## ##     ##
 ######  ######      ##    ##     ## ########
      ## ##          ##    ##     ## ##
##    ## ##          ##    ##     ## ##
 ######  ########    ##     #######  ##
*/
  
  /**
  * Find all the children of the sipario container
  * and add a sipario__child (default) class to every child
  */
  function setupChildren() {
    siparioContainer.classList.add(siparioClass);
    siparioContainer.id = siparioContainer.id || siparioId;
    children = document.querySelectorAll("#" + siparioId + " > *");
    for (var i = 0; i < children.length; i++) {
      children[i].classList.add(siparioChildrenClass, siparioChildrenClass + (i+1));
    }
  }

  /**
  * Set a z-index to every sipario child starting from the last one
  * to allow elements to stack in the right order
  */
  function setupIndexes() {
    var z = zIndexBase;
    for (var i = children.length-1; i >= 0; i--) {
      children[i].style.zIndex = z++;
    }
  }

  /**
  * Calculate and cache the height of every sipario child to set the sipario height
  */
  function setupHeights() {
    var bodyHeight = 0;
    var windowHeight = window.innerHeight;
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      cBox = c.getBoundingClientRect();
      var h = cBox.bottom - cBox.top;
      childrenHeights[i] = h;
      //
      if (options.forceSiparioHeight === true) {
        if (i === children.length - 1 && h < windowHeight) {
          h = windowHeight;
        }
      }
      bodyHeight += h;
    }
    siparioContainer.style.minHeight = bodyHeight + "px";
  }
  
  /**
  * Setup all the elements and start the logic
  */
  function setup() {
    setupIndexes();
    setupHeights();
    updateLoop();
  }
  
  /**
  * Call the fist setup
  */
  setupChildren();
  setup();

/*
 ######   ######  ########   #######  ##       ##          ##        #######   ######   ####  ######
##    ## ##    ## ##     ## ##     ## ##       ##          ##       ##     ## ##    ##   ##  ##    ##
##       ##       ##     ## ##     ## ##       ##          ##       ##     ## ##         ##  ##
 ######  ##       ########  ##     ## ##       ##          ##       ##     ## ##   ####  ##  ##
      ## ##       ##   ##   ##     ## ##       ##          ##       ##     ## ##    ##   ##  ##
##    ## ##    ## ##    ##  ##     ## ##       ##          ##       ##     ## ##    ##   ##  ##    ##
 ######   ######  ##     ##  #######  ######## ########    ########  #######   ######   ####  ######
*/

  var ticking = false;
  var isResizing = false;

  function doScroll() {
    ticker(false);
  }

  function doResize() {
    ticker(true);
  }

  function ticker(resize) {
    isResizing = resize;
    //
    if(ticking === false) {
      requestAnimFrame(updateRaf);
    }
    ticking = true;
  }

  function updateRaf() {
    ticking = false;
    if (isResizing === true) {
      setupHeights();
    }
    updateLoop();
  }

  window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ) {
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  function scrollAnimTo(where, offset, time, callback, hash, changeHash) {
    var startTime;
    var o = offset || 0;
    var e = typeof where === 'string' ? document.querySelector(where) : where;
    var s = window.pageYOffset;
    var d = typeof where === 'number' ? where : offset + e.getBoundingClientRect().top;
    var t = time || 1000;
    var start;

    // starts the animation loog
    isScrolling = true;
    requestAnimFrame(scrollAnimLoop);

    function scrollAnimLoop(timestamp) {
      if (!start) start = timestamp;
      var progress = timestamp - start;

      var nextStep = scrollEasing(progress, s, d, t);
      window.scrollTo(0, nextStep)
      if (progress < time) {
        requestAnimFrame(scrollAnimLoop);
      } else {
        scrollAnimEnd();
      }
    }

    function scrollAnimEnd() {
      window.scrollTo(0, d + s);
      if (typeof callback === 'function') {
        callback();
      }

      // simulates the hash change
      if (changeHash !== false && options.updateHash === true) {
        if (typeof where === 'string' && where.substr(0,1) === "#") {
          document.location.hash = where;
        } else {
          document.location.hash = hash;
        }
        currentHash = document.location.hash;
      }
      isScrolling = false;
    }

    function scrollEasing(t,b,c,d) {
      // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
      t /= d / 2
      if(t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }
  }

  return {
    setOptions: _setOptions
  }
  
}