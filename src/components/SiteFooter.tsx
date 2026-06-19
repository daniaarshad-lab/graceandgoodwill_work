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
      <div className="container-wrapper">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 lg:gap-8">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center items-center space-y-4 sm:space-y-5"
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
