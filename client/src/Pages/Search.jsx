import { useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import ListingItems from "../Components/ListingItems";

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    })
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    console.log(listings);
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typefromUrl = urlParams.get('type');
        const parkingfromUrl = urlParams.get('parking');
        const furnishedfromUrl = urlParams.get('furnished');
        const offerfromUrl = urlParams.get('offer');
        const sortfromUrl = urlParams.get('sort');
        const orderfromUrl = urlParams.get('order');

        if(searchTermFromUrl || typefromUrl || parkingfromUrl || furnishedfromUrl || sortfromUrl || orderfromUrl || offerfromUrl){
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typefromUrl || 'all',
                parking: parkingfromUrl === 'true' ? true : false,
                furnished: furnishedfromUrl === 'true' ? true : false,
                offer: offerfromUrl === 'true' ? true : false,
                sort: sortfromUrl || 'created_at',
                order: orderfromUrl || 'desc',
            })
        }
        const fetchListings = async () => {
            setLoading(true)
            setShowMore(false)
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        }
        fetchListings();
    },[location.search]);

    const handleChange = (e) => {

        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSidebardata({...sidebardata, type: e.target.id })
        }
        if(e.target.id === 'searchTerm'){
            setSidebardata({...sidebardata, searchTerm: e.target.value })
        }
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebardata({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({ ...sidebardata, sort, order });
        }
    }
    const onShowMoreClick = async () => {
        const numberoflistings = listings.length;
        const startIndex = numberoflistings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json();
        if(data.length < 9){
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlparams = new URLSearchParams();
        urlparams.set('searchTerm', sidebardata.searchTerm);
        urlparams.set('type', sidebardata.type);
        urlparams.set('parking', sidebardata.parking);
        urlparams.set('furnished', sidebardata.furnished);
        urlparams.set('offer', sidebardata.offer);
        urlparams.set('sort', sidebardata.sort);
        urlparams.set('order', sidebardata.order);
        const searchQuery = urlparams.toString();
        navigate(`/search?${searchQuery}`);
    }
  return (
<div>
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex item-center gap-2">
                    <label className="font-semibold">Search Term:</label>
                    <input type="text" id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full" value={sidebardata.searchTerm} onChange={handleChange}></input>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="font-semibold">Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="all" className="w-5" onChange={handleChange} checked={sidebardata.type === 'all'}></input>
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={sidebardata.type === 'sale'}></input>
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={sidebardata.type === 'rent'}></input>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={sidebardata.offer === 'offer'}></input>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="font-semibold">Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={sidebardata.parking}></input>
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={sidebardata.furnished}></input>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <label className="font-semibold">Sort:</label>
                    <select id="sort_order" className="border rounded-lg p-3" onChange={handleChange} defaultValue={'created_at_desc'}>
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">search</button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">Listing results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && listings.length === 0 && (
                    <p className="text-xl text-slate-700">No Listing Found!</p>
                )}
                {loading && (
                    <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
                )}
                {!loading && listings && listings.map((listing) => (
                    <ListingItems key={listing._id} listing={listing}/>
                ))}
                {showMore && (
                    <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>Show More...</button>
                )}
            </div>
        </div>
    </div>
</div>
  )
}
