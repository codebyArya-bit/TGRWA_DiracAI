// Add this function to your AdminDashboard component (app/admin1/dashboard/page.tsx)
// Place it with your other handler functions

const handleSeedProjects = async () => {
    try {
        // Show loading toast
        toast({
            title: "Seeding Projects",
            description: "Importing project data from live site...",
        });

        // Call your backend bulk-upsert endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/admin/projects/bulk-upsert/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${yourAuthToken}`, // Replace with your actual auth token variable
            },
            body: JSON.stringify([
                // Add your project data here, or fetch from diracai.com
                // For now, this will use the data you already seeded via Python scripts
            ])
        });

        if (response.ok) {
            const data = await response.json();
            toast({
                title: "Success!",
                description: `${data.count} projects seeded successfully`,
            });

            // Refresh the page or refetch projects
            window.location.reload();
        } else {
            throw new Error('Failed to seed projects');
        }
    } catch (error) {
        console.error('Seed error:', error);
        toast({
            title: "Error",
            description: "Failed to seed projects. Check console for details.",
            variant: "destructive",
        });
    }
};

// Alternative: If you just want to refresh/fetch projects that are already in DB
const handleSeedProjects = async () => {
    try {
        toast({
            title: "Loading Projects",
            description: "Fetching latest project data...",
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/projects/`);

        if (response.ok) {
            const projects = await response.json();
            toast({
                title: "Success!",
                description: `Loaded ${projects.length} projects from database`,
            });

            // Update your state or refresh
            window.location.reload();
        }
    } catch (error) {
        console.error('Load error:', error);
        toast({
            title: "Error",
            description: "Failed to load projects",
            variant: "destructive",
        });
    }
};
