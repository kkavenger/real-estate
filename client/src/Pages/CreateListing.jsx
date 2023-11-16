import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"

export default function CreateListing() {
  const [files, setfiles] = useState([])
  const [formdata, setformdata] = useState({
    imageUrls: [],
  })
  console.log(formdata);
  const [imgeuploaderror, setImageuploaderror] = useState(null);
  const [uploading, setUploading] = useState(false);
  const handlesubmitclick = () => {
    if(files.length > 0 && files.length + formdata.imageUrls.length < 7){
      setUploading(true);
      setImageuploaderror(false);
      const promise = []
      for(let i = 0; i < files.length; i++){
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise).then((urls) => {
        setformdata({ ...formdata, imageUrls: formdata.imageUrls.concat(urls) })
        setImageuploaderror(true);
        setUploading(false);
      }).catch((err) => {
        setImageuploaderror('Image upload error size should be less than 2mb', err)
        setUploading(false);
      });
    }else{
      setImageuploaderror('You can only upload 6 images per listing')
      setUploading(false);
    }
  }
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setformdata({
      ...formdata,
      imageUrls: formdata.imageUrls.filter((_, i) => i !== index),
    })
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-4 flex-1">
          <input type='text' placeholder="Name" className="border p-3 rounded-lg" id="Name" maxLength='60' minLength='5' required></input>
          <textarea type='text' placeholder="Description" className="border p-3 rounded-lg" id="Description" required></textarea>
          <input type='text' placeholder="Address" className="border p-3 rounded-lg" id="Address" required></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-6">
              <input type="checkbox" id="Sale" className="w-5"></input>
              <span>Sale</span>
              <input type="checkbox" id="Rent" className="w-5"></input>
              <span>Rent</span>
              <input type="checkbox" id="Parking spot" className="w-5"></input>
              <span>Parking</span>
              <input type="checkbox" id="Furnished" className="w-5"></input>
              <span>Furnished</span>
              <input type="checkbox" id="Offer" className="w-5"></input>
              <span>Offer</span>
            </div>
          </div>
          <div className = "flex flex-wrap gap-6">
            <div className = "flex items-center gap-2">
              <input type="number" id="bedrooms" min='1' max='10' required className="p-3 border border-grey-300 rounded-lg"></input>
              <p>Beds</p>
            </div>
            <div className = "flex items-center gap-2">
              <input type="number" id="bathrooms" min='1' max='10' required className="p-3 border border-grey-300 rounded-lg"></input>
              <p>Bathrooms</p>
            </div>
            <div className = "flex items-center gap-2">
              <input type="number" id="Regularprice" min='1' max='10' required className="p-3 border border-grey-300 rounded-lg"></input>
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className = "flex items-center gap-2">
              <input type="number" id="Discountedprice" min='1' max='10' required className="p-3 border border-grey-300 rounded-lg"></input>
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-6">
          <p className="font-semibold">
            Image:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover</span>
          </p>
          <div className="flex gap-4">
            <input onChange = {(e) => setfiles(e.target.files)} className="p-3 border border-gray-700 rounded w-full" type="file" id="image" accept="image/*" multiple></input>
            <button disabled={uploading} onClick = {handlesubmitclick} type = "button" className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              {uploading ? 'Uploading...' : 'Uploading'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imgeuploaderror && imgeuploaderror}</p>
          {
            formdata.imageUrls.length > 0 && formdata.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between p-3 border items-center">
                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg"></img>
                <button type = "button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
              </div>
            ))
          }
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
        </div>
      </form>
    </main>
  )
}
