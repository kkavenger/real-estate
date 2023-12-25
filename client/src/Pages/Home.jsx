import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import ListingItems from "../Components/ListingItems";
import 'swiper/css/bundle';
import { Navigation } from 'swiper/modules'
import SwiperCore from 'swiper';

export default function Home() {
  const [offerListing, setofferListing] = useState([]);
  const [saleListing, setsaleListing] = useState([]);
  const [rentListing, setrentListing] = useState([]);
  SwiperCore.use([Navigation])
  console.log(rentListing);
  useEffect(() => {
    const fetchofferListing = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setofferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setrentListing(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListing = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setsaleListing(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchofferListing();
  },[])
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br/>
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          RealEstate is the best place to find your next perfect place to live
          <br/>
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline">
          Let&apos;s get started...
        </Link>
      </div>
      <Swiper navigation>
        {offerListing && offerListing.length > 0 && offerListing.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover"}} className='h-[500px]'></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offer</h2>
              <Link className='text-sm text-blue-600 hover:underline' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id}></ListingItems>
              ))}
            </div>
          </div>
        )}

        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places of Rent</h2>
              <Link className='text-sm text-blue-600 hover:underline' to={'/search?type=rent'}>
                Show more offers for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id}></ListingItems>
              ))}
            </div>
          </div>
        )}

        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent offer for Sale</h2>
              <Link className='text-sm text-blue-600 hover:underline' to={'/search?type=sale'}>
                Show more offers for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListing.map((listing) => (
                <ListingItems listing={listing} key={listing._id}></ListingItems>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
