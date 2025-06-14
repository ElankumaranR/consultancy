import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrows with transparent black background
const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="slick-arrow slick-prev z-10 left-0 absolute top-1/2 -translate-y-1/2 p-3 rounded-full cursor-pointer"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
  >
    <span className="text-white text-xl">‹</span>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="slick-arrow slick-next z-10 right-0 absolute top-1/2 -translate-y-1/2 p-3 rounded-full cursor-pointer"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
  >
    <span className="text-white text-xl">›</span>
  </div>
);


const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("https://consultancy-yrz7.onrender.com/admin/items");
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

  return (
    <>
      {user && <Navbar />}

      <div className="min-h-screen bg-gray-100 text-gray-900">
        {/* Hero Section */}
        <header className="relative w-full h-[80vh] overflow-hidden">
          {!loading && items.length > 0 ? (
            <Slider
              dots={true}
              infinite={true}
              speed={600}
              slidesToShow={1}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={10000}
              arrows={true}
              prevArrow={<CustomPrevArrow />}
              nextArrow={<CustomNextArrow />}
              fade={true}
            >
              {items.map((item) => (
                <div key={item._id} className="h-[80vh] w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="w-full h-[80vh] bg-black flex items-center justify-center">
              <p className="text-white text-xl">Loading...</p>
            </div>
          )}

<div
  className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white bg-cover bg-center"
  style={{
    backgroundImage: `url('/Bg.png')`,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'overlay',
  }}
>            <h1 className="text-5xl font-bold uppercase drop-shadow-lg max-w-3xl">
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

        {/* Product Carousel Section */}
        {!loading && items.length > 0 && (
          <section className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
            <Slider
              dots={true}
              infinite={true}
              speed={600}
              slidesToShow={3}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={10000}
              arrows={true}
              prevArrow={<CustomPrevArrow />}
              nextArrow={<CustomNextArrow />}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: { slidesToShow: 2, slidesToScroll: 1 },
                },
                {
                  breakpoint: 640,
                  settings: { slidesToShow: 1, slidesToScroll: 1 },
                },
              ]}
            >
              {items.map((item) => (
                <div key={item._id} className="px-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item._id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden h-full"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="mt-2 text-red-600 font-bold">
                          ${item.pricePerKg} / Kg
                        </p>
                        <p className="mt-1 text-gray-700 text-sm">{item.description}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </Slider>
          </section>
        )}
      </div>
    </>
  );
};

export default Home;
