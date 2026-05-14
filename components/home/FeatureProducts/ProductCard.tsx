import { Button } from "@/components/ui/button";
import { mockProducts, mockCategories } from "@/lib/data/mockData";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import FilteredProductsPage from "../OtherProducts/FilteredProductsPage";

interface ProductCardProps {
  product: any; 
}


const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <>
      <div className="flex gap-1 px-7 justify-around max-w-7xl mx-auto items-center py-10">
        {mockProducts.slice(0, 3).map((product: any) => {
          const category = mockCategories[product.categoryIndex] || "Uncategorized";
          return (
          <Card
            key={product.id}
            className="max-w-sm mx-auto w-full"
            variant="featured"
          >
            <CardHeader>
              <CardTitle>{category?.name}</CardTitle>
              <CardDescription>
                {product.name}
              </CardDescription>
              <div>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                />
              </div>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className=" gap-2 ">
              <CardAction>
                <Button variant="link">shop now</Button>
              </CardAction>
            </CardFooter>
          </Card>
          );
        })}
      </div>
      <FilteredProductsPage />
    </>
  );
};

export default ProductCard;
