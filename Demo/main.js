import { PuffElement as puff } from "../src/puffElement.js";

let list = new puff({
    children: [
        { 
            tag: "ul",
            children: [
                {
                    tag: "li",
                    children: [
                        "strengur"
                    ]
                },                
                {
                    tag: "li",
                    children: [
                        "strengur1"
                    ]
                }
            ]
        }
    ]
})

document.body.append(list.element);