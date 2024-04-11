import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ProductQuery } from "../utils/types.js";

const createProduct = asyncHandler(async (req, res, next) => {
    const { name, description, price, category } = req.body
    const createdBy: string = req.user._id

    if (
        [name, description, price, category].some((val): boolean => val.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        createdBy
    })

    if (!product) {
        throw new ApiError(500, "Error while creating product")
    }

    res
        .status(200)
        .json(new ApiResponse(200, product, "Product created successfully"))
})

const getAllProducts = asyncHandler(async (req, res, next) => {
    let { page, limit, query, sortBy, sortType }: ProductQuery = req.query as { [key: string]: string };

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;
    sortType = (sortType === "asc") ? 1 : -1;

    if (!(["cate1", "cate2"].includes(sortBy))) {
        throw new ApiError(400, "Invalid category")
    }

    const allProducts = await Product.aggregate([
        {
            $match: {
                $text: {
                    $search: query,
                }
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy"
            }
        },
        {
            $project: {
                name: 1,
                _id: 1,
                description: 1,
                price: 1,
                category: 1,
                createdAt: 1,
                "createdBy.userName": 1,
                "createdBy.fullName": 1,
            }
        },
    ]).sort({sortBy: sortType}).skip((page - 1) * limit).limit(limit);

    if (!allProducts) {
        throw new ApiError(500, "Unable to fetch data from database");
      }
    
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {allProducts},
            "Products fetched successfully"
          )
        );
})

export { createProduct, getAllProducts }