export interface PriceRange {
  min: number;
  max: number;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  img: string;
  rating: number;
  images?: string[];
  category: string;
  oldPrice?: number;
  discount?: string;
  style?: string;
  colors?: string[];
  sizes?: string[];
  description?: string;
  isNew?: boolean;
  selectedSize?: string;
  selectedColor?: string;
}

export interface DeleteConfirm {
  id: string | number;
  type: string;
}