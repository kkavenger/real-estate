import { useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from "react"

export default function UpdateListing() {
  const {currentUser} = useSelector(state => state.user)
  const [files, setfiles] = useState([])
  const navigate = useNavigate()
  const params = useParams()
  const [formdata, setformdata] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: '',
    bedrooms: 1,
    bathrooms: 1,
    regularprice: 50,
    discountprice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })
  console.log(formdata);
  const [imgeuploaderror, setImageuploaderror] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetching = async () => {
      const listingid =  params.id;
      const res = await fetch(`/api/listing/get/${listingid}`)
      const data = await res.json();

      if(data.success === false){
        console.log(data.message);
        return;
      }
      setformdata(data);
    }
    fetching();
  }, [])

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
  const handlechange = (e) => {

    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setformdata({
        ...formdata,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setformdata({
        ...formdata,
        [e.target.id]: e.target.value,
      });
    }
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      if(formdata.imageUrls.length < 1) return setError('You must upload at least one image')
      if(+formdata.regularprice < +formdata.discountprice) return setError('Regular price must be greater than discount price')
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formdata,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);

      if(data.success === false){
        setError(data.message);
        setLoading(false);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Update a Listing</h1>
      <form onSubmit = {handleSubmit} className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-4 flex-1">
          <input type='text' onChange = {handlechange} value = {formdata.name} placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength='60' minLength='5' required></input>
          <textarea type='text' onChange = {handlechange} value = {formdata.description} placeholder="Description" className="border p-3 rounded-lg" id="description" required></textarea>
          <input type='text' onChange = {handlechange} value = {formdata.address} placeholder="Address" className="border p-3 rounded-lg" id="address" required></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-6">
              <input type="checkbox" id="sale" className="w-5" onChange={handlechange} checked={formdata.type === 'sale'}></input>
              <span>Sale</span>
              <input type="checkbox" id="rent" className="w-5" onChange={handlechange} checked={formdata.type === 'rent'}></input>
              <span>Rent</span>
              <input type="checkbox" id="parking" className="w-5" onChange={handlechange} checked={formdata.parking}></input>
              <span>Parking</span>
              <input type="checkbox" id="furnished" className="w-5" onChange={handlechange} checked={formdata.furnished}></input>
              <span>Furnished</span>
              <input type="checkbox" id="offer" className="w-5" onChange={handlechange} checked={formdata.offer}></input>
              <span>Offer</span>
            </div>
          </div>
          <div className = "flex flex-wrap gap-6">
            <div className = "flex items-center gap-2">
              <input type="number" id="bedrooms" min='1' max='10' required className="p-3 border border-grey-300 rounded-lg" onChange={handlechange} value={formdata.bedrooms}></input>
              <p>Beds</p>
            </div>
            <div className = "flex items-center gap-2">
              <input type="number" id="bathrooms" min='1' max='10' required className="p-3 border border-grey-300 rounded-lg" onChange={handlechange} value={formdata.bathrooms}></input>
              <p>Bathrooms</p>
            </div>
            <div className = "flex items-center gap-2">
              <input type="number" id="regularprice" min='50' max='1000000' required className="p-3 border border-grey-300 rounded-lg" onChange={handlechange} value={formdata.regularprice}></input>
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            {formdata.offer && (
            <div className = "flex items-center gap-2">
              <input type="number" id="discountprice" min='0' max='1000000' required className="p-3 border border-grey-300 rounded-lg"onChange={handlechange} value={formdata.discountprice}></input>
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            )}
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
          <button disabled = {loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Updating...' : 'Update Listing'}</button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  )
}