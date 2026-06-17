import React from "react";
import { X } from "lucide-react";

// Konten S&K disamakan 100% dengan halaman utama /terms
const termsContent = [
  {
    title: "1. Ketentuan Umum",
    text: "Dengan mengakses dan menggunakan platform EduBidan, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. EduBidan adalah platform purwarupa (prototype) media edukasi kebidanan berbasis digital untuk keperluan akademik, yang mencakup modul pembelajaran dan kuis evaluasi."
  },
  {
    title: "2. Akun Pengguna",
    text: "Pengguna bertanggung jawab penuh untuk menjaga kerahasiaan informasi akun, termasuk email dan kata sandi. Anda wajib memberikan informasi yang akurat saat mendaftar. Pengelola berhak menangguhkan atau menghapus akun yang terindikasi melakukan penyalahgunaan sistem."
  },
  {
    title: "3. Hak Kekayaan Intelektual",
    text: "Seluruh konten yang tersedia di platform EduBidan, termasuk teks, gambar, grafik, logo, dan ringkasan materi pembelajaran, ditujukan murni untuk keperluan edukasi. Pengguna tidak diperkenankan menyalin, mendistribusikan, atau menggunakan konten tersebut untuk tujuan komersial."
  },
  {
    title: "4. Penggunaan Layanan",
    text: "Pengguna dilarang keras: (a) Menggunakan platform untuk tujuan ilegal; (b) Melakukan tindakan yang dapat merusak, memberatkan, atau mengganggu server dan arsitektur sistem platform; (c) Mengunggah atau menyisipkan kode berbahaya (virus/malware)."
  },
  {
    title: "5. Evaluasi dan Nilai",
    text: "Fitur kuis yang disediakan oleh EduBidan bertujuan sebagai alat evaluasi mandiri bagi mahasiswa. Skor atau pencapaian yang diperoleh di dalam platform ini tidak memiliki nilai hukum dan tidak setara dengan sertifikasi kompetensi resmi dari lembaga pemerintahan maupun institusi pendidikan terkait."
  },
  {
    title: "6. Ketersediaan dan Batasan Tanggung Jawab",
    text: "Mengingat platform ini dikembangkan dalam tahap purwarupa, sistem disediakan 'sebagaimana adanya'. Kami tidak menjamin bahwa layanan akan selalu bebas dari bug, error, atau gangguan teknis (downtime). EduBidan tidak bertanggung jawab atas hilangnya data evaluasi pengguna akibat kendala server."
  },
  {
    title: "7. Perubahan Ketentuan",
    text: "Pengelola berhak mengubah, menambah, atau menghapus bagian dari Syarat dan Ketentuan ini sewaktu-waktu sesuai dengan kebutuhan pengembangan sistem. Penggunaan layanan secara berkelanjutan dianggap sebagai persetujuan atas ketentuan yang telah diperbarui."
  },
  {
    title: "8. Kontak dan Bantuan",
    text: "Jika Anda menemukan kendala teknis atau memiliki pertanyaan lebih lanjut mengenai penggunaan platform EduBidan, silakan hubungi pengembang melalui email di admin@edubidan.id."
  },
];

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function TermsModal({ isOpen, onClose, onAgree }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-3xl border border-border w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">Syarat & Ketentuan</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body dengan Custom Scrollbar Kapsul Elegan */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 
                        [&::-webkit-scrollbar]:w-2 
                        [&::-webkit-scrollbar-track]:bg-transparent 
                        [&::-webkit-scrollbar-thumb]:bg-border 
                        [&::-webkit-scrollbar-thumb]:rounded-full 
                        hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50"
        >
          {termsContent.map((s, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold mb-2 text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        
        {/* Footer Modal */}
        <div className="p-6 border-t border-border flex gap-3 shrink-0 bg-muted/20 rounded-b-3xl">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground text-sm font-semibold transition-colors"
          >
            Tutup
          </button>
          <button 
            onClick={onAgree} 
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-sm font-bold shadow-md shadow-primary/20 transition-all"
          >
            Saya Setuju
          </button>
        </div>

      </div>
    </div>
  );
}