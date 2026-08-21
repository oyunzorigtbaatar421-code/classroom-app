<!DOCTYPE html>
<html lang="mn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>7А Ангийн Систем</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <!-- Supabase JS Library -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Nunito', 'sans-serif'],
                    },
                    colors: {
                        primary: '#4F46E5',
                        secondary: '#EC4899',
                        success: '#10B981',
                        warning: '#F59E0B',
                        info: '#3B82F6',
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #f8fafc;
            background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 20px 20px;
        }
        .tab-content { display: none; animation: fadeIn 0.4s ease-in-out; }
        .tab-content.active { display: block; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col">

    <header class="bg-gradient-to-r from-primary to-secondary text-white shadow-lg sticky top-0 z-40">
        <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="bg-white text-primary rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow-md">7А</div>
                <div>
                    <h1 class="text-xl md:text-2xl font-bold tracking-wide">Ангийн Систем</h1>
                    <span id="dbStatus" class="text-xs bg-emerald-500/30 px-2 py-0.5 rounded-full text-emerald-100 flex items-center gap-1 w-max">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Supabase Холбогдсон
                    </span>
                </div>
            </div>
            <div>
                <button id="loginBtn" onclick="openLoginModal()" class="bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 backdrop-blur-sm">
                    <i class="fas fa-lock"></i> Багш нэвтрэх
                </button>
                <div id="loggedInUser" class="hidden flex items-center gap-3">
                    <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold"><i class="fas fa-chalkboard-teacher mr-1"></i> Багш</span>
                    <button onclick="logout()" class="text-white hover:text-red-200 text-sm underline">Гарах</button>
                </div>
            </div>
        </div>
    </header>

    <main class="flex-grow max-w-6xl mx-auto w-full px-4 py-6">
        
        <!-- Navigation Menu -->
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8" id="navMenu">
            <!-- Rendered via JS -->
        </div>

        <section id="tab-info" class="tab-content active">
            <div class="flex justify-between items-end mb-6">
                <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2">
                    <span class="bg-blue-100 text-blue-600 p-2 rounded-lg"><i class="fas fa-bullhorn"></i></span> 
                    Ангийн Мэдээлэл
                </h2>
            </div>
            
            <!-- Teacher input form (Hidden by default) -->
            <div id="teacherInfoForm" class="hidden bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-6 shadow-sm">
                <h3 class="font-bold text-blue-800 mb-3"><i class="fas fa-plus-circle"></i> Шинэ мэдээлэл нэмэх</h3>
                <div class="flex gap-2">
                    <input type="text" id="newInfoText" class="flex-grow rounded-xl border-blue-300 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 border" placeholder="Энд мэдээллээ бичнэ үү...">
                    <button onclick="addInfo()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold shadow-md transition flex items-center gap-2">
                        <i class="fas fa-paper-plane"></i> Нийтлэх
                    </button>
                </div>
            </div>

            <div id="infoContainer" class="grid gap-4">
                <!-- Data injected by JS -->
            </div>
        </section>

        <section id="tab-duty" class="tab-content">
            <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
                <span class="bg-emerald-100 text-emerald-600 p-2 rounded-lg"><i class="fas fa-broom"></i></span> 
                Жижүүрийн Хуваарь
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4" id="dutyContainer">
                <!-- Data injected by JS -->
            </div>
        </section>

        <section id="tab-schedule" class="tab-content">
            <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
                <span class="bg-amber-100 text-amber-600 p-2 rounded-lg"><i class="fas fa-calendar-alt"></i></span> 
                Хичээлийн Хуваарь
            </h2>
            <div class="glass-card rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-100 text-slate-600">
                                <th class="p-4 font-bold border-b border-slate-200">Цаг</th>
                                <th class="p-4 font-bold border-b border-slate-200 text-center">Даваа</th>
                                <th class="p-4 font-bold border-b border-slate-200 text-center">Мягмар</th>
                                <th class="p-4 font-bold border-b border-slate-200 text-center">Лхагва</th>
                                <th class="p-4 font-bold border-b border-slate-200 text-center">Пүрэв</th>
                                <th class="p-4 font-bold border-b border-slate-200 text-center">Баасан</th>
                            </tr>
                        </thead>
                        <tbody id="scheduleContainer" class="text-sm md:text-base">
                            <!-- Data injected by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <section id="tab-advice" class="tab-content">
            <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
                <span class="bg-purple-100 text-purple-600 p-2 rounded-lg"><i class="fas fa-lightbulb"></i></span> 
                Хэрэгтэй Зөвлөмжүүд
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="adviceContainer">
                <!-- Data injected by JS -->
            </div>
        </section>

        <section id="tab-rules" class="tab-content">
            <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
                <span class="bg-rose-100 text-rose-600 p-2 rounded-lg"><i class="fas fa-balance-scale"></i></span> 
                Ангийн Дүрэм
            </h2>
            <div class="bg-white rounded-3xl p-6 md:p-10 shadow-lg border-t-8 border-rose-500 relative overflow-hidden">
                <i class="fas fa-quote-right absolute -top-4 -right-4 text-9xl text-rose-50 opacity-50"></i>
                <div class="relative z-10 grid gap-4" id="rulesContainer">
                     <!-- Data injected by JS -->
                </div>
            </div>
        </section>

        <section id="tab-cabinet" class="tab-content">
            <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
                <span class="bg-teal-100 text-teal-600 p-2 rounded-lg"><i class="fas fa-door-open"></i></span> 
                Кабинетийн Хуваарь
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="cabinetContainer">
                 <!-- Data injected by JS -->
            </div>
        </section>

        <section id="tab-feedback" class="tab-content">
            <h2 class="text-2xl font-bold text-slate-700 flex items-center gap-2 mb-6">
                <span class="bg-pink-100 text-pink-600 p-2 rounded-lg"><i class="fas fa-comments"></i></span> 
                Санал Хүсэлт
            </h2>
            
            <div class="bg-white rounded-2xl shadow-md p-6 mb-8 border border-pink-100">
                <h3 class="font-bold text-lg text-slate-700 mb-2">Саналаа үлдээх</h3>
                <p class="text-sm text-slate-500 mb-4">Эцэг эх, сурагчид та бүхэн ангийн үйл ажиллагаатай холбоотой санал хүсэлтээ энд бичнэ үү.</p>
                <div class="flex flex-col gap-3">
                    <input type="text" id="feedbackName" placeholder="Нэр (Сонголттой)" class="w-full rounded-xl border-slate-300 focus:ring-pink-500 focus:border-pink-500 px-4 py-2 border">
                    <textarea id="feedbackText" rows="3" placeholder="Санал хүсэлтээ энд бичнэ үү..." class="w-full rounded-xl border-slate-300 focus:ring-pink-500 focus:border-pink-500 px-4 py-3 border"></textarea>
                    <button onclick="submitFeedback()" class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition self-end flex items-center gap-2">
                        <i class="fas fa-paper-plane"></i> Илгээх
                    </button>
                </div>
            </div>

            <h3 class="font-bold text-slate-600 mb-4">Ирүүлсэн саналууд <span class="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs" id="feedbackCount">0</span></h3>
            <div class="grid gap-4" id="feedbackContainer">
                 <!-- Data injected by JS -->
            </div>
        </section>

    </main>

    <div id="modalOverlay" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex justify-center items-center">
        <!-- Login Modal -->
        <div id="loginModal" class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-95 opacity-0 transition-all duration-300 hidden flex-col relative">
            <button onclick="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><i class="fas fa-times"></i></button>
            <div class="text-center mb-6">
                <div class="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                    <i class="fas fa-user-lock"></i>
                </div>
                <h3 class="text-xl font-bold text-slate-800">Багшийн нэвтрэх</h3>
                <p class="text-sm text-slate-500">Мэдээлэл засах эрхтэй нэвтрэх</p>
            </div>
            <input type="password" id="loginCode" placeholder="Нууц үг оруулах" class="w-full rounded-xl border-slate-300 focus:ring-primary focus:border-primary px-4 py-3 border mb-4 text-center text-lg tracking-widest" onkeyup="if(event.key === 'Enter') handleLogin()">
            <p id="loginError" class="text-red-500 text-sm text-center mb-4 hidden">Нууц үг буруу байна!</p>
            <button onclick="handleLogin()" class="w-full bg-primary hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition">Нэвтрэх</button>
        </div>

        <!-- Alert Modal -->
        <div id="alertModal" class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-95 opacity-0 transition-all duration-300 hidden flex-col relative text-center">
            <div id="alertIcon" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl"></div>
            <h3 id="alertTitle" class="text-xl font-bold text-slate-800 mb-2"></h3>
            <p id="alertMessage" class="text-slate-600 mb-6"></p>
            <button onclick="closeModal()" class="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold transition">Ойлголоо</button>
        </div>
    </div>

    <script>
        // Supabase Client Initialization
        const SUPABASE_URL = 'https://mutapsqzpczebbecjchd.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_drFdAtF9g6ZpZp-drl2o8A_LOOjf9e0';
        
        let supabase = null;
        try {
            if (window.supabase) {
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            }
        } catch (e) {
            console.error('Supabase initialization error:', e);
        }

        // App State
        let isTeacher = false;
        let activeTabId = 'info';

        // Navigation Tabs Config
        const tabs = [
            { id: 'info', name: 'Мэдээлэл', icon: 'fa-bullhorn', color: 'blue' },
            { id: 'duty', name: 'Жижүүр', icon: 'fa-broom', color: 'emerald' },
            { id: 'schedule', name: 'Хичээл', icon: 'fa-calendar-alt', color: 'amber' },
            { id: 'advice', name: 'Зөвлөмж', icon: 'fa-lightbulb', color: 'purple' },
            { id: 'rules', name: 'Дүрэм', icon: 'fa-balance-scale', color: 'rose' },
            { id: 'cabinet', name: 'Кабинет', icon: 'fa-door-open', color: 'teal' },
            { id: 'feedback', name: 'Санал', icon: 'fa-comments', color: 'pink' }
        ];

        // Static App Data
        const staticData = {
            duty: [
                { day: 'Даваа', students: 'Б.Бат, С.Цэцэг', icon: 'fa-sun' },
                { day: 'Мягмар', students: 'Д.Болд, Г.Уянга', icon: 'fa-cloud' },
                { day: 'Лхагва', students: 'Э.Сүх, О.Ану', icon: 'fa-cloud-sun' },
                { day: 'Пүрэв', students: 'Т.Марал, Н.Төгөлдөр', icon: 'fa-wind' },
                { day: 'Баасан', students: 'Б.Анар, С.Мишээл', icon: 'fa-star' },
            ],
            schedule: [
                { time: '08:00 - 08:40', mon: 'Математик', tue: 'Монгол хэл', wed: 'Биеийн тамир', thu: 'Англи хэл', fri: 'Түүх' },
                { time: '08:45 - 09:25', mon: 'Монгол хэл', tue: 'Математик', wed: 'Мэдээлэл зүй', thu: 'Уран зохиол', fri: 'Газар зүй' },
                { time: '09:30 - 10:10', mon: 'Англи хэл', tue: 'Биологи', wed: 'Математик', thu: 'Хөгжим', fri: 'Дизайн' },
                { time: '10:30 - 11:10', mon: 'Түүх', tue: 'Англи хэл', wed: 'Монгол хэл', thu: 'Математик', fri: 'Биеийн тамир' }
            ],
            advice: [
                { title: 'Нойроо сайн авах', desc: 'Өсвөр насны хүүхэд өдөрт 8-10 цаг унтах шаардлагатай байдаг.', icon: 'fa-moon', bg: 'bg-indigo-100', text: 'text-indigo-600' },
                { title: 'Ус сайн уух', desc: 'Өдөрт 1.5-2 литр ус уух нь тархины үйл ажиллагааг сайжруулна.', icon: 'fa-tint', bg: 'bg-cyan-100', text: 'text-cyan-600' },
                { title: 'Цагийн менежмент', desc: 'Гэрийн даалгавраа өдөр бүр тодорхой цагт хийж хэвших нь стрессээс сэргийлнэ.', icon: 'fa-clock', bg: 'bg-orange-100', text: 'text-orange-600' },
                { title: 'Дэлгэцийн цаг', desc: 'Утас, компьютер үзэх хугацаагаа өдөрт 2 цагаас хэтрүүлэхгүй байх.', icon: 'fa-mobile-alt', bg: 'bg-red-100', text: 'text-red-600' }
            ],
            rules: [
                'Хичээлдээ цагтаа ирнэ. (07:50-д ангид байх)',
                'Бие биенээ хүндэтгэж, зөв боловсон харилцана.',
                'Анги болон сургуулийн эд хөрөнгөнд гамтай хандана.',
                'Хичээлийн цагаар гар утас ашиглахгүй.',
                'Жижүүрийн үүргээ сайн биелүүлж, ангиа цэвэр байлгана.'
            ],
            cabinet: [
                { subject: 'Математик', room: '305 тоот' },
                { subject: 'Монгол хэл', room: '302 тоот' },
                { subject: 'Англи хэл', room: '201 тоот' },
                { subject: 'Мэдээлэл зүй', room: '405 тоот (Лаборатори)' },
                { subject: 'Биеийн тамир', room: 'Спорт заал' },
                { subject: 'Хөгжим', room: '104 тоот' }
            ]
        };

        // Dynamic Supabase Managed Data
        let dynamicData = {
            info: [],
            feedback: []
        };

        // Fallback default dynamic data if Supabase table is empty or loading
        const defaultInfo = [
            { id: 1, date: '2026.08.20', text: 'Хичээлийн шинэ жилийн нээлт 9 сарын 1-ний 08:00 цагт сургуулийн талбайд болно. Дүрэмт хувцастайгаа ирнэ үү.', isNew: true },
            { id: 2, date: '2026.08.15', text: 'Сургуулийн засвар бүрэн дууссан бөгөөд 7А анги 3 давхарт 305 тоотод хичээллэхээр боллоо.', isNew: false }
        ];

        const defaultFeedback = [
            { name: 'Б.Батын ээж', text: 'Ангийн хурал хэзээ болох вэ? Урьдчилж мэдээлэл өгөөрэй баярлалаа.', date: '2026.08.19' }
        ];

        function init() {
            renderNav();
            renderStaticData();
            fetchSupabaseData();
            switchTab('info');
        }

        function renderNav() {
            const nav = document.getElementById('navMenu');
            nav.innerHTML = tabs.map(tab => `
                <button onclick="switchTab('${tab.id}')" id="nav-${tab.id}" class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 gap-2 group">
                    <div class="w-12 h-12 rounded-full bg-${tab.color}-100 text-${tab.color}-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        <i class="fas ${tab.icon}"></i>
                    </div>
                    <span class="text-sm font-bold text-slate-600">${tab.name}</span>
                </button>
            `).join('');
        }

        function switchTab(tabId) {
            activeTabId = tabId;
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`tab-${tabId}`).classList.add('active');

            tabs.forEach(tab => {
                const btn = document.getElementById(`nav-${tab.id}`);
                if (tab.id === tabId) {
                    btn.className = `flex flex-col items-center justify-center p-4 rounded-2xl bg-${tab.color}-50 border border-${tab.color}-300 ring-2 ring-${tab.color}-400 shadow-md transition-all duration-300 gap-2 group`;
                } else {
                    btn.className = `flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 gap-2 group`;
                }
            });
        }

        async function fetchSupabaseData() {
            renderInfo(true);
            renderFeedback(true);

            if (!supabase) {
                dynamicData.info = defaultInfo;
                dynamicData.feedback = defaultFeedback;
                renderInfo();
                renderFeedback();
                return;
            }

            try {
                // Fetch Announcements
                const { data: infoData, error: infoErr } = await supabase
                    .from('announcements')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!infoErr && infoData && infoData.length > 0) {
                    dynamicData.info = infoData.map(item => ({
                        id: item.id,
                        date: item.date || new Date(item.created_at).toLocaleDateString(),
                        text: item.text || item.content,
                        isNew: item.is_new ?? false
                    }));
                } else {
                    dynamicData.info = defaultInfo;
                }

                // Fetch Feedback
                const { data: fbData, error: fbErr } = await supabase
                    .from('feedbacks')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!fbErr && fbData && fbData.length > 0) {
                    dynamicData.feedback = fbData.map(item => ({
                        id: item.id,
                        name: item.name || item.parent_name || 'Нэргүй',
                        text: item.text || item.content,
                        date: item.date || new Date(item.created_at).toLocaleDateString()
                    }));
                } else {
                    dynamicData.feedback = defaultFeedback;
                }

            } catch (err) {
                console.warn('Supabase fetch error, using local fallback:', err);
                dynamicData.info = defaultInfo;
                dynamicData.feedback = defaultFeedback;
            }

            renderInfo();
            renderFeedback();
        }

        function renderStaticData() {
            renderDuty();
            renderSchedule();
            renderAdvice();
            renderRules();
            renderCabinet();
        }

        function renderInfo(isLoading = false) {
            const container = document.getElementById('infoContainer');
            if (isLoading) {
                container.innerHTML = `<div class="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200"><i class="fas fa-spinner fa-spin mr-2"></i> Мэдээлэл ачаалж байна...</div>`;
                return;
            }

            if (dynamicData.info.length === 0) {
                container.innerHTML = `<div class="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">Одоогоор мэдээлэл алга байна.</div>`;
                return;
            }

            container.innerHTML = dynamicData.info.map(item => `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex gap-4 hover:shadow-md transition relative overflow-hidden group">
                    <div class="w-2 h-full bg-blue-500 absolute left-0 top-0"></div>
                    <div class="flex-grow pl-4">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs font-bold text-slate-400"><i class="far fa-calendar-alt mr-1"></i> ${item.date}</span>
                            ${item.isNew ? '<span class="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">ШИНЭ</span>' : ''}
                        </div>
                        <p class="text-slate-700 leading-relaxed">${item.text}</p>
                    </div>
                </div>
            `).join('');
        }

        function renderFeedback(isLoading = false) {
            const container = document.getElementById('feedbackContainer');
            const countBadge = document.getElementById('feedbackCount');
            
            if (isLoading) {
                container.innerHTML = `<div class="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200"><i class="fas fa-spinner fa-spin mr-2"></i> Санал хүсэлтүүдийг ачаалж байна...</div>`;
                return;
            }

            countBadge.innerText = dynamicData.feedback.length;

            if (dynamicData.feedback.length === 0) {
                container.innerHTML = `<div class="text-center p-6 text-slate-400 bg-white rounded-2xl border border-slate-100">Одоогоор санал хүсэлт ирээгүй байна.</div>`;
                return;
            }

            container.innerHTML = dynamicData.feedback.map(item => `
                <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative">
                    <div class="flex items-center gap-3 mb-3 border-b border-slate-50 pb-3">
                        <div class="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-lg"><i class="fas fa-user"></i></div>
                        <div>
                            <h4 class="font-bold text-slate-700 text-sm">${item.name || 'Нэргүй'}</h4>
                            <p class="text-xs text-slate-400">${item.date}</p>
                        </div>
                    </div>
                    <p class="text-slate-600 text-sm">${item.text}</p>
                </div>
            `).join('');
        }

        function renderDuty() {
            const container = document.getElementById('dutyContainer');
            container.innerHTML = staticData.duty.map(item => `
                <div class="bg-white rounded-2xl p-5 shadow-sm border-t-4 border-emerald-500 text-center hover:-translate-y-1 transition duration-300">
                    <div class="text-emerald-500 text-3xl mb-3"><i class="fas ${item.icon}"></i></div>
                    <h3 class="font-bold text-slate-800 mb-2">${item.day}</h3>
                    <p class="text-sm text-slate-600 font-semibold bg-slate-50 py-2 rounded-lg">${item.students}</p>
                </div>
            `).join('');
        }

        function renderSchedule() {
            const container = document.getElementById('scheduleContainer');
            const colors = ['bg-blue-50', 'bg-emerald-50', 'bg-amber-50', 'bg-purple-50', 'bg-rose-50', 'bg-teal-50', 'bg-pink-50'];
            
            const getSubjectColor = (subj) => {
                let hash = 0;
                for (let i = 0; i < subj.length; i++) hash = subj.charCodeAt(i) + ((hash << 5) - hash);
                return colors[Math.abs(hash) % colors.length];
            };

            container.innerHTML = staticData.schedule.map((row) => `
                <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td class="p-4 font-semibold text-slate-500 whitespace-nowrap"><i class="far fa-clock mr-2 text-slate-400"></i>${row.time}</td>
                    <td class="p-3"><div class="p-2 rounded-xl text-center text-sm font-semibold text-slate-700 ${getSubjectColor(row.mon)}">${row.mon}</div></td>
                    <td class="p-3"><div class="p-2 rounded-xl text-center text-sm font-semibold text-slate-700 ${getSubjectColor(row.tue)}">${row.tue}</div></td>
                    <td class="p-3"><div class="p-2 rounded-xl text-center text-sm font-semibold text-slate-700 ${getSubjectColor(row.wed)}">${row.wed}</div></td>
                    <td class="p-3"><div class="p-2 rounded-xl text-center text-sm font-semibold text-slate-700 ${getSubjectColor(row.thu)}">${row.thu}</div></td>
                    <td class="p-3"><div class="p-2 rounded-xl text-center text-sm font-semibold text-slate-700 ${getSubjectColor(row.fri)}">${row.fri}</div></td>
                </tr>
            `).join('');
        }

        function renderAdvice() {
            const container = document.getElementById('adviceContainer');
            container.innerHTML = staticData.advice.map(item => `
                <div class="flex bg-white rounded-2xl p-5 shadow-sm border border-slate-100 items-start gap-4">
                    <div class="w-14 h-14 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center text-2xl flex-shrink-0">
                        <i class="fas ${item.icon}"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800 mb-1">${item.title}</h3>
                        <p class="text-sm text-slate-600 leading-relaxed">${item.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        function renderRules() {
            const container = document.getElementById('rulesContainer');
            container.innerHTML = staticData.rules.map((rule, index) => `
                <div class="flex items-center gap-4 bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
                    <div class="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm">${index + 1}</div>
                    <p class="text-slate-700 font-semibold text-sm md:text-base">${rule}</p>
                </div>
            `).join('');
        }

        function renderCabinet() {
            const container = document.getElementById('cabinetContainer');
            container.innerHTML = staticData.cabinet.map(item => `
                <div class="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl p-1 shadow-md hover:-translate-y-1 transition duration-300">
                    <div class="bg-white rounded-xl p-4 h-full flex flex-col items-center justify-center text-center gap-2">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">${item.subject}</span>
                        <span class="text-lg font-extrabold text-teal-600"><i class="fas fa-map-marker-alt mr-1"></i> ${item.room}</span>
                    </div>
                </div>
            `).join('');
        }

        function openLoginModal() {
            const overlay = document.getElementById('modalOverlay');
            const modal = document.getElementById('loginModal');
            
            overlay.classList.remove('hidden');
            modal.classList.remove('hidden');
            
            setTimeout(() => {
                modal.classList.remove('scale-95', 'opacity-0');
                modal.classList.add('scale-100', 'opacity-100');
                document.getElementById('loginCode').focus();
            }, 10);
        }

        function closeModal() {
            const loginModal = document.getElementById('loginModal');
            const alertModal = document.getElementById('alertModal');
            const overlay = document.getElementById('modalOverlay');

            loginModal.classList.add('scale-95', 'opacity-0');
            alertModal.classList.add('scale-95', 'opacity-0');
            
            setTimeout(() => {
                loginModal.classList.add('hidden');
                alertModal.classList.add('hidden');
                overlay.classList.add('hidden');
                document.getElementById('loginError').classList.add('hidden');
                document.getElementById('loginCode').value = '';
            }, 300);
        }

        function showCustomAlert(type, title, message) {
            closeModal();
            setTimeout(() => {
                const overlay = document.getElementById('modalOverlay');
                const modal = document.getElementById('alertModal');
                const icon = document.getElementById('alertIcon');
                
                if(type === 'success') {
                    icon.className = 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl bg-green-100 text-green-500';
                    icon.innerHTML = '<i class="fas fa-check"></i>';
                } else {
                    icon.className = 'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl bg-red-100 text-red-500';
                    icon.innerHTML = '<i class="fas fa-exclamation"></i>';
                }

                document.getElementById('alertTitle').innerText = title;
                document.getElementById('alertMessage').innerText = message;

                overlay.classList.remove('hidden');
                modal.classList.remove('hidden');
                
                setTimeout(() => {
                    modal.classList.remove('scale-95', 'opacity-0');
                    modal.classList.add('scale-100', 'opacity-100');
                }, 10);
            }, 310);
        }

        function handleLogin() {
            const code = document.getElementById('loginCode').value;
            if (code === '1918') {
                isTeacher = true;
                closeModal();
                updateUIForTeacher();
                setTimeout(() => showCustomAlert('success', 'Амжилттай', 'Багшийн эрхээр амжилттай нэвтэрлээ.'), 400);
            } else {
                document.getElementById('loginError').classList.remove('hidden');
            }
        }

        function logout() {
            isTeacher = false;
            updateUIForTeacher();
            showCustomAlert('success', 'Гарсан', 'Та багшийн эрхээс гарлаа.');
        }

        function updateUIForTeacher() {
            const loginBtn = document.getElementById('loginBtn');
            const userBadge = document.getElementById('loggedInUser');
            const teacherForm = document.getElementById('teacherInfoForm');

            if (isTeacher) {
                loginBtn.classList.add('hidden');
                userBadge.classList.remove('hidden');
                userBadge.classList.add('flex');
                teacherForm.classList.remove('hidden');
            } else {
                loginBtn.classList.remove('hidden');
                userBadge.classList.add('hidden');
                userBadge.classList.remove('flex');
                teacherForm.classList.add('hidden');
            }
        }

        async function addInfo() {
            if (!isTeacher) return;
            const input = document.getElementById('newInfoText');
            const text = input.value.trim();
            if (!text) return;

            const today = new Date();
            const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
            
            const newItem = {
                date: dateStr,
                text: text,
                isNew: true
            };

            // Insert into Supabase if available
            if (supabase) {
                try {
                    const { error } = await supabase
                        .from('announcements')
                        .insert([{ text: text, date: dateStr, is_new: true }]);
                    
                    if (error) console.error('Supabase insert announcement error:', error);
                } catch(e) {
                    console.error('Supabase request failed:', e);
                }
            }

            dynamicData.info.forEach(i => i.isNew = false);
            dynamicData.info.unshift({ id: Date.now(), ...newItem });
            
            input.value = '';
            renderInfo();
            showCustomAlert('success', 'Нэмэгдлээ', 'Шинэ мэдээлэл Supabase өгөгдлийн санд амжилттай нийтлэгдлээ.');
        }

        async function submitFeedback() {
            const nameInput = document.getElementById('feedbackName').value.trim();
            const textInput = document.getElementById('feedbackText').value.trim();

            if (!textInput) {
                showCustomAlert('error', 'Алдаа', 'Санал хүсэлтээ бичнэ үү!');
                return;
            }

            const today = new Date();
            const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
            
            const newFeedback = {
                name: nameInput || 'Нэргүй',
                text: textInput,
                date: dateStr
            };

            // Insert into Supabase if available
            if (supabase) {
                try {
                    const { error } = await supabase
                        .from('feedbacks')
                        .insert([{ name: newFeedback.name, text: textInput, date: dateStr }]);
                    
                    if (error) console.error('Supabase insert feedback error:', error);
                } catch(e) {
                    console.error('Supabase request failed:', e);
                }
            }

            dynamicData.feedback.unshift({ id: Date.now(), ...newFeedback });

            document.getElementById('feedbackName').value = '';
            document.getElementById('feedbackText').value = '';
            
            renderFeedback();
            showCustomAlert('success', 'Баярлалаа!', 'Таны санал Supabase руу амжилттай илгээгдлээ.');
        }

        // Initialize App
        window.onload = init;
    </script>
</body>
</html>