import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInfailure } from "../redux/user/userSlice";
import OAuth from "../Components/OAuth";

export default function Signin() {

  const[form, setformdata] = useState({});
  const {loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (event) => {
    setformdata({
      ...form,
      [event.target.id]: event.target.value,
    });
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
        dispatch(signInfailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInfailure(error.message));
    }
  };
  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type='email' placeholder="Email" id = "email" className="rounded-lg border p-3" onChange={handleChange}/>
        <input type='password' placeholder="Password" id = "password" className="rounded-lg border p-3" onChange={handleChange}/>
        <button disabled = {loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Sign In'}</button>
        <OAuth/>
      </form>
      <div className="mt-4 flex gap-2">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500">SignUp</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  )
}
