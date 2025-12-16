// ROBUST Error Handling for updateProject
// Replace your error handling section (around line 1512) with this:

const updateProject = async (projectId: number, projectData: any) => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const url = `${API_URL}/api/projects/${projectId}/`;

        // Get token
        const accessToken = localStorage.getItem("access");
        if (!accessToken) {
            alert("Not logged in. Please log in first.");
            return;
        }

        console.log("🔄 Updating project:", projectId, "at", url);

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `JWT ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData),
        });

        console.log("📡 Response status:", response.status, response.statusText);

        // ✅ SUCCESS CASE
        if (response.ok) {
            const data = await response.json();
            console.log("✅ Project updated successfully:", data);

            toast({
                title: "Success!",
                description: "Project updated successfully",
            });

            // Refresh and close
            await fetchProjects();
            setIsEditProjectDialogOpen(false);
            setEditingProject(null);

            return data;
        }

        // ❌ ERROR CASE - ROBUST HANDLING
        console.error("❌ Update failed with status:", response.status);

        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetail: any = {};

        // Get the response body
        const contentType = response.headers.get("content-type");
        console.log("📄 Response content-type:", contentType);

        try {
            // Try to get response text first
            const responseText = await response.text();
            console.log("📝 Response text:", responseText);

            if (!responseText) {
                // Empty response
                errorMessage = `Server returned ${response.status} with no error details`;

                // Common status code meanings
                if (response.status === 401) {
                    errorMessage = "Authentication failed. Please log in again.";
                } else if (response.status === 403) {
                    errorMessage = "You don't have permission to update this project.";
                } else if (response.status === 404) {
                    errorMessage = "Project not found.";
                } else if (response.status === 500) {
                    errorMessage = "Server error. Check Django logs for details.";
                }

            } else {
                // Try to parse as JSON
                try {
                    errorDetail = JSON.parse(responseText);
                    console.log("📋 Parsed error JSON:", errorDetail);

                    // Extract meaningful message
                    if (errorDetail.detail) {
                        errorMessage = errorDetail.detail;
                    } else if (typeof errorDetail === 'object' && !Array.isArray(errorDetail)) {
                        // Field-specific errors
                        const errors = Object.entries(errorDetail)
                            .map(([field, messages]) => {
                                const msgArray = Array.isArray(messages) ? messages : [messages];
                                return `${field}: ${msgArray.join(', ')}`;
                            })
                            .join('\n');
                        errorMessage = errors || errorMessage;
                    } else if (typeof errorDetail === 'string') {
                        errorMessage = errorDetail;
                    }
                } catch (parseError) {
                    // Not JSON - use the text as is
                    console.log("⚠️ Response is not JSON, using raw text");
                    errorMessage = responseText.substring(0, 200); // Limit to 200 chars
                }
            }

        } catch (readError) {
            console.error("❌ Could not read response:", readError);
            errorMessage = `Failed to read error response (Status: ${response.status})`;
        }

        // Show error to user
        console.error("❌ Final error message:", errorMessage);
        console.error("❌ Error detail object:", errorDetail);

        toast({
            title: "Update Failed",
            description: errorMessage,
            variant: "destructive",
        });

        alert(`Failed to update project:\n\n${errorMessage}`);

    } catch (err) {
        // Network error (can't connect to server)
        console.error("❌ Network error:", err);

        const message = err instanceof Error ? err.message : "Unknown network error";

        toast({
            title: "Network Error",
            description: `Could not connect to server: ${message}`,
            variant: "destructive",
        });

        alert(`Network error: ${message}\n\nIs the Django backend running on port 8000?`);
    }
};

// DEBUGGING HELPER - Add this temporarily to see what's being sent
console.log("📤 Sending to server:", {
    url: `${API_URL}/api/projects/${projectId}/`,
    method: 'PATCH',
    headers: {
        'Authorization': `JWT ${accessToken ? '***' + accessToken.slice(-10) : 'MISSING'}`,
        'Content-Type': 'application/json',
    },
    body: projectData,
});
