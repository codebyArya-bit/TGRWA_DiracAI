// Fix for Project Update Error - Complete Solution
// Update your updateProject function in app/admin1/dashboard/page.tsx

const updateProject = async (projectId: number, projectData: any) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

        // ✅ 1. Get authentication token
        const token = localStorage.getItem('access_token'); // or from your auth context

        if (!token) {
            toast({
                title: "Authentication Error",
                description: "Please log in to update projects",
                variant: "destructive",
            });
            return;
        }

        // ✅ 2. Prepare the data
        // Handle array fields (technologies, bullets, challenges, outcomes, etc.)
        const preparedData = {
            ...projectData,
            // Convert arrays to proper format if needed
            technologies: Array.isArray(projectData.technologies)
                ? projectData.technologies
                : projectData.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [],
            bullets: Array.isArray(projectData.bullets)
                ? projectData.bullets
                : projectData.bullets?.split(',').map(b => b.trim()).filter(Boolean) || [],
            challenges: Array.isArray(projectData.challenges)
                ? projectData.challenges
                : projectData.challenges?.split(',').map(c => c.trim()).filter(Boolean) || [],
            outcomes: Array.isArray(projectData.outcomes)
                ? projectData.outcomes
                : projectData.outcomes?.split(',').map(o => o.trim()).filter(Boolean) || [],
        };

        console.log("🔄 Updating project:", projectId, preparedData);

        // ✅ 3. Make the API call
        const response = await fetch(`${API_URL}/api/projects/${projectId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preparedData),
        });

        console.log("📡 Response status:", response.status);

        // ✅ 4. Handle success
        if (response.ok) {
            const updatedProject = await response.json();
            console.log("✅ Project updated:", updatedProject);

            // Show success message
            toast({
                title: "Success!",
                description: "Project updated successfully",
            });

            // Refresh projects list
            await fetchProjects();

            // Close edit dialog
            setIsEditProjectDialogOpen(false);
            setEditingProject(null);

            return updatedProject;
        }

        // ✅ 5. Handle errors properly
        let errorMessage = "Unknown error";
        let errorDetail: any = {};

        try {
            // Try to parse as JSON first
            errorDetail = await response.json();
            console.error("❌ Error response:", errorDetail);

            // Extract meaningful error message
            if (errorDetail.detail) {
                errorMessage = errorDetail.detail;
            } else if (typeof errorDetail === 'object') {
                // Handle field-specific errors
                errorMessage = Object.entries(errorDetail)
                    .map(([field, errors]) => {
                        const errorList = Array.isArray(errors) ? errors : [errors];
                        return `${field}: ${errorList.join(', ')}`;
                    })
                    .join('; ');
            }
        } catch (parseError) {
            // If JSON parsing fails, try to get text
            try {
                const errorText = await response.text();
                console.error("❌ Error text:", errorText);
                errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
            } catch {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
        }

        // Show error to user
        toast({
            title: "Update Failed",
            description: errorMessage,
            variant: "destructive",
        });

        console.error("❌ Update failed:", errorDetail);

    } catch (err) {
        console.error("❌ Network error:", err);
        toast({
            title: "Network Error",
            description: "Could not connect to server. Is the backend running?",
            variant: "destructive",
        });
    }
};

// ✅ Also add fetchProjects function if you don't have it
const fetchProjects = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const response = await fetch(`${API_URL}/api/projects/`);

        if (response.ok) {
            const data = await response.json();
            setProjects(data); // Update your state
            console.log(`✅ Loaded ${data.length} projects`);
        }
    } catch (error) {
        console.error("Failed to fetch projects:", error);
    }
};

// ✅ ALTERNATIVE: If you're uploading images with FormData
const updateProjectWithImage = async (projectId: number, projectData: any) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const token = localStorage.getItem('access_token');

        if (!token) {
            toast({
                title: "Authentication Error",
                description: "Please log in first",
                variant: "destructive",
            });
            return;
        }

        // Check if there's an image file
        const hasImageFile = projectData.image instanceof File;

        let body: any;
        let headers: any = {
            'Authorization': `JWT ${token}`,
        };

        if (hasImageFile) {
            // Use FormData for file upload
            const formData = new FormData();

            Object.keys(projectData).forEach(key => {
                const value = projectData[key];

                if (value === null || value === undefined) {
                    return; // Skip null/undefined
                }

                // Handle arrays
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            });

            body = formData;
            // Don't set Content-Type for FormData (browser sets it with boundary)
        } else {
            // Use JSON for no file upload
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(projectData);
        }

        const response = await fetch(`${API_URL}/api/projects/${projectId}/`, {
            method: 'PATCH',
            headers,
            body,
        });

        if (response.ok) {
            const updatedProject = await response.json();

            toast({
                title: "Success!",
                description: "Project updated successfully",
            });

            await fetchProjects();
            setIsEditProjectDialogOpen(false);
            setEditingProject(null);

            return updatedProject;
        } else {
            // Error handling same as above...
            const errorText = await response.text();
            console.error("Update failed:", errorText);

            toast({
                title: "Update Failed",
                description: errorText || "Unknown error",
                variant: "destructive",
            });
        }

    } catch (err) {
        console.error("Network error:", err);
        toast({
            title: "Network Error",
            description: "Could not connect to server",
            variant: "destructive",
        });
    }
};
