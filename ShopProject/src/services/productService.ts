import type { Product } from "../types/product";

export const allProducts: Product[] = [
  {
    id: "1",
    name: "Gradient Graphic T-shirt",
    price: 145,
    rating: 3.5,
    img: "/products/p5.png",
    category: "T-shirts",
    style: "Casual",
    description: "This gradient graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    colors: ["#504A41", "#314F4A", "#31344F"],
    sizes: ["Small", "Medium", "Large", "X-Large"]
  },
  {
    id: "2",
    name: "Polo with Tipping Details",
    price: 180,
    oldPrice: 242,
    discount: "-20%",
    rating: 4.5,
    img: "/products/p6.png",
    category: "T-shirts",
    style: "Casual",
    description: "Classic polo shirt with elegant tipping details on the collar and sleeves for a refined look.",
    colors: ["#F50606", "#FFFFFF", "#000000"],
    sizes: ["Medium", "Large", "X-Large"]
  },
  {
    id: "3",
    name: "Black Striped T-shirt",
    price: 120,
    oldPrice: 150,
    discount: "-30%",
    rating: 5.0,
    img: "/products/p1.png",
    category: "T-shirts",
    style: "Casual",
    description: "Comfortable cotton T-shirt with timeless black stripes, an essential for daily wear.",
    colors: ["#000000", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "4",
    name: "Skinny Fit Jeans",
    price: 240,
    oldPrice: 260,
    discount: "-20%",
    rating: 3.5,
    img: "/products/p2.png",
    category: "Jeans",
    style: "Formal",
    description: "High-quality skinny fit jeans that combine durability with a sharp, modern silhouette.",
    colors: ["#063AF5", "#000000"],
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: "5",
    name: "Checkered Shirt",
    price: 180,
    rating: 4.5,
    img: "/products/p3.png",
    category: "Shirts",
    style: "Formal",
    description: "Versatile checkered shirt crafted from premium fabric, suitable for both office and social events.",
    colors: ["#F50606", "#FFFFFF"],
    sizes: ["Medium", "Large", "X-Large"]
  },
  {
    id: "6",
    name: "Sleeve Striped T-shirt",
    price: 130,
    oldPrice: 160,
    discount: "-30%",
    rating: 4.5,
    img: "/products/p4.png",
    category: "T-shirts",
    style: "Party",
    description: "Bold T-shirt with distinctive sleeve stripes to make a statement at any gathering.",
    colors: ["#F57906", "#000000"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "7",
    name: "Vertical Striped Shirt",
    price: 212,
    oldPrice: 232,
    discount: "-20%",
    rating: 5.0,
    img: "/products/TopSelling1.png",
    category: "Shirts",
    style: "Casual",
    description: "Elegant vertical striped shirt that offers a slimming look and breathable comfort.",
    colors: ["#00C12B", "#FFFFFF"],
    sizes: ["Medium", "Large", "X-Large"]
  },
  {
    id: "8",
    name: "Courage Graphic T-shirt",
    price: 145,
    rating: 4.0,
    img: "/products/TopSelling2.png",
    category: "T-shirts",
    style: "Gym",
    description: "A t-shirt designed for those who value both style and resilience. Great for active wear.",
    colors: ["#F57906", "#000000"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "9",
    name: "Loose Fit Bermuda Shorts",
    price: 80,
    rating: 3.0,
    img: "/products/TopSelling3.png",
    category: "Shorts",
    style: "Casual",
    description: "Loose fit bermuda shorts that combine comfort with a relaxed aesthetic for warm days.",
    colors: ["#06CAF5", "#F5DD06"],
    sizes: ["30", "32", "34"]
  },
  {
    id: "10",
    name: "Polo with Tipping Details",
    price: 280,
    rating: 4.8,
    img: "/products/p6.png",
    category: "Shirts",
    style: "Formal",
    description: "A high-end formal polo designed for professional settings and premium comfort.",
    colors: ["#000000", "#314F4A"],
    sizes: ["Large", "X-Large", "XXL"]
  },
  {
    id: "11",
    name: "Black Striped T-shirt",
    price: 210,
    rating: 4.2,
    img: "/products/p7.png",
    category: "T-shirts",
    style: "Casual",
    description: "Classic stripes for a bold daily outfit. Made from 100% organic cotton.",
    colors: ["#000000", "#FFFFFF"],
    sizes: ["Medium", "Large"]
  },
  {
    id: "12",
    name: "Polo with Contrast Trims",
    price: 210,
    rating: 4.2,
    img: "/products/p8.png",
    category: "T-shirts",
    style: "Casual",
    description: "Contrasting trims for a modern sporty look, perfect for a casual weekend.",
    colors: ["#31344F", "#FFFFFF"],
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: "13",
    name: "One Life Graphic T-shirt",
    price: 210,
    rating: 4.2,
    img: "/products/p9.png",
    category: "T-shirts",
    style: "Casual",
    description: "Stay inspired with our signature One Life graphic. High-quality print on premium fabric.",
    colors: ["#000000", "#504A41"],
    sizes: ["Medium", "Large", "X-Large"]
  },
];

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(allProducts), 300);
    });
  },

  getProductById: async (id: string | number): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      const product = allProducts.find((p) => String(p.id) === String(id));
      setTimeout(() => resolve(product), 300);
    });
  },
};