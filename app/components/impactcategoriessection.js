"use client";
import { useEffect, useState } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";

export default function ImpactCategoriesEditor() {
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState({ title: "", subtitle: "" });
  const [categories, setCategories] = useState([]);
  const [edit, setEdit] = useState(false);

  const [newCategory, setNewCategory] = useState({
    key: "",
    color: "",
    title: "",
    subtitle: "",
    description: "",
    link: "",
    stats: [],
  });

  const [editingKey, setEditingKey] = useState(null); // <-- track if editing an existing category
  const [newStat, setNewStat] = useState({ label: "", value: "", progress: 0 });
  const [editingStatIndex, setEditingStatIndex] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/impactcategories");
      const data = await res.json();
      setSection(data.section || { title: "", subtitle: "" });
      setCategories(data.categories || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Save whole doc (section + categories)
  const saveDoc = async (updated) => {
    const res = await fetch("/api/impactcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setSection(data.section || { title: "", subtitle: "" });
    setCategories(data.categories || []);
  };

  // Save section only
  const handleSaveSection = () => {
    saveDoc({ section, categories });
    setEdit(false);
  };

  // Save or update stat
  const handleSaveStat = () => {
    if (!newStat.label || !newStat.value) {
      alert("Stat needs both label and value.");
      return;
    }

    let updatedStats;
    if (editingStatIndex !== null) {
      // Update existing stat
      updatedStats = newCategory.stats.map((s, i) =>
        i === editingStatIndex ? newStat : s
      );
      setEditingStatIndex(null);
    } else {
      // Add new stat
      updatedStats = [...newCategory.stats, newStat];
    }

    setNewCategory({ ...newCategory, stats: updatedStats });
    setNewStat({ label: "", value: "", progress: 0 });
  };

  // Add / Update category
  const handleAddCategory = () => {
    if (!newCategory.key) {
      alert("Each category needs a key (e.g. education, healthcare).");
      return;
    }

    let updated;
    if (editingKey) {
      // Update existing category
      updated = categories.map((c) => (c.key === editingKey ? newCategory : c));
      setEditingKey(null);
    } else {
      // Add new category
      updated = [...categories, newCategory];
    }

    saveDoc({ section, categories: updated });

    setNewCategory({
      key: "",
      color: "",
      title: "",
      subtitle: "",
      description: "",
      link: "",
      stats: [],
    });
  };

  // Remove category
  const handleRemoveCategory = (key) => {
    const updated = categories.filter((c) => c.key !== key);
    saveDoc({ section, categories: updated });
  };

  // Edit category (populate form)
  const handleEditCategory = (cat) => {
    setNewCategory(cat);
    setEditingKey(cat.key);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); // scroll to form
  };

  // Add stat to current newCategory
  const handleAddStat = () => {
    if (!newStat.label || !newStat.value) {
      alert("Stat needs both label and value.");
      return;
    }
    setNewCategory({
      ...newCategory,
      stats: [...newCategory.stats, newStat],
    });
    setNewStat({ label: "", value: "", progress: 0 });
  };

  // Edit stat
  const handleEditStat = (index) => {
    setNewStat(newCategory.stats[index]);
    setEditingStatIndex(index);
  };

  // Remove stat
  const handleRemoveStat = (index) => {
    const updatedStats = newCategory.stats.filter((_, i) => i !== index);
    setNewCategory({ ...newCategory, stats: updatedStats });
  };

  if (loading) return <p>Loading editor...</p>;

  return (
    <div className="space-y-8">
      <div className="px-4">
        {edit ? (
          <div className="pt-4">
            <input
              type="text"
              placeholder="Title"
              value={section.title}
              onChange={(e) =>
                setSection({ ...section, title: e.target.value })
              }
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={section.subtitle}
              onChange={(e) =>
                setSection({ ...section, subtitle: e.target.value })
              }
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
            />
            <button
              onClick={handleSaveSection}
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Save Section
            </button>
          </div>
        ) : (
          <div className="relative">
            <span className="text-sm sm:text-base font-semibold">Title:</span>
            <span className="block mt-2 text-sm sm:text-base">
              {section.title}
            </span>
            <span className="text-sm sm:text-base font-semibold mt-4 block">
              Subtitle:
            </span>
            <span className="block mt-2 text-sm sm:text-base">
              {section.subtitle}
            </span>

            <button
              className="absolute text-xs sm:text-base right-3 sm:right-4 top-3 sm:top-4 flex flex-row gap-2 items-center font-medium border border-violet-600 hover:bg-violet-600 sm:px-6 px-2 py-1 cursor-pointer text-violet-600 hover:text-white transition rounded-md lg:rounded-xl"
              onClick={() => setEdit(true)}
            >
              Edit Title/Subtitle <TbEdit className="text-base lg:text-xl" />
            </button>
          </div>
        )}
      </div>

      <hr className="text-gray-300 mb-4" />

      {/* Categories */}
      <div className="px-4">
        <h2 className="font-semibold mb-2">Categories</h2>
        {categories.length === 0 && (
          <p className="text-gray-500">No categories added yet.</p>
        )}
        {categories.map((cat) => (
          <div
            key={cat.key}
            className={`w-full md:w-1/2 lg:w-1/3 p-3 shadow-lg border border-gray-200 rounded mb-2 bg-gray-50`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-md">{cat.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(cat)}
                  className="text-violet-600 text-sm cursor-pointer"
                >
                  <TbEdit size={18} />
                </button>
                <button
                  onClick={() => handleRemoveCategory(cat.key)}
                  className="text-red-600 text-sm cursor-pointer"
                >
                  <TbTrash size={18} />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{cat.subtitle}</p>

            <div className="flex gap-2 justify-start items-center">
              <p className="text-sm text-gray-600">Card Color: </p>
              <div
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{
                  backgroundColor: cat.color?.startsWith("#")
                    ? cat.color
                    : "#10b981",
                }}
              ></div>
              <div className="text-sm italic text-gray-500">
                [{cat.color || "#10b981"}]
              </div>
            </div>

            {cat.stats && cat.stats.length > 0 && (
              <div className="mt-3 space-y-2">
                {cat.stats.map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm">
                      <span>{s.label}</span>
                      <span>{s.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-violet-600 h-2 rounded-full"
                        style={{ width: `${s.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Category */}
      <div className="p-4 mx-4 border text-sm border-gray-200 rounded-xl bg-white shadow">
        <h2 className="font-semibold text-sm mb-2">
          {editingKey ? "Edit Category" : "Add Category"}
        </h2>
        <input
          type="text"
          placeholder="Key"
          value={newCategory.key}
          disabled={!!editingKey} // cannot change key while editing
          onChange={(e) =>
            setNewCategory({ ...newCategory, key: e.target.value })
          }
          className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={newCategory.title}
          onChange={(e) =>
            setNewCategory({ ...newCategory, title: e.target.value })
          }
          className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={newCategory.subtitle}
          onChange={(e) =>
            setNewCategory({ ...newCategory, subtitle: e.target.value })
          }
          className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
        />
        <div className="flex items-center gap-2">
          <label className="text-xs">Card color: </label>
          <input
            type="color"
            placeholder="Color"
            value={
              newCategory.color?.startsWith("#") ? newCategory.color : "#10b981"
            }
            onChange={(e) =>
              setNewCategory({ ...newCategory, color: e.target.value })
            }
            className="w-10 h-10 text-xs p-2 border border-gray-300 rounded-full mb-2"
          />
        </div>
        <textarea
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Link"
          value={newCategory.link}
          onChange={(e) =>
            setNewCategory({ ...newCategory, link: e.target.value })
          }
          className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
        />

        <h3 className="font-semibold mt-4 mb-2">Add Stat</h3>
        <div className="flex flex-col lg:flex-row justify-evenly gap-2 mb-2">
          <input
            type="text"
            placeholder="Stat Label"
            value={newStat.label}
            onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Stat Value"
            value={newStat.value}
            onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
          />
          <input
            type="number"
            placeholder="Progress %"
            value={newStat.progress}
            onChange={(e) =>
              setNewStat({ ...newStat, progress: Number(e.target.value) })
            }
            className="w-full text-xs px-2 py-1 border border-gray-300 rounded mb-2"
          />
        </div>
        <button
          onClick={handleSaveStat}
          className="p-2 mr-2 bg-blue-600 text-white text-sm rounded mb-4 cursor-pointer"
        >
          {editingStatIndex !== null ? "Update Stat" : "Add Stat"}
        </button>

        {newCategory.stats.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Stats</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {newCategory.stats.map((s, i) => (
                <div
                  key={i}
                  className="p-3 border rounded-md shadow-sm bg-gray-50 flex flex-col justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">{s.label}</p>
                    <p className="text-xs text-gray-600">{s.value}</p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 relative">
                      <div
                        className="bg-violet-600 h-2 rounded-full"
                        style={{ width: `${s.progress}%` }}
                      ></div>
                      <span className="absolute right-1 -top-5 text-xs font-medium text-gray-700">
                        {s.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEditStat(i)}
                      className="text-blue-600 text-xs px-2 py-1 border border-blue-600 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveStat(i)}
                      className="text-red-600 text-xs px-2 py-1 border border-red-600 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleAddCategory}
          className={`p-2 cursor-pointer text-sm ${
            editingKey ? "bg-blue-600" : "bg-violet-600"
          } text-white rounded`}
        >
          {editingKey ? "Update Category" : "Add Category"}
        </button>
      </div>
    </div>
  );
}
