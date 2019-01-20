class PuffElement {
  constructor() {

  }

/**
Creates an HTMLElement out of a JSONObject
@param {JSONObject} jsonObj
@returns {HTMLElement}
*/
  static createElement(jsonObj = {}) {
    let element = document.createElement(jsonObj.tag || "div");

    for(let key of Object.keys(jsonObj)) {
      let value = jsonObj[key];

      // if tag, then skip
      if(key === "tag"){
        continue;
      }

      // add child elements to the element
      else if(key === "children"){
        if(typeof value === "string"){
          element.innerHTML = value;
        }
        else{
          for(const obj of value){
            let child = undefined;
            if(typeof obj === "string"){
              child = document.createTextNode(obj);
            }
            else {
              child = PuffElement.createElement(obj);
            }
            element.appendChild(child);
          }
        }
      }

      // add event listener(s) to the element
      else if(key === "eventListeners"){
        if(Array.isArray(value)){
          for(const listener of value){
            element.addEventListener(listener.event, listener.function, listener.useCapture);
          }
        }
        else{
          element.addEventListener(value.event, value.function, value.useCapture);
        }
      }

      // assign the current element to the given variable
      else if(key == "variable"){
        key = element;
      }

      // it's an attribute and will be added as such
      else{
        const attributeName = key.replace("_", "-");
        element.setAttribute(attributeName, value);
      }
    }

    return element;
  }
}
