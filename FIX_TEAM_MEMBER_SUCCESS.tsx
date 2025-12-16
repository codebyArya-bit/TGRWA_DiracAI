// Fix for Team Member Update - Show Success & Auto-Refresh
// Add this to your app/admin1/dashboard/page.tsx

const handleSaveTeamMember = async (memberData: any) => {
    try {
        const url = memberData.id
            ? `${API_URL}/api/team/${memberData.id}/`
            : `${API_URL}/api/team/`;

        const method = memberData.id ? 'PATCH' : 'POST';
        const token = localStorage.getItem('access_token');

        // Determine if we're creating or updating
        const isUpdate = !!memberData.id;

        const res = await fetch(url, {
            method,
            headers: {
                'Authorization': `JWT ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData),
        });

        if (res.ok) {
            const data = await res.json();

            // ✅ 1. SHOW SUCCESS MESSAGE
            toast({
                title: "Success!",
                description: isUpdate
                    ? "Team member updated successfully"
                    : "Team member added successfully",
                variant: "default", // or remove this for default green success style
            });

            // ✅ 2. REFRESH THE TEAM MEMBERS LIST
            await fetchTeamMembers(); // Re-fetch to get updated data

            // ✅ 3. CLOSE THE EDIT DIALOG/MODAL
            setIsEditDialogOpen(false); // If you have an edit dialog state
            setEditingMember(null); // Clear the editing member

            // ✅ 4. RESET FORM (if you have a form state)
            // setFormData(initialFormState); // Reset form to empty

        } else {
            // Handle error
            const errorData = await res.json().catch(() => ({}));
            console.error("Failed to save team member:", errorData);

            const errorMsg = errorData.detail
                || Object.entries(errorData).map(([k, v]) => `${k}: ${v}`).join(', ')
                || "Unknown error";

            // ❌ SHOW ERROR MESSAGE
            toast({
                title: "Error",
                description: `Failed to save: ${errorMsg}`,
                variant: "destructive",
            });
        }
    } catch (error) {
        console.error("Network error:", error);
        toast({
            title: "Network Error",
            description: "Could not connect to server. Is it running?",
            variant: "destructive",
        });
    }
};

// Make sure you have the fetchTeamMembers function:
const fetchTeamMembers = async () => {
    try {
        const response = await fetch(`${API_URL}/api/team/`);
        if (response.ok) {
            const data = await response.json();
            setTeamMembers(data); // Update your state
        }
    } catch (error) {
        console.error("Failed to fetch team members:", error);
    }
};
