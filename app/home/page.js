"use client"
import { useState } from "react"
import HomeHeroSectionEditor from "../components/homeherosection"
import HomeImpactSectionEditor from "../components/homeimpactsection"
import HomeQuoteSectionEditor from "../components/homequotesection"

const sections = [
  { name: "Hero", key: "hero" },
  { name: "Impact", key: "impact" },
  { name: "Tag", key: "tag" },
]

export default function HomeCMSPage() {
  const [activeSection, setActiveSection] = useState("hero")

  return (
    <div className="min-h-full bg-white p-6 rounded-2xl relative">
      <nav className="flex flex-row gap-2">
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
