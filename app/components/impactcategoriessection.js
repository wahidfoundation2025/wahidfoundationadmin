"use client";
import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";

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

  if (loading) return <p>Loading editor...</p>;

  return (
    <div className="space-y-8">
      {/* Section Fields */}
      <h2 className="font-semibold mb-2">Section Settings</h2>
      <div>
        {edit ? (
          <>
            <input
              type="text"
              placeholder="Title"
              value={section.title}
              onChange={(e) =>
                setSection({ ...section, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={section.subtitle}
              onChange={(e) =>
                setSection({ ...section, subtitle: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={handleSaveSection}
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Save Section
            </button>
          </>
        ) : (
          <div className="relative">
            <span className="text-base sm:text-xl font-semibold">Title:</span>
            <span className="block mt-2 text-base sm:text-lg">
              {section.title}
            </span>
            <span className="text-base sm:text-xl font-semibold mt-4 block">
              Subtitle:
            </span>
            <span className="block mt-2">{section.subtitle}</span>

            <button
              className="absolute text-sm sm:text-base right-3 sm:right-4 top-3 sm:top-4 flex flex-row gap-2 items-center font-medium border border-violet-600 hover:bg-violet-600 sm:px-6 px-4 py-2 cursor-pointer text-violet-600 hover:text-white transition rounded-xl"
              onClick={() => setEdit(true)}
            >
              Edit Title/Subtitle <TbEdit className="text-xl" />
            </button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="p-4 border rounded-xl bg-white shadow">
        <h2 className="font-semibold mb-2">Categories</h2>
        {categories.length === 0 && (
          <p className="text-gray-500">No categories added yet.</p>
        )}
        {categories.map((cat) => (
          <div key={cat.key} className="p-3 border rounded mb-2 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{cat.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(cat)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveCategory(cat.key)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{cat.subtitle}</p>

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
      <div className="p-4 border rounded-xl bg-white shadow">
        <h2 className="font-semibold mb-2">
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
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Title"
          value={newCategory.title}
          onChange={(e) =>
            setNewCategory({ ...newCategory, title: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={newCategory.subtitle}
          onChange={(e) =>
            setNewCategory({ ...newCategory, subtitle: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Color"
          value={newCategory.color}
          onChange={(e) =>
            setNewCategory({ ...newCategory, color: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          placeholder="Description"
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Link"
          value={newCategory.link}
          onChange={(e) =>
            setNewCategory({ ...newCategory, link: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <h3 className="font-semibold mt-4">Add Stat</h3>
        <input
          type="text"
          placeholder="Stat Label"
          value={newStat.label}
          onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Stat Value"
          value={newStat.value}
          onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="number"
          placeholder="Progress %"
          value={newStat.progress}
          onChange={(e) =>
            setNewStat({ ...newStat, progress: Number(e.target.value) })
          }
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleAddStat}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        >
          Add Stat
        </button>

        {newCategory.stats.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold">Preview Stats</h4>
            {newCategory.stats.map((s, i) => (
              <p key={i} className="text-sm">
                {s.label}: {s.value} ({s.progress}%)
              </p>
            ))}
          </div>
        )}

        <button
          onClick={handleAddCategory}
          className={`px-4 py-2 ${
            editingKey ? "bg-blue-600" : "bg-violet-600"
          } text-white rounded`}
        >
          {editingKey ? "Update Category" : "Add Category"}
        </button>
      </div>
    </div>
  );
}
