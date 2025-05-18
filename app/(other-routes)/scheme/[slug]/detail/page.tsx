'use client'
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const SchemeDetail = () => {
  const [ activeTab, setActiveTab ] = useState("Details");

  const scheme = {
    title: "Goa Village & Municipal Child Committee Grants And Awards Scheme",
    tags: ["Awards", "Child Rights", "Municipal", "Panchayat", "Village"],
    description: "Introduced in the year 2015-16, the scheme \"Goa Village & Municipal Child Committee Grants and Awards Scheme (GVMCCGS)\" covers all the Village and Municipal Child Committees set up under Rule 7 of The Goa Children's Homes Rules, 2004 by the local bodies as per provisions of the rules. The winner is awarded an annual financial grant of ₹ 10,000/- towards administrative expenses incurred on organizing the activities of the Committee. The applicant should be the concerned local body i.e. a Panchayat or a Municipal Local Body."
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/scheme" className="text-accent mx-2 flex hover:underline"> <ArrowLeft/> Back</Link>
        </div>

        <div className="space-y-4">
          <div className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-accent border border-accent">
            Goa
          </div>

          <h1 className="text-3xl font-bold">{scheme.title}</h1>

          <div className="flex flex-wrap gap-2">
            {scheme.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm border border-accent text-accent"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-8">
              <button className="px-4 py-2 border-b-2 border-accent text-accent font-medium">
                Details
              </button>
              <button className="px-4 py-2 text-gray-500">
                Benefits
              </button>
              <button className="px-4 py-2 text-gray-500">
                Eligibility
              </button>
              <button className="px-4 py-2 text-gray-500">
                Application Process
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <p className="text-gray-600">
              {scheme.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;
