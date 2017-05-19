# Sipario Scroller
### A Curtain Like Scroll Library

## Usage
Include the `sipario.js` and the `sipario.css` files in your project.

Customize the content of every Sipario child as you like in your CSS, but pay attention to **not add top and bottom margins**.

Call the Sipario constructor passing the container element CSS selector or element.
```javascript
var sipario = new Sipario(".my-parent-element");
```
or
```javascript
var element = document.querySelector(".my-parent-element");
var sipario = new Sipario(element);
```

Scroll!

## Examples

[Example 1](https://marcolago.github.io/sipario/examples/example-1.html): Pikmin Illustrations, fixed sidebar and anchors management.

## Notes

Sipario Scroller has no dependencies and manages the animated scroll with it’s own logic. Pay attention when mixing Sipario with other scrolling and animation libraries.

You can add vertical margins to Sipario children, if your really want, but please mind that the elements could not be positioned where you expect and some other “unexpected things” could happens.