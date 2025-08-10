'use client';

import { useEffect, useState } from 'react';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';

export default function FooterSettingsPage() {
  const [footer, setFooter] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch existing footer settings
  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.json())
      .then(data => {
        setFooter(data);
        setFormData(data);
        setLoading(false);
      });
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index][field] = value;
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const addArrayItem = (arrayName) => {
    const newItem = { label: '', path: '' };
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), newItem]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    const updatedArray = formData[arrayName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/footer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const updated = await res.json();
    setFooter(updated);
    setFormData(updated);
    setSaving(false);
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="flex  min-h-screen bg-gray-100">
        <div className="flex items-center gap-3 text-gray-600 text-lg">
          <Loader2 className="animate-spin" size={24} />
          Loading Footer Settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Footer Settings
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
          <div className="flex justify-end gap-3 mb-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData(footer);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-400 transition"
                >
                  <X size={16} /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-violet-700 transition"
              >
                <Edit size={16} /> Edit
              </button>
            )}
          </div>

          {/* Organization Name */}
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Organization Name
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {editMode ? (
                <input
                  type="text"
                  value={formData.orgName || ''}
                  onChange={e => handleFieldChange('orgName', e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter organization name"
                />
              ) : (
                <p className="text-gray-900 font-medium">{footer.orgName}</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quick Links
            </label>
            <div className="space-y-3">
              {formData.quickLinks?.map((link, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50 p-3 rounded-lg"
                >
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={link.label}
                        onChange={e =>
                          handleArrayChange('quickLinks', i, 'label', e.target.value)
                        }
                        placeholder="Link Label"
                        className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <input
                        type="text"
                        value={link.path}
                        onChange={e =>
                          handleArrayChange('quickLinks', i, 'path', e.target.value)
                        }
                        placeholder="Link Path"
                        className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <button
                        onClick={() => removeArrayItem('quickLinks', i)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  ) : (
                    <p className="flex-1 text-gray-900 font-medium">
                      {link.label} <span className="text-gray-400">→</span> {link.path}
                    </p>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => addArrayItem('quickLinks')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 mt-3"
                >
                  <Plus size={16} /> Add Quick Link
                </button>
              )}
            </div>
          </div>

          {/* Terms Links */}
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Terms Links
            </label>
            <div className="space-y-3">
              {formData.termsLinks?.map((link, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50 p-3 rounded-lg"
                >
                  {editMode ? (
                    <>
                      <input
                        type="text"
                        value={link.label}
                        onChange={e =>
                          handleArrayChange('termsLinks', i, 'label', e.target.value)
                        }
                        placeholder="Link Label"
                        className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <input
                        type="text"
                        value={link.path}
                        onChange={e =>
                          handleArrayChange('termsLinks', i, 'path', e.target.value)
                        }
                        placeholder="Link Path"
                        className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      />
                      <button
                        onClick={() => removeArrayItem('termsLinks', i)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  ) : (
                    <p className="flex-1 text-gray-900 font-medium">
                      {link.label} <span className="text-gray-400">→</span> {link.path}
                    </p>
                  )}
                </div>
              ))}
              {editMode && (
                <button
                  onClick={() => addArrayItem('termsLinks')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition flex items-center gap-2 mt-3"
                >
                  <Plus size={16} /> Add Terms Link
                </button>
              )}
            </div>
          </div>

          {/* Volunteering */}
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Volunteering
            </label>
            {editMode ? (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <input
                  type="text"
                  value={formData.volunteering?.heading || ''}
                  onChange={e =>
                    handleNestedChange('volunteering', 'heading', e.target.value)
                  }
                  placeholder="Volunteering Heading"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <textarea
                  value={formData.volunteering?.description || ''}
                  onChange={e =>
                    handleNestedChange('volunteering', 'description', e.target.value)
                  }
                  placeholder="Volunteering Description"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows={4}
                />
                <input
                  type="text"
                  value={formData.volunteering?.linkLabel || ''}
                  onChange={e =>
                    handleNestedChange('volunteering', 'linkLabel', e.target.value)
                  }
                  placeholder="Link Label"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
                <input
                  type="text"
                  value={formData.volunteering?.linkPath || ''}
                  onChange={e =>
                    handleNestedChange('volunteering', 'linkPath', e.target.value)
                  }
                  placeholder="Link Path"
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-gray-900">{footer.volunteering.heading}</p>
                <p className="text-gray-600 mt-1">{footer.volunteering.description}</p>
                <p className="text-gray-900 font-medium mt-1">
                  {footer.volunteering.linkLabel}{' '}
                  <span className="text-gray-400">→</span> {footer.volunteering.linkPath}
                </p>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Social Links
            </label>
            <div className="space-y-3">
              {Object.keys(formData.socialLinks || {}).map((key, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 items-center bg-gray-50 p-3 rounded-lg"
                >
                  <span className="capitalize min-w-[100px] font-semibold text-gray-700">
                    {key}:
                  </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.socialLinks[key]}
                      onChange={e => handleNestedChange('socialLinks', key, e.target.value)}
                      className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder={`Enter ${key} URL`}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{footer.socialLinks[key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-b pb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Copyright Text
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {editMode ? (
                <input
                  type="text"
                  value={formData.copyrightText || ''}
                  onChange={e => handleFieldChange('copyrightText', e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter copyright text"
                />
              ) : (
                <p className="text-gray-900 font-medium">{footer.copyrightText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}