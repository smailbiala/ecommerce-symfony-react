import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchProducts,
  filterProducts,
} from "../store/slices/productsSlice";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    categoryId: "",
    inStock: false,
    sortBy: "name",
    sortDirection: "asc",
  });

  const { categories, categoriesStatus } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSortChange = (e) => {
    const [sortBy, sortDirection] = e.target.value.split("-");
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortDirection,
    }));
  };

  const applyFilters = () => {
    const filterParams = {
      ...filters,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      categoryId: filters.categoryId || undefined,
    };

    dispatch(filterProducts(filterParams));
  };

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      categoryId: "",
      inStock: false,
      sortBy: "name",
      sortDirection: "asc",
    });
    dispatch(fetchProducts());
  };

  if (status === "loading" && (!items || items.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  const products = Array.isArray(items) ? items : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={filters.categoryId}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={`${filters.sortBy}-${filters.sortDirection}`}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={filters.inStock}
              onChange={handleFilterChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="inStock"
              className="text-sm font-medium text-gray-700"
            >
              In Stock Only
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && status === "succeeded" && (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
