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

  // Takvimin başlangıç ayı. CV'de "Fall 2026" yazdığı için Ağustos 2026 alındı; gerçek ayla değiştirin.
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
  // Gelecekte olacak ama henüz gerçekleşmemiş bir şey için  planned: true  ekleyin ("Planned" etiketi çıkar).
  calendar: [
    { date: "2026-08", type: "milestone", title: "Started the dual PhD in Political Science & Social Data Analytics", note: "Penn State, Fall 2026" },
    { date: "2026-08", type: "award", title: "University Graduate Fellowship", note: "Fall 2026" },
    { date: "2027-01", type: "award", title: "Distinguished Graduate Fellowship", note: "Awarded for Spring 2027" }
  ]
};
