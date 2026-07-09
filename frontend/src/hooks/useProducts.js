import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
} from "../lib/api";
import { useAuth } from "@clerk/clerk-react";

export const useProducts = () => {
  const result = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  return result;
};

export const useCreateProduct = () => {
  const result = useMutation({ mutationFn: createProduct });
  return result;
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useDeleteProduct = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};

export const useMyProducts = () => {
  const { isLoaded, isSignedIn } = useAuth(); // iz @clerk/clerk-react
  return useQuery({
    queryKey: ["myProducts"],
    queryFn: getMyProducts,
    enabled: isLoaded && isSignedIn,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};
