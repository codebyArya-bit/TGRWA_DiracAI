import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import classes from "./Projects.module.css";

// Icons for Category Tabs
const Icons = {
  All: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Mobile: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  FinTech: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  SaaS: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  EdTech: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>,
  AI: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Blockchain: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  DevOps: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Commerce: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  GovTech: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>,
  Enterprise: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Layers: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  GraduationCap: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
  Brain: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  BarChart: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>,
  Database: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  ShoppingCart: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Globe: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Server: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
  Blocks: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Code: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Smartphone: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
};

const getCategoryIcon = (category, specificIcon) => {
  // If specific icon is provided and exists in Icons, use it
  if (specificIcon && Icons[specificIcon]) return Icons[specificIcon];

  // Fallback to category matching
  if (!category) return Icons.All;
  const key = Object.keys(Icons).find(k => category.toLowerCase().includes(k.toLowerCase()));
  return Icons[key] || Icons.All;
};

// Modal Component
const ProjectModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!project) return null;
  const Icon = getCategoryIcon(project.category, project.icon);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
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

                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {project.category || 'Project'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
              <p className="text-white/90 text-lg">{project.shortDescription}</p>
            </div>
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
                  <div className="prose max-w-none text-gray-600 leading-relaxed">
                    {(project.details || project.description)?.split(/\r?\n\r?\n/).filter(p => p.trim()).map((paragraph, idx) => (
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
  );
};

const Project = (props) => {
  const isMounted = useRef(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    isMounted.current = true;
    props.passMountInfo(true);
    fetchProjects();
    return () => {
      isMounted.current = false;
      props.passMountInfo(false);
    };
  }, [props]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/projects/');
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      setLoading(false);
    }
  };

  // Calculate Categories Dynamically
  const categories = ["All Projects", ...new Set(projects.map(p => p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Other'))];

  // Filter Logic
  const filteredProjects = projects.filter(project => {
    const matchCategory = activeCategory === "All Projects"
      ? true
      : (project.category && project.category.toLowerCase() === activeCategory.toLowerCase());

    const matchSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.shortDescription && project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSearch;
  });

  if (loading) return (
    <div className={classes.projectMain}>
      <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
    </div>
  );

  return (
    <div className={classes.projectMain}>
      {/* Modal Component */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* Header Section */}
      <div className="w-full mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Our Product</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our portfolio of innovative solutions across various industries and technologies
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-16 space-y-8">
        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm text-gray-700 bg-white/80 backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {categories.map(cat => {
            const Icon = getCategoryIcon(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform 
                                    ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md'
                  }`}
              >
                <Icon />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-1 gap-6 pb-20">
        {filteredProjects.map((project) => {
          const CategoryIcon = getCategoryIcon(project.category, project.icon);
          return (
            <div
              key={project.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-64 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Left Side: Image & Gradient */}
              <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image.startsWith('http') ? project.image : `http://127.0.0.1:8000${project.image}`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${project.color || 'from-blue-500 to-purple-600'} flex items-center justify-center`}>
                    <span className="text-4xl text-white font-bold opacity-30">{project.title.charAt(0)}</span>
                  </div>
                )}

                {/* Gradients - Using dynamic project color */}
                <div className={`absolute inset-0 bg-gradient-to-r ${project.color || 'from-blue-500 to-purple-600'} mix-blend-multiply opacity-70`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />

                {/* Category Label */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white border-none px-3 py-1 rounded-md uppercase tracking-wider text-xs font-bold inline-flex items-center gap-2">
                    <CategoryIcon />
                    {project.category || 'Project'}
                  </span>
                </div>
              </div>

              {/* Right Side: Content & Actions */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    {/* Status or Meta Icons */}
                    <div className="flex items-center gap-2 text-gray-400">
                      {/* Add timeline or client if available in data, mostly placeholders here if not in API */}
                    </div>
                  </div>
                  <p className="text-gray-600 line-clamp-2 md:line-clamp-3 mb-4 text-sm leading-relaxed">
                    {project.shortDescription || project.description}
                  </p>
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
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors border border-gray-100" onClick={(e) => e.stopPropagation()}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      )}
                      {project.videoUrl && (
                        <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full transition-colors border border-gray-100" onClick={(e) => e.stopPropagation()}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                        </a>
                      )}
                    </div>

                    {/* Decorated Details Button */}
                    <button
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-sm font-semibold px-5 py-2 rounded-full inline-flex items-center gap-2 group/btn"
                    >
                      View Details
                      <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 pb-40">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No projects found for "{activeCategory}"</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}

    </div>
  );
};

export default Project;
