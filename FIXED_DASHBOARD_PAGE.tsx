"use client";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Users,
  Briefcase,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Check,
  LayoutDashboard,
  Calendar,
  MapPin,
  Filter,
  TrendingUp,
  Award,
  Activity,
  Download,
  Upload,
  Settings,
  Star,
  ExternalLink,
  Play,
  Package,
  ArrowRight,
  Sparkles,
  Layers,
  Tag,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Globe,
  Cpu,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Helpers
type JsonErr = { detail?: string;[k: string]: any };

async function extractError(res: Response): Promise<JsonErr> {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!json || (typeof json === 'object' && Object.keys(json).length === 0)) {
      return { detail: `Request failed with status ${res.status} (empty JSON)` };
    }
    return json;
  } catch {
    return { detail: text || `Request failed with status ${res.status}` };
  }
}

export async function updateProductJson(
  id: number | string,
  token: string,
  body: Record<string, any>
) {
  // Use PUT because backend doesn't implement PATCH, but handles partial updates via partial=True logic in PUT
  // Use API_URL because no Next.js API route exists
  const res = await fetch(`${API_URL}/api/products/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw await extractError(res);
  }
  return await res.json();
}

export async function updateProductCoverFile(
  id: number | string,
  token: string,
  file: File
) {
  const form = new FormData();
  form.append("cover", file);
  const res = await fetch(
    `${API_URL}/api/products/${id}/`,
    {
      method: "PUT",
      headers: { Authorization: `JWT ${token}` },
      body: form,
    }
  );
  if (!res.ok) {
    throw await extractError(res);
  }
  return await res.json();
}


// Types
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  location: string;
  joinDate: string;
  skills: string[];
  status: "Active" | "Alumni";
  member_type: "founder" | "executive" | "employee" | "alumni";
  education?: string;
  achievements?: string[];
  experience?: string;
}

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  icon: string;
  category: string;
  technologies: string[];
  color: string;
  stats: Record<string, string>;
  details: string;
  challenges: string[];
  outcomes: string[];
  timeline: string;
  team: string;
  client: string;
  liveUrl?: string;
  videoUrl?: string;
  status: "completed" | "ongoing" | "planned";
  featured?: boolean;
  testimonial?: {
    name: string;
    role: string;
    image: string;
    quote: string;
    rating: number;
  };
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  iconText: string;
  cover: string;
  gallery: string[];
  description: string;
  fullDescription: string;
  features: string[];
  outcomes: string[];
  challenges: string[];
  technologies: string[];
  stats: { label: string; value: string }[];
  liveUrl?: string;
  status: "Live" | "In Development" | "Coming Soon";
  category: string;
  platforms: string[];
  integrations: string[];
  support: string[];
  documentationUrl?: string;
  demoUrl?: string;
  featured: boolean;
  sortOrder: number;
  timeline: string;
  createdAt: string;
  updatedAt: string;
}

// Initial Data
const initialTeam: TeamMember[] = [];
const initialProjects: Project[] = [];
const initialGallery: GalleryItem[] = [];
const initialProducts: Product[] = [];

// Project constants
const projectCategories = [
  "mobile",
  "fintech",
  "saas",
  "edtech",
  "ai",
  "blockchain",
  "devops",
  "ecommerce",
  "govtech",
  "enterprise",
];

const categoryLabels: Record<string, string> = {
  mobile: "Mobile App",
  fintech: "FinTech",
  saas: "SaaS",
  edtech: "Ed-Tech",
  ai: "AI & ML",
  blockchain: "Blockchain",
  devops: "DevOps",
  ecommerce: "E-Commerce",
  govtech: "GovTech",
  enterprise: "Enterprise",
};

const productCategories = [
  "education",
  "healthcare",
  "fintech",
  "saas",
  "ai-ml",
  "ecommerce",
  "enterprise",
  "business",
  "productivity",
  "analytics",
  "communication",
  "development",
  "design",
  "marketing",
];

const productCategoryLabels: Record<string, string> = {
  education: "Education",
  healthcare: "Healthcare",
  fintech: "FinTech",
  saas: "SaaS",
  "ai-ml": "AI & ML",
  ecommerce: "E-Commerce",
  enterprise: "Enterprise",
  business: "Business",
  productivity: "Productivity",
  analytics: "Analytics",
  communication: "Communication",
  development: "Development",
  design: "Design",
  marketing: "Marketing",
};

const colorOptions = [
  "from-blue-500 to-purple-600",
  "from-green-500 to-emerald-600",
  "from-orange-500 to-red-600",
  "from-purple-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-gray-600 to-gray-800",
  "from-cyan-500 to-blue-600",
  "from-yellow-500 to-orange-600",
  "from-teal-500 to-green-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
];

const platformOptions = [
  "web",
  "mobile",
  "desktop",
  "cloud",
  "self-hosted",
  "api",
  "browser-extension",
];

const integrationOptions = [
  "google-workspace",
  "microsoft-365",
  "slack",
  "zoom",
  "stripe",
  "paypal",
  "github",
  "gitlab",
  "jira",
  "notion",
  "salesforce",
  "hubspot",
];

const supportOptions = [
  "email",
  "phone",
  "chat",
  "documentation",
  "tutorials",
  "community-forum",
  "dedicated-support",
  "training-sessions",
];

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "Live":
      return "bg-green-500";
    case "ongoing":
    case "In Development":
      return "bg-blue-500";
    case "planned":
    case "Coming Soon":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "ongoing":
      return "Ongoing";
    case "planned":
      return "Planned";
    case "Live":
      return "Live";
    case "In Development":
      return "In Development";
    case "Coming Soon":
      return "Coming Soon";
    default:
      return status;
  }
};

const getPricingTypeColor = (type: string) => {
  switch (type) {
    case "free":
      return "bg-green-100 text-green-800";
    case "paid":
      return "bg-blue-100 text-blue-800";
    case "freemium":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const TeamModal = ({
  isOpen,
  onClose,
  member,
  onSave,
  isEdit = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: Partial<TeamMember> | null;
  onSave: (member: Partial<TeamMember>) => void;
  isEdit?: boolean;
}) => {
  const [localMember, setLocalMember] = useState<Partial<TeamMember>>(() => ({
    name: "",
    role: "",
    department: "",
    image: "",
    bio: "",
    location: "",
    joinDate: "",
    skills: [],
    status: "Active",
    member_type: "employee",
    education: "",
    achievements: [],
    experience: "",
  }));

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize only once when modal opens
  // Optimize state updates to avoid unnecessary re-renders but ensure editing works
  useEffect(() => {
    if (isOpen) {
      if (member) {
        setLocalMember({
          name: member.name || "",
          role: member.role || "",
          department: member.department || "",
          image: member.image || "",
          bio: member.bio || "",
          location: member.location || "",
          joinDate: member.joinDate || "",
          skills: member.skills || [],
          status: member.status || "Active",
          member_type: member.member_type || "employee",
          education: member.education || "",
          achievements: member.achievements || [],
          experience: member.experience || "",
        });

        if (member.image) {
          if (member.image.startsWith("http")) {
            setImagePreview(member.image);
          } else if (typeof member.image === "string") {
            setImagePreview(`${API_URL}${member.image}`);
          }
        } else {
          setImagePreview("");
        }
      } else {
        // Reset for new member
        setLocalMember({
          name: "",
          role: "",
          department: "",
          image: "",
          bio: "",
          location: "",
          joinDate: "",
          skills: [],
          status: "Active",
          member_type: "employee",
          education: "",
          achievements: [],
          experience: "",
        });
        setImagePreview("");
      }
    }
  }, [isOpen, member]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLocalMember((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    onSave(localMember);
  };

  const addSkill = () => {
    setLocalMember((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), ""],
    }));
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...(localMember.skills || [])];
    updatedSkills[index] = value;
    setLocalMember((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const removeSkill = (index: number) => {
    setLocalMember((prev) => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index) || [],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {isEdit ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  fill
                  className="rounded-full object-cover border-4 border-white shadow-lg"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {localMember.image ? "Change Photo" : "Upload Photo"}
                  </span>
                </Button>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                Recommended: Square image, 500x500px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Member Type *</Label>
              <select
                value={localMember.member_type}
                onChange={(e) =>
                  setLocalMember({
                    ...localMember,
                    member_type: e.target.value as any,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                <option value="employee">Employee</option>
                <option value="executive">Executive</option>
                <option value="founder">Founder</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div>
              <Label className="text-sm font-medium">Status</Label>
              <select
                value={localMember.status}
                onChange={(e) =>
                  setLocalMember({
                    ...localMember,
                    status: e.target.value as any,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                <option value="Active">Active</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div>
              <Label className="text-sm font-medium">Full Name *</Label>
              <Input
                value={localMember.name}
                onChange={(e) =>
                  setLocalMember({ ...localMember, name: e.target.value })
                }
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Role *</Label>
              <Input
                value={localMember.role}
                onChange={(e) =>
                  setLocalMember({ ...localMember, role: e.target.value })
                }
                placeholder="Software Engineer"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Department</Label>
              <Input
                value={localMember.department}
                onChange={(e) =>
                  setLocalMember({
                    ...localMember,
                    department: e.target.value,
                  })
                }
                placeholder="Engineering"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Location</Label>
              <Input
                value={localMember.location}
                onChange={(e) =>
                  setLocalMember({
                    ...localMember,
                    location: e.target.value,
                  })
                }
                placeholder="San Francisco, CA"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Join Date</Label>
              <Input
                type="date"
                value={localMember.joinDate || ""}
                onChange={(e) =>
                  setLocalMember({
                    ...localMember,
                    joinDate: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Education</Label>
              <Input
                value={localMember.education}
                onChange={(e) =>
                  setLocalMember({
                    ...localMember,
                    education: e.target.value,
                  })
                }
                placeholder="B.S. Computer Science"
                className="mt-1"
              />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Skills</Label>
              <Button
                type="button"
                onClick={addSkill}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Skill
              </Button>
            </div>
            <div className="space-y-2">
              {localMember.skills?.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label className="text-sm font-medium">Bio *</Label>
            <Textarea
              value={localMember.bio}
              onChange={(e) =>
                setLocalMember({ ...localMember, bio: e.target.value })
              }
              placeholder="Tell us about this team member..."
              rows={4}
              className="mt-1"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!localMember.name || !localMember.role || !localMember.bio}
            className="bg-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Update Member" : "Add Member"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("team");
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Team State
  // Team State - NEW VERSION
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeam);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamDeptFilter, setTeamDeptFilter] = useState("all");
  const [teamStatusFilter, setTeamStatusFilter] = useState("all");
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(
    null
  );
  const [isEditTeamMode, setIsEditTeamMode] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("all");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    shortDescription: "",
    description: "",
    category: "mobile",
    client: "",
    image: "",
    technologies: [],
    status: "planned",
    timeline: "",
    team: "",
    color: "from-blue-500 to-purple-600",
    featured: false,
    details: "",
    challenges: [],
    outcomes: [],
    stats: {},
    gallery: [],
    icon: "Briefcase",
    testimonial: undefined,
  });

  // Gallery State
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [editedGallery, setEditedGallery] = useState<Partial<GalleryItem>>({});
  const [gallerySearch, setGallerySearch] = useState("");
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState("all");
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState<Partial<GalleryItem>>({
    title: "",
    description: "",
    category: "",
    image: "",
    created_at: "",
  });

  // Products State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    tagline: "",
    iconText: "",
    cover: "",
    gallery: [],
    description: "",
    fullDescription: "",
    features: [],
    outcomes: [],
    challenges: [],
    technologies: [],
    stats: [],
    liveUrl: "",
    status: "In Development",
    category: "education",
    platforms: [],
    integrations: [],
    support: [],
    documentationUrl: "",
    demoUrl: "",
    featured: false,
    sortOrder: 0,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Toast effect
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Get unique values for filters
  const departments = [
    "all",
    ...Array.from(
      new Set(teamMembers.map((m) => m.department).filter(Boolean))
    ),
  ];
  const galleryCategories = [
    "all",
    "office",
    "events",
    "celebration",
    "others",
  ];

  // Filtered data for each section
  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      member.role.toLowerCase().includes(teamSearch.toLowerCase()) ||
      (member.department && member.department.toLowerCase().includes(teamSearch.toLowerCase()));

    const matchesDept = teamDeptFilter === "all" ||
      (member.department && member.department.toLowerCase().trim() === teamDeptFilter.toLowerCase().trim());

    const matchesStatus = teamStatusFilter === "all" ||
      (member.status && member.status.toLowerCase().trim() === teamStatusFilter.toLowerCase().trim());

    return matchesSearch && matchesDept && matchesStatus;
  });

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (project.shortDescription && project.shortDescription.toLowerCase().includes(projectSearch.toLowerCase())) ||
      (project.client && project.client.toLowerCase().includes(projectSearch.toLowerCase()));

    // Case-insensitive Category Check
    const matchesCategory =
      projectCategoryFilter === "all" ||
      (project.category && project.category.toLowerCase().trim() === projectCategoryFilter.toLowerCase().trim());

    // Case-insensitive Status Check
    const matchesStatus =
      projectStatusFilter === "all" ||
      (project.status && project.status.toLowerCase().trim() === projectStatusFilter.toLowerCase().trim());

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredGallery = gallery.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(gallerySearch.toLowerCase()));

    const matchesCategory = galleryCategoryFilter === "all" ||
      (item.category && item.category.toLowerCase().trim() === galleryCategoryFilter.toLowerCase().trim());

    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (product.tagline && product.tagline.toLowerCase().includes(productSearch.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesCategory = productCategoryFilter === "all" ||
      (product.category && product.category.toLowerCase().trim() === productCategoryFilter.toLowerCase().trim());

    const matchesStatus = productStatusFilter === "all" ||
      (product.status && product.status.toLowerCase().trim() === productStatusFilter.toLowerCase().trim());

    return matchesSearch && matchesCategory && matchesStatus;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access");
        const headers = { Authorization: `JWT ${access}` };
        try {
          const adminRes = await fetch(`${API_URL}/api/admin/dashboard/`, {
            headers,
          });
          if (adminRes.ok) {
            const adminData = await adminRes.json();
            setUser(adminData.user);
          } else if (adminRes.status === 404) {
            console.warn("Admin endpoint not found, using fallback");
            setUser({ username: "Admin" });
          } else {
            throw new Error(`Admin API failed with status: ${adminRes.status}`);
          }
        } catch (adminError) {
          console.warn("Admin fetch failed:", adminError);
          setUser({ username: "Admin" });
        }
        const [teamRes, projectRes, galleryRes, productsRes] =
          await Promise.all([
            fetch(`${API_URL}/api/team/`, { headers }),
            fetch(`${API_URL}/api/projects/`, { headers }),
            fetch(`${API_URL}/api/gallery/`, { headers }),
            fetch(`${API_URL}/api/products/`, { headers }),
          ]);

        if (teamRes.ok && projectRes.ok && galleryRes.ok) {
          setTeamMembers(await teamRes.json());
          setProjects(await projectRes.json());
          setGallery(await galleryRes.json());
        }

        if (productsRes.ok) {
          setProducts(await productsRes.json());
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Team Functions
  const handleAddTeamMember = () => {
    setEditingTeamMember(null);
    setIsEditTeamMode(false);
    setIsTeamModalOpen(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setIsEditTeamMode(true);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = async (memberData: Partial<TeamMember>) => {
    try {
      const access = localStorage.getItem("access");
      const formData = new FormData();

      // Add all fields to formData
      Object.entries(memberData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "image") {
          if ((value as any) instanceof File) {
            formData.append("image", value as File);
          }
          return;
        }

        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, (value as any).toString());
        }
      });

      let url = `${API_URL}/api/team/`;
      let method = "POST";

      if (isEditTeamMode && editingTeamMember?.id) {
        url = `${API_URL}/api/team/${editingTeamMember.id}/`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `JWT ${access}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        if (isEditTeamMode && editingTeamMember?.id) {
          setTeamMembers((prev) =>
            prev.map((m) => (m.id === editingTeamMember.id ? data : m))
          );
        } else {
          setTeamMembers((prev) => [...prev, data]);
        }

        setIsTeamModalOpen(false);
        setEditingTeamMember(null);

        alert(
          `Team member ${isEditTeamMode ? "updated" : "added"} successfully!`
        );
      } else {
        console.error("❌ Failed to save team member, status:", res.status);
        let errorDetail = "Unknown error";
        try {
          const text = await res.text();
          if (text) {
            try {
              const json = JSON.parse(text);
              errorDetail = json.detail || json.message || JSON.stringify(json);
            } catch {
              errorDetail = text;
            }
          } else {
            errorDetail = `Status ${res.status} (Empty response)`;
          }
        } catch (e) {
          errorDetail = "Could not read response";
        }
        console.error("Error detail:", errorDetail);
        alert(`Failed to save team member: ${errorDetail}`);
      }
    } catch (err) {
      console.error("Error saving team member:", err);
      alert("Error saving team member. Please try again.");
    }
  };

  const deleteTeamMember = async (member) => {
    try {
      const access = localStorage.getItem("access");
      const res = await fetch(`${API_URL}/api/team/${member.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${access}`,
        },
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert(`Failed to delete team member. Status: ${res.status}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting team member. Please try again.");
    }
  };

  // Project Functions
  const validateProject = (project: Partial<Project>): string[] => {
    const errors: string[] = [];
    if (!project.title?.trim()) errors.push("Title is required");
    if (!project.shortDescription?.trim())
      errors.push("Short description is required");
    if (project.shortDescription && project.shortDescription.length > 200) {
      errors.push("Short description should be under 200 characters");
    }
    if (project.testimonial?.quote && !project.testimonial.name) {
      errors.push("Client name is required if testimonial is provided");
    }
    return errors;
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit) {
        setEditedProject((prev) => ({
          ...prev,
          [field]: file,
        }));
      } else {
        setNewProject((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
    }
  };

  const addProject = async (newProjectData: Partial<Project>) => {
    const validationErrors = validateProject(newProjectData);
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n${validationErrors.join("\n")}`);
      return;
    }

    try {
      const access = localStorage.getItem("access");
      const formData = new FormData();

      // Basic fields
      formData.append("title", newProjectData.title || "");
      formData.append(
        "shortDescription",
        newProjectData.shortDescription || ""
      );
      formData.append("description", newProjectData.description || "");
      formData.append("category", newProjectData.category || "mobile");
      formData.append("client", newProjectData.client || "");
      formData.append("status", newProjectData.status || "planned");
      formData.append("timeline", newProjectData.timeline || "");
      formData.append("team", newProjectData.team || "");
      formData.append(
        "color",
        newProjectData.color || "from-blue-500 to-purple-600"
      );
      formData.append("icon", newProjectData.icon || "Briefcase");
      formData.append("details", newProjectData.details || "");
      formData.append("liveUrl", newProjectData.liveUrl || "");
      formData.append("videoUrl", newProjectData.videoUrl || "");
      formData.append("featured", newProjectData.featured ? "true" : "false");

      // Send as proper JSON strings
      formData.append(
        "technologies",
        JSON.stringify(
          typeof newProjectData.technologies === "string"
            ? newProjectData.technologies
              .split(",")
              .map((tech) => tech.trim())
              .filter((tech) => tech)
            : Array.isArray(newProjectData.technologies)
              ? newProjectData.technologies
              : []
        )
      );

      formData.append(
        "challenges",
        JSON.stringify(
          typeof newProjectData.challenges === "string"
            ? newProjectData.challenges
              .split("\n")
              .map((challenge) => challenge.trim())
              .filter((challenge) => challenge)
            : Array.isArray(newProjectData.challenges)
              ? newProjectData.challenges
              : []
        )
      );

      formData.append(
        "outcomes",
        JSON.stringify(
          typeof newProjectData.outcomes === "string"
            ? newProjectData.outcomes
              .split("\n")
              .map((outcome) => outcome.trim())
              .filter((outcome) => outcome)
            : Array.isArray(newProjectData.outcomes)
              ? newProjectData.outcomes
              : []
        )
      );

      // Default empty values for other JSON fields
      formData.append("stats", JSON.stringify(newProjectData.stats || {}));
      formData.append("gallery", JSON.stringify(newProjectData.gallery || []));

      // Testimonial fields
      formData.append(
        "testimonial_name",
        newProjectData.testimonial?.name || ""
      );
      formData.append(
        "testimonial_role",
        newProjectData.testimonial?.role || ""
      );
      formData.append(
        "testimonial_image",
        newProjectData.testimonial?.image || ""
      );
      formData.append(
        "testimonial_quote",
        newProjectData.testimonial?.quote || ""
      );
      formData.append(
        "testimonial_rating",
        newProjectData.testimonial?.rating?.toString() || "5"
      );

      if (newProjectData.image instanceof File) {
        formData.append("image", newProjectData.image);
      }

      const res = await fetch(`${API_URL}/api/projects/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${access}`,
        },
        body: formData,
      });

      if (res.ok) {
        const created = await res.json();
        setProjects((prev) => [...prev, created]);
        setIsAddProjectModalOpen(false);
        setNewProject({
          title: "",
          shortDescription: "",
          description: "",
          category: "mobile",
          client: "",
          image: "",
          technologies: "",
          status: "planned",
          timeline: "",
          team: "",
          color: "from-blue-500 to-purple-600",
          featured: false,
          details: "",
          challenges: "",
          outcomes: "",
          stats: {},
          gallery: [],
          icon: "Briefcase",
          testimonial: undefined,
        });
        alert("Project added successfully!");
      } else {
        const errorData = await res.json();
        console.error("Failed to add project:", errorData);
        alert(`Failed to add project: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Error adding project. Please try again.");
    }
  };

  const updateProject = async (id: string, updatedData: Partial<Project>) => {
    try {
      const access = localStorage.getItem("access");
      const formData = new FormData();

      console.log("🔄 Starting project update...", updatedData);

      Object.keys(updatedData).forEach((key) => {
        const value = updatedData[key as keyof Project];
        if (value === undefined || value === null) return;
        if (key === "id") return;

        // Handle Image
        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          }
          return; // Don't send string URL
        }

        // Handle Status (Backend expects lower case)
        if (key === "status") {
          formData.append("status", String(value).toLowerCase());
          return;
        }

        // Handle Category (Backend expects lower case)
        if (key === "category") {
          formData.append("category", String(value).toLowerCase());
          return;
        }

        // Handle Stats: Ensure it is sent as a List of Objects
        if (key === "stats") {
          let statsValue: any[] = [];

          try {
            // Case 1: Already an array
            if (Array.isArray(value)) {
              statsValue = value;
            }
            // Case 2: Stringified JSON
            else if (typeof value === 'string') {
              try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                  statsValue = parsed;
                } else if (typeof parsed === 'object' && parsed !== null) {
                  // Convert dict to list
                  statsValue = Object.entries(parsed).map(([k, v]) => ({ label: k, value: String(v) }));
                } else {
                  statsValue = []; // Invalid string format
                }
              } catch {
                statsValue = []; // Not JSON
              }
            }
            // Case 3: Object (Dictionary)
            else if (typeof value === 'object' && value !== null) {
              console.log("Converting stats object dict to array:", value);
              statsValue = Object.entries(value as Record<string, any>).map(([k, v]) => ({
                label: k,
                value: String(v)
              }));
            }
          } catch (e) {
            console.error("Error processing stats:", e);
            statsValue = [];
          }

          // FINAL VALIDATION: Ensure every item is an object with label/value
          statsValue = statsValue.map(item => {
            if (typeof item === 'object' && item !== null) {
              // Keep existing label/value or try to map key/value
              if ('label' in item && 'value' in item) return item;
              // Maybe it has key/value?
              if ('key' in item && 'value' in item) return { label: item.key, value: item.value };
            }
            return null;
          }).filter(item => item !== null);

          console.log("✅ Final Processed Stats for sending:", statsValue);
          formData.append(key, JSON.stringify(statsValue));
          return;
        }

        // Handle Arrays & Objects -> JSON String
        // Backend serializer now explicitly expects JSON strings for these fields
        // Only stringify if it's NOT a string, or if it IS an array/object
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
          formData.append(key, JSON.stringify(value));
        } else {
          // For simple strings, numbers, etc.
          formData.append(key, String(value));
        }
      });

      const res = await fetch(`${API_URL}/api/projects/${id}/`, {
        method: "PATCH", // Changed to PATCH for partial updates
        headers: { Authorization: `JWT ${access}` },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setIsEditProjectModalOpen(false);
        setEditingProject(null);
        setEditedProject({});
        // toast({ title: "Success", description: "Project updated successfully!" }); // Uncomment if toast is available
        alert("Project updated successfully!");
      } else {
        console.error("❌ Update failed with status:", res.status);

        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;

        // Get response text first
        const responseText = await res.text();
        console.log("📝 Server response:", responseText);

        if (!responseText) {
          if (res.status === 401) errorMessage = "Authentication failed. Token might be expired.";
          else if (res.status === 403) errorMessage = "Permission denied.";
          else if (res.status === 500) errorMessage = "Server error. Check Django terminal.";
          else errorMessage = `Server returned ${res.status} with empty response`;
        } else {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.detail
              || errorData.message
              || JSON.stringify(errorData);
          } catch {
            errorMessage = responseText.substring(0, 300);
          }
        }

        console.error("❌ Error message:", errorMessage);
        alert(`Failed to update project:\n${errorMessage}`);
      }
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Error updating project.");
    }
  };

  const deleteProject = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const access = localStorage.getItem("access");
      const res = await fetch(`${API_URL}/api/projects/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${access}`,
        },
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        alert("Project deleted successfully!");
      } else {
        alert("Failed to delete project. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project. Please try again.");
    }
  };

  const handleEditProject = (project: any) => {
    const mappedProject = {
      ...project,
      shortDescription: project.shortDescription || "",
      liveUrl: project.liveUrl || "",
      videoUrl: project.videoUrl || "",
      testimonial: project.testimonial_name
        ? {
          name: project.testimonial_name,
          role: project.testimonial_role || "",
          image: project.testimonial_image || "",
          quote: project.testimonial_quote || "",
          rating: project.testimonial_rating || 5,
        }
        : undefined,
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      challenges: Array.isArray(project.challenges)
        ? project.challenges.join("\n")
        : project.challenges || "",
      outcomes: Array.isArray(project.outcomes)
        ? project.outcomes.join("\n")
        : project.outcomes || "",
    };

    setEditingProject(mappedProject);
    setEditedProject({});
    setIsEditProjectModalOpen(true);
  };

  const resetNewProjectForm = () => {
    setNewProject({
      title: "",
      shortDescription: "",
      description: "",
      category: "mobile",
      client: "",
      image: "",
      technologies: [],
      status: "planned",
      timeline: "",
      team: "",
      color: "from-blue-500 to-purple-600",
      featured: false,
      details: "",
      challenges: [],
      outcomes: [],
      stats: {},
      gallery: [],
      icon: "Briefcase",
      testimonial: undefined,
    });
  };

  // Gallery Functions
  const resetGalleryForm = () => {
    setNewGalleryItem({
      title: "",
      description: "",
      category: "office",
      image: null,
    });
  };

  const addGalleryItem = async (newItem) => {
    setIsAddingGallery(true);
    try {
      const access = localStorage.getItem("access");

      const formData = new FormData();
      formData.append("title", newItem.title || "");
      formData.append("description", newItem.description || "");
      formData.append("category", newItem.category || "office");

      if (newItem.image instanceof File) {
        formData.append("image", newItem.image);
      }

      if (newItem.tags) {
        formData.append("tags", JSON.stringify(newItem.tags));
      }

      const res = await fetch(`${API_URL}/api/gallery/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${access}`,
        },
        body: formData,
      });

      if (res.ok) {
        const created = await res.json();
        setGallery((prev) => [...prev, created]);
        setIsAddGalleryModalOpen(false);
        resetGalleryForm();
        setShowToast(true);
      } else {
        const errorData = await res.json();
        console.error("Failed to add gallery item:", errorData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingGallery(false);
    }
  };

  const updateGalleryItem = async (id, updatedData) => {
    try {
      const access = localStorage.getItem("access");
      const formData = new FormData();

      Object.entries(updatedData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          }
          return;
        }

        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      const res = await fetch(`${API_URL}/api/gallery/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `JWT ${access}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setGallery((prev) => prev.map((g) => (g.id === id ? updated : g)));
        setEditingGalleryId(null);
        setEditedGallery({});
        alert("Gallery item updated successfully!");
      } else {
        const errorData = await res.json();
        console.error("Failed to update gallery item:", errorData);
        alert(`Failed to update gallery item: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGalleryItem = async (id) => {
    try {
      const access = localStorage.getItem("access");
      const res = await fetch(`${API_URL}/api/gallery/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${access}`,
        },
      });
      if (res.ok) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product Functions
  const validateProduct = (product: Partial<Product>): string[] => {
    const errors: string[] = [];
    if (!product.name?.trim()) errors.push("Product name is required");
    if (!product.tagline?.trim()) errors.push("Tagline is required");
    if (!product.description?.trim()) errors.push("Description is required");
    if (!product.fullDescription?.trim())
      errors.push("Full description is required");
    if (product.features && product.features.length === 0)
      errors.push("At least one feature is required");
    return errors;
  };

  const addProduct = async (newProductData: Partial<Product>) => {
    const validationErrors = validateProduct(newProductData);
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n${validationErrors.join("\n")}`);
      return;
    }

    try {
      const access = localStorage.getItem("access");
      const formData = new FormData();

      console.log("🔄 Starting product creation with FormData...");
      console.log("Product data:", newProductData);

      // ✅ FIX: Append all product data as FormData
      Object.keys(newProductData).forEach((key) => {
        const value = newProductData[key as keyof Product];

        if (value === undefined || value === null) return;

        // Handle files separately
        if (value instanceof File) {
          if (key === "cover") {
            console.log(`📁 Appending cover file: ${value.name}`);
            formData.append("cover", value);
          }
          return;
        }

        // Handle gallery files (gallery_0, gallery_1, etc.)
        if (key.startsWith("gallery_")) {
          if (value instanceof File) {
            console.log(`🖼️ Appending gallery file ${key}: ${value.name}`);
            formData.append(key, value);
          }
          return;
        }

        // Handle array fields as JSON
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
          console.log(`📊 Appending array ${key}:`, value);
        }
        // Handle object fields as JSON
        else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        }
        // Handle boolean fields
        else if (typeof value === "boolean") {
          formData.append(key, value.toString());
        }
        // Handle string/number fields
        else {
          formData.append(key, value.toString());
        }
      });

      // ✅ FIX: Also append gallery files that might not be in the main object
      // Extract gallery files from the data
      Object.keys(newProductData).forEach((key) => {
        if (key.startsWith("gallery_")) {
          const value = newProductData[key as keyof Product];
          if (value instanceof File) {
            console.log(`🖼️ Appending gallery file ${key}: ${value.name}`);
            formData.append(key, value);
          }
        }
      });

      // Debug: Check what's in FormData
      console.log("📋 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      const res = await fetch(`${API_URL}/api/products/`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${access}`,
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formData,
      });

      console.log("📨 Response status:", res.status);

      if (res.ok) {
        const created = await res.json();
        console.log("✅ Product created successfully:", created);
        setProducts((prev) => [...prev, created]);
        setIsAddProductModalOpen(false);
        resetNewProductForm();
        alert("Product added successfully!");
      } else {
        const errorData = await res.json();
        console.error("❌ Failed to add product:", errorData);
        alert(
          `Failed to add product: ${errorData.message || JSON.stringify(errorData)
          }`
        );
      }
    } catch (err) {
      console.error("💥 Error adding product:", err);
      alert("Error adding product. Please try again.");
    }
  };
  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const access = localStorage.getItem("access");
      if (!access) throw new Error("No access token");

      console.log("🔄 Starting product update...", updatedData);

      // Separate Files and JSON
      const jsonPayload: any = {};
      let coverFile: File | null = null;

      Object.keys(updatedData).forEach((key) => {
        const value = updatedData[key as keyof Product];

        // Skip metadata
        if (value === undefined) return;
        if (key === "id" || key === "createdAt" || key === "updatedAt" || key === "created_at" || key === "updated_at") return;
        if (key === "gallery") return;

        if (key === "cover") {
          if (value instanceof File) {
            coverFile = value;
          } else if (value === null || value === "") {
            // Clear cover
            jsonPayload.cover = null;
          }
          return;
        }

        // Handle other files - e.g. gallery 
        if (value instanceof File) return;

        jsonPayload[key] = value;
      });

      // 1. Send JSON Update
      if (Object.keys(jsonPayload).length > 0) {
        await updateProductJson(id, access, jsonPayload);
      }

      // 2. Upload Cover if needed
      if (coverFile) {
        await updateProductCoverFile(id, access, coverFile);
      }

      // Refresh Products - Re-fetch completely to be safe or optimistic update
      // Optimistic update for UI response speed
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;
          return {
            ...p,
            ...jsonPayload, // Apply JSON changes
            // We will update local state with what we know
            ...(coverFile ? { cover: URL.createObjectURL(coverFile) } : (jsonPayload.cover === null ? { cover: null } : {}))
          } as Product;
        })
      );

      // Also update edited product state if needed
      setEditingProduct(null);
      setIsEditProductModalOpen(false);
      setEditedProduct({});
      alert("Product updated successfully!");

    } catch (err: any) {
      console.error("Error updating product:", err);
      alert(`Failed to update product: ${err.detail || JSON.stringify(err)}`);
    }
  };

  const deleteProduct = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const access = localStorage.getItem("access");
      const res = await fetch(`${API_URL}/api/products/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${access}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product. Please try again.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditedProduct({});
    setIsEditProductModalOpen(true);
  };

  const resetNewProductForm = () => {
    setNewProduct({
      name: "",
      tagline: "",
      iconText: "",
      color: "from-blue-500 to-purple-600",
      cover: "",
      gallery: [],
      description: "",
      fullDescription: "",
      features: [],
      outcomes: [],
      challenges: [],
      technologies: [],
      stats: [],
      liveUrl: "",
      status: "In Development",
      category: "education",
      pricing: {
        type: "free",
        amount: 0,
        currency: "USD",
        period: "monthly",
      },
      platforms: [],
      integrations: [],
      support: [],
      documentationUrl: "",
      demoUrl: "",
      featured: false,
      sortOrder: 0,
    });
  };

  // Project Modal Component
  const ProjectModal = ({
    isOpen,
    onClose,
    project,
    onSave,
    isEdit = false,
  }: {
    isOpen: boolean;
    onClose: () => void;
    project: Partial<Project>;
    onSave: (project: Partial<Project>) => void;
    isEdit?: boolean;
  }) => {
    const [activeTab, setActiveTab] = useState("basic");
    const [statsList, setStatsList] = useState<{ key: string; value: string }[]>(
      []
    );
    const [localProject, setLocalProject] = useState<Partial<Project>>(() => {
      if (isEdit && project) {
        return {
          ...project,
          testimonial: project.testimonial_name
            ? {
              name: project.testimonial_name,
              role: project.testimonial_role || "",
              image: project.testimonial_image || "",
              quote: project.testimonial_quote || "",
              rating: project.testimonial_rating || 5,
            }
            : undefined,
          technologies: Array.isArray(project.technologies)
            ? project.technologies.join(", ")
            : project.technologies || "",
          challenges: Array.isArray(project.challenges)
            ? project.challenges.join("\n")
            : project.challenges || "",
          outcomes: Array.isArray(project.outcomes)
            ? project.outcomes.join("\n")
            : project.outcomes || "",
        };
      }
      return project;
    });

    useEffect(() => {
      // Ensure we transform arrays to strings for editing, matching the initializer logic
      setLocalProject({
        ...project,
        testimonial: project.testimonial_name
          ? {
            name: project.testimonial_name,
            role: project.testimonial_role || "",
            image: project.testimonial_image || "",
            quote: project.testimonial_quote || "",
            rating: project.testimonial_rating || 5,
          }
          : undefined,
        technologies: Array.isArray(project.technologies)
          ? project.technologies.join(", ")
          : project.technologies || "",
        challenges: Array.isArray(project.challenges)
          ? project.challenges.join("\n")
          : project.challenges || "",
        outcomes: Array.isArray(project.outcomes)
          ? project.outcomes.join("\n")
          : project.outcomes || "",
      });

      if (project.stats) {
        setStatsList(
          Object.entries(project.stats).map(([key, value]) => ({ key, value }))
        );
      } else {
        setStatsList([]);
      }
    }, [project]);

    if (!isOpen) return null;

    const handleSave = () => {
      const backendData: any = {
        ...localProject,
      };

      // Correctly handle JSON fields: Convert text input (string) back to Array
      if (typeof localProject.technologies === "string") {
        backendData.technologies = localProject.technologies.split(",").map(t => t.trim()).filter(Boolean);
      } else if (!Array.isArray(localProject.technologies)) {
        backendData.technologies = [];
      }

      if (typeof localProject.challenges === "string") {
        backendData.challenges = localProject.challenges.split("\n").map(c => c.trim()).filter(Boolean);
      } else if (!Array.isArray(localProject.challenges)) {
        backendData.challenges = [];
      }

      if (typeof localProject.outcomes === "string") {
        backendData.outcomes = localProject.outcomes.split("\n").map(o => o.trim()).filter(Boolean);
      } else if (!Array.isArray(localProject.outcomes)) {
        backendData.outcomes = [];
      }

      if (localProject.testimonial) {
        backendData.testimonial_name = localProject.testimonial.name || "";
        backendData.testimonial_role = localProject.testimonial.role || "";
        backendData.testimonial_image = localProject.testimonial.image || "";
        backendData.testimonial_quote = localProject.testimonial.quote || "";
        backendData.testimonial_rating = localProject.testimonial.rating || 5;
      } else {
        backendData.testimonial_name = "";
        backendData.testimonial_role = "";
        backendData.testimonial_image = "";
        backendData.testimonial_quote = "";
        backendData.testimonial_rating = 5;
      }

      delete backendData.testimonial;

      // Convert statsList to object
      const statsObj: Record<string, string> = {};
      statsList.forEach((stat) => {
        if (stat.key && stat.key.trim()) {
          statsObj[stat.key.trim()] = stat.value;
        }
      });
      backendData.stats = statsObj;
      backendData.gallery = backendData.gallery || [];
      backendData.featured = backendData.featured || false;

      onSave(backendData);
    };

    const handleImageUpload = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: string
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        setLocalProject((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {isEdit ? "Edit Project" : "Add New Project"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-6 gap-1">
                <TabsTrigger
                  value="basic"
                  className="text-xs py-2 px-1 truncate"
                >
                  Basic
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="text-xs py-2 px-1 truncate"
                >
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="text-xs py-2 px-1 truncate"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="testimonial"
                  className="text-xs py-2 px-1 truncate"
                >
                  Testimonial
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="text-xs py-2 px-1 truncate"
                >
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={localProject.title || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={localProject.category}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          category: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {projectCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="shortDescription">
                      Short Description *
                    </Label>
                    <Input
                      id="shortDescription"
                      value={localProject.shortDescription || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          shortDescription: e.target.value,
                        })
                      }
                      placeholder="Short description for cards"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {localProject.shortDescription?.length || 0}/200
                      characters
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={localProject.status}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          status: e.target.value as any,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="planned">Planned</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Input
                      id="client"
                      value={localProject.client || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          client: e.target.value,
                        })
                      }
                      placeholder="Client name or organization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={localProject.timeline || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          timeline: e.target.value,
                        })
                      }
                      placeholder="e.g., 6 months, Q2 2024"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={localProject.description || ""}
                    onChange={(e) =>
                      setLocalProject({
                        ...localProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Detailed project description..."
                    rows={4}
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div>
                  <Label htmlFor="details">Project Details</Label>
                  <Textarea
                    id="details"
                    value={localProject.details || ""}
                    onChange={(e) =>
                      setLocalProject({
                        ...localProject,
                        details: e.target.value,
                      })
                    }
                    placeholder="Comprehensive project overview, technical details, approach..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      value={localProject.team || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          team: e.target.value,
                        })
                      }
                      placeholder="e.g., 3 developers, 1 designer, 1 PM"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="technologies">
                      Technologies (comma separated)
                    </Label>
                    <Input
                      id="technologies"
                      value={
                        Array.isArray(localProject.technologies)
                          ? localProject.technologies.join(", ")
                          : localProject.technologies || ""
                      }
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          technologies: e.target.value,
                        })
                      }
                      placeholder="React, Node.js, MongoDB, AWS"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="challenges">
                      Challenges (one per line)
                    </Label>
                    <Textarea
                      id="challenges"
                      value={
                        Array.isArray(localProject.challenges)
                          ? localProject.challenges.join("\n")
                          : localProject.challenges || ""
                      }
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          challenges: e.target.value,
                        })
                      }
                      placeholder="Key challenges faced during project..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="outcomes">Outcomes (one per line)</Label>
                    <Textarea
                      id="outcomes"
                      value={
                        Array.isArray(localProject.outcomes)
                          ? localProject.outcomes.join("\n")
                          : localProject.outcomes || ""
                      }
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          outcomes: e.target.value,
                        })
                      }
                      placeholder="Key results and achievements..."
                      rows={4}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image">Upload Main Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "image")}
                      className="h-10"
                    />
                    {localProject.image instanceof File && (
                      <p className="text-xs text-green-600 mt-1">
                        Selected: {localProject.image.name}
                      </p>
                    )}
                    {typeof localProject.image === "string" &&
                      localProject.image && (
                        <p className="text-xs text-gray-600 mt-1">
                          Current image: {localProject.image}
                        </p>
                      )}
                  </div>
                  <div>
                    <Label htmlFor="liveUrl">Live Project URL</Label>
                    <Input
                      id="liveUrl"
                      value={localProject.liveUrl || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          liveUrl: e.target.value,
                        })
                      }
                      placeholder="https://project-domain.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={localProject.videoUrl || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          videoUrl: e.target.value,
                        })
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery">
                      Gallery Images (comma separated URLs)
                    </Label>
                    <Input
                      id="gallery"
                      value={localProject.gallery?.join(", ") || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          gallery: e.target.value
                            .split(",")
                            .map((url) => url.trim())
                            .filter((url) => url !== ""),
                        })
                      }
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="testimonial" className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Client Testimonial
                    </span>
                  </div>
                  <p className="text-blue-700 text-xs mt-1">
                    Add a client testimonial to showcase feedback for this
                    project.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testimonialName">Client Name</Label>
                    <Input
                      id="testimonialName"
                      value={localProject.testimonial?.name || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          testimonial: {
                            ...localProject.testimonial,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Dr. Sarah Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="testimonialRole">
                      Client Role & Company
                    </Label>
                    <Input
                      id="testimonialRole"
                      value={localProject.testimonial?.role || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          testimonial: {
                            ...localProject.testimonial,
                            role: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g., Dean of Technology, Westlake University"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="testimonialImage">Client Photo URL</Label>
                    <Input
                      id="testimonialImage"
                      value={localProject.testimonial?.image || ""}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          testimonial: {
                            ...localProject.testimonial,
                            image: e.target.value,
                          },
                        })
                      }
                      placeholder="https://example.com/client-photo.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="testimonialRating">Rating</Label>
                    <div className="flex items-center gap-2">
                      <select
                        id="testimonialRating"
                        value={localProject.testimonial?.rating || 5}
                        onChange={(e) =>
                          setLocalProject({
                            ...localProject,
                            testimonial: {
                              ...localProject.testimonial,
                              rating: parseInt(e.target.value),
                            },
                          })
                        }
                        className="flex h-10 w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} {rating === 1 ? "Star" : "Stars"}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < (localProject.testimonial?.rating || 5)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="testimonialQuote">Testimonial Quote</Label>
                  <Textarea
                    id="testimonialQuote"
                    value={localProject.testimonial?.quote || ""}
                    onChange={(e) =>
                      setLocalProject({
                        ...localProject,
                        testimonial: {
                          ...localProject.testimonial,
                          quote: e.target.value,
                        },
                      })
                    }
                    placeholder="Client's testimonial about the project..."
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeTestimonial"
                    checked={!!localProject.testimonial?.name}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setLocalProject({
                          ...localProject,
                          testimonial: undefined,
                        });
                      } else {
                        setLocalProject({
                          ...localProject,
                          testimonial: {
                            name: "",
                            role: "",
                            image: "",
                            quote: "",
                            rating: 5,
                          },
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="includeTestimonial"
                    className="text-sm font-medium leading-none"
                  >
                    Include Client Testimonial
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Color Gradient</Label>
                    <select
                      id="color"
                      value={localProject.color}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          color: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {colorOptions.map((color) => (
                        <option key={color} value={color}>
                          {color.replace("from-", "").replace("to-", " → ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <select
                      id="icon"
                      value={localProject.icon}
                      onChange={(e) =>
                        setLocalProject({
                          ...localProject,
                          icon: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Briefcase">Briefcase</option>
                      <option value="GraduationCap">Graduation Cap</option>
                      <option value="Brain">Brain (AI)</option>
                      <option value="BarChart">Bar Chart</option>
                      <option value="Database">Database</option>
                      <option value="ShoppingCart">Shopping Cart</option>
                      <option value="Globe">Globe</option>
                      <option value="Server">Server</option>
                      <option value="Blocks">Blocks</option>
                      <option value="Code">Code</option>
                      <option value="Smartphone">Smartphone</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Project Statistics</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setStatsList([...statsList, { key: "", value: "" }])
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Stat
                    </Button>
                  </div>

                  {statsList.map((stat, index) => (
                    <div key={index} className="flex gap-2 items-start mb-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Label (e.g., Users)"
                          value={stat.key}
                          onChange={(e) => {
                            const newStats = [...statsList];
                            newStats[index] = { ...newStats[index], key: e.target.value };
                            setStatsList(newStats);
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Value (e.g., 10K+)"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...statsList];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            setStatsList(newStats);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          const newStats = statsList.filter((_, i) => i !== index);
                          setStatsList(newStats);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {statsList.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4 border border-dashed rounded-lg">
                      No statistics added yet. Click "Add Stat" to start.
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={localProject.featured || false}
                    onChange={(e) =>
                      setLocalProject({
                        ...localProject,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none"
                  >
                    Featured Project
                  </Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!localProject.title || !localProject.shortDescription}
                className="bg-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Update Project" : "Add Project"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Product Modal Component
  // Product Modal Component - Simplified version
  // Product Modal Component - Fixed version (no blinking on scroll)
  const ProductModal = ({
    isOpen,
    onClose,
    product,
    onSave,
    isEdit = false,
  }: {
    isOpen: boolean;
    onClose: () => void;
    product: Partial<Product>;
    onSave: (product: Partial<Product>) => void;
    isEdit?: boolean;
  }) => {
    const [activeTab, setActiveTab] = useState("basic");
    const isInitialMount = useRef(true);

    // Use a state that persists across re-renders
    const [localProduct, setLocalProduct] = useState<Partial<Product>>(() => {
      return {
        name: "",
        tagline: "",
        iconText: "",
        cover: "",
        description: "",
        fullDescription: "",
        features: [],
        outcomes: [],
        challenges: [],
        technologies: [],
        stats: [],
        liveUrl: "",
        status: "In Development",
        category: "education",
        platforms: [],
        integrations: [],
        support: [],
        documentationUrl: "",
        demoUrl: "",
        featured: false,
        sortOrder: 0,
        timeline: "",
        ...product,
      };
    });

    // ✅ FIX: Separate state for gallery files (not part of product data)
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<any[]>(
      []
    );

    // Only update when modal opens or product data fundamentally changes
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      // Only update when the modal opens with new product data
      if (isOpen && product) {
        setLocalProduct((prev) => ({
          ...prev,
          ...product,
        }));
        // Reset gallery files when editing existing product
        setGalleryFiles([]);
      }
    }, [isOpen, product]);
    // Fetch existing gallery images when editing
    useEffect(() => {
      if (isOpen && isEdit && product?.id) {
        const fetchGalleryImages = async () => {
          try {
            const access = localStorage.getItem("access");
            const res = await fetch(
              `${API_URL}/api/products/${product.id}/gallery/`,
              {
                headers: {
                  Authorization: `JWT ${access}`,
                },
              }
            );
            if (res.ok) {
              const galleryData = await res.json();
              setExistingGalleryImages(galleryData);
            }
          } catch (err) {
            console.error("Error fetching gallery images:", err);
          }
        };
        fetchGalleryImages();
      } else {
        setExistingGalleryImages([]);
      }
    }, [isOpen, isEdit, product?.id]);

    // Reset form only when modal completely closes
    useEffect(() => {
      if (!isOpen) {
        const timer = setTimeout(() => {
          if (!isEdit) {
            setLocalProduct({
              name: "",
              tagline: "",
              iconText: "",
              cover: "",
              description: "",
              fullDescription: "",
              features: [],
              outcomes: [],
              challenges: [],
              technologies: [],
              stats: [],
              liveUrl: "",
              status: "In Development",
              category: "education",
              platforms: [],
              integrations: [],
              support: [],
              documentationUrl: "",
              demoUrl: "",
              featured: false,
              sortOrder: 0,
              timeline: "",
            });
            setGalleryFiles([]);
          }
          setActiveTab("basic");
        }, 300);
        return () => clearTimeout(timer);
      }
    }, [isOpen, isEdit]);

    // Don't return null - keep the modal in DOM but hide it
    if (!isOpen) {
      return (
        <div style={{ display: "none" }}>
          {/* Hidden placeholder to maintain state */}
        </div>
      );
    }

    const handleSave = () => {
      // 🔍 DEBUG: Log category at the start
      console.log("🔍 [ProductModal.handleSave] START");
      console.log("🔍 [ProductModal.handleSave] localProduct.category:", localProduct.category);
      console.log("🔍 [ProductModal.handleSave] typeof category:", typeof localProduct.category);

      // ✅ FIX: Create FormData to properly handle file uploads
      const formData = new FormData();

      // Append all product data
      Object.keys(localProduct).forEach((key) => {
        const value = localProduct[key as keyof Product];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else if (value instanceof File) {
            // Files will be handled separately
            if (key === "cover") {
              formData.append("cover", value);
            }
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // ✅ FIX: Append gallery files with proper field names
      galleryFiles.forEach((file, index) => {
        console.log(`🖼️ Adding gallery file gallery_${index}:`, file.name);
        formData.append(`gallery_${index}`, file);
      });

      // Convert FormData back to object for the onSave function
      // This is a bit hacky but maintains your existing API
      const productData: any = {
        ...localProduct,
      };

      // Add gallery files directly to the object
      galleryFiles.forEach((file, index) => {
        productData[`gallery_${index}`] = file;
      });

      // 🔍 DEBUG: Log category before sending
      console.log("🔍 [ProductModal.handleSave] productData.category:", productData.category);
      console.log("🔍 [ProductModal.handleSave] Full productData:", productData);

      console.log("📤 Sending product data with gallery files:", {
        product: localProduct,
        galleryFiles: galleryFiles.map((f) => f.name),
        formDataKeys: Array.from(formData.keys()),
      });

      onSave(productData);
    };

    const handleImageUpload = (
      e: React.ChangeEvent<HTMLInputElement>,
      field: string
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        setLocalProduct((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newGallery = Array.from(files);
        setGalleryFiles((prev) => [...prev, ...newGallery]);
      }
    };

    const removeGalleryImage = (index: number) => {
      setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const deleteExistingGalleryImage = async (galleryId: number) => {
      try {
        const access = localStorage.getItem("access");
        const res = await fetch(
          `${API_URL}/api/products/gallery/${galleryId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `JWT ${access}`,
            },
          }
        );

        if (res.ok) {
          setExistingGalleryImages((prev) =>
            prev.filter((img) => img.id !== galleryId)
          );
        } else {
          alert("Failed to delete gallery image");
        }
      } catch (err) {
        console.error("Error deleting gallery image:", err);
        alert("Error deleting gallery image");
      }
    };

    const addFeature = () => {
      setLocalProduct((prev) => ({
        ...prev,
        features: [...(prev.features || []), ""],
      }));
    };

    const updateFeature = (index: number, value: string) => {
      const updatedFeatures = [...(localProduct.features || [])];
      updatedFeatures[index] = value;
      setLocalProduct((prev) => ({
        ...prev,
        features: updatedFeatures,
      }));
    };

    const removeFeature = (index: number) => {
      setLocalProduct((prev) => ({
        ...prev,
        features: prev.features?.filter((_, i) => i !== index) || [],
      }));
    };

    // Outcomes Helpers
    const addOutcome = () => {
      setLocalProduct((prev) => ({
        ...prev,
        outcomes: [...(prev.outcomes || []), ""],
      }));
    };

    const updateOutcome = (index: number, value: string) => {
      const updated = [...(localProduct.outcomes || [])];
      updated[index] = value;
      setLocalProduct((prev) => ({
        ...prev,
        outcomes: updated,
      }));
    };

    const removeOutcome = (index: number) => {
      setLocalProduct((prev) => ({
        ...prev,
        outcomes: prev.outcomes?.filter((_, i) => i !== index) || [],
      }));
    };

    // Challenges Helpers
    const addChallenge = () => {
      setLocalProduct((prev) => ({
        ...prev,
        challenges: [...(prev.challenges || []), ""],
      }));
    };

    const updateChallenge = (index: number, value: string) => {
      const updated = [...(localProduct.challenges || [])];
      updated[index] = value;
      setLocalProduct((prev) => ({
        ...prev,
        challenges: updated,
      }));
    };

    const removeChallenge = (index: number) => {
      setLocalProduct((prev) => ({
        ...prev,
        challenges: prev.challenges?.filter((_, i) => i !== index) || [],
      }));
    };

    const addStat = () => {
      setLocalProduct((prev) => ({
        ...prev,
        stats: [...(prev.stats || []), { label: "", value: "" }],
      }));
    };

    const updateStat = (index: number, field: string, value: string) => {
      const updatedStats = [...(localProduct.stats || [])];
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      setLocalProduct((prev) => ({
        ...prev,
        stats: updatedStats,
      }));
    };

    const removeStat = (index: number) => {
      setLocalProduct((prev) => ({
        ...prev,
        stats: prev.stats?.filter((_, i) => i !== index) || [],
      }));
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6 gap-1">
                <TabsTrigger
                  value="basic"
                  className="text-xs py-2 px-1 truncate"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="description"
                  className="text-xs py-2 px-1 truncate"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="text-xs py-2 px-1 truncate"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="text-xs py-2 px-1 truncate"
                >
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* BASIC TAB */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={localProduct.name || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline *</Label>
                    <Input
                      id="tagline"
                      value={localProduct.tagline || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          tagline: e.target.value,
                        })
                      }
                      placeholder="Short catchy tagline"
                    />
                  </div>
                  <div>
                    <Label htmlFor="iconText">Icon Text</Label>
                    <Input
                      id="iconText"
                      value={localProduct.iconText || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          iconText: e.target.value,
                        })
                      }
                      placeholder="Single character or short text"
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      value={localProduct.category}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          category: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {productCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {productCategoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={localProduct.status}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          status: e.target.value as any,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Live">Live</option>
                      <option value="In Development">In Development</option>
                      <option value="Coming Soon">Coming Soon</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={localProduct.timeline || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          timeline: e.target.value,
                        })
                      }
                      placeholder="e.g., Q3 2024, 6 months"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="liveUrl">Live URL</Label>
                    <Input
                      id="liveUrl"
                      value={localProduct.liveUrl || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          liveUrl: e.target.value,
                        })
                      }
                      placeholder="https://product-domain.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="demoUrl">Demo URL</Label>
                    <Input
                      id="demoUrl"
                      value={localProduct.demoUrl || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          demoUrl: e.target.value,
                        })
                      }
                      placeholder="https://demo.product.com"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* DESCRIPTION TAB */}
              <TabsContent value="description" className="space-y-4">
                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={localProduct.description || ""}
                    onChange={(e) =>
                      setLocalProduct({
                        ...localProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description for product cards..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {localProduct.description?.length || 0}/300 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="fullDescription">Full Description *</Label>
                  <Textarea
                    id="fullDescription"
                    value={localProduct.fullDescription || ""}
                    onChange={(e) =>
                      setLocalProduct({
                        ...localProduct,
                        fullDescription: e.target.value,
                      })
                    }
                    placeholder="Comprehensive product description with details..."
                    rows={6}
                  />
                </div>

                {/* Technologies Field */}
                <div>
                  <Label htmlFor="technologies">Technologies</Label>
                  <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md min-h-10 bg-white">
                    {localProduct.technologies?.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 text-xs"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTech =
                              localProduct.technologies?.filter(
                                (_, i) => i !== index
                              ) || [];
                            setLocalProduct({
                              ...localProduct,
                              technologies: updatedTech,
                            });
                          }}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    <input
                      type="text"
                      className="flex-1 outline-none border-none bg-transparent text-sm min-w-[120px]"
                      placeholder={
                        localProduct.technologies?.length === 0
                          ? "Type technology and press Enter or comma..."
                          : "Add more technologies..."
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (
                            value &&
                            !localProduct.technologies?.includes(value)
                          ) {
                            const updatedTech = [
                              ...(localProduct.technologies || []),
                              value,
                            ];
                            setLocalProduct({
                              ...localProduct,
                              technologies: updatedTech,
                            });
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value.trim();
                        if (
                          value &&
                          !localProduct.technologies?.includes(value)
                        ) {
                          const updatedTech = [
                            ...(localProduct.technologies || []),
                            value,
                          ];
                          setLocalProduct({
                            ...localProduct,
                            technologies: updatedTech,
                          });
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Type technology and press Enter or comma to add. Click × to
                    remove.
                  </p>
                </div>

                {/* Outcomes and Challenges */}
                {/* Outcomes and Challenges - Dynamic Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Outcomes */}
                  <div className="p-3 border rounded-lg bg-gray-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-semibold">Outcomes / Improvements</Label>
                      <Button
                        type="button"
                        onClick={addOutcome}
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs bg-white hover:bg-green-50 hover:text-green-600 border-dashed"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {localProduct.outcomes?.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center group">
                          <span className="text-xs text-gray-400 w-4 text-center">{index + 1}</span>
                          <Input
                            value={item}
                            onChange={(e) => updateOutcome(index, e.target.value)}
                            placeholder="e.g. Improved efficiency by 50%"
                            className="flex-1 h-8 text-sm bg-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOutcome(index)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!localProduct.outcomes?.length) && (
                        <div className="text-center py-4 text-gray-400 text-xs italic border border-dashed rounded bg-white">
                          No outcomes added. Click 'Add' to list product improvements.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="p-3 border rounded-lg bg-gray-50/50">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-semibold">Challenges / Issues Solved</Label>
                      <Button
                        type="button"
                        onClick={addChallenge}
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs bg-white hover:bg-blue-50 hover:text-blue-600 border-dashed"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {localProduct.challenges?.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center group">
                          <span className="text-xs text-gray-400 w-4 text-center">{index + 1}</span>
                          <Input
                            value={item}
                            onChange={(e) => updateChallenge(index, e.target.value)}
                            placeholder="e.g. Scalability under load"
                            className="flex-1 h-8 text-sm bg-white"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeChallenge(index)}
                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!localProduct.challenges?.length) && (
                        <div className="text-center py-4 text-gray-400 text-xs italic border border-dashed rounded bg-white">
                          No challenges added. Click 'Add' to list issues solved.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* MEDIA TAB - FIXED */}
              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cover">Cover Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "cover")}
                      className="h-10"
                    />
                    {localProduct.cover instanceof File && (
                      <p className="text-xs text-green-600 mt-1">
                        Selected: {localProduct.cover.name}
                      </p>
                    )}
                    {typeof localProduct.cover === "string" &&
                      localProduct.cover && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-gray-600">
                              Current cover image:
                            </p>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setLocalProduct({
                                  ...localProduct,
                                  cover: "",
                                })
                              }
                              className="h-6 px-2 text-xs"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                          <img
                            src={
                              localProduct.cover.startsWith("http")
                                ? localProduct.cover
                                : `${API_URL}${localProduct.cover}`
                            }
                            alt="Cover preview"
                            className="w-32 h-32 object-cover rounded-lg mt-1"
                          />
                        </div>
                      )}
                  </div>
                  <div>
                    <Label htmlFor="gallery">Gallery Images</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryUpload}
                      className="h-10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select multiple images for product gallery
                    </p>
                  </div>
                </div>

                {/* ✅ FIXED: Gallery Preview showing BOTH existing and new images */}
                {(galleryFiles.length > 0 ||
                  existingGalleryImages.length > 0) && (
                    <div>
                      <Label>
                        Gallery Preview ({galleryFiles.length} new,{" "}
                        {existingGalleryImages.length} existing)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {/* Existing gallery images */}
                        {existingGalleryImages.map((image, index) => (
                          <div
                            key={`existing-${image.id}`}
                            className="relative group"
                          >
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={`${API_URL}${image.image}`}
                                alt={`Existing gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteExistingGalleryImage(image.id)}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}

                        {/* New gallery files */}
                        {galleryFiles.map((file, index) => (
                          <div key={`new-${index}`} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`New gallery ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Show message if gallery is empty */}
                {galleryFiles.length === 0 &&
                  existingGalleryImages.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        No gallery images added yet
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Upload images using the file input above
                      </p>
                    </div>
                  )}
              </TabsContent>

              {/* ADVANCED TAB */}
              <TabsContent value="advanced" className="space-y-4">
                {/* Features Section */}
                <div className="flex justify-between items-center">
                  <Label>Features *</Label>
                  <Button type="button" onClick={addFeature} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-3">
                  {localProduct.features?.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Statistics Section */}
                <div className="flex justify-between items-center mt-6">
                  <Label>Statistics</Label>
                  <Button type="button" onClick={addStat} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Stat
                  </Button>
                </div>

                <div className="space-y-3">
                  {localProduct.stats?.map((stat, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        value={stat.label}
                        onChange={(e) =>
                          updateStat(index, "label", e.target.value)
                        }
                        placeholder="Label (e.g., Active Users)"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={stat.value}
                          onChange={(e) =>
                            updateStat(index, "value", e.target.value)
                          }
                          placeholder="Value (e.g., 50K+)"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeStat(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Advanced Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <Label htmlFor="documentationUrl">Documentation URL</Label>
                    <Input
                      id="documentationUrl"
                      value={localProduct.documentationUrl || ""}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          documentationUrl: e.target.value,
                        })
                      }
                      placeholder="https://docs.product.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={localProduct.sortOrder || 0}
                      onChange={(e) =>
                        setLocalProduct({
                          ...localProduct,
                          sortOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lower numbers appear first
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={localProduct.featured || false}
                    onChange={(e) =>
                      setLocalProduct({
                        ...localProduct,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="featured"
                    className="text-sm font-medium leading-none"
                  >
                    Featured Product
                  </Label>
                </div>
              </TabsContent>
            </Tabs>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={
                  !localProduct.name ||
                  !localProduct.tagline ||
                  !localProduct.description ||
                  !localProduct.fullDescription
                }
                className="bg-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Add this COMPONENT right after your ProductModal component
  // Move this TeamModal component OUTSIDE the AdminDashboard function
  // Place it right after the ProductModal component (around line 1600)



  // Then remove the TeamModal component that's INSIDE the AdminDashboard function
  // (the one starting around line 1400 in your current code)

  // Filtered Data
  // Duplicate filters removed. Using the robust case-insensitive filters defined at the top of the component.


  // Stats calculations
  const activeTeam = teamMembers.filter((m) => m.status === "Active").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  const ongoingProjects = projects.filter((p) => p.status === "ongoing").length;
  const liveProducts = products.filter((p) => p.status === "Live").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative">
      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-500 transition-transform duration-100"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "0%",
          }}
        />
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ Image added successfully!
        </div>
      )}

      <div className="container mx-auto px-3 md:px-6 py-20 md:py-24">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Top Header Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <h1 className="text-4xl font-bold mb-6 text-card-foreground">
                    Welcome, {user?.username || "Admin"} 👋
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your content efficiently
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Total Team</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.length}
              </p>
              <p className="text-xs text-green-600 mt-1">{activeTeam} Active</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {ongoingProjects} Ongoing
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
              <p className="text-xs text-green-600 mt-1">{liveProducts} Live</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedProjects}
              </p>
              <p className="text-xs text-green-600 mt-1">Projects Done</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-pink-600" />
                </div>
                <Activity className="w-4 h-4 text-pink-500" />
              </div>
              <p className="text-xs text-gray-500 mb-1">Gallery Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {gallery.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Total Images</p>
            </motion.div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-1 mb-6">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
                <TabsTrigger
                  value="team"
                  className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
                >
                  <Users className="w-4 h-4 mr-1" />
                  Team ({teamMembers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
                >
                  <Briefcase className="w-4 h-4 mr-1" />
                  Projects ({projects.length})
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
                >
                  <Package className="w-4 h-4 mr-1" />
                  Products ({products.length})
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="text-xs md:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg"
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Gallery ({gallery.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TEAM TAB */}
            <TabsContent value="team">
              <div className="space-y-4">
                {/* Team Filters Section */}
                <Card className="bg-white border-gray-100 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        Filters & Search
                      </CardTitle>
                      <Button
                        onClick={handleAddTeamMember}
                        size="sm"
                        className="bg-gradient-to-r from-primary to-blue-600 text-white text-xs h-8"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Member
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search by name or role..."
                          value={teamSearch}
                          onChange={(e) => setTeamSearch(e.target.value)}
                          className="h-9 text-sm pl-9 border-gray-200"
                        />
                      </div>
                      <select
                        value={teamDeptFilter}
                        onChange={(e) => setTeamDeptFilter(e.target.value)}
                        className="h-9 text-sm rounded-md border border-gray-200 bg-background px-3"
                      >
                        <option value="all">All Member Types</option>
                        <option value="founder">Founders</option>
                        <option value="executive">Executives</option>
                        <option value="employee">Employees</option>
                      </select>
                      <select
                        value={teamStatusFilter}
                        onChange={(e) => setTeamStatusFilter(e.target.value)}
                        className="h-9 text-sm rounded-md border border-gray-200 bg-background px-3"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="alumni">Alumni</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {filteredTeam.length} Result
                          {filteredTeam.length !== 1 ? "s" : ""}
                        </Badge>
                        {(teamSearch ||
                          teamDeptFilter !== "all" ||
                          teamStatusFilter !== "all") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => {
                                setTeamSearch("");
                                setTeamDeptFilter("all");
                                setTeamStatusFilter("all");
                              }}
                            >
                              <X className="w-3 h-3 mr-1" />
                              Clear
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Table */}
                {/* Team Table */}
                <Card className="bg-white border-gray-100 shadow-md">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-sm font-semibold text-gray-700">
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <div className="overflow-x-auto">
                    {/* Desktop View */}
                    <table className="w-full hidden md:table">
                      <thead className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-b">
                        <tr>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Profile
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Name
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Type
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Role
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Department
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Status
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Location
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Join Date
                          </th>
                          <th className="text-left p-2 md:p-3 text-xs font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTeam.map((member) => (
                          <tr
                            key={member.id}
                            className="border-b hover:bg-blue-50/50"
                          >
                            <td className="p-2 md:p-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src={
                                    member.image?.startsWith("http")
                                      ? member.image
                                      : member.image
                                        ? `${API_URL}${member.image}`
                                        : "/default-avatar.png"
                                  }
                                  alt={member.name}
                                  fill
                                  className="rounded-full object-cover"
                                  sizes="40px"
                                />
                              </div>
                            </td>
                            <td className="p-2 md:p-3">
                              <p className="text-xs font-semibold">
                                {member.name}
                              </p>
                            </td>
                            <td className="p-2 md:p-3">
                              <Badge variant="outline" className="text-xs">
                                {member.member_type}
                              </Badge>
                            </td>
                            <td className="p-2 md:p-3">
                              <p className="text-xs">{member.role}</p>
                            </td>
                            <td className="p-2 md:p-3">
                              <Badge variant="outline" className="text-xs">
                                {member.department}
                              </Badge>
                            </td>
                            <td className="p-2 md:p-3">
                              <Badge
                                className={`text-xs ${member.status.toLowerCase() === "active"
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                                  }`}
                              >
                                {member.status}
                              </Badge>
                            </td>
                            <td className="p-2 md:p-3">
                              <p className="text-xs">{member.location}</p>
                            </td>
                            <td className="p-2 md:p-3">
                              <p className="text-xs">
                                {member.joinDate || "-"}
                              </p>
                            </td>
                            <td className="p-2 md:p-3">
                              <div className="flex justify-end gap-1">
                                <Button
                                  onClick={() => handleEditTeamMember(member)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    const confirmed = window.confirm(
                                      `Are you sure you want to delete ${member.name}? This action cannot be undone.`
                                    );
                                    if (confirmed) {
                                      deleteTeamMember(member);
                                    }
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile View */}
                    <div className="block md:hidden space-y-3 p-3">
                      {filteredTeam.map((member) => (
                        <Card key={member.id} className="p-4 border shadow-sm">
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                  src={
                                    member.image?.startsWith("http")
                                      ? member.image
                                      : member.image
                                        ? `${API_URL}${member.image}`
                                        : "/default-avatar.png"
                                  }
                                  alt={member.name}
                                  fill
                                  className="rounded-full object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div>
                                  <p className="text-sm font-semibold truncate">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {member.role}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {member.member_type}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {member.department}
                                    </Badge>
                                    <Badge
                                      className={`text-xs ${member.status.toLowerCase() === "active"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                        }`}
                                    >
                                      {member.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{member.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span>{member.joinDate || "-"}</span>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                              <Button
                                onClick={() => handleEditTeamMember(member)}
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => {
                                  const confirmed = window.confirm(
                                    `Are you sure you want to delete ${member.name}? This action cannot be undone.`
                                  );
                                  if (confirmed) {
                                    deleteTeamMember(member);
                                  }
                                }}
                                variant="destructive"
                                size="sm"
                                className="h-8 px-3 text-xs"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* PROJECTS TAB */}
            <TabsContent value="projects">
              <div className="space-y-6">



                {/* New Admin Header & Filter Section */}
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 tracking-tight">Projects Management</h2>
                      <p className="text-muted-foreground">Manage and organize your project portfolio</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          className="pl-10 w-full sm:w-64 rounded-full bg-white"
                          placeholder="Search projects..."
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                        />
                      </div>

                      <select
                        value={projectStatusFilter}
                        onChange={(e) => setProjectStatusFilter(e.target.value)}
                        className="h-10 text-sm rounded-full border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-ring"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="planned">Planned</option>
                      </select>

                      <Button
                        onClick={() => setIsAddProjectModalOpen(true)}
                        className="bg-primary text-primary-foreground rounded-full px-6 hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>
                  </div>

                  {/* Tablist Filter - NOW DYNAMIC */}
                  <div className="mb-8 overflow-x-auto pb-2">
                    <div role="tablist" aria-orientation="horizontal" className="flex items-center gap-2 min-w-max" tabIndex={0} style={{ outline: 'none' }}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={projectCategoryFilter === 'all'}
                        data-state={projectCategoryFilter === 'all' ? "active" : "inactive"}
                        onClick={() => setProjectCategoryFilter('all')}
                        className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-2 px-4 py-2 rounded-full ${projectCategoryFilter === 'all' ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
                      >
                        <Sparkles className="w-4 h-4" />
                        All Projects
                      </button>

                      {/* Dynamic Categories derived from ALL projects */}
                      {Array.from(new Set(projects.map(p => p.category ? p.category.toLowerCase().trim() : 'uncategorized'))).filter(c => c !== 'uncategorized').sort().map(cat => (
                        <button
                          key={cat}
                          type="button"
                          role="tab"
                          aria-selected={projectCategoryFilter === cat}
                          data-state={projectCategoryFilter === cat ? "active" : "inactive"}
                          onClick={() => {
                            // Debugging alert removed for production/user comfort
                            setProjectCategoryFilter(cat);
                          }}
                          className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-2 px-4 py-2 rounded-full capitalize ${projectCategoryFilter === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
                        >
                          <Layers className="w-4 h-4" />
                          {categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projects Grid with New Card Design */}
                <div className="grid grid-cols-1 gap-6">
                  {filteredProjects.map(project => (
                    <Card key={project.id} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row h-auto md:min-h-64">
                      {/* Left Side: Image & Category & Gradient */}
                      <div className="relative w-full md:w-2/5 h-48 md:h-full overflow-hidden">
                        <Image
                          src={project.image?.startsWith('http') ? project.image : project.image ? `${API_URL}${project.image}` : '/placeholder-project.png'}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent mix-blend-multiply opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        {/* Category Label with Hover Effect */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/40 transition-colors px-3 py-1 uppercase tracking-wider text-xs font-bold">
                            {categoryLabels[project.category] || project.category}
                          </Badge>
                        </div>

                        {/* Edit/Delete Overlay (Admin specific) */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <Button onClick={() => handleEditProject(project)} size="sm" variant="secondary" className="h-8">
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button onClick={() => deleteProject(project.id)} size="sm" variant="destructive" className="h-8">
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>

                      {/* Right Side: Content & Actions */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{project.title}</h3>
                            {/* Icons Area (Edu, DB representations if available, or just status/meta) */}
                            <div className="flex items-center gap-2 text-gray-400">
                              {project.client && <Briefcase className="w-4 h-4" title={`Client: ${project.client}`} />}
                              <Calendar className="w-4 h-4" title={`Timeline: ${project.timeline}`} />
                            </div>
                          </div>
                          <p className="text-gray-600 line-clamp-2 md:line-clamp-3 mb-4 text-sm leading-relaxed">
                            {project.shortDescription}
                          </p>

                          {/* Dynamic Team Section */}
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                            <h3 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              <Users className="h-3 w-3 text-blue-500" /> Team
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1" title={project.team}>
                              {project.team || "No team details specified"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto">
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies && project.technologies.slice(0, 4).map((tech, i) => (
                              <span key={i} className="px-2.5 py-1 bg-gray-100/80 text-gray-600 rounded-md text-xs font-medium border border-gray-200/50">
                                {tech}
                              </span>
                            ))}
                            {project.technologies && project.technologies.length > 4 && (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100">+{project.technologies.length - 4}</span>
                            )}
                          </div>

                          <div className="flex items-end justify-between border-t pt-4 border-gray-50">
                            <div className="flex items-center gap-3">
                              {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors border border-gray-100">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {project.videoUrl && (
                                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors border border-gray-100">
                                  <Play className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {/* Decorated Details Button */}
                            <Button
                              onClick={() => handleEditProject(project)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-xs font-semibold px-5 rounded-full group/btn"
                            >
                              View Details <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* No Projects Message */}
                {filteredProjects.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Search className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        No projects found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {projects.length === 0
                          ? "Get started by adding your first project"
                          : "No projects match your current filters"}
                      </p>
                      {projects.length === 0 && (
                        <Button onClick={() => setIsAddProjectModalOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Project
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* PRODUCTS TAB */}
            <TabsContent value="products">
              <div className="space-y-6">
                {/* New Admin Header & Filter Section */}
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 tracking-tight">Products Management</h2>
                      <p className="text-muted-foreground">Manage and organize your product portfolio</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          className="pl-10 w-full sm:w-64 rounded-full bg-white"
                          placeholder="Search products..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                        />
                      </div>

                      <select
                        value={productStatusFilter}
                        onChange={(e) => setProductStatusFilter(e.target.value)}
                        className="h-10 text-sm rounded-full border border-input bg-background px-4 py-2 focus:ring-2 focus:ring-ring"
                      >
                        <option value="all">All Status</option>
                        <option value="Live">Live</option>
                        <option value="In Development">Dev</option>
                        <option value="Coming Soon">Soon</option>
                      </select>

                      <Button
                        onClick={() => setIsAddProductModalOpen(true)}
                        className="bg-primary text-primary-foreground rounded-full px-6 hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  </div>

                  {/* Tablist Filter */}
                  <div className="mb-8 overflow-x-auto pb-2">
                    <div role="tablist" aria-orientation="horizontal" className="flex items-center gap-2 min-w-max" tabIndex={0} style={{ outline: 'none' }}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={productCategoryFilter === 'all'}
                        data-state={productCategoryFilter === 'all' ? "active" : "inactive"}
                        onClick={() => setProductCategoryFilter('all')}
                        className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-2 px-4 py-2 rounded-full ${productCategoryFilter === 'all' ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
                      >
                        <Sparkles className="w-4 h-4" />
                        All Categories
                      </button>

                      {productCategories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          role="tab"
                          aria-selected={productCategoryFilter === cat}
                          data-state={productCategoryFilter === cat ? "active" : "inactive"}
                          onClick={() => setProductCategoryFilter(cat)}
                          className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-2 px-4 py-2 rounded-full capitalize ${productCategoryFilter === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
                        >
                          {/* Just use a generic icon or map if feasible, keeping it simple for admin */}
                          <Layers className="w-4 h-4" />
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Products Grid with New Card Design */}
                <div className="grid grid-cols-1 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row h-auto md:h-64">
                      {/* Left Side: Image & Category & Gradient */}
                      <div className="relative w-full md:w-2/5 h-48 md:h-full overflow-hidden">
                        <Image
                          src={
                            product.cover?.startsWith("http")
                              ? product.cover
                              : product.cover
                                ? `${API_URL}${product.cover}`
                                : "/placeholder-product.jpg"
                          }
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent mix-blend-multiply opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        {/* Category Label with Hover Effect */}
                        <div className="absolute top-4 left-4 z-10">
                          <Badge className="bg-white/20 backdrop-blur-md text-white border-none hover:bg-white/40 transition-colors px-3 py-1 uppercase tracking-wider text-xs font-bold">
                            {productCategoryLabels[product.category] || product.category}
                          </Badge>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute bottom-4 left-4 z-10">
                          <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                            {getStatusText(product.status)}
                          </Badge>
                        </div>

                        {/* Edit/Delete Overlay (Admin specific) */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <Button onClick={() => handleEditProduct(product)} size="sm" variant="secondary" className="h-8">
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button onClick={() => deleteProduct(product.id)} size="sm" variant="destructive" className="h-8">
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>

                      {/* Right Side: Content & Actions */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{product.name}</h3>
                            {/* Icons Area */}
                            <div className="flex items-center gap-2 text-gray-400">
                              <div className={`w-2 h-2 rounded-full ${product.status === 'Live' ? 'bg-green-500' : product.status === 'In Development' ? 'bg-amber-500' : 'bg-blue-300'}`} title={product.status} />
                            </div>
                          </div>
                          <p className="text-gray-600 line-clamp-2 md:line-clamp-3 mb-4 text-sm leading-relaxed">
                            {product.description || product.tagline}
                          </p>
                        </div>

                        <div className="mt-auto">
                          {/* Technologies/Platforms */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {product.technologies && product.technologies.slice(0, 4).map((tech, i) => (
                              <span key={i} className="px-2.5 py-1 bg-gray-100/80 text-gray-600 rounded-md text-xs font-medium border border-gray-200/50">
                                {tech}
                              </span>
                            ))}
                            {product.platforms && product.platforms.slice(0, 2).map((plat, i) => (
                              <span key={`plat-${i}`} className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100">
                                {plat}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-end justify-between border-t pt-4 border-gray-50">
                            <div className="flex items-center gap-3">
                              {product.liveUrl && (
                                <a href={product.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors border border-gray-100">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              {product.demoUrl && (
                                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-full transition-colors border border-gray-100">
                                  <Play className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {/* Decorated Details Button */}
                            <Button
                              onClick={() => handleEditProduct(product)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-xs font-semibold px-5 rounded-full group/btn"
                            >
                              View Details <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* No Products Message */}
                {filteredProducts.length === 0 && (
                  <Card className="text-center py-12">
                    <CardContent>
                      <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <Package className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        No products found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {products.length === 0
                          ? "Get started by adding your first product"
                          : "No products match your current filters"}
                      </p>
                      {products.length === 0 && (
                        <Button onClick={() => setIsAddProductModalOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Product
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* GALLERY TAB */}
            <TabsContent value="gallery">
              <div className="space-y-4">
                {/* Gallery Filters Section */}
                <Card className="bg-white border-gray-100 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        Filters & Search
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={async () => {
                            const res = await fetch(`${API_URL}/api/gallery/`, {
                              headers: { Authorization: `JWT ${localStorage.getItem("access")}` },
                            });
                            if (res.ok) {
                              setGallery(await res.json());
                              alert("Gallery synced successfully!");
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          Sync
                        </Button>
                        <Button
                          onClick={() => setIsAddGalleryModalOpen(true)}
                          size="sm"
                          className="bg-gradient-to-r from-primary to-blue-600 text-white text-xs h-8"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Image
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          placeholder="Search gallery..."
                          value={gallerySearch}
                          onChange={(e) => setGallerySearch(e.target.value)}
                          className="h-9 text-sm pl-9 border-gray-200"
                        />
                      </div>
                      <select
                        value={galleryCategoryFilter}
                        onChange={(e) =>
                          setGalleryCategoryFilter(e.target.value)
                        }
                        className="h-9 text-sm rounded-md border border-gray-200 bg-background px-3"
                      >
                        {galleryCategories.map((c) => (
                          <option key={c} value={c}>
                            {c === "all" ? "All Categories" : c}
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {filteredGallery.length} Result
                          {filteredGallery.length !== 1 ? "s" : ""}
                        </Badge>
                        {(gallerySearch || galleryCategoryFilter !== "all") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setGallerySearch("");
                              setGalleryCategoryFilter("all");
                            }}
                          >
                            <X className="w-3 h-3 mr-1" />
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGallery.map((item) => {
                    const isEditing = editingGalleryId === item.id;

                    const getCurrentImageUrl = () => {
                      if (isEditing && editedGallery?.image instanceof File) {
                        return URL.createObjectURL(editedGallery.image);
                      }
                      return item.image?.startsWith("http")
                        ? item.image
                        : `${API_URL}${item.image}`;
                    };

                    return (
                      <Card
                        key={item.id}
                        className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                      >
                        <div className="relative h-40">
                          <Image
                            src={getCurrentImageUrl()}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          {isEditing && (
                            <>
                              <label
                                htmlFor={`edit-image-${item.id}`}
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 hover:opacity-100 cursor-pointer transition-opacity"
                                title="Change image"
                              >
                                <Edit className="w-6 h-6 text-white" />
                              </label>
                              <input
                                id={`edit-image-${item.id}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setEditedGallery((prev) => ({
                                      ...prev,
                                      image: file,
                                    }));
                                  }
                                }}
                              />
                            </>
                          )}
                        </div>
                        <CardContent className="p-3">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-gray-700">
                                  Title
                                </Label>
                                <Input
                                  value={editedGallery.title ?? item.title}
                                  onChange={(e) =>
                                    setEditedGallery((prev) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                  className="h-8 text-sm"
                                  placeholder="Enter title"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-gray-700">
                                  Category
                                </Label>
                                <select
                                  value={
                                    editedGallery.category ?? item.category
                                  }
                                  onChange={(e) =>
                                    setEditedGallery((prev) => ({
                                      ...prev,
                                      category: e.target.value,
                                    }))
                                  }
                                  className="h-8 text-sm border rounded px-2 w-full"
                                >
                                  <option value="office">Office</option>
                                  <option value="events">Events</option>
                                  <option value="celebration">
                                    Celebration
                                  </option>
                                  <option value="others">Others</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-gray-700">
                                  Description
                                </Label>
                                <Textarea
                                  value={
                                    editedGallery.description ??
                                    item.description
                                  }
                                  onChange={(e) =>
                                    setEditedGallery((prev) => ({
                                      ...prev,
                                      description: e.target.value,
                                    }))
                                  }
                                  className="text-sm resize-none"
                                  rows={3}
                                  placeholder="Enter description"
                                />
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button
                                  onClick={() => {
                                    updateGalleryItem(item.id, editedGallery);
                                    if (editedGallery?.image instanceof File) {
                                      URL.revokeObjectURL(getCurrentImageUrl());
                                    }
                                  }}
                                  size="sm"
                                  className="h-8 flex-1 text-xs bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-3 h-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (editedGallery?.image instanceof File) {
                                      URL.revokeObjectURL(getCurrentImageUrl());
                                    }
                                    setEditingGalleryId(null);
                                    setEditedGallery({});
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="h-8 flex-1 text-xs"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xs font-semibold mb-1">
                                {item.title || "Untitled"}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                {item.description || "No description"}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {item.category}
                                </Badge>
                                <div className="flex gap-1">
                                  <Button
                                    onClick={() => {
                                      setEditingGalleryId(item.id);
                                      setEditedGallery({
                                        title: item.title || "",
                                        description: item.description || "",
                                        category: item.category || "office",
                                      });
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      const confirmed = window.confirm(
                                        `Are you sure you want to delete this image? This action cannot be undone.`
                                      );
                                      if (confirmed) {
                                        deleteGalleryItem(item.id);
                                      }
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-3 text-xs text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Add Team Modal */}
      {/* Team Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setEditingTeamMember(null);
        }}
        member={editingTeamMember}
        onSave={handleSaveTeamMember}
        isEdit={isEditTeamMode}
      />

      {/* Add Project Modal */}
      <ProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => {
          setIsAddProjectModalOpen(false);
          resetNewProjectForm();
        }}
        project={newProject}
        onSave={addProject}
        isEdit={false}
      />

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => {
          setIsEditProjectModalOpen(false);
          setEditingProject(null);
          setEditedProject({});
        }}
        project={editingProject || {}}
        onSave={(updatedProject) =>
          updateProject(editingProject!.id, updatedProject)
        }
        isEdit={true}
      />

      {/* Add Product Modal */}
      <ProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          setIsAddProductModalOpen(false);
          resetNewProductForm();
        }}
        product={newProduct}
        onSave={addProduct}
        isEdit={false}
      />

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => {
          setIsEditProductModalOpen(false);
          setEditingProduct(null);
          setEditedProduct({});
        }}
        product={editingProduct || {}}
        onSave={(updatedProduct) => {
          console.log("Saving Product:", editingProduct?.id, updatedProduct);
          if (editingProduct?.id) {
            updateProduct(editingProduct.id, updatedProduct);
          } else {
            console.error("Editing product ID missing");
            alert("Error: Product ID missing");
          }
        }}
        isEdit={true}
      />

      {/* Add Gallery Modal */}
      {isAddGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Add Gallery Image</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddGalleryModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs">Title *</Label>
                <Input
                  value={newGalleryItem.title}
                  onChange={(e) =>
                    setNewGalleryItem({
                      ...newGalleryItem,
                      title: e.target.value,
                    })
                  }
                  className="h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Category</Label>
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) =>
                        setNewGalleryItem({
                          ...newGalleryItem,
                          category: e.target.value,
                        })
                      }
                      className="h-9 text-sm rounded-md border border-gray-200 bg-background px-3"
                    >
                      <option value="office">Office</option>
                      <option value="events">Events</option>
                      <option value="celebration">Celebration</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-xs">Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setNewGalleryItem({
                      ...newGalleryItem,
                      image: file || null,
                    });
                  }}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={newGalleryItem.description}
                  onChange={(e) =>
                    setNewGalleryItem({
                      ...newGalleryItem,
                      description: e.target.value,
                    })
                  }
                  className="text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddGalleryModalOpen(false);
                  resetGalleryForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => addGalleryItem(newGalleryItem)}
                disabled={!newGalleryItem.title || isAddingGallery}
                className="bg-primary"
              >
                {isAddingGallery ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Image
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
