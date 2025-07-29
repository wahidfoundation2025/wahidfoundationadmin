'use client'

import React, { useEffect, useState } from 'react'
import { FiEdit3 } from "react-icons/fi";

const Footer = () => {
    const [loading, setLoading] = useState(false);
    const [footer, setFooter] = useState();

    async function fetchFooter() {
        try {
            setLoading(true);

            const res = await fetch('/api/footer', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            setFooter(data)
        } catch (err) {
            console.log("Error in Footer: ", err);
        } finally {
            setLoading(false);
        }
    }

    console.log(footer);


    useEffect(() => {
        fetchFooter()
    }, [])

    return (
        <div className="min-h-full w-full bg-white p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Footer</h1>

                <button
                    onClick={() => router.push('/projects/create')}
                    className="flex flex-row gap-2 items-center font-medium btn btn-primary border bg-violet-600 hover:bg-violet-700 px-6 py-2 cursor-pointer text-white transition rounded-xl"
                >
                    <FiEdit3 size={16} /> Edit
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : footer && (
                <div className='flex flex-col gap-4'>
                    <div>
                        <span className='font-medium'>
                            Name: {" "}
                        </span>
                        {footer.orgName}
                    </div>
                    <div>
                        <span className='font-medium'>
                            Copy Right Text: {" "}
                        </span>
                        {footer.copyrightText}
                    </div>
                    <div>
                        <span className='font-medium mb-2'>
                            Quick Links: {" "}
                        </span>

                        <div className='flex flex-col mt-2 ml-6 space-y-1'>
                            {footer.quickLinks.map(({ label, path }) => (
                                <div key={label}>
                                    <span className="capitalize font-medium w-40 inline-block">{label}:</span>
                                    <span>{path}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="font-medium mb-2">Social Links:</span>

                        <div className="flex flex-col mt-2 ml-6 space-y-1">
                            {Object.entries(footer.socialLinks).map(([platform, url]) => (
                                <div key={platform} className="flex items-center space-x-2">
                                    <span className="capitalize font-medium w-40">{platform}:</span>
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

                    <div>
                        <span className="font-medium mb-2">Terms & Policies:</span>

                        <div className="flex flex-col mt-2 ml-6 space-y-1">
                            {footer.termsLinks.map(({ label, path, _id }) => (
                                <div key={_id} className="flex items-center space-x-2">
                                    <span className="capitalize font-medium w-40">{label}:</span>

                                    <a
                                        href={path}
                                        className="text-blue-600 hover:underline flex items-center space-x-2"
                                    >
                                        <span className="capitalize">{label}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <span className="font-medium mb-2">Volunteering:</span>

                        <div className="flex flex-col mt-2 ml-6 space-y-1">

                            <div className="flex">
                                <span className="font-medium w-40">Heading:</span>
                                <span>{footer.volunteering.heading}</span>
                            </div>

                            <div className="flex">
                                <span className="font-medium w-40">Description:</span>
                                <span>{footer.volunteering.description}</span>
                            </div>

                            <div className="flex">
                                <span className="font-medium w-40">Link:</span>
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

export default Footer