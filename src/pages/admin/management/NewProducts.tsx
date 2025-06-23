import AdminSidebar from "../../../components/admin/AdminSidebar";
import { ChangeEvent, useState } from "react";
import { useCreateProductMutation } from "../../../redux/api/productApi";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNavigate } from "react-router-dom";
import { responseToast } from "../../../utils/features";

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [createProduct] = useCreateProductMutation();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[] | undefined>(undefined);

  console.log(photos); //! remove this

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
            setPhotoPrev(previews);
            setPhotos(photoFiles);
          }
        }
      };
    });
    // if (file) {
    //   reader.readAsDataURL(file);
    //   reader.onloadend = () => {
    //     if (typeof reader.result === "string") {
    //       setPhotoPrev(reader.result);
    //       setPhoto(file);
    //     }
    //   };
    // }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name || !category || !photos || !price || stock < 0) {
        return;
      }
      //Use FormData only when you're sending files (e.g. image uploads):You cannot send files like photo: file using JSON. FormData handles multipart/form-data under the hood.req.body will not contain the file unless you're using a file middleware (like multer).
      const formData = new FormData();
      formData.set("name", name);
      formData.set("category", category);
      formData.set("price", price.toString());
      formData.set("stock", stock.toString());
      photos.forEach((file) => {
        formData.append("photos", file);
      });

      const res = await createProduct({ formData, id: user ? user._id : "" });

      setName("");
      setCategory("");
      setPrice(1000);
      setStock(1);
      setPhotoPrev([]);
      setPhotos(undefined);
      setIsLoading(false);
      responseToast(res, navigate, "/admin/products");
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                required
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={changeImageHandler}
                required
              />
            </div>

            {photoPrev.length > 0 &&
              photoPrev.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Preview ${index + 1}`}
                  width={100}
                />
              ))}

            <button disabled={isLoading} type="submit">
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
