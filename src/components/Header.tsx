import { Link } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { User } from "../types/types";

import { signOut } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import toast from "react-hot-toast";
import { userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";

interface PropsType {
  user: User | null;
}

// const user = {
//   _id: "ddf",
//   role: "",
// };

//{ user }: PropsType
const Header = ({ user }: PropsType) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
      dispatch(userNotExist());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Sign Out Failed: ${error.message}`);
      } else {
        toast.error("Sign Out Failed: An unknown error occurred.");
      }
    }
  };

  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>
        HOME
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingBag />
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
