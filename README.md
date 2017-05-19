# Sipario
### A Curtain Like Scroll Library Dependencies Free

## Usage
Include the `sipario.js` and the `sipario.css` files in your project.

Customize the content of every Sipario child as you like in your CSS, but pay attention to **not add top and bottom margins**.

Call the Sipario constructor passing the container element CSS selector or element.
```javascript
var sipario = newSipario(".my-parent-element");
or
var element = document.querySelector(".my-parent-element");
var sipario = new Sipario(element);
```

Scroll!
