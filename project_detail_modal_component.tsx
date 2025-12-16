// Project Detail Modal Component
// Add this component to your temp_page.tsx file after the other modal components

const ProjectDetailModal = ({
    isOpen,
    onClose,
    project,
}: {
    isOpen: boolean;
    onClose: () => void;
    project: Project | null;
}) => {
    const [activeTab, setActiveTab] = useState("overview");

    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 size-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-muted transition-colors"
                >
                    <X className="size-5" />
                </button>

                {/* Hero Section */}
                <div className="relative">
                    <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${project.color || 'from-green-500 to-emerald-600'} opacity-90`} />

                        {/* Project Image */}
                        {project.image && (
                            <img
                                alt={project.title}
                                className="w-full h-full object-cover"
                                src={project.image?.startsWith('http') ? project.image : `${API_URL}${project.image}`}
                            />
                        )}

                        {/* Hero Content */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="size-12 rounded-full bg-white/90 flex items-center justify-center text-primary">
                                    <Briefcase className="size-6" />
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                    {project.category}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
                            <p className="text-white/90 text-lg">{project.shortDescription}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="p-6 md:p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Gallery
                                </TabsTrigger>
                                <TabsTrigger value="testimonial" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Client Testimonial
                                </TabsTrigger>
                                <TabsTrigger value="video" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Video
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview">
                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Main Content - 2/3 width */}
                                    <div className="md:col-span-2">
                                        {/* Project Overview */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                                            <div className="prose prose-blue max-w-none text-muted-foreground leading-relaxed">
                                                {(project.details || project.description)?.split(/\r?\n\r?\n/).filter((p: string) => p.trim()).map((paragraph: string, idx: number) => (
                                                    <p key={idx} className="mb-4">{paragraph.trim()}</p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Challenges & Outcomes */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            {/* Challenges */}
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">Challenges</h3>
                                                <ul className="space-y-3">
                                                    {project.challenges && project.challenges.length > 0 ? (
                                                        project.challenges.map((challenge, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                                                <CheckCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
                                                                <span>{challenge}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-muted-foreground italic">No challenges listed</li>
                                                    )}
                                                </ul>
                                            </div>

                                            {/* Outcomes */}
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">Outcomes</h3>
                                                <ul className="space-y-3">
                                                    {project.outcomes && project.outcomes.length > 0 ? (
                                                        project.outcomes.map((outcome, idx) => (
                                                            <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                                                <CheckCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
                                                                <span>{outcome}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-muted-foreground italic">No outcomes listed</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Technologies */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies && project.technologies.map((tech, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar - 1/3 width */}
                                    <div>
                                        <Card className="bg-muted/30 border-border/40">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold mb-4">Project Information</h3>

                                                <div className="space-y-4">
                                                    {project.client && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Client</h4>
                                                            <p className="font-medium">{project.client}</p>
                                                        </div>
                                                    )}

                                                    {project.timeline && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Timeline</h4>
                                                            <p className="font-medium">{project.timeline}</p>
                                                        </div>
                                                    )}

                                                    {project.team && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Team</h4>
                                                            <p className="font-medium">{project.team}</p>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                                                        <p className="font-medium capitalize">{project.category}</p>
                                                    </div>
                                                </div>

                                                {/* Key Metrics */}
                                                {project.stats && typeof project.stats === 'object' && Object.keys(project.stats).length > 0 && (
                                                    <>
                                                        <div className="border-t border-border/40 my-6" />
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Metrics</h4>
                                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                                            {Object.entries(project.stats).map(([key, value], idx) => (
                                                                <div key={idx} className="text-center p-3 bg-background rounded-lg border border-border/20">
                                                                    <div className="text-xl font-bold text-primary">{value}</div>
                                                                    <div className="text-xs text-muted-foreground uppercase mt-1">{key}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="space-y-3">
                                                    {project.liveUrl && (
                                                        <Button className="w-full gap-2" asChild>
                                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="size-4" />
                                                                View Live Project
                                                            </a>
                                                        </Button>
                                                    )}
                                                    {project.videoUrl && (
                                                        <Button variant="outline" className="w-full gap-2" asChild>
                                                            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                                                                <Play className="size-4" />
                                                                Watch Video
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent value="gallery">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {project.gallery && project.gallery.length > 0 ? (
                                        project.gallery.map((img, idx) => (
                                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                                                <img
                                                    src={img.startsWith('http') ? img : `${API_URL}${img}`}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-muted-foreground py-12">No gallery images available</p>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Testimonial Tab */}
                            <TabsContent value="testimonial">
                                {project.testimonial ? (
                                    <Card className="max-w-2xl mx-auto">
                                        <CardContent className="p-8">
                                            <div className="flex items-start gap-4 mb-4">
                                                {project.testimonial.image && (
                                                    <img
                                                        src={project.testimonial.image}
                                                        alt={project.testimonial.name}
                                                        className="size-16 rounded-full object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-lg">{project.testimonial.name}</h4>
                                                    <p className="text-muted-foreground">{project.testimonial.role}</p>
                                                    <div className="flex gap-1 mt-2">
                                                        {[...Array(project.testimonial.rating)].map((_, i) => (
                                                            <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <blockquote className="text-lg italic text-muted-foreground">
                                                "{project.testimonial.quote}"
                                            </blockquote>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <p className="text-center text-muted-foreground py-12">No testimonial available</p>
                                )}
                            </TabsContent>

                            {/* Video Tab */}
                            <TabsContent value="video">
                                {project.videoUrl ? (
                                    <div className="aspect-video max-w-4xl mx-auto">
                                        <iframe
                                            src={project.videoUrl}
                                            className="w-full h-full rounded-lg"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-12">No video available</p>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};
