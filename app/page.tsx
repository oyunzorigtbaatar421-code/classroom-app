'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Initialization
const SUPABASE_URL = 'https://mutapsqzpczebbecjchd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_drFdAtF9g6ZpZp-drl2o8A_LOOjf9e0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Announcement {
id: number | string;
date: string;
text: string;
isNew: boolean;
}

interface Feedback {
id: number | string;
name: string;
text: string;
date: string;
}

export default function Home() {
const [activeTab, setActiveTab] = useState('info');
const [isTeacher, setIsTeacher] = useState(false);
const [showLoginModal, setShowLoginModal] = useState(false);
const [loginCode, setLoginCode] = useState('');
const [loginError, setLoginError] = useState(false);

// Custom Alert Modal State
const [alertState, setAlertState] = useState<{
show: boolean;
type: 'success' | 'error';
title: string;
message: string;
}>({ show: false, type: 'success', title: '', message: '' });

// Inputs
const [newInfoText, setNewInfoText] = useState('');
const [feedbackName, setFeedbackName] = useState('');
const [feedbackText, setFeedbackText] = useState('');

// Data States
const [announcements, setAnnouncements] = useState<Announcement[]>([]);
const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
const [loading, setLoading] = useState(true);

// Static Data
const tabs = [
{ id: 'info', name: 'Мэдээлэл', icon: 'fa-bullhorn', color: 'blue' },
{ id: 'duty', name: 'Жижүүр', icon: 'fa-broom', color: 'emerald' },
{ id: 'schedule', name: 'Хичээл', icon: 'fa-calendar-alt', color: 'amber' },
{ id: 'advice', name: 'Зөвлөмж', icon: 'fa-lightbulb', color: 'purple' },
{ id: 'rules', name: 'Дүрэм', icon: 'fa-balance-scale', color: 'rose' },
{ id: 'cabinet', name: 'Кабинет', icon: 'fa-door-open', color: 'teal' },
{ id: 'feedback', name: 'Санал', icon: 'fa-comments', color: 'pink' }
];

const staticDuty = [
{ day: 'Даваа', students: 'Б.Бат, С.Цэцэг', icon: 'fa-sun' },
{ day: 'Мягмар', students: 'Д.Болд, Г.Уянга', icon: 'fa-cloud' },
{ day: 'Лхагва', students: 'Э.Сүх, О.Ану', icon: 'fa-cloud-sun' },
{ day: 'Пүрэв', students: 'Т.Марал, Н.Төгөлдөр', icon: 'fa-wind' },
{ day: 'Баасан', students: 'Б.Анар, С.Мишээл', icon: 'fa-star' },
];

const staticSchedule = [
{ time: '08:00 - 08:40', mon: 'Математик', tue: 'Монгол хэл', wed: 'Биеийн тамир', thu: 'Англи хэл', fri: 'Түүх' },
{ time: '08:45 - 09:25', mon: 'Монгол хэл', tue: 'Математик', wed: 'Мэдээлэл зүй', thu: 'Уран зохиол', fri: 'Газар зүй' },
{ time: '09:30 - 10:10', mon: 'Англи хэл', tue: 'Биологи', wed: 'Математик', thu: 'Хөгжим', fri: 'Дизайн' },
{ time: '10:30 - 11:10', mon: 'Түүх', tue: 'Англи хэл', wed: 'Монгол хэл', thu: 'Математик', fri: 'Биеийн тамир' }
];

const staticAdvice = [
{ title: 'Нойроо сайн авах', desc: 'Өсвөр насны хүүхэд өдөрт 8-10 цаг унтах шаардлагатай байдаг.', icon: 'fa-moon', bg: 'bg-indigo-100', text: 'text-indigo-600' },
{ title: 'Ус сайн уух', desc: 'Өдөрт 1.5-2 литр ус уух нь тархины үйл ажиллагааг сайжруулна.', icon: 'fa-tint', bg: 'bg-cyan-100', text: 'text-cyan-600' },
{ title: 'Цагийн менежмент', desc: 'Гэрийн даалгавраа өдөр бүр тодорхой цагт хийж хэвших нь стрессээс сэргийлнэ.', icon: 'fa-clock', bg: 'bg-orange-100', text: 'text-orange-600' },
{ title: 'Дэлгэцийн цаг', desc: 'Утас, компьютер үзэх хугацаагаа өдөрт 2 цагаас хэтрүүлэхгүй байх.', icon: 'fa-mobile-alt', bg: 'bg-red-100', text: 'text-red-600' }
];

const staticRules = [
'Хичээлдээ цагтаа ирнэ. (07:50-д ангид байх)',
'Бие биенээ хүндэтгэж, зөв боловсон харилцана.',
'Анги болон сургуулийн эд хөрөнгөнд гамтай хандана.',
'Хичээлийн цагаар гар утас ашиглахгүй.',
'Жижүүрийн үүргээ сайн биелүүлж, ангиа цэвэр байлгана.'
];

const staticCabinet = [
{ subject: 'Математик', room: '305 тоот' },
{ subject: 'Монгол хэл', room: '302 тоот' },
{ subject: 'Англи хэл', room: '201 тоот' },
{ subject: 'Мэдээлэл зүй', room: '405 тоот (Лаборатори)' },
{ subject: 'Биеийн тамир', room: 'Спорт заал' },
{ subject: 'Хөгжим', room: '104 тоот' }
];

// Fetch Supabase Data
useEffect(() => {
fetchData();
}, []);

const fetchData = async () => {
setLoading(true);
try {
const { data: infoData } = await supabase
.from('announcements')
.select('*')
.order('created_at', { ascending: false });

  if (infoData && infoData.length > 0) {
    setAnnouncements(infoData.map((item: any) => ({
      id: item.id,
      date: item.date || new Date(item.created_at).toLocaleDateString(),
      text: item.text || item.content,
      isNew: item.is_new ?? false
    })));
  } else {
    setAnnouncements([
      { id: 1, date: '2026.08.20', text: 'Хичээлийн шинэ жилийн нээлт 9 сарын 1-ний 08:00 цагт сургуулийн талбайд болно. Дүрэмт хувцастайгаа ирнэ үү.', isNew: true },
      { id: 2, date: '2026.08.15', text: 'Сургуулийн засвар бүрэн дууссан бөгөөд 7А анги 3 давхарт 305 тоотод хичээллэхээр боллоо.', isNew: false }
    ]);
  }

  const { data: fbData } = await supabase
    .from('feedbacks')
    .select('*')
    .order('created_at', { ascending: false });

  if (fbData && fbData.length > 0) {
    setFeedbacks(fbData.map((item: any) => ({
      id: item.id,
      name: item.name || item.parent_name || 'Нэргүй',
      text: item.text || item.content,
      date: item.date || new Date(item.created_at).toLocaleDateString()
    })));
  } else {
    setFeedbacks([
      { id: 1, name: 'Б.Батын ээж', text: 'Ангийн хурал хэзээ болох вэ? Урьдчилж мэдээлэл өгөөрэй баярлалаа.', date: '2026.08.19' }
    ]);
  }
} catch (e) {
  console.error(e);
} finally {
  setLoading(false);
}


};

const showAlert = (type: 'success' | 'error', title: string, message: string) => {
setAlertState({ show: true, type, title, message });
};

const handleLogin = () => {
if (loginCode === '1918') {
setIsTeacher(true);
setShowLoginModal(false);
setLoginCode('');
setLoginError(false);
showAlert('success', 'Амжилттай', 'Багшийн эрхээр амжилттай нэвтэрлээ.');
} else {
setLoginError(true);
}
};

const addAnnouncement = async () => {
if (!newInfoText.trim()) return;
const today = new Date();
const dateStr = ${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')};

try {
  await supabase.from('announcements').insert([{ text: newInfoText, date: dateStr, is_new: true }]);
  showAlert('success', 'Нэмэгдлээ', 'Шинэ мэдээлэл Supabase өгөгдлийн санд амжилттай нийтлэгдлээ.');
  setNewInfoText('');
  fetchData();
} catch (err) {
  showAlert('error', 'Алдаа', 'Мэдээлэл нэмэхэд алдаа гарлаа.');
}


};

const submitFeedback = async () => {
if (!feedbackText.trim()) {
showAlert('error', 'Алдаа', 'Санал хүсэлтээ бичнэ үү!');
return;
}

const today = new Date();
const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

try {
  await supabase.from('feedbacks').insert([{ name: feedbackName || 'Нэргүй', text: feedbackText, date: dateStr }]);
  showAlert('success', 'Баярлалаа!', 'Таны санал Supabase руу амжилттай илгээгдлээ.');
  setFeedbackName('');
  setFeedbackText('');
  fetchData();
} catch (err) {
  showAlert('error', 'Алдаа', 'Санал илгээхэд алдаа гарлаа.');
}


};

return (

{/* FontAwesome CDN Link Inclusion */}


  {/* Header */}
  <header className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg sticky top-0 z-40">
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-white text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-md">7А</div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">Ангийн Систем</h1>
          <span className="text-xs bg-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-100 flex items-center gap-1 w-max">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Supabase Холбогдсон
          </span>
        </div>
      </div>
      <div>
        {!isTeacher ? (
          <button onClick={() => setShowLoginModal(true)} className="bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 backdrop-blur-sm">
            <i className="fas fa-lock"></i> Багш нэвтрэх
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold"><i class="fas fa-chalkboard-teacher mr-1"></i> Багш</span>
            <button onClick={() => setIsTeacher(false)} className="text-white hover:text-red-200 text-sm underline">Гарах</button>
          </div>
        )}
      </div>
    </div>
  </header>

  {/* Navigation */}
  <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-6">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 ${
            activeTab === tab.id
              ? `bg-${tab.color}-50 border-${tab.color}-300 ring-2 ring-${tab.color}-400 shadow-md`
              : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        >
          <div className={`w-12 h-12 rounded-full bg-${tab.color}-100 text-${tab.color}-500 flex items-center justify-center text-xl`}>
            <i className={`fas ${tab.icon}`}></i>
          </div>
          <span className="text-sm font-bold text-slate-600">{tab.name}</span>
        </button>
      ))}
    </div>

    {/* Tab Content: Info */}
    {activeTab === 'info' && (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg"><i className="fas fa-bullhorn"></i></span> 
          Ангийн Мэдээлэл
        </h2>

        {isTeacher && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-blue-800 mb-3"><i className="fas fa-plus-circle"></i> Шинэ мэдээлэл нэмэх</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newInfoText}
                onChange={(e) => setNewInfoText(e.target.value)}
                className="flex-grow rounded-xl border-blue-300 px-4 py-2 border focus:outline-none"
                placeholder="Энд мэдээллээ бичнэ үү..."
              />
              <button onClick={addAnnouncement} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-2">
                <i className="fas fa-paper-plane"></i> Нийтлэх
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {loading ? (
            <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border">Ачаалж байна...</div>
          ) : announcements.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border">Мэдээлэл байхгүй байна.</div>
          ) : (
            announcements.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex gap-4 hover:shadow-md transition relative overflow-hidden">
                <div className="w-2 h-full bg-blue-500 absolute left-0 top-0"></div>
                <div className="flex-grow pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-400"><i className="far fa-calendar-alt mr-1"></i> {item.date}</span>
                    {item.isNew && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">ШИНЭ</span>}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    )}

    {/* Tab Content: Duty */}
    {activeTab === 'duty' && (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><i className="fas fa-broom"></i></span> 
          Жижүүрийн Хуваарь
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {staticDuty.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-emerald-500 text-center hover:-translate-y-1 transition duration-300">
              <div className="text-emerald-500 text-3xl mb-3"><i className={`fas ${item.icon}`}></i></div>
              <h3 className="font-bold text-slate-800 mb-2">{item.day}</h3>
              <p className="text-sm text-slate-600 font-semibold bg-slate-50 py-2 rounded-lg">{item.students}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Tab Content: Schedule */}
    {activeTab === 'schedule' && (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="bg-amber-100 text-amber-600 p-2 rounded-lg"><i className="fas fa-calendar-alt"></i></span> 
          Хичээлийн Хуваарь
        </h2>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-600">
                  <th className="p-4 font-bold border-b">Цаг</th>
                  <th className="p-4 font-bold border-b text-center">Даваа</th>
                  <th className="p-4 font-bold border-b text-center">Мягмар</th>
                  <th className="p-4 font-bold border-b text-center">Лхагва</th>
                  <th className="p-4 font-bold border-b text-center">Пүрэв</th>
                  <th className="p-4 font-bold border-b text-center">Баасан</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base">
                {staticSchedule.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50">
                    <td className="p-4 font-semibold text-slate-500 whitespace-nowrap">{row.time}</td>
                    <td className="p-3"><div className="p-2 bg-blue-50 rounded-xl text-center font-semibold text-slate-700">{row.mon}</div></td>
                    <td className="p-3"><div className="p-2 bg-emerald-50 rounded-xl text-center font-semibold text-slate-700">{row.tue}</div></td>
                    <td className="p-3"><div className="p-2 bg-amber-50 rounded-xl text-center font-semibold text-slate-700">{row.wed}</div></td>
                    <td className="p-3"><div className="p-2 bg-purple-50 rounded-xl text-center font-semibold text-slate-700">{row.thu}</div></td>
                    <td className="p-3"><div className="p-2 bg-rose-50 rounded-xl text-center font-semibold text-slate-700">{row.fri}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    )}

    {/* Tab Content: Advice */}
    {activeTab === 'advice' && (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="bg-purple-100 text-purple-600 p-2 rounded-lg"><i className="fas fa-lightbulb"></i></span> 
          Хэрэгтэй Зөвлөмжүүд
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staticAdvice.map((item, idx) => (
            <div key={idx} className="flex bg-white rounded-2xl p-5 shadow-sm border border-slate-100 items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center text-2xl flex-shrink-0`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Tab Content: Rules */}
    {activeTab === 'rules' && (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="bg-rose-100 text-rose-600 p-2 rounded-lg"><i className="fas fa-balance-scale"></i></span> 
          Ангийн Дүрэм
        </h2>
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border-t-8 border-rose-500 relative overflow-hidden">
          <div className="relative z-10 grid gap-4">
            {staticRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm">{index + 1}</div>
                <p className="text-slate-700 font-semibold text-sm md:text-base">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Tab Content: Cabinet */}
    {activeTab === 'cabinet' && (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="bg-teal-100 text-teal-600 p-2 rounded-lg"><i className="fas fa-door-open"></i></span> 
          Кабинетийн Хуваарь
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {staticCabinet.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-1 shadow-md">
              <div className="bg-white rounded-xl p-4 h-full flex flex-col items-center justify-center text-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.subject}</span>
                <span className="text-lg font-extrabold text-teal-600"><i className="fas fa-map-marker-alt mr-1"></i> {item.room}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Tab Content: Feedback */}
    {activeTab === 'feedback' && (
      <section>
        <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
          <span className="bg-pink-100 text-pink-600 p-2 rounded-lg"><i className="fas fa-comments"></i></span> 
          Санал Хүсэлт
        </h2>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-pink-100 space-y-3">
          <h3 className="font-bold text-lg text-slate-700">Саналаа үлдээх</h3>
          <input
            type="text"
            value={feedbackName}
            onChange={(e) => setFeedbackName(e.target.value)}
            placeholder="Нэр (Сонголттой)"
            className="w-full rounded-xl border-slate-300 px-4 py-2 border focus:outline-none"
          />
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Санал хүсэлтээ энд бичнэ үү..."
            className="w-full rounded-xl border-slate-300 px-4 py-3 border focus:outline-none"
          ></textarea>
          <button onClick={submitFeedback} className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2">
            <i className="fas fa-paper-plane"></i> Илгээх
          </button>
        </div>

        <h3 className="font-bold text-slate-600 mb-4">Ирүүлсэн саналууд ({feedbacks.length})</h3>
        <div className="grid gap-4">
          {feedbacks.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3 border-b pb-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center"><i className="fas fa-user"></i></div>
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    )}
  </main>

  {/* Login Modal */}
  {showLoginModal && (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400"><i className="fas fa-times"></i></button>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Багшийн нэвтрэх</h3>
        </div>
        <input
          type="password"
          value={loginCode}
          onChange={(e) => setLoginCode(e.target.value)}
          placeholder="Нууц үг оруулах"
          className="w-full rounded-xl border px-4 py-3 border-slate-300 mb-4 text-center text-lg"
        />
        {loginError && <p className="text-red-500 text-sm text-center mb-4">Нууц үг буруу байна!</p>}
        <button onClick={handleLogin} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold">Нэвтрэх</button>
      </div>
    </div>
  )}

  {/* Alert Modal */}
  {alertState.show && (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
        <h3 className="text-xl font-bold mb-2">{alertState.title}</h3>
        <p className="text-slate-600 mb-6">{alertState.message}</p>
        <button onClick={() => setAlertState({ ...alertState, show: false })} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold">Ойлголоо</button>
      </div>
    </div>
  )}
</div>


);
}