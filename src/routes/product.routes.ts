import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts } from "../controllers/product.controller.js";

const router = Router()

router.use(verifyJWT)

router.route("/create-product").post(createProduct)
router.route("/get-all-products").get(getAllProducts)

export default router;