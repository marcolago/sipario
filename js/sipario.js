function Sipario(selectorOrElement) {

  // values
  var zIndexBase = 0;
  var childrenHeights = [];

  // callbacks
  var cbSiparioDOMReady = null;
  var cbSiparioReady = null;

  // elements
  var parent;
  console.log(typeof selectorOrElement);
  if (typeof selectorOrElement === "string") {
    parent = document.querySelector(selectorOrElement);
  } else if (selectorOrElement.querySelector) {
    parent = selectorOrElement;
  } else {
    throw ("Sipario was not able to find the container element. Please, check the element you‘ve passed to the new Sipario() function.");
  }
  var children;
  var nonFixedChildren = [];

  // references
  var siparioClass = "sipario";
  var siparioId = "sipario-" + new Date().getTime();
  var siparioChildrenClass = "sipario__child";
  var siparioChildrenFixedClass = "sipario__child--fixed";

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

  function getAnchor(target, outer) {
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
    scrollAnimTo(yTo, 0, speed);
  }
  
  function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
      left: el.left,
      top: el.top
    }
  }
  
  var siparioInnerAnchors = parent.querySelectorAll("*[id]");
  //
  for (var i = 0; i < siparioInnerAnchors.length; i++) {
    var targetElement = siparioInnerAnchors[i];
    var linkElements = document.querySelectorAll("*[href='#" + targetElement.id + "'");
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
      console.log(element);
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

/*
##       ####  ######  ######## ######## ##    ## ######## ########
##        ##  ##    ##    ##    ##       ###   ## ##       ##     ##
##        ##  ##          ##    ##       ####  ## ##       ##     ##
##        ##   ######     ##    ######   ## ## ## ######   ########
##        ##        ##    ##    ##       ##  #### ##       ##   ##
##        ##  ##    ##    ##    ##       ##   ### ##       ##    ##
######## ####  ######     ##    ######## ##    ## ######## ##     ##
*/

  // non optimized listener
  // have to debounce the execution
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", onResize);
  document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
  window.addEventListener("load", onWindowLoadComplete);

  function onScroll(e) {
    updateLoop();
  }
  
  function onResize(e) {
    setupHeights();
    updateLoop();
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
    parent.classList.add(siparioClass);
    parent.id = siparioId;
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
      // questo check è da rendere opzionale
      // per poter gestire contenuto che segue il sipario in modo che si incastri subito dopo l'ultima slide
      if (i === children.length - 1 && h < windowHeight) {
        h = windowHeight;
      }
      bodyHeight += h;
    }
    parent.style.minHeight = bodyHeight + "px";
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
  
}

/*
 ######   ######  ########   #######  ##       ##          ##        #######   ######   ####  ######
##    ## ##    ## ##     ## ##     ## ##       ##          ##       ##     ## ##    ##   ##  ##    ##
##       ##       ##     ## ##     ## ##       ##          ##       ##     ## ##         ##  ##
 ######  ##       ########  ##     ## ##       ##          ##       ##     ## ##   ####  ##  ##
      ## ##       ##   ##   ##     ## ##       ##          ##       ##     ## ##    ##   ##  ##
##    ## ##    ## ##    ##  ##     ## ##       ##          ##       ##     ## ##    ##   ##  ##    ##
 ######   ######  ##     ##  #######  ######## ########    ########  #######   ######   ####  ######
*/

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

function scrollAnimTo(where, offset, time, callback) {
  var startTime;
  var o = offset || 0;
  var e = typeof where === 'string' ? document.querySelector(where) : where;
  var s = window.pageYOffset;
  var d = typeof where === 'number' ? where : offset + e.getBoundingClientRect().top;
  var t = time || 1000;
  var start;

  // simulates the hash change
  if (typeof where === 'string' && where.substr(0,1) === "#") {
    document.location.hash = where;
  }
  // starts the animation loog
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
    window.scrollTo(0, s + d);
    if (typeof callback === 'function') {
      callback();
    }
  }

  function scrollEasing(t,b,c,d) {
    // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
    t /= d / 2
    if(t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
}