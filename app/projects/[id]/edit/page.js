"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import isEqual from "lodash.isequal";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function EditProjectPage({ params }) {
  const { id } = use(params) || {};
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [cardPreview, setCardPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [ogImagePreview, setOgImagePreview] = useState("");
  const [newImpact, setNewImpact] = useState({
    type: "Direct",
    title: "",
    description: "",
  });
  const [newTimelineEvent, setNewTimelineEvent] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
  });
  const [newScheme, setNewScheme] = useState("");
  const [newUpdate, setNewUpdate] = useState({
    version: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [newKeyword, setNewKeyword] = useState("");

  const [editingImpactIndex, setEditingImpactIndex] = useState(null);
  const [editingTimelineEventIndex, setEditingTimelineEventIndex] =
    useState(null);
  const [editingUpdateIndex, setEditingUpdateIndex] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: [],
    location: "",
    totalRequired: "",
    collected: 0,
    beneficiaries: "",
    completion: "",
    daysLeft: "",
    status: "Active",
    mainImage: "",
    cardImage: "",
    photoGallery: [],
    youtubeIframe: "",
    overview: "",
    zakat_eligible: false,
    interest_earnings_eligible: false,
    projectManager: {
      name: "",
      email: "",
      phone: "",
    },
    donationOptions: [
      { type: "General Donation", isEnabled: false },
      { type: "Zakat", isEnabled: false },
      { type: "Sadqa", isEnabled: false },
      { type: "Interest Earnings", isEnabled: false },
    ],
    minDonationAmount: 365,
    donationFrequency: "One Time",
    og: {
      title: "",
      description: "",
      image: "",
      url: "",
    },
    impact: [],
    timeline: [],
    scheme: [],
    updates: [],
    slug: "",
    target_keywords: [],
    metatitle: "",
    metadescription: "",
  });

  const [initialForm, setInitialForm] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        if (!id) throw new Error("Project ID is missing");
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to load project");
        const data = await res.json();

        const normalized = {
          ...form,
          ...data,
          category: Array.isArray(data.category) ? data.category : [],
          mainImage: data.mainImage || "",
          cardImage: data.cardImage || "",
          photoGallery: Array.isArray(data.photoGallery)
            ? data.photoGallery
            : [],
          og: {
            title: data.og?.title || "",
            description: data.og?.description || "",
            image: data.og?.image || "",
            url: data.og?.url || "",
          },
          projectManager: {
            name: data.projectManager?.name || "",
            email: data.projectManager?.email || "",
            phone: data.projectManager?.phone || "",
          },
          donationOptions: Array.isArray(data.donationOptions)
            ? data.donationOptions.map((opt) => ({
                type: opt.type || "Unknown",
                isEnabled: opt.isEnabled || false,
              }))
            : form.donationOptions,
          impact: Array.isArray(data.impact) ? data.impact : [],
          scheme: Array.isArray(data.scheme) ? data.scheme : [],
          timeline: Array.isArray(data.timeline) ? data.timeline : [],
          updates: Array.isArray(data.updates) ? data.updates : [],
          target_keywords: Array.isArray(data.target_keywords)
            ? data.target_keywords
            : [],
        };

        setForm(normalized);
        setInitialForm(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  // track dirty state
  useEffect(() => {
    if (initialForm) {
      setIsDirty(!isEqual(form, initialForm));
    }
  }, [form, initialForm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target || {};
    if (!name) return;

    if (name.startsWith("projectManager.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        projectManager: { ...prev.projectManager, [field]: value || "" },
      }));
    } else if (name.startsWith("og.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        og: { ...prev.og, [field]: value || "" },
      }));
    } else if (name.startsWith("donationOptions.")) {
      const index = parseInt(name.split(".")[1]);
      if (index >= 0 && index < form.donationOptions.length) {
        const updated = [...form.donationOptions];
        updated[index] = { ...updated[index], isEnabled: checked || false };
        setForm((prev) => ({ ...prev, donationOptions: updated }));
      }
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked || false }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value || "" }));
    }
  };

  const handleImageUpload = async (e, type) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      if (type === "main") setUploadingMain(true);
      if (type === "gallery") setUploadingGallery(true);
      if (type === "ogImage") setUploadingOgImage(true);
      if (type === "card") setUploadingCard(true);

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        if (!data.url) throw new Error("No URL returned from upload");
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);

      if (type === "gallery") {
        setForm((prev) => ({
          ...prev,
          photoGallery: [...(prev.photoGallery || []), ...urls],
        }));
        setGalleryPreviews((prev) => [...(prev || []), ...urls]);
      } else if (type === "main") {
        setForm((prev) => ({ ...prev, mainImage: urls[0] || "" }));
        setImagePreview(urls[0] || "");
      } else if (type === "ogImage") {
        setForm((prev) => ({
          ...prev,
          og: { ...prev.og, image: urls[0] || "" },
        }));
        setOgImagePreview(urls[0] || "");
      } else if (type === "card") {
        setForm((prev) => ({ ...prev, cardImage: urls[0] || "" }));
        setCardPreview(urls[0] || "");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image(s). Please try again.");
    } finally {
      if (type === "main") setUploadingMain(false);
      if (type === "gallery") setUploadingGallery(false);
      if (type === "ogImage") setUploadingOgImage(false);
      if (type === "card") setUploadingCard(false);
    }
  };

  const handleGalleryRemove = (index) => {
    setForm((prev) => ({
      ...prev,
      photoGallery: (prev.photoGallery || []).filter((_, i) => i !== index),
    }));
    setGalleryPreviews((prev) => (prev || []).filter((_, i) => i !== index));
  };

  const handleAddImpact = () => {
    if (newImpact.title && newImpact.description) {
      setForm((prev) => ({
        ...prev,
        impact: [...(prev.impact || []), newImpact],
      }));
      setNewImpact({ type: "Direct", title: "", description: "", icon: "" });
      setImpactIconPreview("");
    }
  };

  const handleEditImpact = (idx) => {
    setEditingImpactIndex(idx);
    setNewImpact(form.impact[idx]);
  };

  const handleSaveImpact = () => {
    if (editingImpactIndex !== null) {
      const updated = [...form.impact];
      updated[editingImpactIndex] = newImpact;
      setForm((prev) => ({ ...prev, impact: updated }));
      setEditingImpactIndex(null);
      setNewImpact({ type: "Direct", title: "", description: "" });
    }
  };

  const handleCancelImpactEdit = () => {
    setEditingImpactIndex(null);
    setNewImpact({ type: "Direct", title: "", description: "" });
  };

  const handleRemoveImpact = (index) => {
    setForm((prev) => ({
      ...prev,
      impact: (prev.impact || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddTimelineEvent = () => {
    if (
      newTimelineEvent.title &&
      newTimelineEvent.date &&
      newTimelineEvent.status
    ) {
      setForm((prev) => ({
        ...prev,
        timeline: [...(prev.timeline || []), newTimelineEvent],
      }));
      setNewImpact({
        title: "",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      });
    }
  };

  const handleEditTimelineEvent = (idx) => {
    setEditingTimelineEventIndex(idx);
    setNewTimelineEvent(form.timeline[idx]);
  };

  const handleSaveTimelineEvent = () => {
    if (editingTimelineEventIndex !== null) {
      const updated = [...form.timeline];
      updated[editingTimelineEventIndex] = newTimelineEvent;
      setForm((prev) => ({ ...prev, timeline: updated }));
      setEditingTimelineEventIndex(null);
      setNewTimelineEvent({
        title: "",
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      });
    }
  };

  const handleCancelTimelineEventEdit = () => {
    setEditingTimelineEventIndex(null);
    setNewTimelineEvent({
      title: "",
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    });
  };

  const handleRemoveTimelineEvent = (index) => {
    setForm((prev) => ({
      ...prev,
      timeline: (prev.timeline || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddScheme = () => {
    if (!newScheme) return form;

    try {
      const parsed = JSON.parse(newScheme); // if using free JSON input
      const updatedForm = {
        ...form,
        scheme: [...(form.scheme || []), parsed],
      };
      setForm(updatedForm);
      setNewScheme("");
      return updatedForm;
    } catch (err) {
      alert("Invalid JSON in schema");
      return form;
    }
  };

  const handleRemoveScheme = (index) => {
    setForm((prev) => ({
      ...prev,
      scheme: (prev.scheme || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddUpdate = () => {
    if (newUpdate.version && newUpdate.content) {
      setForm((prev) => ({
        ...prev,
        updates: [...(prev.updates || []), newUpdate],
      }));
      setNewUpdate({
        version: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleEditUpdate = (idx) => {
    setEditingUpdateIndex(idx);
    setNewUpdate(form.updates[idx]);
  };

  const handleSaveUpdate = () => {
    if (editingUpdateIndex !== null) {
      const updated = [...form.updates];
      updated[editingUpdateIndex] = newUpdate;
      setForm((prev) => ({ ...prev, updates: updated }));
      setEditingUpdateIndex(null);
      setNewUpdate({
        version: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleCancelUpdateEdit = () => {
    setEditingUpdateIndex(null);
    setNewUpdate({
      version: "",
      content: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleRemoveUpdate = (index) => {
    setForm((prev) => ({
      ...prev,
      updates: (prev.updates || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddKeyword = () => {
    if (newKeyword) {
      setForm((prev) => ({
        ...prev,
        target_keywords: [...(prev.target_keywords || []), newKeyword],
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setForm((prev) => ({
      ...prev,
      target_keywords: (prev.target_keywords || []).filter(
        (k) => k !== keyword
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      alert("Title and description are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update project");

      setInitialForm(form);
      setIsDirty(false);

      router.push(`/projects/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-full w-full bg-white p-4 sm:p-6 sm:rounded-2xl">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            setCategories([]);
            fetchProject();
            fetchCategories();
          }}
          className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-full w-full bg-white p-4 sm:p-6 sm:rounded-2xl">
        <p className="p-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-white p-4 sm:p-6 sm:rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Edit Project</h1>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded-lg flex items-center ${
            isDirty
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          disabled={!isDirty || submitting}
          type="submit"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />} 
          <p className="mx-2">Save Changes</p>
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                name="title"
                value={form.title || ""}
                onChange={handleChange}
                placeholder="Enter project title"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <ReactQuill
                value={form.description || ""}
                onChange={(val) =>
                  handleChange({ target: { name: "description", value: val } })
                }
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions || []
                  ).map((opt) => opt.value);
                  setForm((prev) => ({
                    ...prev,
                    category: Array.from(
                      new Set([...(prev.category || []), ...selected])
                    ),
                  }));
                }}
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Choose category
                </option>
                {(categories || []).map((cat, idx) => (
                  <option value={cat.name || ""} key={idx}>
                    {cat.name || "Unknown"}
                  </option>
                ))}
              </select>
              {(form.category || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.category || []).map((cat) => (
                    <span
                      key={cat}
                      className="bg-violet-100 border border-violet-300 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
                    >
                      {cat}
                      <button
                        type="button"
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            category: (prev.category || []).filter(
                              (c) => c !== cat
                            ),
                          }))
                        }
                      >
                        <IoIosCloseCircle size={18} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={form.location || ""}
                onChange={handleChange}
                placeholder="Enter location"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Required
              </label>
              <input
                name="totalRequired"
                type="number"
                min="0"
                value={form.totalRequired || ""}
                onChange={handleChange}
                placeholder="Enter required amount"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Collected
              </label>
              <input
                name="collected"
                type="number"
                min="0"
                value={form.collected || 0}
                onChange={handleChange}
                placeholder="Amount collected so far"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Beneficiaries
              </label>
              <input
                name="beneficiaries"
                type="number"
                min="0"
                value={form.beneficiaries || ""}
                onChange={handleChange}
                placeholder="No. of beneficiaries"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Completion %
              </label>
              <input
                name="completion"
                type="number"
                min="0"
                value={form.completion || ""}
                onChange={handleChange}
                placeholder="Completion percentage"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Days Left
              </label>
              <input
                name="daysLeft"
                type="number"
                min="0"
                value={form.daysLeft || ""}
                onChange={handleChange}
                placeholder="Days left to complete"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={form.status || "Active"}
                onChange={handleChange}
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                name="slug"
                value={form.slug || ""}
                onChange={handleChange}
                placeholder="Enter project slug"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Title
              </label>
              <input
                name="metatitle"
                value={form.metatitle || ""}
                onChange={handleChange}
                placeholder="Enter meta title"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Meta Description
              </label>
              <textarea
                name="metadescription"
                value={form.metadescription || ""}
                onChange={handleChange}
                placeholder="Enter meta description"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Keywords
              </label>
              <div className="flex gap-2">
                <input
                  value={newKeyword || ""}
                  onChange={(e) => setNewKeyword(e.target.value || "")}
                  placeholder="Enter keyword"
                  className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="px-4 py-2 bg-violet-600 text-white rounded-xl"
                >
                  Add
                </button>
              </div>
              {(form.target_keywords || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.target_keywords || []).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-violet-100 border border-violet-300 py-1 pl-3 pr-2 rounded-full text-sm flex items-center gap-2"
                    >
                      {keyword}
                      <button
                        type="button"
                        className="cursor-pointer hover:text-red-500 transition-colors"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        <IoIosCloseCircle size={18} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Main Image (1440 X 750) or (1440 X 800)
              </label>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("mainImageInput")?.click()
                }
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 text-sm"
              >
                {uploadingMain ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Upload New Main Image"
                )}
              </button>
              <input
                id="mainImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "main")}
              />
              {(imagePreview || form.mainImage) && (
                <img
                  src={imagePreview || form.mainImage}
                  alt="Main image preview"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200"
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Card Image (1440 X 750) or (1440 X 800)
              </label>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("cardImageInput")?.click()
                }
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 text-sm"
              >
                {uploadingCard ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Upload New Card Image"
                )}
              </button>
              <input
                id="cardImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "card")}
              />
              {(cardPreview || form.cardImage) && (
                <img
                  src={cardPreview || form.cardImage}
                  alt="Card image preview"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200"
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Photo Gallery (450 X 350)
              </label>
              <button
                type="button"
                onClick={() => document.getElementById("galleryInput")?.click()}
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 text-sm"
              >
                {uploadingGallery ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Upload Gallery Images"
                )}
              </button>
              <input
                id="galleryInput"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "gallery")}
              />
              <div className="flex flex-wrap gap-2">
                {(galleryPreviews || []).map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`Gallery image ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleGalleryRemove(i)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                YouTube iframe embed
              </label>
              <input
                name="youtubeIframe"
                value={form.youtubeIframe || ""}
                onChange={handleChange}
                placeholder="Paste YouTube iframe embed here"
                className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
              />
            </div>
            <h2 className="font-semibold text-sm">Project Manager</h2>
            <input
              name="projectManager.name"
              value={form.projectManager?.name || ""}
              onChange={handleChange}
              placeholder="Manager name"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <input
              name="projectManager.email"
              value={form.projectManager?.email || ""}
              onChange={handleChange}
              placeholder="Manager email"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <input
              name="projectManager.phone"
              value={form.projectManager?.phone || ""}
              onChange={handleChange}
              placeholder="Manager phone"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <h2 className="font-semibold text-sm">OG Metadata</h2>
            <input
              name="og.title"
              value={form.og?.title || ""}
              onChange={handleChange}
              placeholder="OG Title"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <textarea
              name="og.description"
              value={form.og?.description || ""}
              onChange={handleChange}
              placeholder="OG Description"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium">OG Image</label>
              <button
                type="button"
                onClick={() => document.getElementById("ogImageInput")?.click()}
                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-xl border border-gray-300 text-sm"
              >
                {uploadingOgImage ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Upload OG Image"
                )}
              </button>
              <input
                id="ogImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e, "ogImage")}
              />
              {ogImagePreview && (
                <img
                  src={ogImagePreview}
                  alt="OG image preview"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200"
                />
              )}
            </div>
            <input
              name="og.url"
              value={form.og?.url || ""}
              onChange={handleChange}
              placeholder="OG URL"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <h2 className="font-semibold text-sm">Impact</h2>
            <select
              value={newImpact.type || "Direct"}
              onChange={(e) =>
                setNewImpact((prev) => ({
                  ...prev,
                  type: e.target.value || "Direct",
                }))
              }
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            >
              <option value="Direct">Direct</option>
              <option value="Indirect">Indirect</option>
              <option value="Long-term">Long-term</option>
            </select>
            <input
              value={newImpact.title || ""}
              onChange={(e) =>
                setNewImpact((prev) => ({
                  ...prev,
                  title: e.target.value || "",
                }))
              }
              placeholder="Impact Title"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <textarea
              value={newImpact.description || ""}
              onChange={(e) =>
                setNewImpact((prev) => ({
                  ...prev,
                  description: e.target.value || "",
                }))
              }
              placeholder="Impact Description"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddImpact}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl"
            >
              Add Impact
            </button>
            {form.impact.map((imp, idx) => (
              <div
                key={idx}
                className={` ${
                  imp.type === "Direct"
                    ? "bg-green-200"
                    : imp.type === "Indirect"
                    ? "bg-amber-100"
                    : "bg-violet-100"
                } p-3 rounded-xl`}
              >
                {editingImpactIndex === idx ? (
                  <div className="space-y-2">
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={newImpact.type}
                        onChange={(e) =>
                          setNewImpact({ ...newImpact, type: e.target.value })
                        }
                        className={` ${
                          imp.type === "Direct"
                            ? "border-green-300"
                            : imp.type === "Indirect"
                            ? "border-amber-300"
                            : "border-violet-400"
                        } p-2.5 w-full text-sm border rounded-xl`}
                      />
                      <input
                        type="text"
                        value={newImpact.title}
                        onChange={(e) =>
                          setNewImpact({ ...newImpact, title: e.target.value })
                        }
                        className={` ${
                          imp.type === "Direct"
                            ? "border-green-300"
                            : imp.type === "Indirect"
                            ? "border-amber-300"
                            : "border-violet-400"
                        } p-2.5 w-full text-sm border rounded-xl`}
                      />
                      <textarea
                        value={newImpact.description}
                        onChange={(e) =>
                          setNewImpact({
                            ...newImpact,
                            description: e.target.value,
                          })
                        }
                        className={` ${
                          imp.type === "Direct"
                            ? "border-green-300"
                            : imp.type === "Indirect"
                            ? "border-amber-300"
                            : "border-violet-400"
                        } p-2.5 w-full text-sm border rounded-xl`}
                      />
                    </div>
                    <div className="flex gap-4 justify-end">
                      <button onClick={handleCancelImpactEdit}>
                        <span className="font-semibold cursor-pointer bg-red-300 px-2 py-1 rounded-sm">
                          Cancel
                        </span>
                      </button>
                      <button onClick={handleSaveImpact}>
                        <span className="font-semibold cursor-pointer bg-violet-600 text-white px-2 py-1 rounded-sm">
                          Save
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold text-medium">
                        {imp.type}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditImpact(idx)}
                          className="cursor-pointer"
                        >
                          <AiOutlineEdit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              impact: prev.impact.filter((_, i) => i !== idx),
                            }))
                          }
                          className="cursor-pointer"
                        >
                          <IoIosCloseCircle size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{imp.title}</p>
                    <p className="text-sm">{imp.description}</p>
                  </div>
                )}
              </div>
            ))}

            <div className="text-sm">
              <label className="font-medium block mb-1">
                Schema Markup (JSON-LD)
              </label>
              <textarea
                className="border p-2 w-full rounded-xl border-gray-300 font-mono"
                placeholder='{"name": "Name of Schema", "description": "Description for Schema", "link": "https://"}'
                value={newScheme}
                onChange={(e) => setNewScheme(e.target.value)}
                rows={6}
              />
            </div>
            <p className="text-sm p-3 rounded-xl bg-purple-100 border border-gray-300">
              {newScheme}
            </p>

            <h2 className="font-semibold text-sm">Timeline Events</h2>
            <input
              value={newTimelineEvent.title || ""}
              onChange={(e) =>
                setNewTimelineEvent((prev) => ({
                  ...prev,
                  title: e.target.value || "",
                }))
              }
              placeholder="Event Title"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <select
              value={newTimelineEvent.status || "Pending"}
              onChange={(e) =>
                setNewTimelineEvent((prev) => ({
                  ...prev,
                  status: e.target.value || "Pending",
                }))
              }
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <input
              value={newTimelineEvent.date || ""}
              onChange={(e) =>
                setNewTimelineEvent((prev) => ({
                  ...prev,
                  date: e.target.value || "",
                }))
              }
              type="date"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddTimelineEvent}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl"
            >
              Add Timeline Event
            </button>
            {form.timeline.map((event, idx) => (
              <div
                key={idx}
                className={` ${
                  event.status === "Completed"
                    ? "bg-green-200"
                    : event.status === "In-Progress"
                    ? "bg-amber-100"
                    : "bg-violet-100"
                } p-3 rounded-xl`}
              >
                {editingTimelineEventIndex === idx ? (
                  <div className="space-y-2">
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={newTimelineEvent.status}
                        onChange={(e) =>
                          setNewTimelineEvent({
                            ...newTimelineEvent,
                            status: e.target.value,
                          })
                        }
                        className={` ${
                          event.status === "Completed"
                            ? "border-green-300"
                            : event.status === "In-Progress"
                            ? "border-amber-300"
                            : "border-violet-400"
                        } p-2.5 w-full text-sm border rounded-xl`}
                      />
                      <input
                        type="text"
                        value={newTimelineEvent.title}
                        onChange={(e) =>
                          setNewTimelineEvent({
                            ...newTimelineEvent,
                            title: e.target.value,
                          })
                        }
                        className={` ${
                          event.status === "Completed"
                            ? "border-green-300"
                            : event.status === "In-Progress"
                            ? "border-amber-300"
                            : "border-violet-400"
                        } p-2.5 w-full text-sm border rounded-xl`}
                      />
                      <input
                        type="date"
                        value={newTimelineEvent.date}
                        onChange={(e) =>
                          setNewTimelineEvent({
                            ...newTimelineEvent,
                            date: e.target.value,
                          })
                        }
                        className={` ${
                          event.status === "Completed"
                            ? "border-green-300"
                            : event.status === "In-Progress"
                            ? "border-amber-300"
                            : "border-violet-400"
                        } p-2.5 w-full text-sm border rounded-xl`}
                      />
                    </div>
                    <div className="flex gap-4 justify-end">
                      <button onClick={handleCancelTimelineEventEdit}>
                        <span className="font-semibold cursor-pointer bg-red-300 px-2 py-1 rounded-sm">
                          Cancel
                        </span>
                      </button>
                      <button onClick={handleSaveTimelineEvent}>
                        <span className="font-semibold cursor-pointer bg-violet-600 text-white px-2 py-1 rounded-sm">
                          Save
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold text-medium">
                        {event.status}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTimelineEvent(idx)}
                          className="cursor-pointer"
                        >
                          <AiOutlineEdit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              timeline: prev.timeline.filter(
                                (_, i) => i !== idx
                              ),
                            }))
                          }
                          className="cursor-pointer"
                        >
                          <IoIosCloseCircle size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{event.title}</p>
                    <p className="text-sm">{event.date}</p>
                  </div>
                )}
              </div>
            ))}
            <h2 className="font-semibold text-sm">Updates</h2>
            <input
              value={newUpdate.version || ""}
              onChange={(e) =>
                setNewUpdate((prev) => ({
                  ...prev,
                  version: e.target.value || "",
                }))
              }
              placeholder="Update Version"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <textarea
              value={newUpdate.content || ""}
              onChange={(e) =>
                setNewUpdate((prev) => ({
                  ...prev,
                  content: e.target.value || "",
                }))
              }
              placeholder="Update Content"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <input
              value={newUpdate.date || ""}
              onChange={(e) =>
                setNewUpdate((prev) => ({
                  ...prev,
                  date: e.target.value || "",
                }))
              }
              type="date"
              className="p-2.5 text-sm w-full border border-gray-300 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddUpdate}
              className="px-4 py-2 bg-violet-600 text-white rounded-xl"
            >
              Add Update
            </button>
            {form.updates.map((upd, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-violet-100">
                {editingUpdateIndex === idx ? (
                  <div className="space-y-2">
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={newUpdate.version}
                        onChange={(e) =>
                          setNewUpdate({
                            ...newUpdate,
                            version: e.target.value,
                          })
                        }
                        className="p-2.5 w-full text-sm border border-gray-100 rounded-xl"
                      />
                      <textarea
                        value={newUpdate.content}
                        onChange={(e) =>
                          setNewUpdate({
                            ...newUpdate,
                            content: e.target.value,
                          })
                        }
                        className="p-2.5 w-full text-sm border border-gray-100 rounded-xl"
                      />
                      <input
                        type="date"
                        value={newUpdate.date}
                        onChange={(e) =>
                          setNewUpdate({
                            ...newUpdate,
                            date: e.target.value,
                          })
                        }
                        className="p-2.5 w-full text-sm border border-gray-100 rounded-xl"
                      />
                    </div>
                    <div className="flex gap-4 justify-end">
                      <button onClick={handleCancelUpdateEdit}>
                        <span className="font-semibold cursor-pointer bg-red-300 px-2 py-1 rounded-sm">
                          Cancel
                        </span>
                      </button>
                      <button onClick={handleSaveUpdate}>
                        <span className="font-semibold cursor-pointer bg-violet-600 text-white px-2 py-1 rounded-sm">
                          Save
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between">
                      <span className="text-slate-700 font-semibold text-medium">
                        {upd.version}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUpdate(idx)}
                          className="cursor-pointer"
                        >
                          <AiOutlineEdit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              updates: prev.updates.filter((_, i) => i !== idx),
                            }))
                          }
                          className="cursor-pointer"
                        >
                          <IoIosCloseCircle size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{upd.content}</p>
                    <p className="text-sm">{upd.date}</p>
                  </div>
                )}
              </div>
            ))}
            <h2 className="font-semibold text-sm">Donation Options</h2>
            <div className="flex flex-wrap gap-4">
              {(form.donationOptions || []).map((option, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    name={`donationOptions.${index}`}
                    checked={option.isEnabled || false}
                    onChange={handleChange}
                  />
                  <span>{option.type || "Unknown"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
