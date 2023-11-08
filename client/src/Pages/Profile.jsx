import { useEffect, useRef, useState } from 'react'//This we make to update the profile picture
import { useSelector } from 'react-redux'//To get the informaton from redux toolkit
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'

export default function Profile() {
  //We initialize the filereference
  const fileref = useRef(null);
  //Get the Information of currentuser from redux toolkit
  const { currentUser } = useSelector((state) => state.user)
  const [file, setfile] = useState(undefined)
  const [fileperc, setfileperc] = useState(0)
  const [fileUploaderror, setfileuploaderror] = useState(false)
  const [formdata, setFormdata] = useState({});
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
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input onChange = { (e) => setfile(e.target.files[0] ) } type="file" ref={fileref} hidden accept='image/*'/>
        <img onClick = { () => fileref.current.click() } src={formdata.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p className='text-sm self-center'>
          {fileUploaderror ? (
            <span className='text-red-700'>Error in uploading image</span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className = 'text-slate-700'>{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className = 'text-green-700'>Image Uploading successful!</span>
          ): (
            ''
          )}
        </p>
        <input type='text' placeholder='username' id = 'usename' className='border p-3 rounded-lg'/>
        <input type='email' placeholder='email' id = 'email' className='border p-3 rounded-lg'/>
        <input type='password' placeholder='password' id = 'password' className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-90'>upadte</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
