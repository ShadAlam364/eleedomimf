import { Facebook, Instagram, X, Linkedin } from "lucide-react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <div className="bg-black text-white relative z-10 tracking-wider">
      <div className="container mx-auto w-[80%] py-12">
        {/* Grid Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Insurance */}
          <div>
            <h2 className="text-lg font-semibold text-white uppercase ">
              Insurance
            </h2>
            <p className="border-b-4 border-blue-700 w-3 mb-6 rounded-md"></p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500">
                  General Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Life Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Term Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Investment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Health Insurance
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Other Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Help Center */}
          <div>
            <h2 className=" text-lg font-semibold text-white uppercase ">
              Help Center
            </h2>
            <p className="border-b-4 border-blue-700 w-3 mb-6 rounded-md"></p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h2 className=" text-lg font-semibold text-white uppercase ">
              Legal
            </h2>

            <p className="border-b-4 border-blue-700 w-3 mb-6 rounded-md"></p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Download */}

          <div>
            <h2 className=" text-lg font-semibold text-white uppercase ">
              Contact US
            </h2>
            <p className="border-b-4 border-blue-700 w-3 mb-6 rounded-md"></p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  +91 9430608622;
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  +91 8253060046;
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  +91 9905886633.
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  support@eleedomimf.com
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500">
                  607, 6th Floor, B-block Gagan Apartment, Exhibition Road
                  Chauraha Patna, Bihar - 800001, India
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-700 pt-6 md:flex md:items-center md:justify-between">
          <span className="text-sm text-white sm:text-center tracking-wider">
            ©{new Date().getFullYear()}{" "}
            <NavLink to="/">Eleedomimf Insurance Broking Pvt. Ltd.</NavLink> |
            All Rights Reserved.
          </span>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <a href="#" aria-label="Facebook">
              <Facebook
                size={30}
                className="text-[#1877F2] transition-all duration-300 hover:scale-110 p-1.5 bg-white rounded-2xl"
              />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram
                size={30}
                className="text-[#E4405F] transition-all duration-300 hover:scale-110 p-1.5 bg-white rounded-2xl"
              />
            </a>
            <a href="#" aria-label="Twitter">
              <X
                size={30}
                className="text-[#1DA1F2] transition-all duration-300 hover:scale-110 p-1.5 bg-white rounded-2xl"
              />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin
                size={30}
                className="text-[#0A66C2] transition-all duration-300 hover:scale-110 p-1.5 bg-white rounded-2xl"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
