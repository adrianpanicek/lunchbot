;
function filterFor(object, allowed) {
    return Object.keys(object)
        .filter(key => !!allowed[key])
        .reduce((obj, key) => {
        obj[key] = object[key];
        return obj;
    }, {});
}
export const filterForToken = (user) => filterFor(user, { identificator: true });
//# sourceMappingURL=model.js.map