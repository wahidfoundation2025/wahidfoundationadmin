"use client";

import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import ImpactSectionEditor from "../components/impactstorieseditor";
import ImpactHeroSectionEditor from "../components/impactherosection";
import ImpactCategoriesEditor from "../components/impactcategoriessection";

const sections = [
  { name: "Hero", key: "hero" },
  { name: "Categories", key: "categories" },
  { name: "Impact Stories", key: "impact" },
];

export default function ImpactCMSPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-full bg-white ms:p-6 p-4 sm:rounded-2xl relative">
      <div className="sm:hidden flex">
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown((prev) => !prev)}
          className="text-xl cursor-pointer hover:bg-black hover:text-white p-1 transition-colors rounded-full"
        >
          <BsThreeDotsVertical />
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className="flex flex-col absolute top-12 left-10 gap-1 bg-white border border-gray-300 p-2 rounded-2xl rounded-tl-none shadow-2xs"
          >
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => {
                  setActiveSection(section.key);
                  setShowDropdown(false);
                }}
                className={`text-left text-sm px-6 py-1.5 rounded-lg cursor-pointer font-semibold transition-all ${
                  activeSection === section.key
                    ? "bg-violet-600 text-white"
                    : "hover:bg-violet-200 hover:text-violet-600"
                }`}
              >
                {section.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="flex-row gap-1 sm:flex hidden">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`text-left px-6 py-2 rounded-lg cursor-pointer font-semibold transition-all ${
              activeSection === section.key
                ? "bg-violet-600 text-white"
                : "hover:bg-violet-200 hover:text-violet-600"
            }`}
          >
            {section.name}
          </button>
        ))}
      </nav>

      {activeSection === "hero" ? (
        <>
          <ImpactHeroSectionEditor />
        </>
      ) : activeSection === "impact" ? (
        <>
          <ImpactSectionEditor />
        </>
      ) : (
        <>
          <ImpactCategoriesEditor />
        </>
      )}
    </div>
  );
}
