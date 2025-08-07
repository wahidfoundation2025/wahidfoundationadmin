'use client'

import withAccessControl from '@/lib/withAccessControl';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TbEdit } from 'react-icons/tb';

const Footer = () => {
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [footer, setFooter] = useState();
    const [submitting, setSubmitting] = useState();

    const [orgName, setOrgName] = useState('');
    const [copyrightText, setCopyrightText] = useState('');
    const [quickLinks, setQuickLinks] = useState([]);
    const [socialLinks, setSocialLinks] = useState({});
    const [termsLinks, setTermsLinks] = useState([]);
    const [volunteering, setVolunteering] = useState({
        heading: '',
        description: '',
        linkLabel: '',
        linkPath: ''
    });

    async function fetchFooter() {
        try {
            setLoading(true);
            const res = await fetch('/api/footer');
            const data = await res.json();
            setFooter(data);
        } catch (err) {
            console.log("Error in Footer: ", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        try {
            setSubmitting(true);

            const updatedFooter = {
                orgName,
                quickLinks,
                termsLinks,
                volunteering,
                socialLinks,
                copyrightText,
            };

            // Don't send request if nothing has changed
            const hasChanged =
                JSON.stringify(updatedFooter) !== JSON.stringify({
                    orgName: footer?.orgName || '',
                    quickLinks: footer?.quickLinks || [],
                    termsLinks: footer?.termsLinks || [],
                    volunteering: footer?.volunteering || {},
                    socialLinks: footer?.socialLinks || {},
                    copyrightText: footer?.copyrightText || ''
                });

            if (!hasChanged) {
                console.log('No changes detected. Skipping update.');
                setEditMode(false);
                return;
            }

            const res = await fetch('/api/footer', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFooter),
            });

            if (!res.ok) throw new Error('Failed to update footer');

            const data = await res.json();
            setFooter(data);
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setSubmitting(false);
            setEditMode(false);
        }
    }

    useEffect(() => {
        fetchFooter();
    }, []);

    useEffect(() => {
        if (footer) {
            setOrgName(footer.orgName);
            setCopyrightText(footer.copyrightText);
            setQuickLinks(footer.quickLinks);
            setSocialLinks(footer.socialLinks);
            setTermsLinks(footer.termsLinks);
            setVolunteering(footer.volunteering || {
                heading: '',
                description: '',
                linkLabel: '',
                linkPath: ''
            });
        }
    }, [footer]);

    return (
        <div className="min-h-full w-full bg-white p-4 sm:p-6 sm:rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Footer</h1>

                {editMode ? (
                    <button
                        onClick={handleSave}
                        className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-700 px-4 sm:px-6 py-2 cursor-pointer text-white transition rounded-xl"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
                    </button>
                ) : (
                    <button
                        onClick={() => setEditMode(true)}
                        className="flex flex-row text-sm sm:text-base gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-700 px-4 sm:px-6 py-2 cursor-pointer text-white transition rounded-xl"
                    >
                        <TbEdit size={16} /> Edit
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : editMode && footer ? (
                <div className="flex flex-col gap-4">
                    {/* Org Name */}
                    <div className='flex sm:flex-row flex-col gap-2'>
                        <label className="font-medium block mb-1 sm:w-40">Name:</label>
                        <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            className="border border-gray-300 px-3 py-1 rounded-lg w-full"
                        />
                    </div>

                    <hr className="text-gray-300" />

                    {/* Copyright */}
                    <div className='flex sm:flex-row flex-col gap-2'>
                        <label className="font-medium block mb-1 sm:w-40">Copy Right Text:</label>
                        <input
                            type="text"
                            value={copyrightText}
                            onChange={(e) => setCopyrightText(e.target.value)}
                            className="border border-gray-300 px-3 py-1 rounded-lg w-full"
                        />
                    </div>

                    <hr className="text-gray-300" />

                    {/* Quick Links */}
                    <div>
                        <span className="font-medium">Quick Links:</span>
                        <div className="flex flex-col mt-2 sm:ml-6 space-y-2">
                            {quickLinks?.map((link, index) => (
                                <div key={index} className="flex sm:flex-row flex-col gap-2">
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => {
                                            const updated = [...quickLinks];
                                            updated[index].label = e.target.value;
                                            setQuickLinks(updated);
                                        }}
                                        className="border border-gray-300 px-2 py-1 rounded-lg sm:w-40 font-semibold"
                                    />
                                    <input
                                        type="text"
                                        value={link.path}
                                        onChange={(e) => {
                                            const updated = [...quickLinks];
                                            updated[index].path = e.target.value;
                                            setQuickLinks(updated);
                                        }}
                                        className="border border-gray-300 px-2 py-1 rounded-lg flex-1 sm:mb-0 mb-4"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="text-gray-300" />

                    {/* Social Links */}
                    <div>
                        <span className="font-medium">Social Links:</span>
                        <div className="flex flex-col mt-2 sm:ml-6 space-y-2">
                            {Object.entries(socialLinks)?.map(([platform, url]) => (
                                <div key={platform} className="flex sm:flex-row flex-col gap-2">
                                    <label className="capitalize font-medium sm:w-40">{platform}:</label>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => {
                                            setSocialLinks({ ...socialLinks, [platform]: e.target.value });
                                        }}
                                        className="border border-gray-300 px-2 py-1 rounded-lg flex-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="text-gray-300" />

                    {/* Terms & Policies */}
                    <div>
                        <span className="font-medium">Terms & Policies:</span>
                        <div className="flex flex-col mt-2 sm:ml-6 space-y-2">
                            {termsLinks?.map((term, index) => (
                                <div key={term._id} className="flex sm:flex-row flex-col gap-2">
                                    <input
                                        type="text"
                                        value={term.label}
                                        onChange={(e) => {
                                            const updated = [...termsLinks];
                                            updated[index].label = e.target.value;
                                            setTermsLinks(updated);
                                        }}
                                        className="border border-gray-300 px-2 py-1 rounded-lg sm:w-40 font-semibold"
                                    />
                                    <input
                                        type="text"
                                        value={term.path}
                                        onChange={(e) => {
                                            const updated = [...termsLinks];
                                            updated[index].path = e.target.value;
                                            setTermsLinks(updated);
                                        }}
                                        className="border border-gray-300 px-2 py-1 rounded-lg flex-1 sm:mb-0 mb-4"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="text-gray-300" />

                    {/* Volunteering */}
                    <div>
                        <span className="font-medium">Volunteering:</span>
                        <div className="flex flex-col mt-2 sm:ml-6 space-y-2">
                            <div className="flex sm:flex-row flex-col gap-2">
                                <label className="font-medium sm:w-40">Heading:</label>
                                <input
                                    type="text"
                                    value={volunteering.heading}
                                    onChange={(e) =>
                                        setVolunteering({ ...volunteering, heading: e.target.value })
                                    }
                                    className="border border-gray-300 px-2 py-1 rounded-lg flex-1"
                                />
                            </div>

                            <div className="flex sm:flex-row flex-col gap-2">
                                <label className="font-medium sm:w-40">Description:</label>
                                <input
                                    type="text"
                                    value={volunteering.description}
                                    onChange={(e) =>
                                        setVolunteering({ ...volunteering, description: e.target.value })
                                    }
                                    className="border border-gray-300 px-2 py-1 rounded-lg flex-1"
                                />
                            </div>

                            <div className="flex sm:flex-row flex-col gap-2">
                                <label className="font-medium sm:w-40">Link Label:</label>
                                <input
                                    type="text"
                                    value={volunteering.linkLabel}
                                    onChange={(e) =>
                                        setVolunteering({ ...volunteering, linkLabel: e.target.value })
                                    }
                                    className="border border-gray-300 px-2 py-1 rounded-lg flex-1"
                                />
                            </div>

                            <div className="flex sm:flex-row flex-col gap-2">
                                <label className="font-medium sm:w-40">Link Path:</label>
                                <input
                                    type="text"
                                    value={volunteering.linkPath}
                                    onChange={(e) =>
                                        setVolunteering({ ...volunteering, linkPath: e.target.value })
                                    }
                                    className="border border-gray-300 px-2 py-1 rounded-lg flex-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : footer && (
                <div className='flex flex-col gap-4'>
                    <div>
                        <span className='font-medium sm:w-40 inline-block'>
                            Name: {" "}
                        </span>
                        {footer.orgName}
                    </div>

                    <hr className="text-gray-300" />

                    <div>
                        <span className='font-medium sm:w-40 inline-block'>
                            Copy Right Text: {" "}
                        </span>
                        {footer.copyrightText}
                    </div>

                    <hr className="text-gray-300" />

                    <div>
                        <span className='font-medium mb-2'>
                            Quick Links: {" "}
                        </span>

                        <div className='flex flex-col mt-2 sm:ml-6 space-y-1'>
                            {footer.quickLinks?.map(({ label, path }) => (
                                <div key={label}>
                                    <span className="capitalize font-medium sm:w-40 inline-block">{label}:</span>
                                    <span>{path}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="text-gray-300" />

                    <div>
                        <span className="font-medium mb-2">Social Links:</span>

                        <div className="flex flex-col mt-2 sm:ml-6 space-y-1">
                            {Object.entries(footer.socialLinks)?.map(([platform, url]) => (
                                <div key={platform} className="flex items-start space-x-2">
                                    <span className="capitalize font-medium sm:w-40">{platform}:</span>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {url}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="text-gray-300" />

                    <div>
                        <span className="font-medium mb-2">Terms & Policies:</span>

                        <div className="flex flex-col mt-2 sm:ml-6 space-y-1">
                            {footer.termsLinks?.map(({ label, path, _id }) => (
                                <div key={_id} className="flex items-start space-x-2">
                                    <span className="capitalize break-all font-medium sm:w-40">{label}:</span>

                                    <a
                                        href={path}
                                        className="text-blue-600 hover:underline"
                                    >
                                        <span className="capitalize break-all">{label}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="text-gray-300" />

                    <div>
                        <span className="font-medium mb-2">Volunteering:</span>

                        <div className="flex flex-col mt-2 sm:ml-6 space-y-1">

                            <div className="flex">
                                <span className="font-medium sm:w-40">Heading:</span>
                                <span>{footer.volunteering.heading}</span>
                            </div>

                            <div className="flex">
                                <span className="font-medium sm:w-40">Description:</span>
                                <span>{footer.volunteering.description}</span>
                            </div>

                            <div className="flex">
                                <span className="font-medium sm:w-40">Link:</span>
                                <a
                                    href={footer.volunteering.linkPath}
                                    className="text-blue-600 hover:underline"
                                >
                                    {footer.volunteering.linkLabel}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default withAccessControl(Footer, "cms")