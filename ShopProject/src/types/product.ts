export interface Product {
  id: string | number;
  name: string;
  price: number;
  img: string;
  rating: number;
  category: string;
  oldPrice?: number;
  discount?: string;
  style?: string;
  colors?: string[];
  sizes?: string[];
  description?: string;
  isNew?: boolean;
}