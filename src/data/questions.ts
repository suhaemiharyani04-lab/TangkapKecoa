import { Question } from '../types/quiz';

export const OFFICIAL_PUISI_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Puisi adalah karya sastra yang mengungkapkan ....",
    options: [
      { id: 'A', text: "laporan hasil pengamatan secara objektif" },
      { id: 'B', text: "pikiran, perasaan, pengalaman, atau imajinasi melalui bahasa yang padat dan bermakna" },
      { id: 'C', text: "langkah-langkah melakukan suatu kegiatan" },
      { id: 'D', text: "informasi berdasarkan urutan waktu" }
    ],
    correctAnswer: 'B',
    explanation: "Puisi mengungkapkan pikiran, perasaan, pengalaman, atau imajinasi melalui bahasa yang padat, indah, dan bermakna.",
    topic: "Pengertian Puisi"
  },
  {
    id: 2,
    question: "Salah satu ciri puisi adalah bahasa yang padat. Maksud pernyataan tersebut ialah ....",
    options: [
      { id: 'A', text: "menggunakan kata sebanyak-banyaknya" },
      { id: 'B', text: "selalu memakai bahasa sehari-hari tanpa makna kias" },
      { id: 'C', text: "menggunakan kata secara hemat, tetapi memiliki makna" },
      { id: 'D', text: "seluruh larik harus memiliki jumlah kata yang sama" }
    ],
    correctAnswer: 'C',
    explanation: "Bahasa padat berarti menggunakan kata secara hemat, tetapi tetap bermakna.",
    topic: "Ciri Bahasa Puisi"
  },
  {
    id: 3,
    question: "Unsur fisik puisi yang berarti pilihan kata yang digunakan penyair disebut ....",
    options: [
      { id: 'A', text: "diksi" },
      { id: 'B', text: "tema" },
      { id: 'C', text: "amanat" },
      { id: 'D', text: "nada" }
    ],
    correctAnswer: 'A',
    explanation: "Diksi adalah pilihan kata yang digunakan penyair untuk menciptakan keindahan dan makna mendalam.",
    topic: "Unsur Fisik Puisi"
  },
  {
    id: 4,
    context: "Perhatikan larik: \"Angin berbisik di telingaku.\"",
    question: "Majas yang digunakan pada larik tersebut adalah ....",
    options: [
      { id: 'A', text: "metafora" },
      { id: 'B', text: "hiperbola" },
      { id: 'C', text: "simile" },
      { id: 'D', text: "personifikasi" }
    ],
    correctAnswer: 'D',
    explanation: "Personifikasi menggambarkan benda mati atau alam seolah-olah memiliki sifat atau tindakan manusia (seperti berbisik).",
    topic: "Majas dalam Puisi"
  },
  {
    id: 5,
    question: "Kata \"embun\", \"lonceng\", dan \"pasir\" dalam puisi dapat digolongkan sebagai ....",
    options: [
      { id: 'A', text: "kata abstrak" },
      { id: 'B', text: "kata konkret" },
      { id: 'C', text: "kata penghubung" },
      { id: 'D', text: "kata tugas" }
    ],
    correctAnswer: 'B',
    explanation: "Kata konkret membuat sesuatu terasa nyata atau mudah dibayangkan serta dapat ditangkap oleh indra.",
    topic: "Unsur Fisik (Kata Konkret)"
  },
  {
    id: 6,
    question: "Kata atau ungkapan yang membangkitkan pengalaman indrawi pembaca disebut ....",
    options: [
      { id: 'A', text: "tipografi" },
      { id: 'B', text: "amanat" },
      { id: 'C', text: "imaji atau citraan" },
      { id: 'D', text: "tema" }
    ],
    correctAnswer: 'C',
    explanation: "Imaji/citraan membangkitkan pengalaman indrawi, seperti penglihatan, pendengaran, penciuman, dan perabaan.",
    topic: "Citraan / Imaji Puisi"
  },
  {
    id: 7,
    question: "Unsur batin puisi yang menunjukkan gagasan utama atau pokok pembicaraan disebut ....",
    options: [
      { id: 'A', text: "tema" },
      { id: 'B', text: "rima" },
      { id: 'C', text: "diksi" },
      { id: 'D', text: "tipografi" }
    ],
    correctAnswer: 'A',
    explanation: "Tema merupakan gagasan utama atau pokok pembicaraan yang menjadi dasar diciptakannya sebuah puisi.",
    topic: "Unsur Batin (Tema)"
  },
  {
    id: 8,
    question: "Sikap atau perasaan penyair terhadap hal yang dibicarakan dalam puisi disebut ....",
    options: [
      { id: 'A', text: "nada" },
      { id: 'B', text: "rasa" },
      { id: 'C', text: "rima" },
      { id: 'D', text: "tipografi" }
    ],
    correctAnswer: 'B',
    explanation: "Rasa adalah sikap atau perasaan penyair terhadap hal yang dibicarakan dalam karyanya.",
    topic: "Unsur Batin (Rasa)"
  },
  {
    id: 9,
    context: "Perhatikan larik: \"Di dalam tas tersimpan harapan / Di balik mata, mimpi mulai dinyalakan.\"",
    question: "Tema yang paling sesuai adalah ....",
    options: [
      { id: 'A', text: "kesedihan karena kehilangan" },
      { id: 'B', keindahan: "keindahan suasana pantai" } as any,
      { id: 'C', text: "semangat belajar dan meraih masa depan" },
      { id: 'D', text: "kerinduan terhadap kampung halaman" }
    ].map(opt => ('keindahan' in opt ? { id: 'B' as const, text: "keindahan suasana pantai" } : opt)),
    correctAnswer: 'C',
    explanation: "Kata \"harapan\" dan \"mimpi\" menunjukkan semangat belajar serta orientasi masa depan yang cerah.",
    topic: "Penafsiran Makna & Tema"
  },
  {
    id: 10,
    question: "Mengapa puisi perlu dibaca dengan memperhatikan jeda dan intonasi?",
    options: [
      { id: 'A', text: "Agar jumlah bait bertambah" },
      { id: 'B', text: "Agar semua kata terdengar sama" },
      { id: 'C', text: "Agar puisi berubah menjadi prosa" },
      { id: 'D', text: "Agar suasana, irama, penekanan, dan makna puisi tersampaikan dengan baik" }
    ],
    correctAnswer: 'D',
    explanation: "Jeda dan intonasi membantu menyampaikan suasana, irama, penekanan, dan makna puisi kepada para pendengar.",
    topic: "Pembacaan & Penghayatan Puisi"
  }
];

export const WEAPONS_LIST = [
  {
    id: 'sandal' as const,
    name: 'Sandal Jepit Hijau',
    alias: 'Swallow Legendaris',
    icon: '🩴',
    description: 'Senjata legendaris Nusantara! Suara tamparan keras mematikan.',
    soundType: 'slap' as const,
    splatColor: '#22c55e',
    hitEffect: 'PLAKKK!'
  },
  {
    id: 'koran' as const,
    name: 'Koran Gulung',
    alias: 'Pikiran Rakyat Bergulung',
    icon: '🗞️',
    description: 'Ringan, cepat, dan ramah lingkungan dengan hantaman telak.',
    soundType: 'thud' as const,
    splatColor: '#cbd5e1',
    hitEffect: 'BUKKK!'
  },
  {
    id: 'raket' as const,
    name: 'Raket Nyamuk Listrik',
    alias: 'Voltase 3000V',
    icon: '⚡',
    description: 'Dilengkapi percikan bunga api listrik biru yang mengejutkan.',
    soundType: 'zap' as const,
    splatColor: '#38bdf8',
    hitEffect: 'ZZZTTT!'
  },
  {
    id: 'semprotan' as const,
    name: 'Semprotan Aerosol',
    alias: 'Pembasmi Toksik Kecoak',
    icon: '🧴',
    description: 'Semburan kabut wangi mematikan yang melumpuhkan kecoak bandel.',
    soundType: 'spray' as const,
    splatColor: '#a855f7',
    hitEffect: 'PSSSHHH!'
  },
  {
    id: 'sapu' as const,
    name: 'Sapu Lidi Sakti',
    alias: 'Penyapu Lantai SMP',
    icon: '🧹',
    description: 'Jangkauan sapuan luas yang membuat kecoak terpental tak berdaya.',
    soundType: 'sweep' as const,
    splatColor: '#eab308',
    hitEffect: 'SRAKKK!'
  }
];
