import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaCopyright } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
const Footer = () => {
  return (
    <footer className="relative bg-white text-[#16213E] py-12 ">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path
            d="M0 60L50 58.3C100 56.7 200 53.3 300 50C400 46.7 500 43.3 600 50C700 56.7 800 73.3 900 80C1000 86.7 1100 83.3 1150 81.7L1200 80V0H1150C1100 0 1000 0 900 0C800 0 700 0 600 0C500 0 400 0 300 0C200 0 100 0 50 0H0Z"
            fill="#F9F9F9"
          ></path>
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center sm:text-left relative">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-[#6C4DE6]">MediQueue</h2>
          <p className="text-sm leading-relaxed">
            Empowering healthcare through an intelligent and seamless medical system.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-[#6C4DE6]">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li className="">
              <a href="#" className="hover:text-[#6C4DE6] flex items-center gap-1 transition">
                <MdKeyboardArrowRight/>  Find a Doctor
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#6C4DE6] flex items-center gap-1 transition">
                <MdKeyboardArrowRight /> Book an Appointment
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#6C4DE6] flex items-center gap-1 transition">
                <MdKeyboardArrowRight /> FAQs
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-[#6C4DE6]">Contact Us</h2>
          <p className="text-sm flex items-center gap-2 text-gray-700">
            <FaMapMarkerAlt className="text-[#6C4DE6]" /> Nairobi, Kenya
          </p>
          <p className="text-sm flex items-center gap-2 text-gray-700">
            <FaEnvelope className="text-[#6C4DE6]" /> support@medsystem.com
          </p>
          <p className="text-sm flex items-center gap-2 text-gray-700">
            <FaPhone className="text-[#6C4DE6]" /> +254 792 032 890
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-20 mx-auto max-w-[1280px]"></div>

      <div className=" text-center text-xs text-gray-700">
        <FaCopyright className="text-[#6C4DE6]" /> {new Date().getFullYear()} Intelligent Medical System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
