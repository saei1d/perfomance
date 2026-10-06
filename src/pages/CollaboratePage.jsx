import { useEffect, useId, useState } from 'react';
import { budgets, projectTypes, sources, studio, timelines } from '../data/site';
import { briefMailto, submitInquiry } from '../lib/inquiry';
import './pages.css';

const INITIAL = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  timeline: '',
  description: '',
  source: '',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Add your name.';
  if (!values.email.trim()) errors.email = 'Add an email so we can reply.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'That email does not look complete.';
  if (!values.projectType) errors.projectType = 'Choose a project type.';
  if (!values.budget) errors.budget = 'Choose a budget range.';
  if (!values.timeline) errors.timeline = 'Choose a timeline.';
  if (values.description.trim().length < 20) {
    errors.description = 'Describe the picture in at least a sentence or two.';
  }
  if (!values.source) errors.source = 'Tell us how you found the studio.';
  return errors;
}

function Field({ id, label, error, hint, children }) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' is-invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children(describedBy)}
      {hint && !error ? (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceGroup({ legend, name, options, value, onChange, error }) {
  const errorId = `${name}-error`;
  return (
    <fieldset id={name} tabIndex={-1} className={`choice-set${error ? ' is-invalid' : ''}`}>
      <legend>{legend}</legend>
      <div className="choice-list">
        {options.map((option) => (
          <label key={option} className="choice">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export default function CollaboratePage() {
  const formId = useId();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [sent, setSent] = useState(null);

  useEffect(() => {
    if (status !== 'success') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [status]);

  const setField = (key) => (event) => {
    const next = event.target.value;
    setValues((current) => ({ ...current, [key]: next }));
    setErrors((current) => {
      if (!current[key]) return current;
      const copy = { ...current };
      delete copy[key];
      return copy;
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      const node = document.getElementById(first) || document.querySelector(`[name="${first}"]`);
      node?.focus();
      return;
    }

    setStatus('loading');
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      projectType: values.projectType,
      budget: values.budget,
      timeline: values.timeline,
      description: values.description.trim(),
      source: values.source,
    };

    try {
      const result = await submitInquiry(payload);
      if (!result?.ok) throw new Error('Submission was not accepted.');
      setSent(payload);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success' && sent) {
    return (
      <article className="page collaborate-page">
        <div className="form-success" role="status">
          <p className="kicker">Brief noted</p>
          <h1 className="page-title">
            Thank you, {sent.name.split(' ')[0]}.
          </h1>
          <p className="page-lede">
            This site does not send mail on its own yet. Open your email with the brief already written, or write to the studio directly.
          </p>
          <div className="footer-actions">
            <a className="btn btn-solid" href={briefMailto(studio.email, sent)}>
              Email this brief
            </a>
            <a className="btn btn-line" href={`mailto:${studio.email}`}>
              {studio.email}
            </a>
          </div>
        </div>
      </article>
    );
  }

  const errorEntries = Object.entries(errors);

  return (
    <article className="page collaborate-page">
      <div className="collab-layout">
        <header className="collab-intro">
          <p className="kicker">Work with us</p>
          <h1 className="page-title">Tell us what you are making.</h1>
          <p className="page-lede">
            Share the picture, the timing, and the range you have in mind. We read it as a brief, not as a formality.
          </p>
          <ol className="next-steps">
            <li>We read what the picture has to do.</li>
            <li>If it fits the studio, we reply by email.</li>
            <li>Then we talk about schedule, approach, and finish.</li>
          </ol>
        </header>

        <form className="brief" id={formId} onSubmit={onSubmit} noValidate>
          {errorEntries.length > 0 ? (
            <div className="form-summary" role="alert">
              <p>The brief needs a few fixes.</p>
              <ul>
                {errorEntries.map(([key, message]) => (
                  <li key={key}>
                    <a href={`#${key}`}>{message}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {status === 'error' ? (
            <p className="form-summary" role="alert">
              The brief could not be saved in this session. Email {studio.email} and we will take it from there.
            </p>
          ) : null}

          <Field id="name" label="Name" error={errors.name}>
            {(describedBy) => (
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={setField('name')}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy}
                required
              />
            )}
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            {(describedBy) => (
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={values.email}
                onChange={setField('email')}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy}
                required
              />
            )}
          </Field>

          <Field id="company" label="Company, if you have one" error={errors.company}>
            {(describedBy) => (
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={setField('company')}
                aria-describedby={describedBy}
              />
            )}
          </Field>

          <Field id="projectType" label="Project type" error={errors.projectType}>
            {(describedBy) => (
              <select
                id="projectType"
                name="projectType"
                value={values.projectType}
                onChange={setField('projectType')}
                aria-invalid={errors.projectType ? true : undefined}
                aria-describedby={describedBy}
                required
              >
                <option value="">Choose a type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <ChoiceGroup
            legend="Budget range"
            name="budget"
            options={budgets}
            value={values.budget}
            error={errors.budget}
            onChange={(option) => {
              setValues((current) => ({ ...current, budget: option }));
              setErrors((current) => {
                if (!current.budget) return current;
                const copy = { ...current };
                delete copy.budget;
                return copy;
              });
            }}
          />

          <ChoiceGroup
            legend="Timeline"
            name="timeline"
            options={timelines}
            value={values.timeline}
            error={errors.timeline}
            onChange={(option) => {
              setValues((current) => ({ ...current, timeline: option }));
              setErrors((current) => {
                if (!current.timeline) return current;
                const copy = { ...current };
                delete copy.timeline;
                return copy;
              });
            }}
          />

          <Field
            id="description"
            label="Project description"
            error={errors.description}
            hint="What the picture is for, and what it has to show."
          >
            {(describedBy) => (
              <textarea
                id="description"
                name="description"
                rows={6}
                value={values.description}
                onChange={setField('description')}
                aria-invalid={errors.description ? true : undefined}
                aria-describedby={describedBy}
                required
              />
            )}
          </Field>

          <Field id="source" label="How you found us" error={errors.source}>
            {(describedBy) => (
              <select
                id="source"
                name="source"
                value={values.source}
                onChange={setField('source')}
                aria-invalid={errors.source ? true : undefined}
                aria-describedby={describedBy}
                required
              >
                <option value="">Choose one</option>
                {sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <button className="btn btn-solid brief-submit" type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
            {status === 'loading' ? 'Saving brief' : 'Submit brief'}
          </button>
        </form>
      </div>
    </article>
  );
}
