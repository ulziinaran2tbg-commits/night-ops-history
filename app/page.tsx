'use client';

import React, { useState, useEffect } from 'react';
import { students as initialStudents, Student } from '../lib/students';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface Mission {
  id: string;
  title: string;
  desc: string;
  status: 'In Progress' | 'Under Review' | 'Completed';
  comments: Comment[];
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredStudents = students.filter((s) => {
    const matchesGrade = selectedGrade === 'ALL' || s.grade === selectedGrade;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.pin.includes(searchQuery);
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-500">NIGHT OPS HISTORY</h1>
          <p className="text-slate-400 text-sm">Түүхийн хичээлийн сурагчдын систем & CRM</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <section className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            placeholder="Сурагчийн нэр эсвэл ПИН кодоор хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 text-slate-100"
          />
          <div className="flex gap-2 wrap">
            {['ALL', '8A', '8B', '8V', '8G', '8D'].map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                  selectedGrade === grade
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400">
                  <th className="p-4">ID / PIN</th>
                  <th className="p-4">Нэр</th>
                  <th className="p-4">Анги</th>
                  <th className="p-4">Цол (Rank)</th>
                  <th className="p-4">XP</th>
                  <th className="p-4">Үе (Level)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{s.pin}</td>
                    <td className="p-4 font-semibold text-slate-200">{s.name}</td>
                    <td className="p-4 text-amber-400 font-medium">{s.grade}</td>
                    <td className="p-4 text-slate-300">{s.title}</td>
                    <td className="p-4 text-emerald-400 font-mono">{s.xp} XP</td>
                    <td className="p-4 text-slate-300">Lvl {s.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}