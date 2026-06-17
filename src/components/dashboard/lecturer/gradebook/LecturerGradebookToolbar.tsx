import { Download, Search } from "lucide-react";

import type { LecturerGradebookRow } from "@/data/learning/lecturer/lecturer-gradebook";

interface LecturerGradebookToolbarProps {
  search: string;
  quizzes: string[];
  rows: LecturerGradebookRow[];
  onSearchChange: (value: string) => void;
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

function formatScore(score: number | null) {
  if (typeof score !== "number") {
    return "-";
  }

  return score.toFixed(1);
}

function downloadGradebookExcel(params: {
  quizzes: string[];
  rows: LecturerGradebookRow[];
}) {
  const { quizzes, rows } = params;

  const quizHeaders = quizzes
    .map((quiz, index) => `<th>Kuis ${index + 1}: ${escapeHtml(quiz)}</th>`)
    .join("");

  const bodyRows = rows
    .map((row, index) => {
      const scoreCells = row.scores
        .map((score) => `<td class="number">${formatScore(score)}</td>`)
        .join("");

      return `
        <tr>
          <td class="number">${index + 1}</td>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.nim)}</td>
          ${scoreCells}
          <td class="number average">${row.average.toFixed(1)}</td>
        </tr>
      `;
    })
    .join("");

  const worksheet = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Buku Nilai</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table {
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }

          th {
            background-color: #0f766e;
            color: #ffffff;
            font-weight: bold;
            text-align: left;
          }

          th, td {
            border: 1px solid #d1d5db;
            padding: 8px;
          }

          .number {
            text-align: center;
          }

          .average {
            font-weight: bold;
            background-color: #ecfdf5;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Mahasiswa</th>
              <th>NIM</th>
              ${quizHeaders}
              <th>Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            ${
              bodyRows ||
              `
                <tr>
                  <td colspan="${quizzes.length + 4}" class="number">
                    Tidak ada data nilai.
                  </td>
                </tr>
              `
            }
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([worksheet], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = sanitizeFileName(`buku-nilai-${timestamp}`) || "buku-nilai";

  anchor.href = url;
  anchor.download = `${fileName}.xls`;
  anchor.click();

  URL.revokeObjectURL(url);
}

export function LecturerGradebookToolbar({
  search,
  quizzes,
  rows,
  onSearchChange,
}: LecturerGradebookToolbarProps) {
  const hasRows = rows.length > 0;

  return (
    <div className="p-4 sm:p-5 border-b border-border flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-muted/10">
      <div className="flex-1 w-full relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Cari nama mahasiswa atau NIM..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
        />
      </div>

      <button
        type="button"
        disabled={!hasRows}
        onClick={() =>
          downloadGradebookExcel({
            quizzes,
            rows,
          })
        }
        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Ekspor Excel</span>
        <span className="sm:hidden">Ekspor</span>
      </button>
    </div>
  );
}