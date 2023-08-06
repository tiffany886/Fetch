import { JsonBodyConverterFactory } from "./JsonConverterFactory.js"

(function main () {
    const factory = JsonBodyConverterFactory.create();
    const res = factory.requestBodyConverter().convert({
        name: 'Tiffany',
        pwd: 1234,
    })
    const res2 = factory.responseBodyConverter().convert("{ \"name\": \"Tiffany\", \"pwd\": 1234 }")
    console.log(res);
    console.log(res2);
}())