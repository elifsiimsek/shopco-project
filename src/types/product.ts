export interface Product {
  id: string | number;
  name: string;
  price: number;
  img: string;
  images: string[];
  category: string;
  rating: number;
  colors: string[];
  sizes: string[];
  description: string;
  isNew: boolean;
  stock: number;    
  style: string;    
  oldPrice?: number;
  discount?: number;
  fabric?: string;
  weight?: string;
  fit?: string;
  manufacturing?: string;
  description_short?: string;
}