import React, { useState, useEffect, useRef } from 'react';
import classes from './Products.module.css';
import axios from 'axios';

// Simple Icon Components for Sectors
const Icons = {
    Education: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    Finance: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Healthcare: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    Analytics: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    Productivity: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    Default: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
};

const getCategoryIcon = (category) => {
    if (!category) return Icons.Default;
    const key = Object.keys(Icons).find(k => k.toLowerCase() === category.toLowerCase());
    return Icons[key] || Icons.Default;
};

// Modal Component
const ProductModal = ({ product, onClose }) => {
    if (!product) return null;
    const Icon = getCategoryIcon(product.category);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
                    {product.cover && (
                        <img
                            src={product.cover.startsWith('http') ? product.cover : `http://127.0.0.1:8000${product.cover}`}
                            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                            alt={product.name}
                        />
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="absolute bottom-6 left-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold uppercase tracking-wider">
                                {product.category || 'Product'}
                            </span>
                            {/* Icon for sector */}
                            <div className="p-1 bg-white/20 rounded-full">
                                <Icon />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold">{product.name}</h2>
                        <p className="text-blue-100 mt-1 text-lg">{product.tagline}</p>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 md:p-8">
                    <div className="prose max-w-none mb-8 text-gray-600">
                        <p>{product.fullDescription || product.description}</p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {product.stats && product.stats.map((stat, idx) => (
                            <div key={`stat-${idx}`} className="flex flex-col items-center min-w-[100px]">
                                <span className="text-2xl font-bold text-blue-600">{stat.value}</span>
                                <span className="text-xs text-gray-500 uppercase font-medium">{stat.label}</span>
                            </div>
                        ))}
                        {(!product.stats || product.stats.length === 0) && <span className="text-gray-400 italic text-sm">No statistics available</span>}
                    </div>

                    {/* Outcomes & Challenges Grid (2 Columns) */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        {/* Column 1: Outcomes */}
                        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                Key Outcomes
                            </h4>
                            <ul className="space-y-3">
                                {product.outcomes && product.outcomes.length > 0 ? product.outcomes.map((outcome, idx) => (
                                    <li key={`out-${idx}`} className="flex items-start gap-3 text-gray-700">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                        <span className="text-sm leading-relaxed">{outcome}</span>
                                    </li>
                                )) : <li className="text-gray-400 italic text-sm">No outcomes listed</li>}
                            </ul>
                        </div>

                        {/* Column 2: Challenges */}
                        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                Challenges Solved
                            </h4>
                            <ul className="space-y-3">
                                {product.challenges && product.challenges.length > 0 ? product.challenges.map((challenge, idx) => (
                                    <li key={`chal-${idx}`} className="flex items-start gap-3 text-gray-700">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                        <span className="text-sm leading-relaxed">{challenge}</span>
                                    </li>
                                )) : <li className="text-gray-400 italic text-sm">No challenges listed</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t">
                        {product.documentationUrl && (
                            <a href={product.documentationUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
                        )}
                        {product.liveUrl && (
                            <a href={product.liveUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-shadow shadow-sm hover:shadow-md">
                                Visit Website
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function Products(props) {
    const isMounted = useRef(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        isMounted.current = true;
        props.passMountInfo(true);
        fetchProducts();
        return () => {
            isMounted.current = false;
            props.passMountInfo(false);
        };
    }, [props]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/products/');
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
            setLoading(false);
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Other'))];

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || (p.category ? p.category.toLowerCase() : 'other') === activeCategory.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    if (loading) return (
        <div className={classes.productsParent}>
            <div className={classes.loadingContainer}>
                <div className={classes.loader}></div>
                <p>Loading products...</p>
            </div>
        </div>
    );

    return (
        <div className={classes.productsParent}>
            {/* Product Modal */}
            {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

            {/* New Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 px-4 mt-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Our Product</h2>
                    <p className="text-gray-500 max-w-2xl">Discover our portfolio of innovative solutions across various industries and technologies</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        <input
                            className="flex h-10 border border-gray-200 bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 w-full sm:w-64 rounded-full"
                            placeholder="Search Products..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* New Tablist Filter */}
            <div className="container mx-auto px-4 mb-12">
                <div role="tablist" aria-orientation="horizontal" className="flex flex-wrap items-center justify-center gap-2" tabIndex="0" style={{ outline: 'none' }}>
                    {/* Map dynamically if possible, or use standard list. Mixing static icons with dynamic categories if needed. */}
                    {categories.map(cat => {
                        // Simple icon mapping based on name
                        const isSelected = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={isSelected}
                                data-state={isSelected ? "active" : "inactive"}
                                onClick={() => setActiveCategory(cat)}
                                className={`justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 inline-flex items-center gap-2 px-4 py-2 rounded-full ${isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-transparent text-gray-500 hover:bg-gray-100"}`}
                            >
                                {/* Generic Icon or specific if matches */}
                                {cat === 'All' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles w-4 h-4"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>}
                                {cat !== 'All' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers w-4 h-4"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></svg>}
                                {cat}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Products Grid - Horizontal Cards */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 gap-6">
                    {filteredProducts.map(product => {
                        const CategoryIcon = getCategoryIcon(product.category);
                        return (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col md:flex-row h-auto md:h-64"
                                onClick={() => setSelectedProduct(product)}
                            >
                                {/* Left Side: Image & Gradient */}
                                <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                                    {product.cover ? (
                                        <img
                                            src={product.cover.startsWith('http') ? product.cover : `http://127.0.0.1:8000${product.cover}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
                                            <div className="text-5xl font-bold text-gray-300 group-hover:text-blue-500 transition-colors">
                                                {product.iconText || product.name.charAt(0)}
                                            </div>
                                        </div>
                                    )}

                                    {/* Gradients */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent mix-blend-multiply opacity-90" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                    {/* Category Label */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="bg-white/20 backdrop-blur-md text-white border-none px-3 py-1 rounded-md uppercase tracking-wider text-xs font-bold inline-flex items-center gap-2">
                                            <CategoryIcon />
                                            {product.category || 'Product'}
                                        </span>
                                    </div>
                                </div>

                                {/* Right Side: Content & Actions */}
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.status === 'Live' ? 'bg-green-500' : product.status === 'In Development' ? 'bg-amber-500' : 'bg-blue-300'}`} title={product.status} />
                                            </div>
                                        </div>
                                        <p className="text-gray-600 line-clamp-2 md:line-clamp-3 mb-4 text-sm leading-relaxed">
                                            {product.tagline || product.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {product.technologies && product.technologies.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="px-2.5 py-1 bg-gray-100/80 text-gray-600 rounded-md text-xs font-medium border border-gray-200/50">
                                                    {tech}
                                                </span>
                                            ))}
                                            {product.technologies && product.technologies.length > 4 && (
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium border border-blue-100">+{product.technologies.length - 4}</span>
                                            )}
                                        </div>

                                        <div className="flex items-end justify-between border-t pt-4 border-gray-50">
                                            <div className="flex items-center gap-3">
                                                {product.liveUrl && (
                                                    <a href={product.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-full transition-colors border border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                    </a>
                                                )}
                                                {product.demoUrl && (
                                                    <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 hover:bg-green-50 text-gray-400 hover:text-green-600 rounded-full transition-colors border border-gray-100" onClick={(e) => e.stopPropagation()}>
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

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No products found for "{activeCategory}".</p>
                        <button onClick={() => setActiveCategory('All')} className="mt-4 text-blue-600 font-medium hover:underline">View all products</button>
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className={classes.ctaSection}>
                <h2>Interested in our products?</h2>
                <p>Get in touch with us to learn more about how our solutions can help your business</p>
                <a href="/contactus" className={classes.ctaButton}>Contact Us</a>
            </div>
        </div>
    );
}

export default Products;
