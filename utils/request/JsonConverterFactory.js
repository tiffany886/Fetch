import { JsonRequestBodyConverter } from "./JsonRequestBodyConverter.js"
import { JsonReponseBodyConverter } from "./JsonResponseBodyConverter.js";

export const JsonBodyConverterFactory = function () {

    this.requestBodyConverter = function () {
        return new JsonRequestBodyConverter();
    }

    this.responseBodyConverter = function () {
        return new JsonReponseBodyConverter();
    }
}

JsonBodyConverterFactory.create = function () {
    return new JsonBodyConverterFactory();
}