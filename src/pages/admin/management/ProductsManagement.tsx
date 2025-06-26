import AdminSidebar from "../../../components/admin/AdminSidebar";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useSelector } from "react-redux";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../../components/Loader";
import { responseToast } from "../../../utils/features";

const Productmanagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );
  const params = useParams();
  const navigate = useNavigate();

  //trk query
  const { data, isLoading } = useProductDetailsQuery(params.id!);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const { photos, name, price, stock, category, description } =
    data?.product || {
      photos: [],
      name: "",
      price: 0,
      stock: 0,
      category: "",
      description: "",
    };

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [desUpdate, setDesUpdate] = useState<string>(description);
  const [photoUpdate, setPhotoUpdate] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File[] | undefined>(undefined);

  // console.log(photoFile, setCategory); //! remove this

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const previews: string[] = [];
    const photoFiles: File[] = [];
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          previews.push(reader.result);
          photoFiles.push(file);

          // Once all files are processed, update state
          if (previews.length === fileArray.length) {
            setPhotoUpdate(previews);
            setPhotoFile(photoFiles);
          }
        }
      };
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (nameUpdate) formData.append("name", nameUpdate);

    if (priceUpdate) formData.append("price", priceUpdate.toString());

    if (stockUpdate !== undefined)
      formData.append("stock", stockUpdate.toString());

    if (categoryUpdate) formData.append("category", categoryUpdate);
    if (desUpdate) formData.append("description", desUpdate);

    if (photoFile && photoFile.length > 0) {
      photoFile.forEach((file) => {
        formData.append("photos", file); // note: use "photos" if your backend expects that
      });
    }

    const userId = user?._id || "";
    const productId = data?.product._id || "";
    const res = await updateProduct({ formData, userId, productId });

    responseToast(res, navigate, "/admin/products");
  };
  const deleteHandler = async () => {
    const userId = user?._id || "";
    const productId = data?.product._id || "";
    const res = await deleteProduct({ userId, productId });

    responseToast(res, navigate, "/admin/products");
  };

  useEffect(() => {
    if (data) {
      const { name, price, stock, category, description, photos } =
        data.product;
      setNameUpdate(name);
      setPriceUpdate(price);
      setStockUpdate(stock);
      setCategoryUpdate(category);
      setDesUpdate(description);
      if (Array.isArray(photos)) {
        setPhotoUpdate(photos.map((photo) => photo.url)); // extract only URLs
      } else {
        setPhotoUpdate([]); // fallback
      }
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img
                src={
                  typeof photos === "string"
                    ? photos
                    : photos && photos[0] && typeof photos[0] === "object"
                    ? photos[0].url
                    : ""
                }
                alt="Product"
              />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button onClick={deleteHandler} className="product-delete-btn">
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>

                  <textarea
                    required
                    placeholder="Description..."
                    value={desUpdate}
                    onChange={(e) => setDesUpdate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Photo</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={changeImageHandler}
                  />
                </div>

                {photoUpdate.length > 0 && (
                  <div
                    style={{ display: "flex", gap: "1rem", overflowX: "auto" }}
                  >
                    {photoUpdate.map((imgSrc, index) => (
                      <img
                        key={index}
                        src={imgSrc}
                        alt={`Preview ${index + 1}`}
                        width={100}
                      />
                    ))}
                  </div>
                )}
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
