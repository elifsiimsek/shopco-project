import axios from "axios";

export interface PriceRange {
  min: number;
  max: number;
}

export interface Product {
  id: number | string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  img: string;
  images: string[];
  rating: number;
  category: string;
  description: string;
  colors: string[];
  sizes: string[];
  isNew: boolean;
  stock: number;
  style: string;
  description_short?: string;
  fabric?: string;
  weight?: string;
  fit?: string;
  manufacturing?: string;
}

export interface PlatziProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: { id: number; name: string; image: string };
}

export const categories = [
  "T-shirts",
  "Shorts",
  "Shirts",
  "Hoodie",
  "Jeans",
  "Electronics",
  "Shoes",
];

export const dressStyles = ["Casual", "Formal", "Party", "Gym"];

export const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large"
];

export const availableColors = [
  { name: "Green", code: "bg-brandGreen" },
  { name: "Red", code: "bg-brandRed" },
  { name: "Yellow", code: "bg-brandYellow" },
  { name: "Orange", code: "bg-brandOrange" },
  { name: "Cyan", code: "bg-brandCyan" },
  { name: "Blue", code: "bg-brandBlue" },
  { name: "Purple", code: "bg-brandPurple" },
  { name: "Pink", code: "bg-brandPink" },
  { name: "White", code: "bg-white" },
  { name: "Black", code: "bg-black" },
];

const BASE_URL = "https://api.escuelajs.co/api/v1";

export const getStoredProducts = (): Product[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("vault_admin_products");
  return stored ? JSON.parse(stored) : [];
};

export const saveProductToStore = (newProduct: Product) => {
  const current = getStoredProducts();
  const filtered = current.filter(
    (p) => String(p.id) !== String(newProduct.id),
  );
  const updated = [newProduct, ...filtered];
  localStorage.setItem("vault_admin_products", JSON.stringify(updated));
  return updated;
};

const cleanImage = (url: string): string => {
  const fallback = "https://i.sstatic.net/y9DpT.jpg";
  if (!url) return fallback;

  let cleaned = url
    .replace(/[\[\]"]/g, "")
    .replace(/\\/g, "")
    .trim();

  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }

  const badPatterns = ["any", "placeholder", "placeimg"];
  const isBad =
    badPatterns.some((p) => cleaned.toLowerCase().includes(p)) ||
    !cleaned.startsWith("http") ||
    !cleaned.includes(".");

  return isBad ? fallback : cleaned;
};

const mapApiToProduct = (apiProduct: PlatziProduct): Product => {
  const idNum = Number(apiProduct.id) || 0;

  const hasDiscount = idNum % 3 === 0; 
  const discountRates = [10, 15, 20, 25, 30];
  const discountIndex = idNum % discountRates.length;
  
  let currentPrice = apiProduct.price;
  let oldPrice = undefined;
  let discount = undefined;

  if (hasDiscount) {
    discount = discountRates[discountIndex];
    oldPrice = Math.round(currentPrice + currentPrice * (discount / 100));
  }

  const color1 = availableColors[idNum % availableColors.length].code;
  const color2 = availableColors[(idNum + 2) % availableColors.length].code;
  const color3 = availableColors[(idNum + 4) % availableColors.length].code;
  const fixedColors = [color1, color2, color3];

  return {
    id: String(apiProduct.id),
    name: apiProduct.title,
    price: currentPrice,
    oldPrice: oldPrice,
    discount: discount,
    img: cleanImage(apiProduct.images[0]),
    images: Array.isArray(apiProduct.images)
      ? apiProduct.images.map(cleanImage)
      : [cleanImage(apiProduct.images[0])],
    rating: 4.5,
    category: apiProduct.category?.name || "Uncategorized",
    description: apiProduct.description,
    colors: fixedColors, 
    sizes: ["Small", "Medium", "Large", "X-Large"],
    isNew: idNum % 7 === 0,
    stock: 25,
    style: "Casual",
    description_short: "Premium Quality Vault Essential.",
    fabric: "100% GOTS Organic Cotton",
    weight: "280 GSM Heavyweight",
    fit: "Boxy Fit",
    manufacturing: "Premium Garment Dye",
  };
};

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const response = await axios.get<PlatziProduct[]>(
        `${BASE_URL}/products?offset=0&limit=100`,
      );

      if (!response.data) {
        throw new Error("API'den veri gelmedi");
      }

      const apiProducts = response.data
        .filter((item) => item.images && item.images.length > 0)
        .map(mapApiToProduct);

      const stored = getStoredProducts();
      return [...stored, ...apiProducts];
    } catch (error) {
      console.error("Fetch Error:", error);
      return getStoredProducts();
    }
  },

  getProductById: async (id: string | number): Promise<Product | null> => {
    const adminProducts = getStoredProducts();
    const foundAdmin = adminProducts.find((p) => String(p.id) === String(id));
    if (foundAdmin) return foundAdmin;

    try {
      const response = await axios.get<PlatziProduct>(
        `${BASE_URL}/products/${id}`,
      );
      return mapApiToProduct(response.data);
    } catch {
      return null;
    }
  },

  getRelatedProducts: async (
    currentId: string | number,
    limit: number = 4,
  ): Promise<Product[]> => {
    try {
      const all = await productService.getAllProducts();
      return all
        .filter((p) => String(p.id) !== String(currentId))
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
    } catch {
      return [];
    }
  },
};