# Sipario
### A Curtain Like Scroll Library Dependencies Free

## Usage
Include the `sipario.js` and the `sipario.css` files in your project.

Customize the content of every Sipario child as you like in your CSS, but pay attention to **not add top and bottom margins<sup>1</sup>**.

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

<sup>1</sup> You can add vertical margins, if your realli want, but please mind that the elements could not be positioned where you expect and some other “strange things” could happens.