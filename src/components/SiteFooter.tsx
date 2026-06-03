import React from "react";
import Image from "next/image";

const values = [
  {
    title: "INTEGRITY",
    text: "Rooted in law,\nguided by ethics.",
    icon: "/Integrity.png",
  },
  {
    title: "COMPASSION",
    text: "A duty to care,\na promise to serve.",
    icon: "/Compassion.png",
  },
  {
    title: "TRUST",
    text: "Built on honesty,\nstrengthened by\nreliability.",
    icon: "/Trust.png",
  },
  {
    title: "PURPOSE",
    text: "Care with meaning,\nimpact that lasts.",
    icon: null, // Custom SVG for Wreath
  },
];

function SiteFooter() {
  return (
    <footer className="bg-navy-950 py-6 sm:py-8 border-t border-navy-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch divide-y md:divide-y-0 md:divide-x divide-navy-800">
          {values.map((val, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-4 sm:space-x-5 flex-1 ${
                idx === 0
                  ? "md:pr-6 lg:pr-8 pb-6 md:pb-0"
                  : idx === values.length - 1
                    ? "md:pl-6 lg:pl-8 pt-6 md:pt-0"
                    : "md:px-6 lg:px-8 py-6 md:py-0"
              }`}
            >
              <div className="flex-shrink-0">
                {val.icon ? (
                  <Image
                    src={val.icon}
                    alt={`${val.title} icon`}
                    width={64}
                    height={64}
                    className="w-12 h-12 lg:w-16 lg:h-16 object-contain drop-shadow-elegant"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 lg:w-16 lg:h-16 text-gold-DEFAULT drop-shadow-elegant"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M495.9,228.6c-13.6-43.1-39.7-78.5-74.8-101.4c-6.8-4.4-15.8-2.5-20.2,4.3c-4.4,6.8-2.5,15.8,4.3,20.2 c29.1,19,50.7,48.4,62.2,84.4c5.3,16.7,8,34.4,8,52.4c0,34.7-10.4,67.8-29.9,96c-15.5,22.3-36.2,40.4-60.6,52.7 C355,452.4,321.2,459,286,459c-10.6,0-19.3,8.6-19.3,19.3c0,10.6,8.6,19.3,19.3,19.3c40.9,0,79.9-7.7,114.7-22.3 c28.3-11.9,52.5-29,71.2-50.5l19.5,18.8c5.4,5.2,14.1,5,19.3-0.4c5.2-5.4,5-14.1-0.4-19.3l-18.7-18.1 c17.9-25.7,27.3-56.1,27.3-88C519,283.4,511.2,254.4,495.9,228.6z" />
                    <path d="M226,459c-35.2,0-69-6.6-98.8-19.3c-24.5-10.4-45.2-25.1-60.6-43.2c-19.6-22.9-30-51-30-80c0-18,2.7-35.7,8-52.4 c11.5-36,33.1-65.5,62.2-84.4c6.8-4.4,8.8-13.4,4.3-20.2c-4.4-6.8-13.4-8.8-20.2-4.3C55.8,178.1,29.7,213.5,16.1,256.6 c-6.4,20-9.6,41.2-9.6,63c0,33.5,12.1,65.8,35.1,92.8c18.5,21.7,42.4,39,70.5,50.9c34.8,14.6,73.8,22.3,114.7,22.3 c10.6,0,19.3-8.6,19.3-19.3C245.3,467.6,236.6,459,226,459z" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-[13px] lg:text-[15px] font-serif text-gold-100 tracking-widest mb-1.5">
                  {val.title}
                </h3>
                <p className="text-[11px] lg:text-[13px] text-gold-200/70 font-sans font-light leading-[1.6] whitespace-pre-line">
                  {val.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default React.memo(SiteFooter);
