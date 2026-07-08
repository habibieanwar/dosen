import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAppState } from "@/lib/app-state";
import { supabase } from "@/lib/supabase";
import {
  Users,
  BarChart3,
  Download,
  Search,
  Plus,
  Trash2,
  Edit2,
  Lock,
  User,
  LogOut,
  Calendar,
  Settings,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Shield,
  FileSpreadsheet
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/dosen/Logo";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean; // true = Aktif, false = Tidak Aktif
  usage: number; // Jumlah chat AI
  joinedDate: string;
  university?: string;
}

const DEFAULT_MOCK_USERS: MockUser[] = [
  { id: "1", name: "Habibie Anwar", email: "hbbnwr@gmail.com", role: "dosen", status: true, usage: 142, joinedDate: "2026-06-01", university: "Universitas Indonesia" },
  { id: "2", name: "Budi Santoso", email: "budi.santoso@mhs.ui.ac.id", role: "mahasiswa", status: true, usage: 45, joinedDate: "2026-06-15", university: "Universitas Indonesia" },
  { id: "3", name: "Dr. Siti Rahma", email: "siti.rahma@lipi.go.id", role: "peneliti", status: true, usage: 89, joinedDate: "2026-06-18", university: "BRIN" },
  { id: "4", name: "Ahmad Fauzi", email: "ahmad.f@student.itb.ac.id", role: "mahasiswa", status: false, usage: 12, joinedDate: "2026-07-02", university: "Institut Teknologi Bandung" },
  { id: "5", name: "Prof. Dewi Lestari", email: "dewi.lestari@ugm.ac.id", role: "dosen", status: true, usage: 210, joinedDate: "2026-05-20", university: "Universitas Gadjah Mada" },
  { id: "6", name: "Eko Prasetyo", email: "eko.pras@riset.org", role: "peneliti", status: true, usage: 156, joinedDate: "2026-05-25", university: "Lembaga Riset Nasional" },
  { id: "7", name: "Rina Wijaya", email: "rina.w@binus.ac.id", role: "mahasiswa", status: true, usage: 62, joinedDate: "2026-07-04", university: "Binus University" },
  { id: "8", name: "Yusuf Mansur", email: "yusuf.m@student.unpad.ac.id", role: "mahasiswa", status: false, usage: 0, joinedDate: "2026-07-07", university: "Universitas Padjadjaran" },
  { id: "9", name: "Lestari Indah", email: "lestari.indah@dosen.ui.ac.id", role: "dosen", status: true, usage: 95, joinedDate: "2026-06-10", university: "Universitas Indonesia" },
  { id: "10", name: "Farhan Hakim", email: "farhan.hakim@peneliti.id", role: "peneliti", status: false, usage: 8, joinedDate: "2026-07-05", university: "Pusat Studi Sosial" }
];

function AdminPage() {
  const { user: loggedInUser } = useAppState();
  
  // Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "reports">("overview");

  // Database State (Simulated with localStorage)
  const [users, setUsers] = useState<MockUser[]>([]);
  
  // Filter/Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add/Edit User Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "mahasiswa",
    status: true,
    university: "",
    usage: 0
  });

  // Sync real users from Supabase profiles table
  const syncSupabaseUsers = async (currentUsersList?: MockUser[]) => {
    try {
      const listToSync = currentUsersList || users;
      if (listToSync.length === 0) return;

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*");

      if (error) {
        console.warn("Supabase profiles sync select error (RLS check):", error.message);
        return;
      }

      if (profiles && profiles.length > 0) {
        let updatedList = [...listToSync];
        profiles.forEach((p: any) => {
          const mapped: MockUser = {
            id: p.id,
            name: p.fullname || "Akademisi Baru",
            email: p.email || "no-email@dosen.ai",
            role: p.role || "mahasiswa",
            status: p.is_profile_completed ? true : false,
            usage: p.chat_usage || 0,
            joinedDate: p.created_at ? p.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            university: p.university || ""
          };

          const idx = updatedList.findIndex(u => u.id === mapped.id || u.email === mapped.email);
          if (idx > -1) {
            // Update
            updatedList[idx] = {
              ...updatedList[idx],
              name: p.fullname || updatedList[idx].name,
              role: p.role || updatedList[idx].role,
              university: p.university || updatedList[idx].university,
              status: p.is_profile_completed ? true : updatedList[idx].status,
              usage: p.chat_usage !== undefined ? p.chat_usage : updatedList[idx].usage
            };
          } else {
            // Insert
            updatedList.push(mapped);
          }
        });

        setUsers(updatedList);
        localStorage.setItem("admin_users", JSON.stringify(updatedList));
      }
    } catch (err) {
      console.error("Gagal melakukan sync data Supabase profiles:", err);
    }
  };

  // Check auth and load database on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAdminLoggedIn(true);
    }

    // Load from localStorage or default seed
    let initialUsers = DEFAULT_MOCK_USERS;
    const savedUsers = localStorage.getItem("admin_users");
    if (savedUsers) {
      initialUsers = JSON.parse(savedUsers);
    } else {
      localStorage.setItem("admin_users", JSON.stringify(DEFAULT_MOCK_USERS));
    }
    setUsers(initialUsers);
    
    // Sync with remote Supabase profiles immediately on load
    syncSupabaseUsers(initialUsers);
  }, []);

  // Sync the currently logged in user's profile details
  useEffect(() => {
    if (loggedInUser && users.length > 0) {
      const existsIndex = users.findIndex(u => u.email === loggedInUser.email || u.id === loggedInUser.id);
      let updated = [...users];
      
      const updatedUserObj = {
        id: loggedInUser.id || Date.now().toString(),
        name: loggedInUser.name && loggedInUser.name !== "User Akademisi" ? loggedInUser.name : (existsIndex > -1 ? updated[existsIndex].name : "Pengguna Baru"),
        email: loggedInUser.email || "active@user.com",
        role: loggedInUser.role || "mahasiswa",
        status: true,
        usage: existsIndex > -1 ? updated[existsIndex].usage : 3,
        joinedDate: existsIndex > -1 ? updated[existsIndex].joinedDate : new Date().toISOString().split("T")[0],
        university: loggedInUser.university
      };

      if (existsIndex > -1) {
        updated[existsIndex] = updatedUserObj;
      } else {
        updated.push(updatedUserObj);
      }
      
      if (JSON.stringify(users) !== JSON.stringify(updated)) {
        setUsers(updated);
        localStorage.setItem("admin_users", JSON.stringify(updated));
      }
    }
  }, [loggedInUser]);

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "admin" && passwordInput === "HabibieAdmin2026") {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem("admin_auth", "true");
      toast.success("Login Admin berhasil!");
    } else {
      toast.error("Username atau Password salah.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("admin_auth");
    toast.success("Keluar dari panel admin.");
  };

  // Save users database helper
  const saveUsers = (newUsers: MockUser[]) => {
    setUsers(newUsers);
    localStorage.setItem("admin_users", JSON.stringify(newUsers));
  };

  // Toggle user status
  const handleToggleStatus = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, status: !u.status } : u);
    saveUsers(updated);
    toast.success("Status pengguna berhasil diperbarui.");
  };

  // Reset user usage count
  const handleResetUsage = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, usage: 0 } : u);
    saveUsers(updated);
    toast.success("Statistik pemakaian chat pengguna direset.");
  };

  // Delete user
  const handleDeleteUser = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      const updated = users.filter(u => u.id !== id);
      saveUsers(updated);
      toast.success("Pengguna berhasil dihapus.");
    }
  };

  // Submit Modal (Add / Edit)
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Edit mode
      const updated = users.map(u => u.id === editingUser.id ? {
        ...u,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        university: formData.university,
        usage: formData.usage
      } : u);
      saveUsers(updated);
      toast.success("Data pengguna berhasil diperbarui.");
    } else {
      // Add mode
      const newUser: MockUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        usage: formData.usage || 0,
        joinedDate: new Date().toISOString().split("T")[0],
        university: formData.university
      };
      saveUsers([...users, newUser]);
      toast.success("Pengguna baru berhasil ditambahkan.");
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Open modal for editing
  const openEditModal = (user: MockUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      university: user.university || "",
      usage: user.usage
    });
    setIsModalOpen(true);
  };

  // Open modal for adding
  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      role: "mahasiswa",
      status: true,
      university: "",
      usage: 0
    });
    setIsModalOpen(true);
  };

  // CSV Report Downloader
  const handleDownloadCSV = (month: string, reportData: MockUser[]) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Nama,Email,Role,Status,Pemakaian (Chat AI),Universitas,Tanggal Bergabung\n";
    
    reportData.forEach((row) => {
      const statusText = row.status ? "Aktif" : "Tidak Aktif";
      const univText = row.university ? row.university : "-";
      csvContent += `"${row.id}","${row.name}","${row.email}","${row.role}","${statusText}",${row.usage},"${univText}","${row.joinedDate}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_DOSEN_${month.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Laporan bulanan ${month} berhasil didownload.`);
  };

  // Calculate Metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status).length;
  const inactiveUsers = totalUsers - activeUsers;
  const totalUsage = users.reduce((acc, curr) => acc + curr.usage, 0);
  
  const roleCounts = users.reduce(
    (acc, curr) => {
      acc[curr.role] = (acc[curr.role] || 0) + 1;
      return acc;
    },
    { mahasiswa: 0, dosen: 0, peneliti: 0 } as Record<string, number>
  );

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.university && u.university.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.status) ||
      (statusFilter === "inactive" && !u.status);
      
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (!isAdminLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center justify-center text-center">
            <Logo size={44} />
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-zinc-950">
              Admin Portal
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manajemen Kelola Administrasi platform DOSEN
            </p>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleLoginSubmit}>
            <div className="space-y-4 rounded-md">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Username
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute top-3 left-3 h-5 w-5 text-muted-foreground/75" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Masukkan username"
                    className="h-11 w-full rounded-2xl border border-border bg-white pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-muted-foreground/75" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password"
                    className="h-11 w-full rounded-2xl border border-border bg-white pl-10 pr-4 text-sm transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-sm font-semibold text-white shadow-lg transition-all hover:bg-zinc-900 cursor-pointer"
            >
              <Shield className="h-4 w-4" />
              Masuk Dashboard Admin
            </button>
          </form>

          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200/50 p-4 text-center text-xs text-amber-800">
            <p className="font-semibold">💡 Info Demo Kredensial:</p>
            <p className="mt-1">Username: <code className="bg-amber-100 px-1 rounded font-bold">admin</code></p>
            <p className="mt-0.5">Password: <code className="bg-amber-100 px-1 rounded font-bold">HabibieAdmin2026</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50/70 text-zinc-900">
      {/* Sidebar Admin */}
      <aside className="hidden w-64 border-r border-zinc-200 bg-white md:block">
        <div className="flex h-full flex-col justify-between p-5">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-5">
              <Logo size={32} />
              <div className="text-left leading-none">
                <span className="text-sm font-bold tracking-tight text-zinc-950">DOSEN</span>
                <span className="block text-[10px] font-semibold text-primary">ADMIN PANEL</span>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Overview Dashboard
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "users"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <Users className="h-4 w-4" />
                Kelola Pengguna
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "reports"
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                Laporan Bulanan
              </button>
            </nav>
          </div>

          <div className="border-t border-zinc-100 pt-5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Keluar Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <Logo size={28} />
            </div>
            <h1 className="font-display text-lg font-bold tracking-tight text-zinc-950 md:text-xl">
              Manajemen Kelola Administrasi
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">
              Sesi: <span className="font-semibold text-zinc-700">Administrator</span>
            </span>
            <button
              onClick={handleLogout}
              className="md:hidden grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Keluar"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Mobile Tab Nav */}
        <div className="flex border-b border-zinc-200 bg-white md:hidden">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 border-b-2 py-3 text-center text-xs font-semibold ${
              activeTab === "overview" ? "border-zinc-950 text-zinc-950" : "border-transparent text-muted-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 border-b-2 py-3 text-center text-xs font-semibold ${
              activeTab === "users" ? "border-zinc-950 text-zinc-950" : "border-transparent text-muted-foreground"
            }`}
          >
            Pengguna
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`flex-1 border-b-2 py-3 text-center text-xs font-semibold ${
              activeTab === "reports" ? "border-zinc-950 text-zinc-950" : "border-transparent text-muted-foreground"
            }`}
          >
            Laporan
          </button>
        </div>

        <main className="flex-1 p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total Pengguna
                    </span>
                    <div className="rounded-lg bg-zinc-100 p-2 text-zinc-900">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold tracking-tight text-zinc-900">
                      {totalUsers}
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      +100% dari awal
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">Pengguna terdaftar di database</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Pengguna Aktif
                    </span>
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <Activity className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold tracking-tight text-zinc-900">
                      {activeUsers}
                    </span>
                    <span className="text-xs font-semibold text-zinc-500">
                      {Math.round((activeUsers / totalUsers) * 100)}% Rasio
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">Pengguna dengan status diijinkan aktif</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total Pemakaian Chat
                    </span>
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold tracking-tight text-zinc-900">
                      {totalUsage}
                    </span>
                    <span className="text-xs font-medium text-emerald-600">
                      Rata-rata {Math.round(totalUsage / totalUsers)} / user
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">Akumulasi request prompt AI Chat</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Sesi Non-Aktif
                    </span>
                    <div className="rounded-lg bg-red-50 p-2 text-red-600">
                      <XCircle className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-display font-bold tracking-tight text-zinc-900">
                      {inactiveUsers}
                    </span>
                    <span className="text-xs font-semibold text-red-600">
                      {inactiveUsers} Dibatasi
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">Sesi login dinonaktifkan sementara</p>
                </div>
              </div>

              {/* Roles Breakdown */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h3 className="font-display font-bold text-zinc-900">Penyebaran Peran Pengguna</h3>
                  <p className="text-xs text-muted-foreground">Statistik pembagian segmentasi akademik</p>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Mahasiswa</span>
                        <span className="text-muted-foreground">{roleCounts.mahasiswa} Pengguna</span>
                      </div>
                      <div className="mt-1.5 h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div 
                          className="h-full bg-zinc-900 rounded-full" 
                          style={{ width: `${(roleCounts.mahasiswa / totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Dosen / Pengajar</span>
                        <span className="text-muted-foreground">{roleCounts.dosen} Pengguna</span>
                      </div>
                      <div className="mt-1.5 h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div 
                          className="h-full bg-zinc-600 rounded-full" 
                          style={{ width: `${(roleCounts.dosen / totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Peneliti / Akademisi</span>
                        <span className="text-muted-foreground">{roleCounts.peneliti} Pengguna</span>
                      </div>
                      <div className="mt-1.5 h-3 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div 
                          className="h-full bg-zinc-400 rounded-full" 
                          style={{ width: `${(roleCounts.peneliti / totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-zinc-900">Kepatuhan Sistem</h3>
                    <p className="text-xs text-muted-foreground">Kesehatan platform dan database</p>
                    
                    <div className="mt-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Integrasi Database</p>
                          <p className="text-[10px] text-muted-foreground">Tersambung ke Supabase Cloud</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Sertifikat SSL & RLS</p>
                          <p className="text-[10px] text-muted-foreground">Kebijakan RLS diaktifkan aman</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-zinc-900">Pembatasan Token AI</p>
                          <p className="text-[10px] text-muted-foreground">Aktif, maksimal pemakaian per role</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
                    <p className="text-[10px] text-zinc-500 font-medium">Versi Aplikasi Administrasi: v1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE USERS */}
          {activeTab === "users" && (
            <div className="space-y-5">
              {/* Search, Filter, and Add User header */}
              <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Cari nama, email, universitas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9.5 w-full rounded-xl border border-border bg-white pl-9.5 pr-4 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="h-9.5 rounded-xl border border-border bg-white px-3 text-xs font-medium focus:outline-none"
                    >
                      <option value="all">Semua Peran</option>
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="dosen">Dosen</option>
                      <option value="peneliti">Peneliti</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-9.5 rounded-xl border border-border bg-white px-3 text-xs font-medium focus:outline-none"
                    >
                      <option value="all">Semua Status</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={openAddModal}
                  className="flex h-9.5 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-xs font-bold text-white transition-all hover:bg-zinc-900 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Pengguna
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="px-5 py-3">Nama & Email</th>
                        <th className="px-5 py-3">Peran (Role)</th>
                        <th className="px-5 py-3">Universitas</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-center">Pemakaian Chat</th>
                        <th className="px-5 py-3">Bergabung</th>
                        <th className="px-5 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/80 text-sm">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-50/30">
                            <td className="px-5 py-3.5">
                              <div className="font-semibold text-zinc-900">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.email}</div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold capitalize text-zinc-800">
                                {item.role}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-zinc-600">
                              {item.university || "-"}
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => handleToggleStatus(item.id)}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all cursor-pointer ${
                                  item.status
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-700 hover:bg-red-100"
                                }`}
                              >
                                {item.status ? (
                                  <>
                                    <CheckCircle className="h-3 w-3" />
                                    Aktif
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3" />
                                    Mati
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="px-5 py-3.5 text-center font-display font-semibold text-zinc-800">
                              <div className="flex items-center justify-center gap-1.5">
                                <span>{item.usage}</span>
                                <button
                                  onClick={() => handleResetUsage(item.id)}
                                  className="text-[10px] text-muted-foreground hover:text-zinc-900 underline underline-offset-2 cursor-pointer"
                                  title="Reset Pemakaian"
                                >
                                  (Reset)
                                </button>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-zinc-500">
                              {new Date(item.joinedDate).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => openEditModal(item)}
                                  className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(item.id)}
                                  className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-5 py-10 text-center text-zinc-500">
                            Tidak ada pengguna ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MONTHLY REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="font-display font-bold text-zinc-900">Arsip Laporan Pemakaian Bulanan</h3>
                <p className="text-xs text-muted-foreground">Download data statistik pengguna untuk keperluan pelaporan</p>
                
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* July 2026 */}
                  <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50/50 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-950 font-bold">
                        <Calendar className="h-4 w-4 text-primary" />
                        Juli 2026
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">Periode berjalan (01 Jul - 31 Jul)</p>
                      
                      <div className="mt-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Registrasi Baru:</span>
                          <span className="font-semibold">{users.filter(u => u.joinedDate.startsWith("2026-07")).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Vol. Chat AI:</span>
                          <span className="font-semibold">{users.filter(u => u.joinedDate.startsWith("2026-07")).reduce((a,c)=>a+c.usage, 0)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadCSV("Juli 2026", users)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2 text-xs font-semibold text-white hover:bg-zinc-900 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Laporan CSV
                    </button>
                  </div>

                  {/* June 2026 */}
                  <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50/50 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-950 font-bold">
                        <Calendar className="h-4 w-4 text-zinc-600" />
                        Juni 2026
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">Periode selesai (01 Jun - 30 Jun)</p>
                      
                      <div className="mt-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Registrasi Baru:</span>
                          <span className="font-semibold">{users.filter(u => u.joinedDate.startsWith("2026-06")).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Vol. Chat AI:</span>
                          <span className="font-semibold">{users.filter(u => u.joinedDate.startsWith("2026-06")).reduce((a,c)=>a+c.usage, 0)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadCSV("Juni 2026", users.filter(u => u.joinedDate.startsWith("2026-06") || u.joinedDate < "2026-06-01"))}
                      className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2 text-xs font-semibold text-white hover:bg-zinc-900 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Laporan CSV
                    </button>
                  </div>

                  {/* May 2026 */}
                  <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50/50 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-zinc-950 font-bold">
                        <Calendar className="h-4 w-4 text-zinc-600" />
                        Mei 2026
                      </div>
                      <p className="mt-1 text-[10px] text-muted-foreground">Periode selesai (01 Mei - 31 Mei)</p>
                      
                      <div className="mt-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Registrasi Baru:</span>
                          <span className="font-semibold">{users.filter(u => u.joinedDate.startsWith("2026-05")).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Vol. Chat AI:</span>
                          <span className="font-semibold">{users.filter(u => u.joinedDate.startsWith("2026-05")).reduce((a,c)=>a+c.usage, 0)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadCSV("Mei 2026", users.filter(u => u.joinedDate.startsWith("2026-05") || u.joinedDate < "2026-05-01"))}
                      className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2 text-xs font-semibold text-white hover:bg-zinc-900 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Laporan CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ADD/EDIT USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950">
              {editingUser ? "Edit Profil Pengguna" : "Tambah Pengguna Baru"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Isi data detail pengguna untuk diadministrasi sistem
            </p>

            <form onSubmit={handleModalSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm mt-1 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Masukkan email"
                  className="h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm mt-1 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Peran (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm mt-1 focus:outline-none"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                    <option value="peneliti">Peneliti</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={formData.status ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value === "active" })}
                    className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm mt-1 focus:outline-none"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Universitas / Institusi
                </label>
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="Contoh: Universitas Indonesia"
                  className="h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm mt-1 focus:outline-none"
                />
              </div>

              {editingUser && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Jumlah Pemakaian Chat AI
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: parseInt(e.target.value) || 0 })}
                    className="h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm mt-1 focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-10 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-zinc-950 text-xs font-bold text-white hover:bg-zinc-900 cursor-pointer"
                >
                  {editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
