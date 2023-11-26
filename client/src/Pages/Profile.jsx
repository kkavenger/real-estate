import { useEffect, useRef, useState } from 'react'//This we make to update the profile picture
import { useSelector } from 'react-redux'//To get the informaton from redux toolkit
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Profile() {
  //We initialize the filereference
  const fileref = useRef(null);
  //Get the Information of currentuser from redux toolkit
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [file, setfile] = useState(undefined)
  const [fileperc, setfileperc] = useState(0)
  const [fileUploaderror, setfileuploaderror] = useState(false)
  const [formdata, setFormdata] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showlistingerror, setShowlistingerror] = useState(false)
  const [showlisting, setShowlisting] = useState([]);
  const dispatch = useDispatch()
  console.log(file)
  console.log(fileperc)
  console.log(fileUploaderror)
  console.log(formdata)

  //When the file changes the useEffect gets run again and again
  useEffect(() => {
    if(file){
      handlefileupload(file)
    }
  },[file])

  //function to upload a file to the firebase
  const handlefileupload = (file) => {

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageref = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageref, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setfileperc(Math.round(progress));
    },
    (error) => {
      if(error){
        setfileuploaderror(true);
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormdata({ ...formdata, avatar: downloadURL }))
    })
  }
  //Function to handle changes in the form
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id] : e.target.value })
  }
  //Funtion fire when the form gets submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/sign-out');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleShowlisting = async() => {
    try {
      setShowlistingerror(false)
      const res = await fetch(`/api/user/listing/${currentUser._id}`)
      const data = await res.json()
      if(data.success === false) {
        setShowlistingerror(true)
        return
      }
      console.log(data);
      setShowlisting(data);
    } catch (error) {
      setShowlistingerror(true)
    }
  }
  const handleListingDelete = async(listingID) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingID}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        console.log(data.message)
        return;
      }
      setShowlisting((prev) => prev.filter((listings) => listings._id !== listingID));
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit = {handleSubmit} className='flex flex-col gap-4'>
        <input onChange = { (e) => setfile(e.target.files[0] ) } type="file" ref={fileref} hidden accept='image/*'/>
        <img onClick = { () => fileref.current.click() } src={formdata.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploaderror ? (
            <span className='text-red-700'>Error in uploading image</span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className = 'text-slate-700'>{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className = 'text-green-700'>Image Uploading successful!</span>
          ) : (
            ''
          )}
        </p>
        <input type='text' defaultValue={currentUser.username} onChange = {handleChange} placeholder='username' id = 'username' className='border p-3 rounded-lg'/>
        <input type='email' defaultValue={currentUser.email} onChange = {handleChange} placeholder='email' id = 'email' className='border p-3 rounded-lg'/>
        <input type='password' placeholder='password' onChange = {handleChange} id = 'password' className='border p-3 rounded-lg'/>
        <button disabled = {loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-90'>{loading ? 'Loading...' : 'Update'}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover: opacity-95' to = {"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick = {handleDeleteUser}>Delete Account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User Updated Successfuly' : ''}</p>
      <button onClick = {handleShowlisting} className='text-green-700 w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>{showlistingerror ? showlistingerror : ''}</p>
      {
        showlisting && 
        showlisting.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl'>Your listings</h1>
          {showlisting.map((listing) => (
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-contain'></img>
            </Link>
            <Link className = 'font-semibold hover:underline truncate text-slate-700 flex-1' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick = {() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
            </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
