"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartTotal = void 0;
function getCartTotal(item) {
    let cartTotal = 0;
    for (let i = 0; i < item.length; i++) {
        cartTotal += Number(item[i].price) * Number(item[i].count);
    }
    return cartTotal;
}
exports.getCartTotal = getCartTotal;
