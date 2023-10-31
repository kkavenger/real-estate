import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input type='text' placeholder="Username" id = "username" className="rounded-lg border p-3"/>
        <input type='email' placeholder="Email" id = "email" className="rounded-lg border p-3"/>
        <input type='password' placeholder="Password" id = "password" className="rounded-lg border p-3"/>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">Sign Up</button>
      </form>
      <div className="mt-4 flex gap-2">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500">SignIn</span>
        </Link>
      </div>

    </div>
  )
}
