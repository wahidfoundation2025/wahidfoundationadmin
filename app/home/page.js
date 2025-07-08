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
    <div className="flex min-h-screen">
      <nav className="w-48  p-2 flex flex-col gap-2">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setActiveSection(section.key)}
            className={`text-left px-4 py-2 rounded font-semibold transition-all ${activeSection === section.key ? "bg-blue-600 text-white" : "hover:bg-blue-100 text-gray-800"}`}
          >
            {section.name}
          </button>
        ))}
      </nav>
      <div className="flex-1 p-8">
        {activeSection === "hero" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Hero Section</h2>
            <HomeHeroSectionEditor />
          </div>
        )}
        {activeSection === "impact" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Impact Section</h2>
            <HomeImpactSectionEditor />
          </div>
        )}
        {activeSection === "tag" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tag Section</h2>
            <HomeQuoteSectionEditor />
          </div>
        )}
      </div>
    </div>
  )
}
