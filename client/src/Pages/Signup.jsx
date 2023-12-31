import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

export default function Signup() {

  const[form, setformdata] = useState({});
  const[error, seterror] = useState(null);
  const[loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setformdata({
      ...form,
      [event.target.id]: event.target.value,
    });
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      setloading(true);
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log(data);
      if(data.success === false) {
        setloading(false);
        seterror(data.message);
        return;
      }
      setloading(false);
      seterror(null);
      navigate('/sign-in');
    } catch (error) {
      setloading(false);
      seterror(error.message);
    }
  };
  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input type='text' placeholder="Username" id = "username" className="rounded-lg border p-3" onChange={handleChange}/>
        <input type='email' placeholder="Email" id = "email" className="rounded-lg border p-3" onChange={handleChange}/>
        <input type='password' placeholder="Password" id = "password" className="rounded-lg border p-3" onChange={handleChange}/>
        <button disabled = {loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Loading...' : 'Sign Up'}</button>
        <OAuth/>
      </form>
      <div className="mt-4 flex gap-2">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500">SignIn</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
    </div>
  )
}
