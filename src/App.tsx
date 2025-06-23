import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { UserReducerInitialState } from "./types/reducer-types";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { useDispatch, useSelector } from "react-redux";
//firebase
import { auth } from "./Firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUser } from "./redux/api/userApi";
import ProtectedRoute from "./Firebase/ProtectedRoute";
import NotFound from "./pages/not-found";

//main route import
const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/Search"));
const PopductDetails = lazy(() => import("./pages/productDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));

//!......................This is admin Import route

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const Transaction = lazy(() => import("./pages/admin/Transaction"));
const Customers = lazy(() => import("./pages/admin/Customers"));

//fro managments
const NewProducts = lazy(() => import("./pages/admin/management/NewProducts"));
const ProductsManagement = lazy(
  () => import("./pages/admin/management/ProductsManagement"),
);
const TransactionsManagement = lazy(
  () => import("./pages/admin/management/TransactionsManagement"),
);

//for Charts
const BarChart = lazy(() => import("./pages/admin/Chart/BarChart"));
const LineChart = lazy(() => import("./pages/admin/Chart/LineChart"));
const PieChart = lazy(() => import("./pages/admin/Chart/PieChart"));

//for apps
const Stopwatch = lazy(() => import("./pages/admin/Apps/Stopwatch"));
const Coupon = lazy(() => import("./pages/admin/Apps/Coupon"));
const Toss = lazy(() => import("./pages/admin/Apps/Toss"));
import CheckOut from "./pages/CheckOut";

//default actions

export default function App() {
  const Dispatch = useDispatch();
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer,
  );

  //* when login by firebase it automatic post in backend see login code ,,,so if user just fetch user from backend by firebase uuid
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        //* user is logged in
        try {
          console.log("Logged in:", user);
          const data = await getUser(user.uid);
          if (data && data.user) {
            Dispatch(userExist(data.user));
          } else {
            // User not found in MongoDB, force logout or handle gracefully
            console.warn("User not found in DB");
            Dispatch(userNotExist());
            await signOut(auth);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          Dispatch(userNotExist());
          await signOut(auth);
        }
      } else {
        //* user is logged out
        Dispatch(userNotExist());
      }
    });

    return () => unsubscribe(); // cleanup
  }, [Dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      {/* header */}
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<PopductDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* //!......................not login route mane user na takle true hobe login acces kora jabe but user takle false hobe login jawa jabe na */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* //!......................This is logged in user route */}
          <Route>
            <Route
              path="/shipping"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <Shipping />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order/:id"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pay"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <CheckOut />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* //!......................This is admin route */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={user ? true : false}
                adminOnly={true}
                isAdmin={user?.role === "admin"}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />

            {/* Charts */}
            <Route path="/admin/chart/barchart" element={<BarChart />} />
            <Route path="/admin/chart/linechart" element={<LineChart />} />
            <Route path="/admin/chart/piechart" element={<PieChart />} />

            {/* Apps */}
            <Route path="/admin/apps/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/apps/coupon" element={<Coupon />} />
            <Route path="/admin/apps/toss" element={<Toss />} />

            {/* management */}
            <Route path="admin/product/new" element={<NewProducts />} />
            <Route path="admin/product/:id" element={<ProductsManagement />} />
            <Route
              path="admin/transaction/:id"
              element={<TransactionsManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}
