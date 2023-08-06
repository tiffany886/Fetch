export const JsonRequestBodyConverter = function () {

    this.convert = function (data) {
        return JSON.stringify(data);
    }
}