import {PuffElement as puff } from "../src/puffElement.js";

describe("PuffElement", () => {

    it("Should be an empty DIV", () => {
        let el = new puff().element;

        expect(el.tagName).toBe("DIV");
    });

    it("Should be an empty H1", () => {
        let el = new puff({tag: "h1"}).element;

        expect(el.tagName).toBe("H1");
    });

    it("Should have a textNode child", () => {
        const text = "I'm a textNode.";
        let el = new puff({children: text }).element;

        expect(el.childNodes.length).toBe(1);
        expect(el.children.length).toBe(0);
        expect(el.firstChild.nodeName).toBe("#text");
        expect(el.firstChild.nodeValue).toBe(text);
    });

    it("Should have a H1 child", () => {
        let el = new puff({children: {tag: "h1"} }).element;

        expect(el.children.length).toBe(1);
        expect(el.firstChild.tagName).toBe("H1");
    });

    it("Should have a textNode and H1 children", () => {
        const text = "I'm a textNode.";
        let el = new puff({children: [ text, {tag: "h1"}] }).element;

        expect(el.childNodes.length).toBe(2);
        expect(el.children.length).toBe(1);
        expect(el.firstChild.nodeName).toBe("#text");
        expect(el.firstChild.nodeValue).toBe(text);
        expect(el.firstElementChild.tagName).toBe("H1");
    });

    it("Should have a click eventListener", () => {
        let handler = {
            click: () => {}
        };
        spyOn(handler, "click").and.callThrough();

        let el = new puff({eventListeners: {type: "click", listener: handler.click}}).element;
        
        let event = new Event("click");
        el.dispatchEvent(event);
        
        expect(handler.click).toHaveBeenCalled();
    });

    it("Should have a click and hover eventListeners", () => {
        let handler = {
            click: () => {},
            hover: () => {}
        };
        spyOn(handler, "click").and.callThrough();
        spyOn(handler, "hover").and.callThrough();

        let el = new puff({eventListeners: [ 
            {type: "click", listener: handler.click},
            {type: "hover", listener: handler.hover}
         ]}).element;
        
        let clickEvent = new Event("click");
        let hoverEvent = new Event("hover");
        el.dispatchEvent(clickEvent);
        el.dispatchEvent(hoverEvent);
        
        expect(handler.click).toHaveBeenCalled();
        expect(handler.hover).toHaveBeenCalled();
    });

    it("Should have a 'class' attribute", () => {
        let el = new puff({class: "class1"}).element;
        
        expect(el.className).toBe("class1");
    });

    it("Should have a 'data-id' attribute", () => {
        let el = new puff({data_id: 1}).element;

        expect(el.dataset.id).toBe("1");
    });

    it("Should have a 'class' and 'data-id' attributes", () => {
        let el = new puff({class: "class1", data_id: 1}).element;

        expect(el.className).toBe("class1");
        expect(el.getAttribute("data-id")).toBe("1");
    });

    it("Should have an inner element as a properties", () => {
        let el = new puff({
            class: 1,
            children: {
                class: 2,
                propertyName: "middleDiv",
                children: {
                    class: 3,
                    propertyName: "centerDiv"
                }
            }
        });
        
        expect(Object.keys(el.properties).length).toBe(2);
        expect(el.properties.middleDiv.element.className).toBe("2");
        expect(el.properties.centerDiv.element.className).toBe("3");
    });

    it("Should update coresponding element when property is updated", () => {
        let el = new puff({
            class: "a",
            children: {
                class: "b",
                propertyName: "middleDiv",
                children: {
                    class: "c",
                    propertyName: "centerDiv"
                }
            }
        });

        el.element.querySelector(".b").className = "bb";
        el.properties.centerDiv.element.className = "cc";

        expect(el.properties.middleDiv.element.className).toBe("bb");
        expect(el.element.querySelector(".cc")).not.toBe(null);
    });
});