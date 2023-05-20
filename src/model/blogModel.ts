import mongoose from "mongoose";

const blogShema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    numViews: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    isDisliked: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    images: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5DFGqY1xEkoJUpvPRy2ISAIjvAUBvbPHnDQ&usqp=CAU",
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogShema);

export default Blog;
