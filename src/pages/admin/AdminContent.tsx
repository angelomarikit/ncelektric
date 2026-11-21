import { useState } from 'react';
import type { SiteContentMap } from '../../types';

type Tab = 'hero' | 'homepage' | 'about' | 'contact' | 'footer' | 'seo_defaults' | 'settings';

export function AdminContent({
  content,
  onSave,
  onUpload,
}: {
  content: SiteContentMap;
  onSave: (key: keyof SiteContentMap, payload: SiteContentMap[keyof SiteContentMap]) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}) {
  const [tab, setTab] = useState<Tab>('hero');
  const [draft, setDraft] = useState(content);
  const [notice, setNotice] = useState('');

  function update<K extends Tab>(section: K, patch: Partial<SiteContentMap[K]>) {
    setDraft((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
  }

  async function save() {
    await onSave(tab, draft[tab]);
    setNotice(`Saved ${tab}.`);
  }

  const tabs: Tab[] = ['hero', 'homepage', 'about', 'contact', 'footer', 'seo_defaults', 'settings'];

  return (
    <div className="max-w-3xl">
      <nav className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            className={`px-3 py-1.5 text-sm font-bold rounded border ${tab === t ? 'bg-[#0b294a] text-white' : 'bg-white'}`}
            onClick={() => setTab(t)}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </nav>
      <div className="bg-white border p-6 grid gap-3">
        {tab === 'hero' ? (
          <>
            {(['eyebrow', 'headline', 'headlineAccent', 'description', 'ctaProducts', 'ctaQuote'] as const).map((field) => (
              <label key={field} className="text-sm font-bold">
                {field}
                <input
                  className="field mt-1"
                  value={draft.hero[field]}
                  onChange={(e) => update('hero', { [field]: e.target.value })}
                />
              </label>
            ))}
            <label className="text-sm font-bold">
              Hero image URL
              <input
                className="field mt-1"
                value={draft.hero.image}
                onChange={(e) => update('hero', { image: e.target.value })}
              />
              <input
                className="field mt-2"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onUpload(f).then((url) => update('hero', { image: url }));
                }}
              />
            </label>
            {draft.hero.image ? <img src={draft.hero.image} alt="" className="h-40 object-contain border" /> : null}
          </>
        ) : null}
        {tab === 'homepage' ? (
          <>
            {(
              [
                'categoriesSubtitle',
                'categoriesTitle',
                'featuredSubtitle',
                'featuredTitle',
                'aboutTitle',
                'aboutBody',
                'ctaTitle',
                'ctaBody',
              ] as const
            ).map((field) => (
              <label key={field} className="text-sm font-bold">
                {field}
                {field.includes('Body') ? (
                  <textarea
                    className="field mt-1"
                    rows={3}
                    value={draft.homepage[field]}
                    onChange={(e) => update('homepage', { [field]: e.target.value })}
                  />
                ) : (
                  <input
                    className="field mt-1"
                    value={draft.homepage[field]}
                    onChange={(e) => update('homepage', { [field]: e.target.value })}
                  />
                )}
              </label>
            ))}
            <label className="text-sm font-bold">
              About section image
              <input
                className="field mt-1"
                value={draft.homepage.aboutImage}
                onChange={(e) => update('homepage', { aboutImage: e.target.value })}
              />
            </label>
          </>
        ) : null}
        {tab === 'about' || tab === 'contact' ? (
          <>
            <label className="text-sm font-bold">
              Title
              <input
                className="field mt-1"
                value={draft[tab].title}
                onChange={(e) => update(tab, { title: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold">
              Body
              <textarea
                className="field mt-1"
                rows={5}
                value={draft[tab].body}
                onChange={(e) => update(tab, { body: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold">
              Draft notice
              <input
                className="field mt-1"
                value={draft[tab].draftNotice}
                onChange={(e) => update(tab, { draftNotice: e.target.value })}
              />
            </label>
          </>
        ) : null}
        {tab === 'footer' ? (
          <>
            <label className="text-sm font-bold">
              Tagline
              <input
                className="field mt-1"
                value={draft.footer.tagline}
                onChange={(e) => update('footer', { tagline: e.target.value })}
              />
            </label>
            <label className="text-sm font-bold">
              Legal note
              <input
                className="field mt-1"
                value={draft.footer.legalNote}
                onChange={(e) => update('footer', { legalNote: e.target.value })}
              />
            </label>
          </>
        ) : null}
        {tab === 'settings' ? (
          <>
            {(['addressLine', 'phoneLine', 'phoneLine2', 'emailLine'] as const).map((field) => (
              <label key={field} className="text-sm font-bold">
                {field}
                <input
                  className="field mt-1"
                  value={draft.settings[field] ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, settings: { ...d.settings, [field]: e.target.value } }))}
                />
              </label>
            ))}
          </>
        ) : null}
        {tab === 'seo_defaults' ? (
          <>
            {(['siteName', 'defaultTitle', 'defaultDescription'] as const).map((field) => (
              <label key={field} className="text-sm font-bold">
                {field}
                <input
                  className="field mt-1"
                  value={draft.seo_defaults[field]}
                  onChange={(e) => update('seo_defaults', { [field]: e.target.value })}
                />
              </label>
            ))}
          </>
        ) : null}
        <button type="button" className="btn btn-yellow w-fit" onClick={() => void save()}>
          Save section
        </button>
        {notice ? <p className="text-sm text-slate-600">{notice}</p> : null}
      </div>
    </div>
  );
}