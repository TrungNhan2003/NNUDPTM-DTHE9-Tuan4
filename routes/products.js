const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/* ================== SCHEMA ================== */
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    price: {
      type: Number,
      required: true
    },
    description: String
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);

/* ================== HELPER ================== */
// Chuyển tiếng Việt → slug (đúng ví dụ đề)
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ================== GET PRODUCTS ================== */
/**
 * GET /products
 * ?page=1&limit=5&minPrice=1000&maxPrice=5000
 */
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 10, minPrice, maxPrice } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // Validate page & limit
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({
        message: 'page và limit phải là số nguyên dương'
      });
    }

    // Validate price range
    if (minPrice && maxPrice && Number(maxPrice) < Number(minPrice)) {
      return res.status(400).json({
        message: 'maxPrice phải >= minPrice'
      });
    }

    // Filter
    const filter = {};
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================== GET BY SLUG ================== */
/**
 * GET /products/slug/dien-thoai-samsung
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm'
      });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================== CREATE PRODUCT ================== */
/**
 * POST /products
 */
router.post('/', async (req, res) => {
  try {
    const { title, price, description } = req.body;

    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({
        message: 'title và price không được để trống'
      });
    }

    if (isNaN(price)) {
      return res.status(400).json({
        message: 'price phải là số'
      });
    }

    const slug = slugify(title);

    // Check duplicate slug
    const exist = await Product.findOne({ slug });
    if (exist) {
      return res.status(400).json({
        message: 'Sản phẩm đã tồn tại'
      });
    }

    const product = await Product.create({
      title,
      slug,
      price,
      description
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
