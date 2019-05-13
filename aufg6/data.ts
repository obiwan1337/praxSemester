namespace aufg6 {
    export interface Product {
        [key: string]: einzelPosten[]
    }
    export interface einzelPosten {
        name: string;
        price: number;
        input: string;

    }
    export let Angebot: Product = {
        "Waffel": [
            {name: "Gammlige Waffel",price: 0, input: "radio"},
            {name: "ComicSans Waffel",price: 3, input: "radio"},
            {name: "Megageile SchokoWaffel",price: 1, input:"radio"}
                        
        ],
        "eis": [
            { name: "Kex", price: 1.10, input: "number" },
            { name: "Void", price: 1.10, input: "number" },
            { name: "Hotpink", price: 1.10, input: "number" },
            { name: "Comic Sans", price: 1.10, input: "number" }],

        "Soße": [
            {name: "Schokolade",price: 1.10, input: "checkbox"},
            {name: "Honig",price: 1.10, input: "checkbox"},
            {name: "Melone",price: 1.10, input: "checkbox"}
        ],
        "Streussel": [
            {name: "nicht Regenbogen",price: 1.10, input: "checkbox"},
            {name: "Regenbogen",price: 1.10, input: "checkbox"},
            {name: "",price: 1.10, input: "checkbox"}
        
                        
        ]
    }
}