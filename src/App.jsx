import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, Menu, Calendar, Inbox, X, Search, RotateCcw, ChevronRight, Bell, Clock, MoreHorizontal, Save, Info, HelpCircle, ChevronLeft, Zap } from 'lucide-react';

// --- Komponen Sidebar ---
const Sidebar = ({ isOpen, toggleSidebar, activeView, setActiveView, todos, searchQuery, setSearchQuery, projects, setProjects, setTodos, addProject, editProject, deleteProject }) => {
  const [isEditingProject, setIsEditingProject] = useState(null);
  const [editProjectText, setEditProjectText] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectText, setNewProjectText] = useState('');

  const menuItems = [
    { id: 'inbox', icon: Inbox, label: 'Inbox', color: 'text-blue-500' },
    { id: 'today', icon: Calendar, label: 'Hari Ini', color: 'text-green-500' },
    { id: 'upcoming', icon: Calendar, label: 'Akan Datang', color: 'text-purple-500' },
  ];

  // --- LOGIKA PERHITUNGAN BADGE (COUNT) DIPERBARUI ---
  const getCount = (id) => {
    // Hitung Inbox (Semua yang belum selesai jika ingin fokus active, atau total)
    // Di sini kita hitung total inbox
    if (id === 'inbox') return todos.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Hitung Hari Ini (< 1 Hari)
    if (id === 'today') {
      return todos.filter((t) => {
        if (t.completed || !t.dueDate) return false;
        const tDate = new Date(t.dueDate);
        tDate.setHours(0, 0, 0, 0);
        const diffTime = tDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays < 1; // Hari ini atau masa lalu
      }).length;
    }

    // Hitung Akan Datang (> 3 Hari)
    if (id === 'upcoming') {
      return todos.filter((t) => {
        if (t.completed || !t.dueDate) return false;
        const tDate = new Date(t.dueDate);
        tDate.setHours(0, 0, 0, 0);
        const diffTime = tDate - today;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > 3; // Lebih dari 3 hari ke depan
      }).length;
    }

    // Hitung Proyek
    return todos.filter((t) => t.category === id).length;
  };

  const handleMenuClick = (id) => {
    setActiveView(id);
    if (window.innerWidth < 768) toggleSidebar();
  };

  const handleSaveProject = () => {
    if (newProjectText.trim()) {
      addProject(newProjectText);
      setNewProjectText('');
      setIsAddingProject(false);
    }
  };

  const handleUpdateProject = (id) => {
    if (editProjectText.trim()) {
      editProject(id, editProjectText);
      setIsEditingProject(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus SEMUA data (tugas & proyek)? Tindakan ini tidak dapat dibatalkan.')) {
      localStorage.removeItem('my-todos-v5');
      localStorage.removeItem('my-projects-v1');
      setTodos([]);
      setProjects([
        { id: 'Fitness', label: 'Fitness', color: 'bg-rose-500' },
        { id: 'Groceries', label: 'Belanja Bulanan', color: 'bg-yellow-500' },
        { id: 'Website', label: 'Update Website', color: 'bg-blue-500' },
      ]);
      alert('Data berhasil direset!');
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleSidebar} />

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-[280px] bg-[#fcfaf9] border-r border-gray-200 flex flex-col h-full transform transition-transform duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 shrink-0 shadow-xl md:shadow-none`}
      >
        <div className="px-6 py-6 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Zap size={20} className="text-white fill-current" />
            </div>
            <span className="text-xl font-extrabold text-gray-800 tracking-tight">kydolist</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 mb-6">
          <div className="relative group">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-hide">
          <nav className="space-y-1">
            <button
              onClick={() => handleMenuClick('about')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === 'about' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Info size={18} className={activeView === 'about' ? 'text-indigo-600' : 'text-gray-500'} />
                <span>About & Calendar</span>
              </div>
            </button>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={activeView === item.id ? 'text-indigo-600' : item.color} />
                  <span>{item.label}</span>
                </div>
                {getCount(item.id) > 0 && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activeView === item.id ? 'bg-white text-indigo-600 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>{getCount(item.id)}</span>}
              </button>
            ))}
          </nav>

          <div className="pt-2">
            <div className="flex items-center justify-between px-3 mb-3 group">
              <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">PROYEK SAYA</h3>
              <button onClick={() => setIsAddingProject(true)} className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-all hover:text-indigo-600">
                <Plus size={14} />
              </button>
            </div>

            <nav className="space-y-1">
              {projects.map((item) => (
                <div key={item.id} className="relative group/project">
                  {isEditingProject === item.id ? (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <input className="w-full text-xs border rounded px-1 py-1 outline-none focus:border-indigo-500" value={editProjectText} onChange={(e) => setEditProjectText(e.target.value)} autoFocus />
                      <button onClick={() => handleUpdateProject(item.id)} className="text-green-600">
                        <Check size={14} />
                      </button>
                      <button onClick={() => deleteProject(item.id)} className="text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all group/btn ${activeView === item.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.color} ${activeView === item.id ? 'ring-2 ring-indigo-200 ring-offset-1' : ''}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingProject(item.id);
                            setEditProjectText(item.label);
                          }}
                          className="opacity-0 group-hover/btn:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 mr-1"
                        >
                          <Edit2 size={10} />
                        </div>
                        {getCount(item.id) > 0 && <span className="text-[10px] text-gray-400 font-medium">{getCount(item.id)}</span>}
                      </div>
                    </button>
                  )}
                </div>
              ))}
              {isAddingProject && (
                <div className="px-3 py-1.5 flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent border-b border-gray-300 outline-none focus:border-indigo-500 placeholder:text-gray-400"
                    placeholder="Nama proyek..."
                    value={newProjectText}
                    onChange={(e) => setNewProjectText(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveProject()}
                  />
                  <button onClick={handleSaveProject} className="text-indigo-600">
                    <Save size={14} />
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-[#fcfaf9]">
          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 rounded-lg text-sm transition-all duration-200 group"
          >
            <RotateCcw size={18} className="group-hover:text-red-600" />
            <span className="font-medium">Reset Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// --- Komponen Mini Calendar ---
const MiniCalendar = () => {
  const [currDate, setCurrDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currDate.getFullYear();
  const month = currDate.getMonth();
  const today = new Date();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    days.push(
      <div
        key={i}
        className={`h-8 w-8 flex items-center justify-center rounded-full text-xs font-medium cursor-default transition-all
        ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-indigo-50'}`}
      >
        {i}
      </div>
    );
  }

  const prevMonth = () => setCurrDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrDate(new Date(year, month + 1, 1));

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
          <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 place-items-center">{days}</div>
    </div>
  );
};

// --- Komponen About ---
const AboutPage = () => {
  return (
    <div className="w-full max-w-5xl animate-in fade-in zoom-in-95">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <HelpCircle size={32} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Tentang kydolist</h2>
              <p className="text-gray-500">Panduan produktivitas harian Anda</p>
            </div>
          </div>

          <div className="space-y-6 text-gray-700">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                <Plus size={16} /> Buat Tugas Baru
              </h3>
              <p className="text-sm text-blue-600">Klik tombol di pojok kanan atas. Isi judul, deskripsi, dan tentukan tenggat waktu agar tugas Anda terorganisir.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">✨ Manajemen Proyek</h4>
                <p className="text-xs text-gray-500">Buat kategori proyek baru di sidebar kiri. Anda bisa menambah, mengedit, atau menghapus proyek sesuai kebutuhan.</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">✏️ Edit Cepat</h4>
                <p className="text-xs text-gray-500">Klik ikon titik tiga (...) pada kartu tugas untuk opsi Edit atau Hapus. Klik checkbox untuk menyelesaikan tugas.</p>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Versi 1.0.0 • kydolist App</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <MiniCalendar />
          <div className="mt-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
            <h4 className="font-bold text-lg mb-1">Tetap Fokus!</h4>
            <p className="text-xs text-indigo-100 opacity-90 leading-relaxed">"Kunci produktivitas bukanlah melakukan lebih banyak hal, tetapi melakukan hal yang benar."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama App ---
export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputDesc, setInputDesc] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [projects, setProjects] = useState([
    { id: 'Fitness', label: 'Fitness', color: 'bg-rose-500' },
    { id: 'Groceries', label: 'Belanja Bulanan', color: 'bg-yellow-500' },
    { id: 'Website', label: 'Update Website', color: 'bg-blue-500' },
  ]);
  const [inputDate, setInputDate] = useState('');
  const [inputTime, setInputTime] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const cardColors = ['bg-blue-100 border-blue-200', 'bg-purple-100 border-purple-200', 'bg-yellow-100 border-yellow-200', 'bg-pink-100 border-pink-200', 'bg-green-100 border-green-200'];

  const getCardColor = (id) => cardColors[id % cardColors.length];

  useEffect(() => {
    const savedTodos = localStorage.getItem('my-todos-v5');
    const savedProjects = localStorage.getItem('my-projects-v1');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedProjects) setProjects(JSON.parse(savedProjects));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('my-todos-v5', JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    localStorage.setItem('my-projects-v1', JSON.stringify(projects));
  }, [projects]);

  const addProject = (label) => {
    const newProject = { id: label.replace(/\s+/g, '-'), label: label, color: 'bg-gray-400' };
    setProjects([...projects, newProject]);
  };

  const editProject = (id, newLabel) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, label: newLabel } : p)));
  };

  const deleteProject = (id) => {
    if (window.confirm('Hapus proyek ini beserta tugas di dalamnya?')) {
      setProjects(projects.filter((p) => p.id !== id));
      setTodos(todos.filter((t) => t.category !== id));
      setActiveView('inbox');
    }
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const currentCategory = ['inbox', 'today', 'upcoming', 'about'].includes(activeView) ? 'inbox' : activeView;
    let finalDate = inputDate;
    if (activeView === 'today' && !finalDate) finalDate = new Date().toISOString().split('T')[0];

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      description: inputDesc,
      completed: false,
      category: currentCategory,
      dueDate: finalDate,
      dueTime: inputTime,
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
    setInputDesc('');
    setInputDate('');
    setInputTime('');
    setIsAdding(false);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  const startEdit = (todo) => {
    setIsEditing(todo.id);
    setEditText(todo.text);
    setEditDesc(todo.description || '');
  };
  const saveEdit = (id) => {
    if (!editText.trim()) return;
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText, description: editDesc } : todo)));
    setIsEditing(null);
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr && !timeStr) return <span className="text-gray-400 text-[11px]">No Date</span>;
    const date = dateStr ? new Date(dateStr) : null;
    const options = { day: 'numeric', month: 'short' };
    const formattedDate = date ? date.toLocaleDateString('id-ID', options) : '';
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-gray-600">
        {timeStr ? timeStr : 'All Day'} {dateStr ? `• ${formattedDate}` : ''}
      </span>
    );
  };

  // --- LOGIKA FILTER UTAMA ---
  const filteredTodos = todos.filter((todo) => {
    // Basic Filters
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'active' ? !todo.completed : todo.completed;

    // View Filters
    if (activeView === 'about') return false;
    if (activeView === 'inbox') return matchesSearch && matchesTab; // Inbox shows all filtered by search/tab

    // Date Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset jam agar hitungan hari akurat

    // Jika tugas tidak punya tanggal, hanya tampil di proyek kategori nya (bukan Today/Upcoming)
    if (!todo.dueDate) {
      return todo.category === activeView && matchesSearch && matchesTab;
    }

    const tDate = new Date(todo.dueDate);
    tDate.setHours(0, 0, 0, 0);
    const diffTime = tDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (activeView === 'today') {
      // Kurang dari 1 hari (Hari ini + Masa Lalu)
      return diffDays < 1 && matchesSearch && matchesTab;
    } else if (activeView === 'upcoming') {
      // Lebih dari 3 hari
      return diffDays > 3 && matchesSearch && matchesTab;
    } else {
      // Project View
      return todo.category === activeView && matchesSearch && matchesTab;
    }
  });

  const getPageTitle = () => {
    const titles = { inbox: 'Inbox', today: 'Hari Ini', upcoming: 'Akan Datang', about: 'Tentang kydolist' };
    const project = projects.find((p) => p.id === activeView);
    return project ? project.label : titles[activeView] || activeView;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900 font-sans overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeView={activeView}
        setActiveView={setActiveView}
        todos={todos}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        projects={projects}
        setProjects={setProjects}
        addProject={addProject}
        editProject={editProject}
        deleteProject={deleteProject}
        setTodos={setTodos}
      />

      <main className="flex-1 flex flex-col h-full relative w-full">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600">
              <Menu size={20} />
            </button>
            <span className="font-bold text-gray-800 capitalize">{getPageTitle()}</span>
          </div>
          <Bell size={20} className="text-gray-400" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-5 py-8 md:px-8 md:py-8">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 capitalize tracking-tight mb-1">{getPageTitle()}</h1>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Clock size={14} className="text-indigo-500" />
                  <span>
                    {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              {activeView !== 'about' && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100 w-full md:w-64">
                    <Search size={16} className="text-gray-400" />
                    <input type="text" placeholder="Search List..." className="ml-2 w-full text-sm outline-none placeholder:text-gray-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-all active:scale-95 whitespace-nowrap">
                    <Plus size={16} /> Add New Task
                  </button>
                </div>
              )}
            </header>

            {activeView === 'about' ? (
              <AboutPage />
            ) : (
              <>
                <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    Active Task
                  </button>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className={`pb-3 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'completed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    Completed
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 pb-20">
                  {isAdding && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border-2 border-dashed border-blue-200 rounded-xl p-6 animate-in fade-in zoom-in-95 shadow-sm">
                      <form onSubmit={addTodo}>
                        <input
                          type="text"
                          placeholder="Judul Tugas..."
                          className="w-full text-lg font-bold outline-none text-gray-800 placeholder:text-gray-300 mb-2 bg-transparent"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          autoFocus
                        />
                        <textarea
                          placeholder="Tambahkan deskripsi..."
                          className="w-full text-sm text-gray-600 outline-none placeholder:text-gray-300 mb-4 bg-transparent resize-none h-20"
                          value={inputDesc}
                          onChange={(e) => setInputDesc(e.target.value)}
                        />
                        <div className="flex flex-wrap gap-4 mb-4 items-center">
                          <div className="flex items-center bg-gray-50 border rounded px-2 py-1">
                            <Calendar size={14} className="text-gray-400 mr-2" />
                            <input type="date" className="bg-transparent text-sm text-gray-600 outline-none" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
                          </div>
                          <div className="flex items-center bg-gray-50 border rounded px-2 py-1">
                            <Clock size={14} className="text-gray-400 mr-2" />
                            <input type="time" className="bg-transparent text-sm text-gray-600 outline-none" value={inputTime} onChange={(e) => setInputTime(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                            Batal
                          </button>
                          <button type="submit" className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-sm">
                            Simpan
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {filteredTodos.length === 0 && !isAdding ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                      <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                        <Inbox size={40} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500">Tidak ada tugas di sini.</p>
                    </div>
                  ) : (
                    filteredTodos.map((todo, index) => (
                      <div key={todo.id} className={`relative p-5 rounded-2xl border transition-all hover:shadow-lg group flex flex-col justify-between min-h-[180px] ${getCardColor(index)}`}>
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            {isEditing === todo.id ? (
                              <div className="w-full">
                                <input
                                  className="bg-white/50 w-full rounded px-1 py-1 text-sm font-bold mb-1 outline-none focus:bg-white focus:ring-2 focus:ring-blue-200"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  placeholder="Judul Tugas"
                                  autoFocus
                                />
                                <textarea
                                  className="bg-white/50 w-full rounded px-1 py-1 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-200 resize-none h-16"
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  placeholder="Deskripsi..."
                                />
                              </div>
                            ) : (
                              <h3 onClick={() => toggleComplete(todo.id)} className={`font-bold text-gray-800 leading-tight cursor-pointer ${todo.completed ? 'line-through opacity-50' : ''}`}>
                                {todo.text}
                              </h3>
                            )}
                            <div className="ml-2 shrink-0">
                              {isEditing === todo.id ? (
                                <button onClick={() => saveEdit(todo.id)} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-sm">
                                  <Save size={14} />
                                </button>
                              ) : (
                                <div className="relative group/menu">
                                  <button className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-black/5">
                                    <MoreHorizontal size={18} />
                                  </button>
                                  <div className="absolute right-0 top-full mt-1 w-28 bg-white shadow-xl rounded-lg border border-gray-100 py-1 hidden group-hover/menu:block z-10">
                                    <button onClick={() => startEdit(todo)} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                                      <Edit2 size={12} /> Edit
                                    </button>
                                    <button onClick={() => deleteTodo(todo.id)} className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 text-red-600 flex items-center gap-2">
                                      <Trash2 size={12} /> Hapus
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {isEditing !== todo.id && (
                            <p className={`text-xs text-gray-600 mb-4 whitespace-pre-wrap leading-relaxed break-words ${todo.completed ? 'opacity-50' : ''}`}>
                              {todo.description || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between border-t border-black/5 pt-3 mt-auto">
                          {formatDateTime(todo.dueDate, todo.dueTime)}
                          <div
                            onClick={() => toggleComplete(todo.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                              todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 bg-white hover:border-blue-500'
                            }`}
                          >
                            {todo.completed && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
