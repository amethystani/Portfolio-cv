import { portfolio } from './portfolio';
export type JobSection = { heading: string; items: string[] };

export type Job = {
  slug: string;
  title: string;
  /** One-line description shown in the roles list. */
  summary: string;
  /** Shown as a tag in the roles list, e.g. "Full time". */
  employment: string;
  location: string;
  /** Small line above the title on the job page, e.g. "Full time, Remote". */
  eyebrow: string;
  /** Intro paragraphs under the title. */
  intro: string[];
  sections: JobSection[];
  /** Subject line of the application email. */
  subject: string;
};

export const jobs: Job[] = [
  {
    slug: 'acl-research-volunteer-coordinator',
    title: 'Research Volunteer Coordinator, Association for Computational Linguistics',
    summary: 'Volunteer coordinator at the ACL, from September 2026.',
    employment: 'Volunteer',
    location: 'Remote',
    eyebrow: 'Volunteer, September 2026 to present',
    intro: [
      'Research Volunteer Coordinator at the Association for Computational Linguistics, in the science and technology cause area.',
    ],
    sections: [
      {
        heading: 'Context',
        items: [
          'Volunteering role, September 2026 to present.',
          'The Association for Computational Linguistics is the professional society behind ACL, EMNLP and the other venues where this work is presented.',
        ],
      },
    ],
    subject: 'Research Volunteer Coordinator, Association for Computational Linguistics',
  },
  {
    slug: 'nous-research-contributor',
    title: 'Contributor, Nous Research',
    summary: 'Open-source contributions to agent tooling and RL training infrastructure.',
    employment: 'Open source',
    location: 'New York',
    eyebrow: 'Contributor, October 2025 to April 2026, New York',
    intro: [
      'Contributed to the open-source stack at Nous Research for seven months, mostly around agent tooling and RL training infrastructure, in a fast-moving codebase built by one of the more interesting open AI labs.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          'Worked on the agent CLI: authentication flows, gateway logic, and how the agent handles tools and sessions.',
          'Bug fixes and small features across the rest of the stack.',
          'Agent tooling and RL training infrastructure.',
        ],
      },
    ],
    subject: 'Contributor, Nous Research',
  },
  {
    slug: 'measurement-validity-of-hidden-bias-audits',
    title: 'Measurement Validity of Hidden-Bias Audits',
    summary: 'Partial identification and calibrated instrument verification for LLM fairness evaluation.',
    employment: 'Research project',
    location: 'Greater Noida, India',
    eyebrow: 'Research project, 2026',
    intro: [
      'Partial identification and calibrated instrument verification for LLM fairness evaluation. Manuscript in preparation. Advisor: Dr. Sonia Khetarpaul, Dept. of Computer Science and Engineering, Shiv Nadar Institution of Eminence.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          'Audited a cross-model gender-bias debiasing framework and found its headline metric maximised by degenerate, uninformative response policies; replaced it with a signed bias-gap statistic and Manski-style partial-identification bounds.',
          "Showed that when an evaluation permits non-response, the identified interval for a model's stereotype rate has width exactly equal to the non-response rate, independent of sample size.",
          'Reanalysed 96 published method-model results on BBQ and UNQOVER and found that a majority of reported bias-score reductions came from increased abstention rather than a change in committed-answer behaviour.',
          'Designed and synthetically verified a calibration framework, a cross-instrument compatibility certificate with an identified blind spot for shared measurement error, for auditing whether bias-elicitation methods reveal or rewrite model decisions.',
        ],
      },
    ],
    subject: 'Measurement Validity of Hidden-Bias Audits',
  },
  {
    slug: 'implicit-control-plane-gpu-kernels',
    title: 'The Implicit Control Plane',
    summary: 'Scheduling warp-specialised persistent GPU kernels as concurrent systems.',
    employment: 'Research project',
    location: 'Greater Noida, India',
    eyebrow: 'Research project, 2026',
    intro: [
      'Scheduling warp-specialised persistent kernels as concurrent systems. Manuscript in preparation. Advisor: Dr. Sheel Sindhu Manohar, Dept. of Computer Science and Engineering, Shiv Nadar Institution of Eminence.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          'Formalised warp-specialised persistent GPU kernels (Hopper/Blackwell MLA, FlashAttention-3, persistent GEMM) as timed marked graphs.',
          'Derived a closed-form steady-state initiation interval via maximum cycle mean, predicting measured per-tile latency to 1.2% mean error with no per-configuration fitting.',
          'Identified the per-SM TMA copy engine as an unarbitrated shared resource causing 21% inter-CTA lifetime dispersion, and designed PhaseSkew, a zero-cost deterministic scheduling fix.',
        ],
      },
    ],
    subject: 'The Implicit Control Plane',
  },
  {
    slug: 'post-decapsulation-leakage-ml-kem',
    title: 'Post-Decapsulation Leakage in ML-KEM',
    summary: 'Measurement, learned exploitation and countermeasures on the reference implementation.',
    employment: 'Research project',
    location: 'Greater Noida, India',
    eyebrow: 'Research project, 2025 to 2026',
    intro: [
      'Post-decapsulation leakage in ML-KEM deployments: measurement, learned exploitation and countermeasure evaluation on the reference implementation. Advisor: Dr. Rajib Mall, Dept. of Computer Science and Engineering, Shiv Nadar Institution of Eminence.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          'Characterised native ML-KEM (CRYSTALS-Kyber, FIPS 203) decapsulation timing across all three standardised parameter sets, finding no exploitable leak.',
          'Formalised and measured post-decapsulation leakage across nine consumption routines via timing and Prime+Probe cache analysis.',
          'Evaluated three countermeasures; constant-time consumption and blinded comparison reduce recovery to chance at roughly 2x runtime cost.',
        ],
      },
    ],
    subject: 'Post-Decapsulation Leakage in ML-KEM',
  },
  {
    slug: 'clerktree-co-founder',
    title: 'Co-Founder, Tech at ClerkTree',
    summary: 'Governed machine-intelligence systems for industrial operations; led development of Machina.',
    employment: 'Self-employed',
    location: 'Straubing, Germany',
    eyebrow: 'Co-founder, February to December 2025, Straubing, Bavaria (hybrid)',
    intro: [
      'Co-founded ClerkTree with Shobhit Mishra and Kenshin Park, building governed machine-intelligence systems for industrial operations. Supported by Snowflake, PostHog and Amplitude.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          'Led development of Machina, an open model family for mechatronics monitoring: bearing-fault classification, remaining-useful-life estimation, quality-inspection vision models and a diagnostic reasoning agent.',
          'Built for edge deployment (on-prem and air-gapped) so manufacturers can monitor equipment locally without sending sensitive operational data off-site.',
        ],
      },
    ],
    subject: 'Co-Founder, Tech at ClerkTree',
  },
  {
    slug: 'complexity-science-hub-student-researcher',
    title: 'Student Researcher, Complexity Science Hub',
    summary: 'Auditing gender-bias debiasing frameworks for LLMs.',
    employment: 'Part-time',
    location: 'Vienna, Austria',
    eyebrow: 'Student researcher, May to September 2025, Vienna (remote)',
    intro: [
      'Part-time research on auditing gender-bias debiasing frameworks for LLMs at the Complexity Science Hub.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          "Found that the standard metric these frameworks are evaluated on can be gamed by responding less: refusing to answer looked like debiasing even when the model's actual bias had not changed.",
          "Replaced it with partial-identification bounds instead of point estimates, and showed that under evaluations that allow non-response the uncertainty interval for a model's bias rate is exactly as wide as its non-response rate, however much data there is.",
          'Reanalysed 96 published results across two standard bias benchmarks and found most reported improvements came from models answering less, not from being less biased.',
        ],
      },
    ],
    subject: 'Student Researcher, Complexity Science Hub',
  },
  {
    slug: 'consultadd-quantitative-research-analyst',
    title: 'Quantitative Research Analyst, Consultadd',
    summary: 'Forecasting consultant demand and role saturation for US staffing operations.',
    employment: 'Internship',
    location: 'New York',
    eyebrow: 'Internship, June to August 2025, New York',
    intro: ['Quantitative research analyst intern at Consultadd Inc.'],
    sections: [
      {
        heading: 'What I did',
        items: [
          "Designed and deployed forecasting infrastructure to predict consultant demand and role saturation for ConsultAdd's US-facing staffing operations.",
          'Worked cross-functionally with the business team; forecasts directly informed staffing and resource-allocation decisions across live client accounts.',
          'Improved forecast accuracy by roughly 8% over the existing baseline.',
        ],
      },
    ],
    subject: 'Quantitative Research Analyst, Consultadd',
  },
  {
    slug: 'hfcl-dct-research-and-development',
    title: 'DCT-R&D, HFCL Limited',
    summary: 'An LLM-powered command center for EV charging strategy at Exicom.',
    employment: 'Internship',
    location: 'Gurugram, India',
    eyebrow: 'Internship, September to December 2024, Gurugram (hybrid)',
    intro: [
      'Research and development internship at HFCL Limited, building for Exicom, an HFCL-affiliated EV charging and energy solutions company.',
    ],
    sections: [
      {
        heading: 'What I did',
        items: [
          'Built an LLM-powered internal command center for EV charging strategy, combining a conversational assistant with time-series forecasting models for shifts in charging demand and adoption.',
          'Wired it into live data pipelines, including real-time news ingestion, to power site-selection decisions for new chargers and competitive intelligence.',
          'Added a closed-loop feedback system so the assistant kept learning from real usage.',
        ],
      },
    ],
    subject: 'DCT-R&D, HFCL Limited',
  },
];

/** Topics listed in the "Get in touch" block (identical on every page). */
export const applicationChecklist: string[] = [
  'NLP and ML evaluation',
  'Scientific AI and retrieval-augmented generation',
  'Research roles ahead of a PhD',
];

export const recruitingEmail = portfolio.email;
