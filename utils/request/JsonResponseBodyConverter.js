export const JsonReponseBodyConverter = function () {
    this.convert = function (data) {
        return JSON.parse(data);
    }
}