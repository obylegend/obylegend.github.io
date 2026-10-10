/*
 * ============================================================
 *  İÇERİK BURADA. Düzenleyeceğiniz tek dosya bu (CV hariç).
 * ============================================================
 *  - Tırnakları ve virgülleri örneklerdeki gibi bırakın.
 *  - Tarihler "YYYY-MM" biçimindedir (örnek: "2026-08").
 *  - Boş bırakılan ("") alanlar sayfada görünmez.
 *  - CV için cv.pdf dosyasını bu klasöre koymanız yeterli.
 */
window.SITE = {
  updated: "October 2026",

  person: {
    name: "Osman Berke Yıldırım",
    title: "PhD Student, Political Science & Social Data Analytics",
    institution: "Penn State",
    // E-posta herkese açık sayfada görüneceği için boş bırakıldı. İstediğiniz adresi yazabilirsiniz.
    email: "",
    // Portre için photo.jpg dosyasını bu klasöre koyun. Dosya yoksa baş harfler görünür.
    photo: "photo.jpg",
    initials: "OBY",
    bio: [
      "I am a first-year PhD student in Political Science and Social Data Analytics at Penn State. I come from Sabancı University, where I completed my MA in Political Science. I also hold a double-major bachelor's degree in Political Science and Computer Science & Engineering.",
      "My research interests include historical political economy, state capacity, and electoral behavior, with a particular focus on long-term institutional persistence."
    ],
    interests: ["Historical political economy", "State capacity", "Electoral behavior", "Institutional persistence"],
    outside: [
      { label: "Outside research", text: "I enjoy playing basketball and trying new foods." },
      { label: "Fun fact", text: "I was the MC for all major events at my high school." }
    ],
    // Url'si boş olan bağlantılar gösterilmez. Google Scholar, ORCID ve LinkedIn adreslerinizi ekleyin.
    links: [
      { label: "GitHub", url: "https://github.com/obylegend" },
      { label: "Google Scholar", url: "" },
      { label: "ORCID", url: "" },
      { label: "LinkedIn", url: "" }
    ],
    // Yayın listesinde kalın yazılacak isim biçimleri.
    authorAliases: ["Osman Berke Yıldırım", "O. B. Yıldırım", "Osman Berke Yildirim"]
  },

  cv: {
    file: "cv.pdf"
  },

  // Takvimin PDF hali. calendar.pdf dosyasını bu klasöre koyarsanız Calendar sayfasında görünür.
  // Dosya yoksa bu bölüm hiç gösterilmez.
  calendarPdf: {
    file: "calendar.pdf"
  },

  // Doktora takvimi: Year 1 bu aydan başlar, her yıl 12 ay sürer, "years" kadar yıl gösterilir.
  // CV'de "Fall 2026 - Expected 2031 June" yazdığı için Ağustos 2026 ve 5 yıl alındı.
  phd: {
    start: "2026-08",
    years: 5
  },

  // type: "journal" | "conference" | "preprint" | "working" | "review" | "thesis" | "other"
  // Tarihi olan her yayın takvimde de görünür. Takvimde istemezseniz  calendar: false  ekleyin.
  publications: [
    {
      title: "Once We Were Brothers: Forced Migration, Agricultural Mismatch, and Electoral Behavior; Evidence from the 1923 Lausanne Population Exchange",
      authors: ["Osman Berke Yıldırım"],
      venue: "MA thesis, Sabancı University",
      date: "2026-04",
      type: "thesis",
      status: "Supervisors: Fatih Serkant Adıgüzel and Mert Moral",
      abstract: "Builds a neighborhood-level dataset of 51,297 Turkish settlements that combines historical population-exchange exposure with agricultural production, geographic, and electoral data. Uses entropy balancing, coarsened exact matching, and difference-in-differences to estimate long-run effects of the 1923 Lausanne Population Exchange, and causal mediation analysis to test whether agricultural production accounts for the political legacy. Finds persistent differences in agricultural production, opposition support, incumbent support, and turnout between historically exchange-exposed and comparable non-exposed settlements.",
      calendar: false
    },
    {
      title: "Administrative Continuity and State Capacity: Quasi-Natural Experiment Example from the Ottoman-Greek Divide",
      authors: ["Osman Berke Yıldırım"],
      venue: "Working paper, Sabancı University",
      date: "2025-04",
      type: "working",
      status: "Draft available upon request",
      abstract: "Investigates whether the 1832 Ottoman–Greek border generated persistent economic disparities across adjacent municipalities. Applies OLS and geographic regression discontinuity models to municipal-level GDP and night-light data, with geographic and infrastructural controls, and identifies slope-based discontinuities suggesting modest positive long-run development patterns on the former Ottoman side.",
      calendar: false
    },
    {
      title: "Foreign Occupation, Local Resistance, and State Capacity: A Subnational Analysis",
      authors: ["Osman Berke Yıldırım"],
      venue: "Working paper",
      date: "2024-04",
      type: "working",
      status: "Supervisor: Adee Weller",
      abstract: "Constructs a geocoded dataset for Turkish districts to study how the Turkish War of Independence shaped fiscal and legal state capacity.",
      calendar: false
    }
  ],

  // type: "paper" | "talk" | "milestone" | "teaching" | "award" | "travel" | "other"
  // Örnek:
  // { date: "2026-10", type: "talk", title: "Başlık", note: "Not" },
  // when: "Spring 2027" yazarsanız ay yerine bu etiket görünür (date yine yılın hangi dönemine düştüğünü belirler).
  // Gelecekte olacak ama henüz gerçekleşmemiş bir şey için  planned: true  ekleyin ("Planned" etiketi çıkar).
  calendar: [
    { date: "2026-08", when: "Fall 2026", type: "milestone", title: "Establish a foundation in coursework and methods", note: "Complete first-year coursework while strengthening statistical and methodological foundations." },
    { date: "2026-09", when: "Fall 2026", type: "paper", title: "PiCP research grant application", note: "Apply for and aim to secure support for ongoing research." },
    { date: "2026-10", when: "Fall 2026", type: "paper", title: "MA thesis revision", note: "Begin revising the Sabancı MA thesis into a journal manuscript." },
    { date: "2027-01", when: "Spring 2027", type: "paper", title: "Foreign occupation project refinement", note: "Strengthen the theoretical framework, identification strategy, and empirical design." },
    { date: "2027-02", when: "Spring 2027", type: "other", title: "GitHub portfolio and sustainable routines", note: "Build a portfolio of reproducible research and personal software projects; establish work-life balance, a regular hobby, and saving and investing habits." },
    { date: "2027-06", when: "Summer 2027", type: "milestone", title: "Written qualifying examination", note: "Prepare for and complete the departmental written qualifying examination." },

    { date: "2027-09", when: "Fall 2027", type: "milestone", title: "Oral qualifying examination", note: "Complete the departmental oral qualifying examination." },
    { date: "2027-10", when: "Fall 2027", type: "other", title: "Comparative politics, causal inference, and SoDA coursework", note: "Prioritize substantive and computational training relevant to the research agenda." },
    { date: "2028-01", when: "Spring 2028", type: "paper", title: "Penn State MA thesis preparation and defense", note: "Finalize the question and framework, review the literature, identify data, establish a feasible design, consult faculty, and aim to defend by Spring 2028." },
    { date: "2028-02", when: "Spring 2028", type: "paper", title: "Peer-reviewed R&R target", note: "Stretch goal: aim for at least one revise-and-resubmit decision; timing depends on editorial and peer-review processes." },
    { date: "2028-03", when: "Spring 2028", type: "travel", title: "Fieldwork, conference presentation, and networks", note: "Pursue feasible fieldwork or archival research, present at a conference, and develop networks in the United States, Europe, and Türkiye." },
    { date: "2028-05", when: "Spring 2028", type: "other", title: "Research collaboration and personal milestones", note: "Support the Sabancı Turkish Politics Lab, seek RA or faculty collaboration opportunities, and purchase a car if financially feasible." },

    { date: "2028-09", when: "Fall 2028", type: "milestone", title: "Complete remaining degree requirements", note: "Finish remaining Political Science and Social Data Analytics coursework and complete the third-year research project." },
    { date: "2029-01", when: "Spring 2029", type: "milestone", title: "Dissertation proposal and oral comprehensive examination", note: "Develop and defend a coherent proposal and prepare for the departmental oral comprehensive examination by Spring 2029." },
    { date: "2029-02", when: "Spring 2029", type: "paper", title: "Top-tier sole-author publication target", note: "Stretch goal: aim to publish one sole-authored top-tier article; outcome depends on peer review and publication timelines." },
    { date: "2029-03", when: "Spring 2029", type: "paper", title: "Revise Penn State MA thesis into a manuscript", note: "Build a journal-ready paper while connecting existing projects to the dissertation's larger theoretical contribution." },
    { date: "2029-05", when: "Spring 2029", type: "other", title: "ABD skills and research portfolio", note: "Use the initial ABD period to deepen advanced methodological and computational skills, expand reproducible projects, and seek complementary research collaborations." },

    { date: "2029-09", when: "Fall 2029", type: "milestone", title: "Dissertation research and coherent publication pipeline", note: "Consolidate projects under a shared theoretical theme and develop at least three publication-ready projects, including an original data paper if feasible." },
    { date: "2030-01", when: "Spring 2030", type: "paper", title: "Dissertation data collection and chapters", note: "Complete major data collection and make substantial progress on empirical analyses and dissertation chapters." },
    { date: "2030-02", when: "Spring 2030", type: "paper", title: "Top-tier publication and active submissions", note: "Aim for one top-tier publication while maintaining submissions and R&Rs; this remains an outcome partly determined by review timelines." },
    { date: "2030-03", when: "Spring 2030", type: "travel", title: "Conferences, networks, and collaborations", note: "Work toward five cumulative conferences, including two overseas conferences in Europe and Türkiye, while pursuing collaborations and funded projects." },
    { date: "2030-04", when: "Spring 2030", type: "teaching", title: "Teaching experience", note: "Explore opportunities to teach independently in comparative politics, political economy, or quantitative methodology." },
    { date: "2030-06", when: "Summer 2030", type: "milestone", title: "Job-market preparation", note: "Select a job-market paper, prepare a CV, research and teaching statements, a teaching portfolio, a professional website, referees, and target lists; identify academic and private-sector paths." },

    { date: "2030-09", when: "Fall 2030", type: "milestone", title: "Dissertation completion and academic job market", note: "Prioritize a defense-ready manuscript and apply strategically to tenure-track positions and postdoctoral fellowships in the United States, Europe, and Türkiye." },
    { date: "2030-10", when: "Fall 2030", type: "other", title: "Private-sector exploration and job-talk learning", note: "Explore data science, computational social science, and applied-research roles; attend at least 15 job talks across academic and industry pathways." },
    { date: "2031-01", when: "Spring 2031", type: "teaching", title: "Independent teaching and professional networks", note: "Pursue instructor-of-record experience if possible and continue building networks through conferences, workshops, and collaborations." },
    { date: "2031-03", when: "Spring 2031", type: "paper", title: "Finish dissertation without pausing the publication pipeline", note: "Continue revising and submitting manuscripts, while protecting dissertation completion from publication delays." },
    { date: "2031-05", when: "Spring/Summer 2031", type: "milestone", title: "Graduation and career transition", note: "Defend and submit the dissertation as early as possible; pursue a tenure-track, postdoctoral, or research-oriented private-sector role and build financial reserves for relocation." },
    { date: "2031-06", when: "Summer 2031", type: "other", title: "Independent research agenda", note: "Develop dissertation chapters into articles and establish a longer-term research program beyond the PhD." }
  ]
};
