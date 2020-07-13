/**
 * @typedef {object} JsonElement Defenition of a PuffElement in JSON form.
 * @property {string} [tag="div"] TagName of the element.
 * @property {(string|JsonElement|(string|JsonElement)[])} children Single or array of strings and/or JsonElements.
 * @property {(EventListenerObject|EventListenerObject[])} eventListeners Single or many eventListeners to be created.
 * @property {string} propertyName The name of an element as a property of it's parent.
 */

/**
 * @typedef {object} EventListenerObject Variables needed to create an EventListener.
 * @property {string} type A case-sensitive string representing the event type to listen for.
 * @property {function} listener The object that receives an Event when an event of the specified type occurs.
 * @property {EventListenerOptions} options An options object specifies characteristics about the event listener.
 * @property {boolean} useCapture A Boolean indicating whether events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
 */

/**
 * @typedef {object} EventListenerOptions An options object specifies characteristics about the event listener.
 * @property {boolean} capture A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
 * @property {boolean} once A Boolean indicating that the listener should be invoked at most once after being added. If true, the listener would be automatically removed when invoked.
 * @property {boolean} passive A Boolean that, if true, indicates that the function specified by listener will never call preventDefault(). If a passive listener does call preventDefault(), the user agent will do nothing other than generate a console warning.
 */



class PuffElement {

	/**
	 * Creates a puffElement.
	 * @param {string|JsonElement} obj JavaScript object containing all information about the element being created.
	 */
	constructor(obj = {}) {
		/**
		 * The standard HTMLElement.
		 * @private {HTMLElement}
		 */
		this._element = undefined;

		/**
		 * References to child elements that have defined propertyNames.
		 * @private {object}
		 */
		this.properties = {};
			
		// If obj is a string, we create a textNode and stop.		
		if(typeof obj === "string"){
			this._element = document.createTextNode(obj);
			return;
		}

		this._element = document.createElement(obj.tag || "div");

		for(let key of Object.keys(obj)) {
			let value = obj[key];

			// SKIP. Tag already defined.
			if(key === "tag"){
				continue;
			}

			// Add children.
			else if(key === "children"){        
				if(Array.isArray(value)){
					this._addChildren(value);
				}
				else{
					this._addChild(value);
				}
			}

			// add event listener(s) to the element
			else if(key === "eventListeners"){
				if(Array.isArray(value)){
					this._addEventListeners(value);
				}
				else{
					this._addEventListener(value);
				}
			}

			// mark the element to be added to the property list of it's parent.
			else if(key == "propertyName"){
				key = "data-puff-property-name";
				this._setAttribute(key, value);
			}

			// it's an attribute and will be added as such
			else{
				this._setAttribute(key, value);
			}

			return new Proxy(this, {
				set(target, p, value, receiver) {
					if(!Object.keys(target).includes(p)){
						target.element[p] = value;
					}
					return Reflect.set(...arguments);
				},
				get(target, p, receiver){
					if(!Object.keys(target).includes(p)){
						return target.element[p];
					}
					return Reflect.get(...arguments);
				}
			})
		}
	}

	/**
	 * Returns the HtmlElement.
	 */
	get element(){
		return this._element;
	}

	/**
	 * Adds a single childNode to the element.
	 * @param {string|JsonElement} child A text or Json with element details.
	 */
	_addChild(child){
		let newPuff = new PuffElement(child);
		this._setElementProperties(newPuff);
		this._element.appendChild(newPuff.element);
	}

	/**
	 * Adds children to the element.
	 * @param {(string|JsonElement)[]} children An array of strings and/or JsonElements.
	 */
	_addChildren(children){
		for(const child of children){
			this._addChild(child);
		}
	}

	/**
	 * Adds an eventListener to the element.
	 * @param {EventListenerObject} settings 
	 */
	_addEventListener(settings){
		this._element.addEventListener(settings.type, settings.listener, settings.options||settings.useCapture);
	}

	/**
	 * Adds multiple eventListeners to the element.
	 * @param {EventListenerObject[]} settings 
	 */
	_addEventListeners(settings){
		for(const setting of settings){
			this._addEventListener(setting);
		}
	}

	/**
	 * Edits or Adds a new attribute to the element.
	 * Lowdashes in key are replaced with dashes.
	 * @param {string} key The name of the attribute.
	 * @param {string|number} value The new value of the attribute.
	 */
	_setAttribute(key, value){
		// Replace all lowdashes with dashes.
		const attributeName = key.replace("_", "-");
		this._element.setAttribute(attributeName, value);
	}

	_setElementProperties(node){
		if(node.element.dataset?.puffPropertyName !== undefined){ // jshint ignore:line
			this.properties[node.element.dataset.puffPropertyName] = node;
		}

		if(Object.keys(node.properties).length > 0){
			for(const key of Object.keys(node.properties)){
				this.properties[key] = node.properties[key];
			}
		}
	}

	/**
	 * Creates an HTMLElement out of a JSONObject
	 * @param {JSONObject} jsonObj JavaScript object containing all information about the element being created.
	 * @returns {HTMLElement} A standard HTMLElement.
	 */
	static createElement(jsonObj = {}) {
		return new PuffElement(jsonObj).element;
	}
}



export { PuffElement };