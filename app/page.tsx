'use client'

import { useState, useRef } from 'react'
import { upload } from '@vercel/blob/client'

type Step = 'intro' | 'form' | 'thanks'

type FormData = {
  name: string
  email: string
  relation: string
  photoUrl: string
  message: string
  firstMemory: string
  idealRelation: string
  videoVibe: string
}

const INITIAL: FormData = {
  name: '', email: '', relation: '', photoUrl: '',
  message: '', firstMemory: '', idealRelation: '', videoVibe: ''
}

export default function Home() {
  const [step, setStep] = useState<Step>('intro')
  const [form, setForm] = useState<FormData>(INITIAL)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof FormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      set('photoUrl', blob.url)
    } catch {
      alert('Photo upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const validate = () => {
    const e: Partial<FormData> = {}
    if (!form.name) e.name = 'Required'
    if (!form.relation) e.relation = 'Required'
    if (!form.message) e.message = 'Required'
    if (!form.firstMemory) e.firstMemory = 'Required'
    if (!form.idealRelation) e.idealRelation = 'Required'
    if (!form.videoVibe) e.videoVibe = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) setStep('thanks')
      else alert('Something went wrong. Please try again.')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'intro') return <Intro onNext={() => setStep('form')} />
  if (step === 'thanks') return <Thanks name={form.name} />

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setStep('intro')} style={styles.back}>← Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: '#6B4FA0' }}>Your contribution</span>
          </div>
          <div style={{ width: 48 }} />
        </div>

        <div style={styles.progress}>
          <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #C4A0E8, #E8A0D0)', borderRadius: 4 }} />
        </div>

        <Section label="About You / आपके बारे में">
          <Field label="Your name / आपका नाम *" error={errors.name}>
            <input style={inp(errors.name)} placeholder="e.g. Priya Sharma"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Relation with Shikha / शिखा से रिश्ता *" error={errors.relation}>
            <select style={inp(errors.relation)} value={form.relation}
              onChange={e => set('relation', e.target.value)}>
              <option value="">Select / चुनें</option>
              <option value="best_friend">Best Friend / बेस्ट फ्रेंड</option>
              <option value="friend">Friend / दोस्त</option>
              <option value="family">Family / परिवार</option>
              <option value="colleague">Colleague / सहकर्मी</option>
              <option value="classmate">Classmate / क्लासमेट</option>
              <option value="other">Other / अन्य</option>
            </select>
          </Field>
          <Field label="Your email (optional) / ईमेल (वैकल्पिक)">
            <input style={inp()} type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
        </Section>

        <Section label="Your Photo / आपकी फोटो">
          <p style={styles.hint}>A photo of you, or you & Shikha together 📸<br />
            <span style={{ fontSize: 12 }}>आपकी या शिखा के साथ फोटो</span></p>
          <div style={styles.uploadBox} onClick={() => fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            {photoPreview ? (
              <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 32 }}>📷</div>
                <div style={{ fontSize: 14, color: '#9B7FD4', fontWeight: 500 }}>Tap to upload</div>
                <div style={{ fontSize: 12, color: '#C4A8E0', marginTop: 2 }}>JPG, PNG · Max 10MB</div>
              </div>
            )}
            {uploading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(107,79,160,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>
                <div style={{ fontSize: 13, color: '#fff' }}>Uploading...</div>
              </div>
            )}
          </div>
          {form.photoUrl && !uploading && <p style={{ fontSize: 12, color: '#7B5EA7', marginTop: 6 }}>✓ Photo uploaded</p>}
        </Section>

        <Section label="Your Message / आपका संदेश">
          <Field label="Write a message for Shikha / शिखा के लिए कुछ लिखें *" error={errors.message}>
            <textarea style={{ ...inp(errors.message), minHeight: 110, resize: 'vertical' as const, lineHeight: '1.6' }}
              placeholder="Dear Shikha, ..." maxLength={500}
              value={form.message} onChange={e => set('message', e.target.value)} />
            <div style={styles.charCount}>{form.message.length}/500</div>
          </Field>
          <Field label="First memory with her / उनके साथ पहली याद *" error={errors.firstMemory}>
            <textarea style={{ ...inp(errors.firstMemory), minHeight: 90, resize: 'vertical' as const, lineHeight: '1.6' }}
              placeholder="I still remember when..." maxLength={400}
              value={form.firstMemory} onChange={e => set('firstMemory', e.target.value)} />
            <div style={styles.charCount}>{form.firstMemory.length}/400</div>
          </Field>
        </Section>

        <Section label="A Fun One / एक मज़ेदार सवाल">
          <p style={styles.hint}>If you could choose any relationship with Shikha?<br />
            <span style={{ fontSize: 12 }}>अगर आप शिखा के साथ कोई भी रिश्ता चुन सकते?</span></p>
          {errors.idealRelation && <p style={styles.error}>{errors.idealRelation}</p>}
          <div style={styles.radioGrid}>
            {[
              { value: 'best_friend', emoji: '👯', label: 'Best Friend', hindi: 'बेस्ट फ्रेंड' },
              { value: 'sibling', emoji: '🤝', label: 'Sibling', hindi: 'भाई / बहन' },
              { value: 'travel_buddy', emoji: '✈️', label: 'Travel Buddy', hindi: 'सफर का साथी' },
              { value: 'mentor', emoji: '🌟', label: 'Mentor', hindi: 'गुरु' },
              { value: 'partner', emoji: '💛', label: 'Life Partner', hindi: 'जीवनसाथी' },
              { value: 'neighbour', emoji: '🏠', label: 'Neighbour', hindi: 'पड़ोसी' },
            ].map(o => (
              <button key={o.value} onClick={() => set('idealRelation', o.value)} style={radioCard(form.idealRelation === o.value)}>
                <span style={{ fontSize: 22 }}>{o.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</span>
                <span style={{ fontSize: 11, color: form.idealRelation === o.value ? '#9B6FD4' : '#B0A0C0' }}>{o.hindi}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section label="Video Vibe / वीडियो का रंग">
          <p style={styles.hint}>Pick the mood for your 30-second animated video 🎬<br />
            <span style={{ fontSize: 12 }}>अपने वीडियो का मूड चुनें</span></p>
          {errors.videoVibe && <p style={styles.error}>{errors.videoVibe}</p>}
          <div style={styles.radioGrid}>
            {[
              { value: 'fun_quirky', emoji: '🎉', label: 'Fun & Quirky', hindi: 'मज़ेदार' },
              { value: 'warm_emotional', emoji: '🥹', label: 'Warm & Emotional', hindi: 'दिल को छूने वाला' },
              { value: 'cool_cinematic', emoji: '🎬', label: 'Cool & Cinematic', hindi: 'सिनेमाई' },
              { value: 'nostalgic', emoji: '🌅', label: 'Nostalgic & Dreamy', hindi: 'पुरानी यादें' },
            ].map(o => (
              <button key={o.value} onClick={() => set('videoVibe', o.value)} style={radioCard(form.videoVibe === o.value)}>
                <span style={{ fontSize: 22 }}>{o.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{o.label}</span>
                <span style={{ fontSize: 11, color: form.videoVibe === o.value ? '#9B6FD4' : '#B0A0C0' }}>{o.hindi}</span>
              </button>
            ))}
          </div>
        </Section>

        <button onClick={submit} disabled={submitting || uploading} style={styles.submitBtn}>
          {submitting ? 'Sending your love...' : 'Send my love to Shikha 💛'}
        </button>
        <p style={styles.submitNote}>
          Your response is private · आपकी जानकारी सिर्फ स्क्रैपबुक बनाने वाले को दिखेगी।
        </p>
      </div>
    </main>
  )
}

function Intro({ onNext }: { onNext: () => void }) {
  return (
    <main style={{ ...styles.main, paddingBottom: 40 }}>
      <div style={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '20px 0' }}>
          {['✨', '🌸', '💛', '🌸', '✨'].map((s, i) => <span key={i} style={{ fontSize: 16 }}>{s}</span>)}
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #EDE0FF', borderRadius: 24, padding: '28px 20px', marginBottom: 14, textAlign: 'center', boxShadow: '0 4px 20px rgba(155,127,212,0.1)' }}>
          <div style={{ display: 'inline-block', background: '#F3EEFF', color: '#9B7FD4', fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 20, marginBottom: 14 }}>
            Shikha's 25th Birthday 🎂
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#3A1F6E', fontFamily: 'Georgia, serif', lineHeight: 1.25, marginBottom: 14 }}>
            A Magic Scrapbook<br />Made With Love
          </h1>
          <p style={{ fontSize: 14, color: '#7B5EA7', lineHeight: 1.7, marginBottom: 6 }}>
            We're creating something Shikha will never forget - a scrapbook where every page comes alive with a surprise animated video.
          </p>
          <p style={{ fontSize: 13, color: '#9B7FD4', lineHeight: 1.6 }}>
            हम शिखा के लिए एक जादुई स्क्रैपबुक बना रहे हैं जिसमें आपकी यादें जिंदा हो जाएंगी।
          </p>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #EDE0FF', borderRadius: 20, padding: '20px 18px', marginBottom: 14, boxShadow: '0 2px 12px rgba(155,127,212,0.08)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase' as const, color: '#9B7FD4', marginBottom: 16 }}>
            How it works / कैसे काम करता है
          </div>
          {[
            { icon: '📝', title: 'You fill this form', sub: 'Photo, message, first memory & a fun question' },
            { icon: '🎬', title: 'We create your video', sub: 'A 30-sec AI animated video, just for you & Shikha' },
            { icon: '📖', title: 'Shikha gets surprised', sub: "She scans a QR code and guesses who it's from" },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 14 : 0, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: '#F3EEFF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#3A1F6E', marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#9B7FD4', lineHeight: 1.5 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#F3EEFF', border: '2px dashed #DDD0F0', borderRadius: 20, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📖</div>
            <div style={{ fontSize: 13, color: '#C4A8E0', lineHeight: 1.5 }}>
              Sample scrapbook page<br /><span style={{ fontSize: 11 }}>(replace with your image)</span>
            </div>
          </div>
        </div>

        <button onClick={onNext} style={styles.submitBtn}>Fill my page 💛</button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#C4A8E0', marginTop: 10 }}>
          Takes less than 5 minutes · It's a surprise, please don't tell her 🤫
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '20px 0' }}>
          {['🌟', '🌸', '✨', '🌸', '🌟'].map((s, i) => <span key={i} style={{ fontSize: 16 }}>{s}</span>)}
        </div>
      </div>
    </main>
  )
}

function Thanks({ name }: { name: string }) {
  return (
    <main style={{ ...styles.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...styles.container, textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🎉💛</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#3A1F6E', fontFamily: 'Georgia, serif', marginBottom: 10 }}>
          Thank you, {name}!
        </h2>
        <p style={{ fontSize: 15, color: '#7B5EA7', lineHeight: 1.7, marginBottom: 8 }}>
          Your love has been saved.<br />Shikha's magic scrapbook just got a little more magical. ✨
        </p>
        <p style={{ fontSize: 13, color: '#B0A0C0', lineHeight: 1.6 }}>
          आपके प्यार के लिए शुक्रिया।<br />शिखा की जादुई स्क्रैपबुक और खास हो गई।
        </p>
        <div style={{ marginTop: 32, fontSize: 13, color: '#C4A8E0' }}>🤫 Remember, it's a surprise!</div>
      </div>
    </main>
  )
}

function Section({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionLabel}>{label}</div>
      {children}
    </div>
  )
}

function Field({ label, error, children }: { label: string, error?: string, children: React.ReactNode }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  )
}

const inp = (error?: string): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
  border: `1.5px solid ${error ? '#E8A0C8' : '#DDD0F0'}`,
  background: '#FDFAFF', color: '#3A1F6E', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
})

const radioCard = (active: boolean): React.CSSProperties => ({
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  gap: 4, padding: '14px 8px', borderRadius: 14, cursor: 'pointer',
  border: `1.5px solid ${active ? '#9B7FD4' : '#DDD0F0'}`,
  background: active ? '#F3EEFF' : '#FDFAFF',
  color: active ? '#6B4FA0' : '#3A1F6E',
  fontSize: 13, fontWeight: 500, transition: 'all 0.15s',
  fontFamily: 'inherit',
})

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #FDF6FF 0%, #F0E8FF 50%, #FFF0F8 100%)',
    padding: '0 0 40px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: { maxWidth: 480, margin: '0 auto', padding: '0 16px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 8px' },
  back: { background: 'none', border: 'none', color: '#9B7FD4', fontSize: 14, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' },
  progress: { height: 4, background: '#EDE0FF', borderRadius: 4, marginBottom: 20, overflow: 'hidden' },
  section: { background: '#FFFFFF', border: '1px solid #EDE0FF', borderRadius: 20, padding: '22px 18px', marginBottom: 14, boxShadow: '0 2px 12px rgba(155,127,212,0.08)' },
  sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', color: '#9B7FD4', marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 14, fontWeight: 500, color: '#3A1F6E', marginBottom: 6, lineHeight: 1.4 },
  hint: { fontSize: 13, color: '#9B7FD4', lineHeight: 1.6, marginBottom: 14 },
  error: { fontSize: 12, color: '#E8609A', marginTop: 4 },
  charCount: { textAlign: 'right', fontSize: 11, color: '#C4A8E0', marginTop: 4 },
  uploadBox: { border: '2px dashed #DDD0F0', borderRadius: 14, height: 160, background: '#FDFAFF', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  submitBtn: { width: '100%', background: 'linear-gradient(135deg, #9B7FD4, #E8A0D0)', color: 'white', border: 'none', borderRadius: 16, padding: '18px', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' },
  submitNote: { textAlign: 'center', fontSize: 12, color: '#C4A8E0', marginTop: 12, lineHeight: 1.6 },
}
