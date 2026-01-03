import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, Menu, Calendar, Inbox, ListTodo, Hash, X, Search, Bell, Settings, ChevronRight } from 'lucide-react';

// --- Komponen Sidebar ---
const Sidebar = ({ isOpen, toggleSidebar, activeView, setActiveView, todos }) => {
  const menuItems = [
    { id: 'inbox', icon: Inbox, label: 'Inbox', color: 'text-blue-500' },
    { id: 'today', icon: Calendar, label: 'Today', color: 'text-green-500' },
    { id: 'upcoming', icon: Calendar, label: 'Upcoming', color: 'text-purple-500' },
    { id: 'filters', icon: ListTodo, label: 'Filters & Labels', color: 'text-orange-500' },
  ];

  const projectItems = [
    { id: 'Fitness', label: 'Fitness', dot: 'bg-rose-500' },
    { id: 'Groceries', label: 'Groceries', dot: 'bg-yellow-500' },
    { id: 'Website', label: 'Website Update', dot: 'bg-blue-500' },
  ];

  // Hitung jumlah tugas (hanya yang belum selesai untuk 'Today')
  const getCount = (id) => {
    if (id === 'inbox') return todos.length;
    if (id === 'today') return todos.filter((t) => !t.completed).length;
    return todos.filter((t) => t.category === id).length;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm transition-opacity animate-in fade-in" onClick={toggleSidebar} />}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#faf9f8] border-r border-gray-200 px-3 py-6 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-full`}
      >
        {/* User Profile */}
        <div className="flex items-center justify-between mb-6 px-3">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200/50 p-1.5 rounded-lg transition-all w-full">
            <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-xs">R</div>
            <span className="font-semibold text-gray-700 text-sm truncate">Risky Iman</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden p-1 hover:bg-gray-200 rounded text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Action Quick Access */}
        <div className="space-y-0.5 mb-6 px-1">
          <button className="w-full flex items-center gap-3 px-3 py-1.5 text-gray-600 hover:bg-gray-200/60 rounded-md text-sm transition-all group">
            <Search size={16} className="text-gray-400 group-hover:text-gray-600" />
            <span>Cari Tugas</span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-0.5 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${activeView === item.id ? 'bg-rose-100 text-rose-800 shadow-sm' : 'text-gray-600 hover:bg-gray-200/60'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeView === item.id ? 'text-rose-600' : item.color} />
                <span className={activeView === item.id ? 'font-bold' : ''}>{item.label}</span>
              </div>
              {getCount(item.id) > 0 && <span className="text-[10px] font-bold text-gray-400">{getCount(item.id)}</span>}
            </button>
          ))}
        </nav>

        {/* Projects Section */}
        <div className="flex-1 px-1">
          <div className="flex items-center justify-between px-3 mb-2 group">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Proyek Saya</h3>
            <button className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition-all">
              <Plus size={14} className="text-gray-500" />
            </button>
          </div>
          <nav className="space-y-0.5">
            {projectItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeView === item.id ? 'bg-rose-100 text-rose-800' : 'text-gray-600 hover:bg-gray-200/60'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.dot} ${activeView === item.id ? 'ring-2 ring-rose-300' : ''}`} />
                  <span className={activeView === item.id ? 'font-bold' : ''}>{item.label}</span>
                </div>
                {getCount(item.id) > 0 && <span className="text-[10px] font-bold text-gray-400">{getCount(item.id)}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 pt-4 px-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-200/60 rounded-md text-sm transition-all">
            <Settings size={16} />
            <span>Pengaturan</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// --- Komponen Utama App ---
export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('today');

  useEffect(() => {
    const savedTodos = localStorage.getItem('my-todos-modern');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  useEffect(() => {
    localStorage.setItem('my-todos-modern', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Logika Kategori: Masuk ke project aktif, atau 'inbox' jika di Today/Inbox
    const currentCategory = ['inbox', 'today', 'upcoming', 'filters'].includes(activeView) ? 'inbox' : activeView;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      category: currentCategory,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    setIsAdding(false);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const startEdit = (todo) => {
    setIsEditing(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo)));
    setIsEditing(null);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // --- Logika Filter Tugas ---
  const filteredTodos = todos.filter((todo) => {
    if (activeView === 'inbox') return true;
    if (activeView === 'today') return !todo.completed; // Tampilkan yang belum beres di hari ini
    return todo.category === activeView;
  });

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden text-gray-900">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} activeView={activeView} setActiveView={setActiveView} todos={todos} />

      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b p-4 flex items-center justify-between z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-gray-100 rounded text-gray-600">
            <Menu size={22} />
          </button>
          <span className="font-bold text-sm capitalize">{activeView}</span>
          <div className="w-6 h-6 rounded-full bg-rose-500" />
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10 md:px-12 md:py-16 transition-all duration-300">
          {/* Main Title Section */}
          <header className="mb-8 group">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-gray-800 capitalize tracking-tight">{activeView}</h1>
              <ChevronRight size={16} className="text-gray-300 md:opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </header>

          {/* List Section */}
          <div className="space-y-0.5 mb-10">
            {filteredTodos.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 text-sm font-medium italic">Tidak ada tugas di sini. Santai dulu!</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div key={todo.id} className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50/80 transition-all border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center
                      ${todo.completed ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
                  >
                    {todo.completed && <Check size={12} strokeWidth={4} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {isEditing === todo.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveEdit(todo.id);
                        }}
                        className="w-full"
                      >
                        <input
                          type="text"
                          className="w-full bg-white border border-rose-200 px-2 py-1 rounded text-sm outline-none shadow-sm ring-2 ring-rose-500/10"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => saveEdit(todo.id)}
                          autoFocus
                        />
                      </form>
                    ) : (
                      <div className="flex items-center justify-between group/item">
                        <p className={`text-sm leading-relaxed break-words font-medium cursor-pointer ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 hover:text-gray-900'}`} onClick={() => toggleComplete(todo.id)}>
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(todo)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => deleteTodo(todo.id)} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Task Control */}
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            {isAdding ? (
              <form onSubmit={addTodo} className="border border-gray-200 rounded-xl p-4 bg-white shadow-lg ring-1 ring-black/5 space-y-4">
                <input
                  type="text"
                  placeholder="Apa yang perlu dilakukan?"
                  className="w-full text-sm font-medium outline-none placeholder:text-gray-300 text-gray-700"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                  <div className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-1 rounded flex items-center gap-1 capitalize">
                    <Hash size={10} /> {activeView === 'today' || activeView === 'inbox' ? 'Inbox' : activeView}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className={`px-4 py-2 text-xs font-extrabold text-white rounded-lg transition-all shadow-md active:scale-95 ${!inputValue.trim() ? 'bg-rose-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'}`}
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button onClick={() => setIsAdding(true)} className="group flex items-center gap-3 w-full p-2 text-gray-400 hover:text-rose-600 transition-all font-medium rounded-lg">
                <div className="w-5 h-5 rounded-full bg-transparent border-2 border-gray-200 flex items-center justify-center group-hover:bg-rose-500 group-hover:border-rose-500 group-hover:text-white transition-all">
                  <Plus size={14} strokeWidth={3} />
                </div>
                <span className="text-sm">Tambah tugas</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
