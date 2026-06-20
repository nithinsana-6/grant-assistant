'use client';

import { useState } from 'react';

type Grant = {
  name: string;
  reason: string;
  fit: string;
};

const workflowSteps = [
  {
    step: '01',
    title: 'Agency intake',
    description: 'Capture eligibility signals and project intent.',
  },
  {
    step: '02',
    title: 'Program matching',
    description: 'Evaluate agency details against funding criteria.',
  },
  {
    step: '03',
    title: 'Draft preparation',
    description: 'Create a structured proposal narrative for review.',
  },
  {
    step: '04',
    title: 'Export',
    description: 'Copy or download the draft for stakeholder review.',
  },
];

const fitStyles: Record<string, string> = {
  'High Fit': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Strong Match': 'bg-blue-50 text-blue-700 ring-blue-200',
  'Innovation Fit': 'bg-violet-50 text-violet-700 ring-violet-200',
  'Needs Review': 'bg-amber-50 text-amber-700 ring-amber-200',
};

export default function Home() {
  const [agencyName, setAgencyName] = useState('');
  const [state, setState] = useState('');
  const [locationType, setLocationType] = useState('');
  const [fundingGoal, setFundingGoal] = useState('');
  const [aiIdea, setAiIdea] = useState('');
  const [recommendedGrants, setRecommendedGrants] = useState<Grant[]>([]);
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    const grants: Grant[] = [];

    if (locationType === 'Rural') {
      grants.push({
        name: 'Section 5311 Rural Formula Program',
        reason: 'Recommended because the agency serves a rural community.',
        fit: 'High Fit',
      });
    }

    if (state.toLowerCase().trim() === 'washington') {
      grants.push({
        name: 'WA Consolidated Grant',
        reason: 'Recommended because the agency is located in Washington.',
        fit: 'Strong Match',
      });
    }

    if (fundingGoal.toLowerCase().includes('ai')) {
      grants.push({
        name: 'Section 5312 Innovation Program',
        reason:
          'Recommended because the funding goal involves AI, innovation, or technology modernization.',
        fit: 'Innovation Fit',
      });
    }

    if (grants.length === 0) {
      grants.push({
        name: 'General Transit Funding Review',
        reason:
          'Additional agency details are needed to identify a stronger grant match. Consider adding a clearer funding goal, location, or project concept.',
        fit: 'Needs Review',
      });
    }

    setRecommendedGrants(grants);
    setDraft('');
    setError('');
  };

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setError('');
    setDraft('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyName, state, locationType, fundingGoal, aiIdea }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate draft');
      }

      const data = await response.json();
      setDraft(data.draft);
    } catch {
      setError('Failed to generate draft. Please check the API key and try again.');
    } finally {
      setIsGenerating(false);
    }
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

  const handleCopyDraft = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const metricCards = [
    {
      label: 'Grant matches',
      value: recommendedGrants.length.toString(),
      detail: 'Eligibility-based program scan',
    },
    {
      label: 'Draft state',
      value: draft ? 'Ready' : isGenerating ? 'Generating' : 'Pending',
      detail: 'Structured proposal narrative',
    },
    {
      label: 'Export options',
      value: draft ? 'Enabled' : 'Locked',
      detail: 'Copy and markdown download',
    },
    {
      label: 'System status',
      value: error ? 'Action needed' : 'Operational',
      detail: 'Loading and error handling',
    },
  ];

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10';

  return (
    <main className="min-h-screen bg-slate-950 text-slate-950">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#020617_0%,#111827_48%,#172554_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <nav className="mb-14 flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-bold tracking-wide">Grant Assistant</p>
              <p className="text-xs text-slate-400">Funding workflow platform</p>
            </div>

            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200 backdrop-blur md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Draft generation enabled
            </div>
          </nav>

          <header className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div className="text-white">
              <p className="mb-5 inline-flex rounded-full border border-blue-300/20 bg-blue-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
                Funding operations workspace
              </p>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
                AI Grant Assistant for funding discovery and proposal drafting.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                A practical AI workflow for grant matching, agency intake, structured
                proposal drafting, and export-ready funding narratives.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">System overview</p>
                  <p className="text-xs text-slate-300">Live application state</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200 ring-1 ring-emerald-300/20">
                  Active
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-slate-300">Matching engine</span>
                  <span className="font-semibold">Rules-based</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-slate-300">Draft service</span>
                  <span className="font-semibold">Available</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-slate-300">Output format</span>
                  <span className="font-semibold">Markdown</span>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 text-white shadow-xl backdrop-blur-xl"
              >
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-bold tracking-normal">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-300">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
            <div className="grid gap-4 lg:grid-cols-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-white/10 bg-white/[0.06] p-5 text-white"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
                    {item.step}
                  </div>
                  <h2 className="text-sm font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/15 bg-white/90 shadow-2xl shadow-slate-950/40 backdrop-blur-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <section className="border-b border-slate-200 bg-slate-50/90 p-6 sm:p-8 lg:col-span-4 lg:border-b-0 lg:border-r">
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                    Agency intake
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
                    Eligibility inputs
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    These fields drive the recommendation logic and provide context for the
                    generated proposal draft.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Agency name
                    </span>
                    <input
                      className={inputClass}
                      placeholder="Example Transit Authority"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      State
                    </span>
                    <input
                      className={inputClass}
                      placeholder="Washington"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Service area
                    </span>
                    <select
                      className={inputClass}
                      value={locationType}
                      onChange={(e) => setLocationType(e.target.value)}
                    >
                      <option value="">Select Urban/Rural</option>
                      <option value="Urban">Urban</option>
                      <option value="Rural">Rural</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Funding goal
                    </span>
                    <input
                      className={inputClass}
                      placeholder="Dispatch modernization"
                      value={fundingGoal}
                      onChange={(e) => setFundingGoal(e.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Project concept
                    </span>
                    <textarea
                      className={`${inputClass} min-h-32 resize-y`}
                      placeholder="Describe the proposed initiative, expected outcomes, and operational impact."
                      value={aiIdea}
                      onChange={(e) => setAiIdea(e.target.value)}
                    />
                  </label>

                  <button
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-700/20"
                  >
                    Find matching grants
                  </button>
                </div>
              </section>

              <section className="bg-white/80 p-6 sm:p-8 lg:col-span-8">
                <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                      Grant workspace
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
                      Recommendations and proposal draft
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      Review matched grants, generate the proposal narrative, and export the
                      draft without leaving the workflow.
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                    Operational workflow
                  </span>
                </div>

                {recommendedGrants.length === 0 && !error && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8">
                    <div className="max-w-xl">
                      <p className="text-sm font-bold text-slate-950">
                        No recommendations yet
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Complete the agency intake and run the matcher. Relevant grant
                        programs, confidence labels, generation status, and export actions
                        will appear here.
                      </p>
                    </div>
                  </div>
                )}

                {recommendedGrants.length > 0 && (
                  <div className="space-y-6">
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-950">
                          Recommended grant programs
                        </h3>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                          {recommendedGrants.length} match
                          {recommendedGrants.length === 1 ? '' : 'es'}
                        </span>
                      </div>

                      <div className="grid gap-4">
                        {recommendedGrants.map((grant, index) => (
                          <article
                            key={index}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                  Recommendation {index + 1}
                                </p>
                                <h4 className="mt-2 text-lg font-bold text-slate-950">
                                  {grant.name}
                                </h4>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {grant.reason}
                                </p>
                              </div>

                              <span
                                className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                                  fitStyles[grant.fit] ??
                                  'bg-slate-50 text-slate-700 ring-slate-200'
                                }`}
                              >
                                {grant.fit}
                              </span>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-bold text-slate-950">
                            Proposal draft generation
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            Generates a structured draft from the agency profile and selected
                            grant context.
                          </p>
                        </div>

                        <button
                          onClick={handleGenerateDraft}
                          disabled={isGenerating}
                          className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                        >
                          {isGenerating ? 'Generating draft...' : 'Generate draft'}
                        </button>
                      </div>

                      {isGenerating && (
                        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                          <div className="mb-3 flex items-center justify-between gap-4">
                            <span className="font-bold">
                              Preparing the proposal draft
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wide">
                              In progress
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                            <div className="h-full w-2/3 animate-pulse rounded-full bg-emerald-600" />
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {draft && (
                  <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                          Generated draft
                        </p>
                        <h3 className="mt-2 text-xl font-bold">Proposal narrative</h3>
                        <p className="mt-1 text-sm text-slate-300">
                          Review, edit, copy, or download this markdown draft.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleCopyDraft}
                          className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                        >
                          {copied ? 'Copied' : 'Copy draft'}
                        </button>

                        <button
                          onClick={handleDownloadDraft}
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
                        >
                          Download draft
                        </button>
                      </div>
                    </div>

                    <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-white/[0.06] p-5 text-sm leading-6 text-slate-100">
                      {draft}
                    </pre>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}