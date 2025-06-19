import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../Firebase/firebase";
import { getUser, useLoginMutation } from "../redux/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../types/api-types";

// import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
// import { MessageResponse } from "../types/api-types";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");

  const [login] = useLoginMutation();

  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      console.log({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      });
      const res = await login({
        name: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        gender,
        role: "user",
        dob: date,
        _id: user.uid,
      });

      if ("data" in res && res.data) {
        toast.success(res.data.message);

        const data = await getUser(user.uid);

        dispatch(userExist(data?.user));
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponse).message;
        toast.error(message);
        dispatch(userNotExist());
      }
    } catch (error) {
      toast.error("Sign In Fail ");
      console.log(error);
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>

        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p>Already Signed In Once</p>
          <button onClick={loginHandler}>
            <FcGoogle /> <span>Sign in with Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;

//! it is simple for more secutity i need must use token and verify it in bcakend ,,,other wise if anyone can know route he can create user and manually set user.role=@admin and then acces by id and can get acces admin protect route

//! so use token for hit everyrout in back end ,,firebase provide token and it also provide @firebase-admin SDK  in backend that check is this token is verified or not

//*firebase admin file in backend

// // firebaseAdmin.js
// import admin from "firebase-admin";
// import serviceAccount from "./serviceAccountKey.json";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;

//* verifytoken middleware in backend

// import admin from "./firebaseAdmin";

// const verifyFirebaseToken = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const token = authHeader.split(" ")[1];
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.firebaseUser = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };

//*or

// const idToken = req.body.token; // or req.headers.authorization

// const decodedToken = await admin.auth().verifyIdToken(idToken);
// if (decodedToken.uid !== req.body._id) {
//   return res.status(401).json({ message: "UID mismatch" });
// }

//* get firebase token in frontend and send it to backend

// const token = await user.getIdToken();

// const res = await login({
//   name: user.displayName,
//   email: user.email,
//   photo: user.photoURL,
//   gender,
//   role: "user",
//   dob: date,
//   _id: user.uid,
//   token,
// });

// * or by header

// fetch("/api/update", {
//   method: "POST",
//   headers: {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ name: "New Name" }),
// });
