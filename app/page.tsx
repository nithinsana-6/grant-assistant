'use client';

import { useState } from 'react';

export default function Home() {
  const [agencyName, setAgencyName] = useState('');
  const [state, setState] = useState('');
  const [locationType, setLocationType] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [aiIdea, setAiIdea] = useState('');
  const [recommendedGrants, setRecommendedGrants] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const handleSubmit = () => {
    const grants: string[] = [];

    if (locationType === 'Rural') {
      grants.push('Section 5311 Rural Formula Program');
    }

    if (state.toLowerCase().trim() === 'washington') {
      grants.push('WA Consolidated Grant');
    }

    if (fundingGoal.toLowerCase().includes('ai')) {
      grants.push('Section 5312 Innovation Program');
    }

    setRecommendedGrants(grants);
  };

 const handleGenerateDraft = async () => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      agencyName,
      state,
      locationType,
      fundingGoal,
      aiIdea,
    }),
  });

  const data = await response.json();

  setDraft(data.draft);
};

  const handleDownloadDraft = () => {
    const blob = new Blob([draft], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'grant-draft.md';
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">AI Grant Assistant</h1>

      <div className="space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Agency Name"
          value={agencyName}
          onChange={(e) => setAgencyName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={locationType}
          onChange={(e) => setLocationType(e.target.value)}
        >
          <option value="">Select Urban/Rural</option>
          <option value="Urban">Urban</option>
          <option value="Rural">Rural</option>
        </select>

        <input
          className="border p-2 w-full"
          placeholder="Funding Goal"
          value={fundingGoal}
          onChange={(e) => setFundingGoal(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="AI Idea (Optional)"
          value={aiIdea}
          onChange={(e) => setAiIdea(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Continue
        </button>

        {recommendedGrants.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Recommended Grants</h2>

            <ul>
              {recommendedGrants.map((grant, index) => (
                <li key={index}>✓ {grant}</li>
              ))}
            </ul>

            <button
              onClick={handleGenerateDraft}
              className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            >
              Generate Draft
            </button>
          </div>
        )}

        {draft && (
          <div className="mt-6 border p-4 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-2">Generated Draft</h2>

            <pre className="whitespace-pre-wrap">{draft}</pre>

            <button
              onClick={handleDownloadDraft}
              className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
            >
              Download Draft
            </button>
          </div>
        )}
      </div>
    </div>
  );
}