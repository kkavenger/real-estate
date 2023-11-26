import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore from "swiper"
import { Navigation } from "swiper/modules"
import "swiper/css/bundle"

export default function Listing() {
  SwiperCore.use([Navigation])
  const params = useParams()
  const [listing, setlisting] = useState(null)
  const [error, seterror] = useState(false)
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const fetchlist = async() => {
      try {
        setloading(true);
        const res = await fetch(`/api/listing/get/${params.id}`)
        const data = await res.json()
        if(data.success === false){
          seterror(true)
          setloading(false)
          return;
        }
        setlisting(data)
        setloading(false)
        seterror(false)
      } catch (error) {
        seterror(true)
        setloading(false)
      }
    }
    fetchlist();
  },[params.id])

  return (
    <main>
     {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
     {error && <p className="text-center my-7 text-2xl">Something went wrong...</p>}
     {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[550px]'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                </SwiperSlide>
            ))}
          </Swiper>
        </div>
     )}
    </main>
  )
}
