"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponGenerator = void 0;
function couponGenerator() {
    let coupon = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < 12; i++) {
        coupon += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return coupon;
}
exports.couponGenerator = couponGenerator;
