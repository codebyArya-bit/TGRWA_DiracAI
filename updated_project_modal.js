// Updated ProjectModal Component for Projects.js
// Replace the existing ProjectModal component (lines 26-152) with this code

// Modal Component with Tabs
const ProjectModal = ({ project, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!project) return null;
    const Icon = getCategoryIcon(project.category);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Hero Section */}
                <div className="relative">
                    <div className={`relative h-64 md:h-80 overflow-hidden rounded-t-2xl bg-gradient-to-br ${project.color || 'from-green-500 to-emerald-600'}`}>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 opacity-90" />

                        {/* Project Image */}
                        {project.image && (
                            <img
                                src={project.image.startsWith('http') ? project.image : `http://127.0.0.1:8000${project.image}`}
                                className="w-full h-full object-cover"
                                alt={project.title}
                            />
                        )}

                        {/* Hero Content */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-blue-600">
                                    <Icon />
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                    {project.category || 'Project'}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
                            <p className="text-white/90 text-lg">{project.shortDescription}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="p-6 md:p-8">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 mb-6">
                            <div className="flex gap-1">
                                {['overview', 'gallery', 'testimonial', 'video'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-sm font-medium transition-all border-b-2 ${activeTab === tab
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Main Content - 2/3 width */}
                                <div className="md:col-span-2">
                                    {/* Project Overview */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                                        <div className="prose max-w-none text-gray-600">
                                            <p>{project.details || project.description}</p>
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
                                                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                                                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{challenge}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-400 italic">No challenges listed</li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Outcomes */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Outcomes</h3>
                                            <ul className="space-y-3">
                                                {project.outcomes && project.outcomes.length > 0 ? (
                                                    project.outcomes.map((outcome, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                                                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{outcome}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-gray-400 italic">No outcomes listed</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Technologies */}
                                    <div className="mb-8">
                                        <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies && project.technologies.map((tech, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar - 1/3 width */}
                                <div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-6">
                                        <h3 className="text-lg font-bold mb-4">Project Information</h3>

                                        <div className="space-y-4">
                                            {project.client && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Client</h4>
                                                    <p className="font-medium">{project.client}</p>
                                                </div>
                                            )}

                                            {project.timeline && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Timeline</h4>
                                                    <p className="font-medium">{project.timeline}</p>
                                                </div>
                                            )}

                                            {project.team && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Team</h4>
                                                    <p className="font-medium">{project.team}</p>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
                                                <p className="font-medium capitalize">{project.category}</p>
                                            </div>
                                        </div>

                                        {/* Key Metrics */}
                                        {/* Key Metrics */}
                                        {project.stats && (Array.isArray(project.stats) ? project.stats.length > 0 : Object.keys(project.stats).length > 0) && (
                                            <>
                                                <div className="border-t border-gray-200 my-6" />
                                                <h4 className="text-sm font-medium text-gray-500 mb-3">Key Metrics</h4>
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    {Array.isArray(project.stats) ? (
                                                        project.stats.map((stat, idx) => (
                                                            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="text-xl font-bold text-blue-600">{stat.value}</div>
                                                                <div className="text-xs text-gray-500 uppercase mt-1">{stat.label || stat.key}</div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        Object.entries(project.stats).map(([key, value], idx) => (
                                                            <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                <div className="text-xl font-bold text-blue-600">{value}</div>
                                                                <div className="text-xs text-gray-500 uppercase mt-1">{key}</div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    View Live Project
                                                </a>
                                            )}
                                            {project.videoUrl && (
                                                <a
                                                    href={project.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                    </svg>
                                                    Watch Video
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gallery Tab */}
                        {activeTab === 'gallery' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {project.gallery && project.gallery.length > 0 ? (
                                    project.gallery.map((img, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden">
                                            <img
                                                src={img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-gray-400 py-12">No gallery images available</p>
                                )}
                            </div>
                        )}

                        {/* Testimonial Tab */}
                        {activeTab === 'testimonial' && (
                            <div>
                                {project.testimonial ? (
                                    <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg p-8">
                                        <div className="flex items-start gap-4 mb-4">
                                            {project.testimonial.image && (
                                                <img
                                                    src={project.testimonial.image}
                                                    alt={project.testimonial.name}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            )}
                                            <div>
                                                <h4 className="font-bold text-lg">{project.testimonial.name}</h4>
                                                <p className="text-gray-600">{project.testimonial.role}</p>
                                                <div className="flex gap-1 mt-2">
                                                    {[...Array(project.testimonial.rating || 5)].map((_, i) => (
                                                        <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <blockquote className="text-lg italic text-gray-700">
                                            "{project.testimonial.quote}"
                                        </blockquote>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-12">No testimonial available</p>
                                )}
                            </div>
                        )}

                        {/* Video Tab */}
                        {activeTab === 'video' && (
                            <div>
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
                                    <p className="text-center text-gray-400 py-12">No video available</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
