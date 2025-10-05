"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

interface Task {
  id: number;
  title: string;
  status: "pending" | "in_progress" | "done";
  project: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  tasks?: Task[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [newTask, setNewTask] = useState({ title: "", status: "pending" });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  // 🟢 Projeleri çek
  useEffect(() => {
    if (!token) {
      toast.error("Please log in first");
      router.push("/login");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await axios.get<Project[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/projects/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(res.data);
      } catch {
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router, token]);

  // 🟦 Yeni proje oluştur
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return toast.error("Project name is required");

    try {
      const res = await axios.post<Project>(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/`,
        newProject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      toast.success("Project created successfully!");
      setShowProjectModal(false);
      setNewProject({ name: "", description: "" });
    } catch {
      toast.error("Failed to create project");
    }
  };

  // 🟢 Yeni task ekle
  const handleAddTask = async (projectId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return toast.error("Task title is required");

    try {
      const res = await axios.post<Task>(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/`,
        { ...newTask, project: projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, tasks: [...(p.tasks || []), res.data] }
            : p
        )
      );
      toast.success("Task added!");
      setNewTask({ title: "", status: "pending" });
      setShowTaskModal(null);
    } catch {
      toast.error("Failed to add task");
    }
  };

// 🟣 Toggle task status
  const toggleTaskStatus = (projectId: number, taskId: number) => {
    const order: Task["status"][] = ["pending", "in_progress", "done"];

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        // status değiştir
        const updatedTasks = p.tasks
          ?.map((t) => {
            if (t.id !== taskId) return t;
            const next = order[(order.indexOf(t.status) + 1) % order.length];
            return { ...t, status: next };
          })
          // 🧠 "done" olanları en sona taşı
          .sort((a, b) => {
            if (a.status === "done" && b.status !== "done") return 1;
            if (a.status !== "done" && b.status === "done") return -1;
            return 0;
          });

        return { ...p, tasks: updatedTasks };
      })
    );

    // backend’e sessizce gönder
    const project = projects.find((p) => p.id === projectId);
    const task = project?.tasks?.find((t) => t.id === taskId);
    if (!task) return;
    const next =
      order[(order.indexOf(task.status) + 1) % order.length];

    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/`,
        { status: next },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .catch((err: AxiosError) => {
        console.error("❌ Backend update failed:", err.response?.data);
        toast.error("Failed to sync with server");
      });
  };
  // 🕓 Loading ekranı
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        <p className="animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <Toaster position="top-right" />
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          🧠 TaskTrackr <span className="text-blue-600">Dashboard</span>
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowProjectModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Project
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              router.push("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 🧩 Proje Listesi */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-600">
          <h2 className="text-2xl font-semibold mb-2">No Projects Yet 😢</h2>
          <p className="mb-4">Start by creating your first project!</p>
        </div>
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {project.name}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="border-t border-gray-200 pt-3">
                <h3 className="font-medium text-gray-700 mb-2 flex justify-between items-center">
                  <span>Tasks ({project.tasks?.length || 0})</span>
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => setShowTaskModal(project.id)}
                  >
                    + Add Task
                  </button>
                </h3>

                {/* Task listesi */}
                {project.tasks && project.tasks.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {project.tasks.map((task) => (
                      <motion.li
                        key={task.id}
                        whileTap={{ scale: 0.96 }}
                        className="flex justify-between items-center bg-gray-50 px-3 py-1 rounded hover:bg-gray-100 transition"
                      >
                        {/* Task adı */}
                        <span
                          className={`font-medium ${
                            task.status === "done"
                              ? "line-through text-gray-700"
                              : "text-gray-800"
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* 🟡 Status etiketi — tıklayınca hemen değişir */}
                        <span
                          onClick={() =>
                            toggleTaskStatus(project.id, task.id)
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded cursor-pointer select-none ${
                            task.status === "done"
                              ? "bg-green-100 text-green-700"
                              : task.status === "in_progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                          title="Click to change status"
                        >
                          {task.status
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No tasks yet.</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ➕ Project Modal */}
      {showProjectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
              ✨ Create New Project
            </h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <textarea
                placeholder="Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* ➕ Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              📝 Add New Task
            </h2>
            <form
              onSubmit={(e) => handleAddTask(showTaskModal, e)}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-lg p-2 text-gray-800 placeholder-gray-400"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
