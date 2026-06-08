import React from "react";
import Image from "next/image";
import { HeartHandshake } from "lucide-react";

const values = [
  {
    title: "INTEGRITY",
    text: "Morally and \n ethically guided.",
    icon: "/Integrity.png",
  },
  {
    title: "COMPASSION",
    text: "A duty to care,\na promise to serve.",
    icon: "/Compassion.png",
  },
  {
    title: "TRUST",
    text: "Built on honesty,\nstrengthened by reliability.",
    icon: "/Trust.png",
  },
  {
    title: "PURPOSE",
    text: "Care with meaning,\nimpact that lasts.",
    icon: "/Purpose.png",
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
              className={`flex flex-col justify-center items-center space-y-4 sm:space-y-5 flex-1 ${
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
                  <HeartHandshake className="w-12 h-12 lg:w-16 lg:h-16 text-gold-DEFAULT drop-shadow-elegant" />
                )}
              </div>
              <div className="flex flex-col justify-center text-center">
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
