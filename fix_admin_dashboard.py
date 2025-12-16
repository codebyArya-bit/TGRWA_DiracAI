
import os
import re

# Path definitions
TEMP_FILE = "temp_page.tsx"
TARGET_FILE = r"C:\Users\Oppen\OneDrive\Desktop\DiracAI-2.0\DiracAI_2.0-main\app\admin1\dashboard\page.tsx"

# 1. NEW updateProject Function
new_update_project = """  const updateProject = async (id: string, updatedData: Partial<Project>) => {
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

        // Handle Status (Backend expects lower case: planned, ongoing, completed)
        if (key === "status") {
            formData.append("status", String(value).toLowerCase());
            return;
        }

        // Handle Arrays & Objects -> JSON String
        if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await fetch(`${API_URL}/api/projects/${id}/`, {
        method: "PUT", // Use PUT for potentially full update or PATCH
        headers: { Authorization: `JWT ${access}` },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setIsEditProjectModalOpen(false);
        setEditingProject(null);
        setEditedProject({});
        alert("Project updated successfully!");
      } else {
        const err = await res.json();
        console.error("Update failed:", err);
        alert(`Failed to update project: ${JSON.stringify(err)}`);
      }
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Error updating project.");
    }
  };"""

# 2. NEW updateProduct Function
new_update_product = """  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
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
  };"""

# 3. Helpers
new_helpers = """
// Helpers
type JsonErr = { detail?: string;[k: string]: any };

async function extractError(res: Response): Promise<JsonErr> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text || "Unknown error" };
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
"""

def apply_fixes():
    with open(TEMP_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match the functions. 
    # We match from "const updateProject =" until the start of "const deleteProject =" or similar major block
    # This is fragile but works given the file structure I saw.
    
    # Replace updateProject
    pattern_project = r"const updateProject = async \(id: string, updatedData: Partial<Project>\) => \{[\s\S]*?\}\;\s*(?=const deleteProject)"
    
    match_project = re.search(pattern_project, content)
    if match_project:
        print("Found updateProject block. Replacing...")
        content = content.replace(match_project.group(0), new_update_project + "\n\n")
    else:
        print("Could not find updateProject block via regex. Check file structure.")

    # Replace updateProduct
    pattern_product = r"const updateProduct = async \(id: string, updatedData: Partial<Product>\) => \{[\s\S]*?\}\;\s*(?=const deleteProduct)"
    
    match_product = re.search(pattern_product, content)
    if match_product:
        print("Found updateProduct block. Replacing...")
        content = content.replace(match_product.group(0), new_update_product + "\n\n")
    else:
         print("Could not find updateProduct block via regex.")

     # Insert Helpers if missing
    if "async function extractError" not in content:
        print(" Inserting helpers...")
        # Look for the last import
        import_marker = 'import { useRouter } from "next/navigation";'
        if import_marker in content:
             content = content.replace(import_marker, import_marker + new_helpers)
        else:
             print("Could not find import marker to insert helpers.")

    # 4. Fix API_URL definition
    import_statement = 'import { API_URL } from "@/lib/config";'
    const_definition = 'const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";'
    
    if import_statement in content:
        print("Replacing API_URL import with constant definition...")
        content = content.replace(import_statement, const_definition)
    elif const_definition not in content:
        print("Inserting API_URL constant definition...")
        # Insert after "use client"; if possible
        if '"use client";' in content:
            content = content.replace('"use client";', '"use client";\n\n' + const_definition)
        else:
            # Fallback to top
            content = const_definition + "\n" + content

    # Write back locally
    with open(TEMP_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Updates applied to local temp file.")

if __name__ == "__main__":
    apply_fixes()
