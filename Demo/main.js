import { PuffElement as puff } from "../src/puffElement.js";

// We'll create a div with an input and a button.
let clicker = new puff({
    children: [
        // We give the input a default value and a propertyName so it can easily be referenced later from clicker's properties.
        {tag: "input", propertyName: "input", value: "Hello World!"},  

        // We create a button with a child textNode and an eventListener.
        {tag: "button", children: "Click", eventListeners: { 
            type: "click",
            listener: () => {
                // The listener gets the input value from the clicker's properties object.
                const message = clicker.properties.input.value;
                alert(message);
            }
        }}
    ]
});

// When a PuffElement is created with the 'new' operator, you must use the 'element' property when adding it to DOM.
document.body.append(clicker.element);