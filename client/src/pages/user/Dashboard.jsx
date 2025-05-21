import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(
          "https://consultancy-yrz7.onrender.com/admin/items"
        );
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: false,
  };

  return (
    <>
      {user && <Navbar />}

      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="relative w-full h-[80vh] overflow-hidden">
          {/* Carousel showing only background images */}
          {!loading && items.length > 0 ? (
            <Slider {...sliderSettings} className="h-full">
              {items.map((item) => (
                <div key={item._id} className="w-full h-[80vh]">
                  <div
                    className="w-full h-[80vh] bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="w-full h-[80vh] bg-black flex items-center justify-center">
              <p className="text-white text-xl">Loading...</p>
            </div>
          )}

          {/* Fixed content overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center px-6 text-center text-white">
            <h1 className="text-5xl font-bold uppercase drop-shadow-lg max-w-3xl">
              SRI RAGHAVENDRA STEELS
            </h1>
            <p className="mt-4 text-lg drop-shadow-md max-w-2xl">
              Top-quality construction materials for your next project.
            </p>
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="mt-6 bg-white text-red-600 hover:bg-gray-200 transition px-8 py-3 text-lg font-semibold rounded-lg shadow-lg"
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* Products grid below header */}
        {!loading && items.length > 0 && (
          <section className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="mt-2 text-red-600 font-bold">
                      ${item.pricePerKg} / Kg
                    </p>
                    <p className="mt-1 text-gray-700 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
