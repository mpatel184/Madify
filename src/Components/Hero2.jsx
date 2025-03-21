import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Scrollbar } from 'swiper/modules';
import d1 from "../assets/d1.png";

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const MedicalSpecialists = () => {
  const doctors = [
    { id: 1, name: 'Dr. Ahmad Khan', specialty: 'Neurologist', image: d1 },
    { id: 2, name: 'Dr. Heena Sachdeva', specialty: 'Orthopedics', image: d1 },
    { id: 3, name: 'Dr. Ankur Sharma', specialty: 'Medicine', image: d1 },
    { id: 4, name: 'Dr. Emily Hull', specialty: 'Medicine', image: d1 },
    { id: 5, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', image: d1 }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
          Our Medical Specialist
        </h2>
        
        <Swiper
          modules={[Pagination, Autoplay, Scrollbar]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 }
          }}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="mySwiper"
        >
          {doctors.map((doctor) => (
            <SwiperSlide key={doctor.id}>
              <div className="flex flex-col items-center">
                <div className="bg-blue-200 rounded-t-full w-full aspect-square overflow-hidden relative mb-3 border-2 border-white">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <h3 className="font-semibold text-blue-900 text-lg">{doctor.name}</h3>
                <p className="text-blue-400">{doctor.specialty}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="swiper-pagination flex justify-center top-2 space-x-2 "></div>
      </div>
    </div>
  );
};

export default MedicalSpecialists;
