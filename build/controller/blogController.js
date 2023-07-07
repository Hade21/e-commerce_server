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
exports.uploadBlogImages = exports.dislikeBlog = exports.likeBlog = exports.deleteBlog = exports.getBlogById = exports.getAllBlog = exports.updateBlog = exports.createBlog = void 0;
const blogModel_1 = __importDefault(require("../model/blogModel"));
const cloudinary_1 = require("../utils/cloudinary");
const fs_1 = __importDefault(require("fs"));
//create post
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = yield blogModel_1.default.create(req.body);
        return res.status(201).json({ message: "New Post creted", newPost });
    }
    catch (error) {
        return res.status(400).json(error);
    }
});
exports.createBlog = createBlog;
//update post
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedBlog = yield blogModel_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        return res.status(200).json({ message: "Blog updated", updatedBlog });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.updateBlog = updateBlog;
//get all post
const getAllBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield blogModel_1.default.find();
        if (posts.length === 0)
            return res.status(404).json({ message: "No post found" });
        return res.status(200).json({ message: "Article found", posts });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getAllBlog = getAllBlog;
//get post by id
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield blogModel_1.default.findById(id);
        const updatedPost = yield blogModel_1.default.findByIdAndUpdate(id, { numViews: post.numViews + 1 }, { new: true })
            .populate("likes")
            .populate("dislikes");
        return res.status(200).json({ message: "Article found", updatedPost });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getBlogById = getBlogById;
//delete post
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield blogModel_1.default.findByIdAndDelete(id);
        return res.status(200).json({ message: "Article deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.deleteBlog = deleteBlog;
//like post
const likeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: blogId } = req.params;
    const blog = yield blogModel_1.default.findById(blogId);
    const { id: loginUserId } = req.user;
    const isLiked = blog === null || blog === void 0 ? void 0 : blog.isLiked;
    const alreadyDisliked = blog === null || blog === void 0 ? void 0 : blog.dislikes.find((userId) => userId.toString() === loginUserId.toString());
    if (alreadyDisliked) {
        const blog = yield blogModel_1.default.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        return res.status(200).json({ blog });
    }
    else if (isLiked) {
        const blog = yield blogModel_1.default.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        return res.status(200).json({ blog });
    }
    else {
        const blog = yield blogModel_1.default.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true,
        }, { new: true });
        return res.status(200).json({ blog });
    }
});
exports.likeBlog = likeBlog;
//dislike post
const dislikeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: blogId } = req.params;
    const blog = yield blogModel_1.default.findById(blogId);
    const { id: loginUserId } = req.user;
    const isDisliked = blog === null || blog === void 0 ? void 0 : blog.isDisliked;
    const alreadyLiked = blog === null || blog === void 0 ? void 0 : blog.likes.find((userId) => userId.toString() === loginUserId.toString());
    if (alreadyLiked) {
        const blog = yield blogModel_1.default.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false,
        }, { new: true });
        return res.status(200).json({ blog });
    }
    else if (isDisliked) {
        const blog = yield blogModel_1.default.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false,
        }, { new: true });
        return res.status(200).json({ blog });
    }
    else {
        const blog = yield blogModel_1.default.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true,
        }, { new: true });
        return res.status(200).json({ blog });
    }
});
exports.dislikeBlog = dislikeBlog;
//upload images
const uploadBlogImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const files = req.files;
        const uploader = (path) => (0, cloudinary_1.cloudinaryUploadImage)(path);
        const { path } = files[0];
        const newPath = yield uploader(path);
        fs_1.default.unlinkSync(path);
        const blog = yield blogModel_1.default.findByIdAndUpdate(id, {
            images: newPath,
        }, { new: true });
        return res.status(200).json({ message: "images uploaded", blog });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});
exports.uploadBlogImages = uploadBlogImages;
