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
    <footer className="bg-navy-950 py-6 border-t border-navy-800">
      <div className="container-wrapper">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {values.map((val, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-center items-center space-y-2"
            >
              <div className="flex-shrink-0">
                {val.icon ? (
                  <Image
                    src={val.icon}
                    alt={`${val.title} icon`}
                    width={48}
                    height={48}
                    className="w-10 h-10 lg:w-12 lg:h-12 object-contain drop-shadow-elegant"
                  />
                ) : (
                  <HeartHandshake className="w-10 h-10 lg:w-12 lg:h-12 text-gold-DEFAULT drop-shadow-elegant" />
                )}
              </div>
              <div className="flex flex-col justify-center text-center">
                <h3 className="text-xs lg:text-[14px] font-serif text-gold-100 tracking-widest mb-1.5">
                  {val.title}
                </h3>
                <p className="text-[11px] lg:text-xs text-gold-200/60 font-sans font-light leading-[1.6] whitespace-pre-line">
                  {val.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-navy-800/50 flex flex-col items-center justify-center gap-3">
          <p className="text-[11px] sm:text-xs text-gold-100/50 font-light tracking-wider">
            &copy; Grace & Goodwill 2026. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(SiteFooter);
