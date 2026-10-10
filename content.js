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
    title: "Graduate Student, Department of Political Science",
    institution: "Penn State",
    // E-posta herkese açık sayfada görüneceği için boş bırakıldı. İstediğiniz adresi yazabilirsiniz.
    email: "",
    // Portre için photo.jpg dosyasını bu klasöre koyun. Dosya yoksa baş harfler görünür.
    photo: "photo.jpg",
    initials: "OBY",
    bio: [
      "Osman Berke Yıldırım is a first-year graduate student in Political Science at Penn State. He comes from Sabancı University, where he completed his MA in Political Science. He also holds a bachelor's degree in Political Science and Computer Science & Engineering.",
      "His research interests include historical political economy, state capacity, and electoral behavior, with a particular focus on long-term institutional persistence."
    ],
    interests: ["Historical political economy", "State capacity", "Electoral behavior", "Institutional persistence"],
    outside: [
      { label: "Outside research", text: "Playing basketball and trying new foods." },
      { label: "Fun fact", text: "He was the MC for all major events at his high school." }
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

  // Takvimin sayıldığı başlangıç ayı. Gerçek başlangıç ayınızla değiştirin.
  phd: {
    start: "2026-08",
    years: 5
  },

  // type: "journal" | "conference" | "preprint" | "review" | "thesis" | "other"
  // Tarihi olan her yayın takvimde de görünür. Takvimde istemezseniz  calendar: false  ekleyin.
  publications: [],

  // type: "paper" | "talk" | "milestone" | "teaching" | "award" | "travel" | "other"
  // Örnek:
  // { date: "2026-10", type: "talk", title: "Başlık", note: "Not" },
  calendar: []
};
