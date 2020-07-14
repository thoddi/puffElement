PuffElement
===========

PuffElement is a JavaScript library to simply create complex DOM elements, using JSON. This library is in semi-experemental stages so features may change.

For now, the only way to use the library is by downloading the zip and placing it in your own project. The code containes some cutting edge EcmaScript features, so you might have to transpile it yourself to an older standards like ES5 or ES6, depending on the project you are working on.

For issues or sugestions, feel free to send me an issue [here](https://github.com/thoddi/puffElement/issues).

How to use
----------

There are two ways to use PuffElement. One way is to create an instance of PuffElement with `new PuffElement()`. The result is an object with two properties:
* element (the HTMLElement that was created)
* properties (an object containing shortcuts all child elements with the `propertyName` attribute.)
The constructor returns a Proxy that redirects all parameter and method calls to the `element` parameter. So you can manipulate the PuffElement as if you are manipulating a HTMLElement. The one exception is when adding it to DOM. Then you have to use the `element` property.
```
let el = new PuffElement();

// These lines do the same thing.
el.element.className = "class1";
el.className = "class1";

// Here you have to use the 'element' property.
document.body.append(el.element);
```

The other way is to use the static method `PuffElement.createElement()`. The result is a pure HTMLElement. So these two methods are equivalent:
```
let el = new PuffElement().element;
let el = PuffElement.createElement();
```

If you create a PuffElement using the `new` operator, you will have to use it's `element` property when you add it to the DOM

### Defining an element

PuffElement takes a single parameter, either a string or a JSON object (JavaScript object). If a string is passed, a textNode will be created. 
If an object is passed, it's properties will be the attributes of the created element. So the property names should be written the same way as the attribute names of the element. If the attribute name will have a dash in it, the property key should have a underscore in it's place.
```
PuffElement.createElement({ data_id: "el1"})

// creates:

<div data-id="el1">
</div>
```

Simply speaking, every property of the object will become an attribute of the created HTMLElement.
There are however a few special properties that will not be mapped to attributs. Those are:
* tag
* children
* eventListeners
* propertyName

#### tag

The `tag` property defines the tagName of the element, with "div" as it's default.

```
PuffElement.createElement({ tag: "input"}) // creates: <input/>

PuffElement.createElement() // creates: <div></div>
```

#### children

The `children` property defines all the children of the HTMLElement. The value can be either an object or an array of objects. The children are defined the same way as basic PuffElements.

```
PuffElement.createElement({
    class: "parentElement",
    children: { class: "childElement" }
})

// creates:

<div class="parentElement>
    <div class="childElement"></div>
</div>

// and

PuffElement.createElement({
    class: "parentElement",
    children: [
        { class: "firstChild" },
        { class: "secondChild" }
    ]
})

// creates:

<div class="parentElement>
    <div class="firstChild"></div>
    <div class="secondChild"></div>
</div>
```

#### eventListeners

Using the `eventListeners`, you can define eventListeners within the definition of the HTMLElement. The value can be a single object or an array of objects. The object's properties will map to the parameters of [EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).
* type - string, e.g. "click"
* listener - function, e.g. () => alert("click")
* options - optional object
* useCapture  - optional boolean

useCapture and options can not be used at the same time.

```
let el = PuffElement.createElement({tag: "button", eventListeners: {
    type: "click",
    listener: () => alert("click!")
}});

// is equivalent to:

let el = document.createElement("button");
el.addEventListener("click", () => alert("click!"));
```

#### propertyName

You can use the `propertyName` property to mark a child element as something you would like to have easy access to later. The element will have the `data-puff-property-name` attribute and a reference to that HTMLElement will be added to the `properties` object of the parent PuffElement.

```
let el = new PuffElement({ 
    class: "parentElement",
    children: {
        class: "childElement",
        children: {
            class: "grandChildElement",
            propertyName: "grandChild"
        }
    }
});

el.properties.grandChild.className = "changedChild";

// is equivalent to:

let el = document.createElement("div");
el.className = "parentElement";

let child = document.createElement("div");
child.className = "childElement";
el.appendChild(child);

let grandChild = document.createElement("div");
grandChild.className = "grandChildElement";
child.appendChild(grandChild);

grandChild.className = "changedChild";
```