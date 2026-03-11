import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, RotateCcw } from 'lucide-react';

export const JobsTab = ({ onboardingData }) => {
  const [jobs, setJobs] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(false);

  const loadJobs = async () => {
    if (jobs || jobsLoading) return;
    setJobsLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTitle: onboardingData?.targetTitle, targetIndustry: onboardingData?.targetIndustry, workType: onboardingData?.workType, salaryRange: onboardingData?.salaryRange, techSkills: onboardingData?.techSkills })
      });
      const data = await res.json();
      setJobs(data.jobs || data);
    } catch {
      setJobs([
        { title: onboardingData?.targetTitle || 'Product Manager', company: 'Innovate Corp', location: onboardingData?.workType === 'Remote' ? 'Remote' : 'New York, NY', salary: onboardingData?.salaryRange || '$80K-$100K', match: 91, tags: ['Leadership', 'Strategy'], posted: '2d ago' },
        { title: 'Senior ' + (onboardingData?.targetTitle || 'Product Manager'), company: 'TechScale Inc', location: 'San Francisco, CA', salary: '$100K-$130K', match: 84, tags: ['Data Analysis', 'Roadmapping'], posted: '1d ago' },
      ]);
    }
    setJobsLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="animate-fadeInUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '32px', marginBottom: '4px' }}>Matched Opportunities</h1>
          <p style={{ color: 'var(--muted)' }}>Handpicked roles that match your profile and target</p>
        </div>
        <button onClick={() => { setJobs(null); loadJobs(); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--plum)', fontSize: '14px', fontWeight: 600 }}>
          <RotateCcw size={16} /> Refresh Matches
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {jobsLoading && [1, 2, 3, 4].map(i => <div key={i} className="card" style={{ height: '200px', background: 'var(--border)', opacity: 0.3 }} />)}
        
        {jobs && jobs.map((job, i) => (
          <div key={i} className="card" style={{ padding: '28px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(56, 161, 105, 0.1)', color: '#38A169', padding: '6px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(56, 161, 105, 0.2)' }}>{job.match}% MATCH</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px', paddingRight: '80px' }}>{job.title}</h3>
            <div style={{ color: 'var(--plum)', fontWeight: 600, fontSize: '15px', marginBottom: '16px' }}>{job.company}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '13px' }}><MapPin size={14} /> {job.location}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '13px' }}><DollarSign size={14} /> {job.salary}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '13px' }}><Calendar size={14} /> {job.posted}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38A169', fontSize: '13px', fontWeight: 600 }}><Briefcase size={14} /> Re-entry Friendly</div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {job.tags.map(t => <span key={t} style={{ padding: '4px 10px', background: 'var(--cream)', borderRadius: '6px', fontSize: '11px', fontWeight: 500, border: '1px solid var(--border)' }}>{t}</span>)}
            </div>

            <button className="btn btn-gold" style={{ width: '100%' }}>View & Apply Role</button>
          </div>
        ))}
      </div>
    </div>
  );
};
