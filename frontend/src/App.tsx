import "./output.css";
import { useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Link,
} from "react-router-dom";

function Page() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ For page navigation

  const handleLoginSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://final-registration-form-backend.onrender.com/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200 || res.status === 201) {
        // ✅ SUCCESS → navigate
        navigate("/loggedin", { state: { email } });
        setEmail("");
        setPassword("");
        setMessage("");
      } else {
        // ❌ Server responded with something, but not success → show message
        const responseData = res.data;
        setMessage(responseData.message);
      }
    } catch (error: any) {
      //'any' means: It can be any type (string, number, object, etc.).
      /*
      ✅ error.response → server sent a reply (even if it’s an error)
      ✅ error.response.data → reply has details like a data body
      ✅ error.response.data.message → backend included an error message (like “Invalid password”)
      👉 If all three exist → safely show error.response.data.message to the user
      👉 If not, show a general error: “Something went wrong. Please try again.”

      1. In `const responseData = res.data;`:
      - `res` is the successful server response object returned by axios.
      - `data` is a property inside `res` that holds the actual response data from the server.

      2. In `error.response && error.response.data && error.response.data.message`:
      - If the server sends an error (like 400 or 500) or if the request can’t be done (like no internet or timeout), axios will give you an error object inside the catch block.
      - This error object contains info from the backend’s error reply (like message, status, etc.) inside error.response.
      - `response` is a property inside the error object that contains the server’s error response (like status, message, data).
      - `response` here is NOT a keyword, just a normal property name inside the error object.
      - We check it to safely access the error message sent by the server.
      */

      // 💥 REQUEST FAILED (network error, server down, 500 error, timeout, etc.)
      if (error.response?.data?.message) {
        // ❌ Server sent back an error message
        setMessage(error.response.data.message);
      } else {
        // ❌ Unexpected error (no server message)
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  const handleSignUpSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://final-registration-form-backend.onrender.com/signup",
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const responseData = res.data;

      if (res.status === 200 || res.status === 201) {
        navigate("/signedup", { state: { email } });
        setName("");
        setEmail("");
        setPassword("");
        setMessage("");
      } else {
        console.log(responseData.message || "Invalid username or password");
      }
    } catch (error: any) {
      // 💥 REQUEST FAILED (network error, server down, 500 error, timeout, etc.)
      if (error.response?.data?.message) {
        // ❌ Server sent back an error message
        setMessage(error.response.data.message);
      } else {
        // ❌ Unexpected error (no server message)
        setMessage("An unexpected error occurred. Please try again!");
      }
      console.error("Request failed:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={mode == "login" ? handleLoginSubmit : handleSignUpSubmit}
        className="bg-cyan-50 h-screen w-screen flex items-center justify-center flex-col"
      >
        <div className="w-72 border-[3px] rounded-md border-gray-700 bg-white p-4 flex flex-col justify-between h-[400px]">
          <h1 className="text-center font-bold text-2xl">
            {mode === "login" ? "Login" : "SignUp"} Form
          </h1>

          <div className="flex border-2 border-gray-200 rounded overflow-hidden h-10 mt-5 mb-4">
            <div
              onClick={() => {
                setMode("login");
                setMessage(""); // Clear error/success message on mode switch
              }}
              className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-medium ${
                mode === "login"
                  ? "bg-blue-900 text-cyan-100"
                  : "bg-white text-black"
              }`}
            >
              Login
            </div>
            <div
              onClick={() => {
                setMode("signup");
                setMessage(""); // Clear error/success message on mode switch
              }}
              className={`flex-1 flex items-center justify-center cursor-pointer select-none text-sm font-medium ${
                mode === "signup"
                  ? "bg-blue-900 text-cyan-100"
                  : "bg-white text-black"
              }`}
            >
              Signup
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between mt-4 mb-2">
            {mode === "login" ? (
              <>
                <div className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-blue-900 text-cyan-100 px-3 py-1 rounded cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      required
                      className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="outline-none shadow-sm px-2 py-1 border-gray-200 border-2 rounded placeholder:text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-blue-900 text-cyan-100 px-3 py-1 rounded  cursor-pointer"
                  >
                    Signup
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="text-sm text-center mt-2">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => setMode("signup")}
                  className="text-blue-900 font-semibold cursor-pointer underline"
                >
                  SignUp
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setMode("login")}
                  className="text-blue-900 font-semibold cursor-pointer underline"
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
        <div className="mt-10 text-red-500">
          {message && <h1>{message}</h1>}
        </div>
      </form>
    </>
  );
}

// ✅ Login Page Success component
import { useLocation } from "react-router-dom";
function AfterLogin() {
  const location = useLocation(); // Get passed state from navigation
  const email = location.state?.email || "User"; //safely get email, or "User" if none

  return (
    <div className="text-center mt-12">
      <h1 className="text-green-500 text-2xl font-bold">
        {email} Logged in Successfully!
      </h1>
      <nav className="mt-5">
        <Link to="/">
          <button className="border-black border-2 px-2 py-1 rounded-sm bg-blue-800 text-cyan-100 cursor-pointer">
            Logout
          </button>
        </Link>
      </nav>
    </div>
  );
}

// ✅ Signed Up Page Success component
function AfterSignUp() {
  const location = useLocation(); // Get passed state from navigation
  const email = location.state?.email || "User"; //safely get email, or "User" if none

  return (
    <div className="text-center mt-12">
      <h1 className="text-green-500 text-2xl font-bold">
        {email} Signed Up Successfully!
      </h1>
      <nav className="mt-5">
        <Link to="/">
          <button className="border-black border-2 px-2 py-1 rounded-sm bg-blue-800 text-cyan-100 cursor-pointer">
            Login
          </button>
        </Link>
      </nav>
    </div>
  );
}

// ✅ Main App component with routes
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/loggedin" element={<AfterLogin />} />
        <Route path="/signedup" element={<AfterSignUp />} />
      </Routes>
    </Router>
  );
}

// ChatGPT code for Login/SignUp Form
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Page() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setError("");
//     try {
//       const res = await fetch("https://final-registration-form-backend.onrender.com/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       if (res.ok) {
//         navigate("/loggedin");
//       } else {
//         const data = await res.json();
//         setError(data.message || "Login failed. Please try again.");
//       }
//     } catch (err) {
//       setError("Network error. Please check your connection.");
//     }
//   };

//   const handleSignUp = async () => {
//     setError("");
//     try {
//       const res = await fetch("https://final-registration-form-backend.onrender.com/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       if (res.ok) {
//         navigate("/signedup");
//       } else {
//         const data = await res.json();
//         setError(data.message || "Sign up failed. Please try again.");
//       }
//     } catch (err) {
//       setError("Network error. Please check your connection.");
//     }
//   };

//   return (
//     <div className="bg-gray-200 h-screen flex justify-center items-center">
//       <div className="bg-white p-8 rounded shadow-md w-80">
//         <h1 className="text-2xl font-bold mb-4">Login or Sign Up</h1>
//         {error && <p className="text-red-500 mb-2">{error}</p>}
//         <input
//           type="text"
//           placeholder="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="mb-2 p-2 border rounded w-full"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="mb-4 p-2 border rounded w-full"
//         />
//         <button
//           onClick={handleLogin}
//           className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2"
//         >
//           Log In
//         </button>
//         <button
//           onClick={handleSignUp}
//           className="bg-green-500 text-white px-4 py-2 rounded w-full"
//         >
//           Sign Up
//         </button>
//       </div>
//     </div>
//   );
// }
