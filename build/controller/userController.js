"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.createOrder = exports.applyCoupon = exports.decreaseItem = exports.emptyCart = exports.getCartUser = exports.addCart = exports.getWishlist = exports.resetPassword = exports.forgotPasswordToken = exports.updatePassword = exports.logout = exports.handleRefreshToken = exports.unblockUser = exports.blockUser = exports.deleteUser = exports.updateUser = exports.getUserDetail = exports.getAllUser = exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../model/userModel"));
const cartModel_1 = __importDefault(require("../model/cartModel"));
const productModel_1 = __importDefault(require("../model/productModel"));
const couponModel_1 = __importDefault(require("../model/couponModel"));
const orderModel_1 = __importDefault(require("../model/orderModel"));
const jwtToken_1 = require("../config/jwtToken");
const authMiddleware_1 = require("../middleware/authMiddleware");
const emailController_1 = require("./emailController");
const productUtils_1 = require("../utils/productUtils");
const crypto_1 = __importDefault(require("crypto"));
const uniqid_1 = __importDefault(require("uniqid"));
//register User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, phone, email } = req.body;
    const password = yield bcrypt_1.default.hash(req.body.password, 12);
    const emailExist = yield userModel_1.default.findOne({ email });
    const phoneExist = yield userModel_1.default.findOne({ phone });
    try {
        if (!emailExist && !phoneExist) {
            const newUser = yield userModel_1.default.create({
                firstName,
                lastName,
                phone,
                email,
                password,
            });
            res
                .status(201)
                .json({ message: "User created successfully", user: newUser });
        }
        else if (emailExist) {
            return res
                .status(422)
                .json({ message: "Email has taken, please sign in" });
        }
        else {
            return res
                .status(422)
                .json({ message: "Phone number has taken, please sign in" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
});
exports.createUser = createUser;
//login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const findUser = yield userModel_1.default.findOne({ email });
    try {
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            const match = yield bcrypt_1.default.compare(password, findUser.password);
            if (match) {
                const token = (0, jwtToken_1.generateToken)(findUser._id.toString());
                const refreshToken = (0, jwtToken_1.generateRefereshToken)(findUser._id.toString());
                const updateUser = yield userModel_1.default.findByIdAndUpdate(findUser._id, { refreshToken: refreshToken }, { new: true });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });
                return res
                    .status(200)
                    .json({ message: "User logged in successfully", token });
            }
            else {
                return res.status(401).json({ message: "Incorrect password" });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.loginUser = loginUser;
//get All User
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllUser = getAllUser;
//get user detail
const getUserDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const findUser = yield userModel_1.default.findById({ _id });
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        else {
            return res.status(200).json({ message: "User found", user: findUser });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error });
    }
});
exports.getUserDetail = getUserDetail;
//update User
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const { firstName, lastName, phone, email, role } = req.body;
        const findUser = yield userModel_1.default.findByIdAndUpdate(_id, {
            firstName,
            lastName,
            email,
            phone,
            role,
        }, {
            new: true,
        });
        return res.status(200).json({ message: "Profile update succesfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateUser = updateUser;
//delete User
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const findUser = yield userModel_1.default.findByIdAndDelete({ _id });
        return res
            .status(200)
            .json({ message: "User deleted succesfully", findUser });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteUser = deleteUser;
//block user
const blockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const findUser = yield userModel_1.default.findByIdAndUpdate(_id, {
            isBlocked: true,
        }, {
            new: true,
        });
        console.log(findUser);
        return res.status(200).json({ message: "Blocked succesfully", findUser });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.blockUser = blockUser;
//unblock user
const unblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const findUser = yield userModel_1.default.findByIdAndUpdate(_id, { isBlocked: false }, { new: true });
        return res.status(200).json({ message: "Unblock successfully", findUser });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.unblockUser = unblockUser;
//handle refresh token
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.cookies;
    if (!(cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken))
        return res.status(400).json({ message: "No token attached" });
    const findUser = yield userModel_1.default.findOne({ refreshToken: cookie.refreshToken });
    if (!findUser)
        return res.status(401).json({ message: "Token not match" });
    const decoded = (0, authMiddleware_1.verifyRefreshToken)(cookie.refreshToken);
    if (!decoded) {
        return res
            .status(401)
            .json({ message: "Something error with refresh token" });
    }
    else {
        const accessToken = (0, jwtToken_1.generateToken)(decoded.id);
        return res.status(200).json({ accessToken });
    }
});
exports.handleRefreshToken = handleRefreshToken;
//logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    if (!refreshToken)
        return res.status(400).json({ message: "No token attached" });
    const findUser = yield userModel_1.default.findOne({ refreshToken });
    if (!findUser) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.status(204);
    }
    yield userModel_1.default.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({ message: "User logged out" });
});
exports.logout = logout;
//update password
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { newPassword, confirmPassword } = req.body;
    const user = yield userModel_1.default.findById(id);
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Password not match" });
    }
    else {
        user.password = newPassword;
        const updatedPassword = user === null || user === void 0 ? void 0 : user.save();
        return res
            .status(200)
            .json({ message: "Password updated successfully", updatedPassword });
    }
});
exports.updatePassword = updatePassword;
//forgot password
const forgotPasswordToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    try {
        const token = crypto_1.default.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        yield user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid for 10 minutes from now <a href='http:localhost/api/user/reset-password/${token}'>Click here</a>`;
        const data = {
            to: email,
            subject: "Reset Password Link",
            html: resetURL,
            text: `Hey ${user.lastName}, if you didn't request this password reset just ignore this email`,
        };
        (0, emailController_1.sendEmail)(data);
        return res.status(200).json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.forgotPasswordToken = forgotPasswordToken;
//reset pasword
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, confirmPassword } = req.body;
    const token = req.params.token;
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user)
        return res.status(401).json({ message: "Token expired, please try again" });
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "Password didn't match" });
    user.password = newPassword;
    (user.passwordResetToken = undefined),
        (user.passwordResetExpires = undefined);
    yield user.save();
    res.status(200).json({ message: "Password updated succesfully" });
});
exports.resetPassword = resetPassword;
//wishlist
const getWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const user = yield userModel_1.default.findById(id).populate("wishlist");
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getWishlist = getWishlist;
//add to cart
const addCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cart } = req.body;
    const { id } = req.user;
    try {
        const user = yield userModel_1.default.findById(id);
        const exist = yield cartModel_1.default.findOne({ orderBy: user === null || user === void 0 ? void 0 : user.id });
        const productExist = exist === null || exist === void 0 ? void 0 : exist.products.find((item) => { var _a; return ((_a = item.product) === null || _a === void 0 ? void 0 : _a.toString()) === cart._id.toString(); });
        if (exist && productExist) {
            yield cartModel_1.default.updateOne({
                products: { $elemMatch: productExist },
            }, {
                $set: { "products.$.count": cart.count + productExist.count }
            }, { new: true });
            const updated = yield cartModel_1.default.findOne({ orderBy: user === null || user === void 0 ? void 0 : user._id });
            const product = yield cartModel_1.default.findByIdAndUpdate(updated === null || updated === void 0 ? void 0 : updated._id, {
                $set: {
                    cartTotal: (0, productUtils_1.getCartTotal)(updated === null || updated === void 0 ? void 0 : updated.products),
                },
            }, {
                new: true
            });
            return res
                .status(200)
                .json({ message: "Product added to cart", cart: product });
        }
        else if (exist && !productExist) {
            let products = {
                product: undefined,
                count: 0,
                variant: "",
                price: 0,
            };
            products.product = cart._id;
            products.count = cart.count;
            products.variant = cart.variant;
            let getPrice = yield productModel_1.default.findById(cart._id)
                .select("price")
                .exec();
            products.price = getPrice === null || getPrice === void 0 ? void 0 : getPrice.price;
            const addCount = yield cartModel_1.default.findByIdAndUpdate(exist._id, {
                $push: { products: products },
            }, { new: true });
            const product = yield cartModel_1.default.findByIdAndUpdate(exist._id, {
                $set: {
                    cartTotal: (0, productUtils_1.getCartTotal)(addCount === null || addCount === void 0 ? void 0 : addCount.products),
                },
            }, { new: true });
            return res
                .status(200)
                .json({ message: "Product added to cart", cart: product });
        }
        else {
            const price = yield productModel_1.default.findById(cart._id).select("price").exec();
            const products = [{
                    product: cart._id,
                    count: cart.count,
                    variant: cart.variant,
                    price: price.price
                }];
            const newCart = yield new cartModel_1.default({
                products,
                cartTotal: (0, productUtils_1.getCartTotal)(products),
                orderBy: user === null || user === void 0 ? void 0 : user._id,
            }).save();
            return res.status(201).json({ message: "New Cart added", cart: newCart });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.addCart = addCart;
//get user cart
const getCartUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const cart = yield cartModel_1.default.findOne({ orderBy: id }).populate("products.product");
        if (!cart)
            return res.status(404).json({ message: "Cart not found" });
        return res.status(200).json(cart);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getCartUser = getCartUser;
//empty cart
const emptyCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.user;
    try {
        const user = yield userModel_1.default.findById(id);
        const cart = yield cartModel_1.default.findOne({ orderBy: id });
        if ((user === null || user === void 0 ? void 0 : user._id.toString()) === ((_b = cart === null || cart === void 0 ? void 0 : cart.orderBy) === null || _b === void 0 ? void 0 : _b.toString())) {
            yield cartModel_1.default.findByIdAndRemove(cart === null || cart === void 0 ? void 0 : cart._id);
            return res.status(200).json({ message: "Cart deleted" });
        }
        return res
            .status(404)
            .json({ message: "Cart not found or unathourized user" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.emptyCart = emptyCart;
//decrease item in cart
const decreaseItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { cart } = req.body;
    try {
        const productCart = yield cartModel_1.default.findOne({ orderBy: id });
        const productExist = productCart === null || productCart === void 0 ? void 0 : productCart.products.find((item) => { var _a; return ((_a = item.product) === null || _a === void 0 ? void 0 : _a.toString()) === cart.product.toString(); });
        if (!productCart)
            return res.status(404).json({ message: "Cart not found" });
        if (!productExist)
            return res.status(404).json({ message: "Product not found" });
        yield cartModel_1.default.updateOne({
            products: { $elemMatch: productExist },
        }, {
            $set: {
                "products.$.count": cart.count,
            },
        }, { new: true });
        const updated = yield cartModel_1.default.findById(productCart._id);
        const decreaseItem = yield cartModel_1.default.findByIdAndUpdate(productCart._id, {
            $set: { cartTotal: (0, productUtils_1.getCartTotal)(updated === null || updated === void 0 ? void 0 : updated.products) },
        }, { new: true });
        return res
            .status(200)
            .json({ message: "Product item updated", decreaseItem });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.decreaseItem = decreaseItem;
//apply coupon
const applyCoupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon } = req.body;
    const { id } = req.user;
    try {
        const validCoupon = yield couponModel_1.default.findOne({ code: coupon });
        if (!validCoupon)
            return res
                .status(404)
                .json({ message: "Coupon not found or invalid code" });
        if (!validCoupon.isActive)
            return res.status(203).json({ message: "Coupon is expired" });
        const user = yield userModel_1.default.findById(id);
        const cart = yield cartModel_1.default.findOne({ orderBy: user === null || user === void 0 ? void 0 : user._id }).populate("products.product");
        let cartTotal = cart === null || cart === void 0 ? void 0 : cart.cartTotal;
        let totalAfterDiscount = cartTotal - cartTotal * (validCoupon.discount / 100);
        yield cartModel_1.default.findOneAndUpdate({ orderBy: user === null || user === void 0 ? void 0 : user._id }, { $set: { totalAfterDiscount } }, { new: true });
        return res
            .status(200)
            .json({ message: "Coupon applied", totalAfterDiscount });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.applyCoupon = applyCoupon;
//create order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { COD, appliedCoupon } = req.body;
    try {
        if (!COD)
            return res.status(203).json({ message: "Order failed!" });
        const user = yield userModel_1.default.findById(id);
        const userCart = yield cartModel_1.default.findOne({ orderBy: user === null || user === void 0 ? void 0 : user._id });
        let finalAmount = 0;
        if (appliedCoupon && (userCart === null || userCart === void 0 ? void 0 : userCart.totalAfterDiscount)) {
            finalAmount = userCart.totalAfterDiscount;
        }
        else {
            finalAmount = userCart === null || userCart === void 0 ? void 0 : userCart.cartTotal;
        }
        let newOrder = yield new orderModel_1.default({
            products: userCart === null || userCart === void 0 ? void 0 : userCart.products,
            paymentIntent: {
                id: (0, uniqid_1.default)(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd"
            },
            orderBy: user === null || user === void 0 ? void 0 : user._id,
            orderStatus: "Cash on Delivery"
        }).save();
        let updates = userCart === null || userCart === void 0 ? void 0 : userCart.products.map(item => {
            var _a;
            return {
                updateOne: {
                    filter: { _id: (_a = item.product) === null || _a === void 0 ? void 0 : _a._id },
                    update: { $inc: { stocks: -(item === null || item === void 0 ? void 0 : item.count), itemSold: +(item === null || item === void 0 ? void 0 : item.count) } }
                }
            };
        });
        const updated = yield productModel_1.default.bulkWrite(updates, {});
        if (updated) {
            yield cartModel_1.default.findByIdAndDelete(userCart === null || userCart === void 0 ? void 0 : userCart._id);
        }
        return res.status(201).json({ message: "Order created", newOrder });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.createOrder = createOrder;
//get orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const orders = yield orderModel_1.default.find({ orderBy: id });
        return res.status(200).json({ orders });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getOrders = getOrders;
//update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const { id } = req.params;
    try {
        const order = yield orderModel_1.default.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status
            }
        }, {
            new: true
        });
        if (!order)
            return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "Order status updated", order });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
