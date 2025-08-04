"use client"
import { useEffect, useRef, useState } from "react"
import HomeHeroSectionEditor from "../components/homeherosection"
import HomeImpactSectionEditor from "../components/homeimpactsection"
import HomeQuoteSectionEditor from "../components/homequotesection"
import { BsThreeDotsVertical } from "react-icons/bs";

const sections = [
  { name: "Hero", key: "hero" },
  { name: "Impact", key: "impact" },
  { name: "Tag", key: "tag" },
]

export default function HomeCMSPage() {
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
    <div className="min-h-full bg-white p-6 rounded-2xl relative">
      <div className="sm:hidden flex">
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown((prev) => !prev)}
          className="text-xl cursor-pointer hover:bg-black hover:text-white p-2 transition-colors rounded-full"
        >
          <BsThreeDotsVertical />
        </button>

        {showDropdown &&
          <div
            ref={dropdownRef}
            className="flex flex-col absolute top-14 left-12 gap-1 bg-white border border-gray-300 p-2 rounded-2xl rounded-tl-none shadow-2xs"
          >
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => {
                  setActiveSection(section.key)
                  setShowDropdown(false)
                }}
                className={`text-left px-8 py-2 rounded-lg cursor-pointer font-semibold transition-all ${activeSection === section.key ? "bg-violet-600 text-white" : "hover:bg-violet-200 hover:text-violet-600"}`}
              >
                {section.name}
              </button>
            ))}
          </div>
        }
      </div>

      <nav className="flex-row gap-2 sm:flex hidden">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`text-left px-8 py-2 rounded-lg cursor-pointer font-semibold transition-all ${activeSection === section.key ? "bg-violet-600 text-white" : "hover:bg-violet-200 hover:text-violet-600"}`}
          >
            {section.name}
          </button>
        ))}
      </nav>

      {activeSection === "hero" ? (
        <>
          <HomeHeroSectionEditor />
        </>
      ) : activeSection === "impact" ? (
        <>
          <HomeImpactSectionEditor />
        </>
      ) : (
        <>
          <HomeQuoteSectionEditor />
        </>
      )}
    </div>
  )
}
