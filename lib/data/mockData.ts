export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isNew: boolean;
  rating: number;
  categoryIndex?: number;
};

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Handcrafted Wooden Chair",
    price: 149.99,
    description: "A beautifully handcrafted wooden chair made from oak.",
    imageUrl: "/wooden-chair.jpg",
    isNew: true,
    rating: 4.5,
    categoryIndex: 5,
  },
  {
    id: 2,
    name: "Artisan Ceramic Vase",
    price: 79.99,
    description: "A unique ceramic vase made by local artisans.",
    imageUrl: "/ceramic-vase.jpg",
    isNew: false,
    rating: 4.0,
    categoryIndex: 6,
  },
  {
    id: 3,
    name: "Custom Leather Wallet",
    price: 59.99,
    description:
      "A durable leather wallet that can be customized with initials.",
    imageUrl: "/leather-wallet.jpg",
    isNew: true,
    rating: 4.8,
    categoryIndex: 7,
  },
  {
    id: 4,
    name: "Handwoven Cotton Blanket",
    price: 129.99,
    description: "A cozy handwoven cotton blanket perfect for chilly evenings.",
    imageUrl: "/cotton-blanket.jpg",
    isNew: false,
    rating: 4.3,
  },
  {
    id: 5,
    name: "Rustic Metal Wall Art",
    price: 199.99,
    description: "A piece of rustic metal wall art to enhance your home decor.",
    imageUrl: "/metal-wall-art.jpg",
    isNew: true,
    rating: 4.7,
  },
];

export const mockCategories: { id: number; name: string }[] = [
  { id: 1, name: "Furniture" },
  { id: 2, name: "Home Decor" },
  { id: 3, name: "Accessories" },
  { id: 4, name: "Outdoor" },
  { id: 5, name: "Kitchenware" },

  { id: 6, name: "Summer Collection" },
  { id: 7, name: "New Collection" },
  { id: 8, name: "Trending Products" },

  { id: 9, name: "Textiles" },
  { id: 10, name: "Lighting" },
  { id: 11, name: "Art" },
  { id: 12, name: "Storage" },
  { id: 13, name: "Office Supplies" },
  { id: 14, name: "Gardening" },
];

