// ============================================
// INTEGRATION CODE FOR temp_page.tsx
// ============================================

// STEP 1: Add these imports at the top of your file (if not already present)
// --------------------------------------------
import { Eye, ArrowRight } from 'lucide-react';

// STEP 2: Add these state variables inside your AdminDashboard component
// --------------------------------------------
const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);

// STEP 3: Add this handler function inside your AdminDashboard component
// --------------------------------------------
const handleViewProductDetails = (product: Product) => {
    setSelectedProductForView(product);
    setIsProductDetailModalOpen(true);
};

const closeProductDetailModal = () => {
    setIsProductDetailModalOpen(false);
    setSelectedProductForView(null);
};

// STEP 4: Add the ProductDetailModal component (paste this BEFORE the AdminDashboard component)
// --------------------------------------------
const ProductDetailModal = ({
    isOpen,
    onClose,
    product,
}: {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}) => {
    const [activeTab, setActiveTab] = useState("overview");

    if (!isOpen || !product) return null;

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
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90" />

                        {/* Product Cover */}
                        {product.cover && (
                            <img
                                alt={product.name}
                                className="w-full h-full object-cover"
                                src={product.cover?.startsWith('http') ? product.cover : `${API_URL}${product.cover}`}
                            />
                        )}

                        {/* Hero Content */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="size-12 rounded-full bg-white/90 flex items-center justify-center text-primary">
                                    <Package className="size-6" />
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                    {product.category}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h2>
                            <p className="text-white/90 text-lg">{product.tagline}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="p-6 md:p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="features" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Features
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                                    Gallery
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview">
                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Main Content - 2/3 width */}
                                    <div className="md:col-span-2">
                                        {/* Product Overview */}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold mb-4">Product Overview</h3>
                                            <div className="prose prose-blue max-w-none text-muted-foreground">
                                                <p>{product.fullDescription || product.description}</p>
                                            </div>
                                        </div>

                                        {/* Challenges & Outcomes */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            {/* Challenges */}
                                            <div>
                                                <h3 className="text-xl font-bold mb-4">Challenges Solved</h3>
                                                <ul className="space-y-3">
                                                    {product.challenges && product.challenges.length > 0 ? (
                                                        product.challenges.map((challenge, idx) => (
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
                                                <h3 className="text-xl font-bold mb-4">Key Outcomes</h3>
                                                <ul className="space-y-3">
                                                    {product.outcomes && product.outcomes.length > 0 ? (
                                                        product.outcomes.map((outcome, idx) => (
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
                                                {product.technologies && product.technologies.map((tech, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Platforms & Integrations */}
                                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                                            {product.platforms && product.platforms.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-bold mb-4">Platforms</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.platforms.map((platform, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                                                                {platform}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {product.integrations && product.integrations.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-bold mb-4">Integrations</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.integrations.map((integration, idx) => (
                                                            <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200">
                                                                {integration}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sidebar - 1/3 width */}
                                    <div>
                                        <Card className="bg-muted/30 border-border/40">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-bold mb-4">Product Information</h3>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                                        <Badge className={getStatusColor(product.status)}>
                                                            {product.status}
                                                        </Badge>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                                                        <p className="font-medium capitalize">{product.category}</p>
                                                    </div>

                                                    {product.support && product.support.length > 0 && (
                                                        <div>
                                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Support</h4>
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {product.support.map((sup, idx) => (
                                                                    <span key={idx} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                                                                        {sup}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Key Metrics */}
                                                {product.stats && product.stats.length > 0 && (
                                                    <>
                                                        <div className="border-t border-border/40 my-6" />
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Metrics</h4>
                                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                                            {product.stats.slice(0, 4).map((stat, idx) => (
                                                                <div key={idx} className="text-center p-3 bg-background rounded-lg">
                                                                    <div className="text-xl font-bold text-primary">{stat.value}</div>
                                                                    <div className="text-xs text-muted-foreground capitalize">{stat.label}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="space-y-3">
                                                    {product.liveUrl && (
                                                        <Button className="w-full gap-2" asChild>
                                                            <a href={product.liveUrl} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="size-4" />
                                                                View Live Product
                                                            </a>
                                                        </Button>
                                                    )}
                                                    {product.demoUrl && (
                                                        <Button variant="outline" className="w-full gap-2" asChild>
                                                            <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                                                                <Play className="size-4" />
                                                                Try Demo
                                                            </a>
                                                        </Button>
                                                    )}
                                                    {product.documentationUrl && (
                                                        <Button variant="outline" className="w-full gap-2" asChild>
                                                            <a href={product.documentationUrl} target="_blank" rel="noopener noreferrer">
                                                                <FileText className="size-4" />
                                                                Documentation
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Features Tab */}
                            <TabsContent value="features">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {product.features && product.features.length > 0 ? (
                                        product.features.map((feature, idx) => (
                                            <Card key={idx}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-3">
                                                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            <Sparkles className="size-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">{feature}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="col-span-full text-center text-muted-foreground py-12">No features listed</p>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Gallery Tab */}
                            <TabsContent value="gallery">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {product.gallery && product.gallery.length > 0 ? (
                                        product.gallery.map((img, idx) => (
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
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

// STEP 5: Find where your products are rendered and add the "View Details" button
// Look for something like: products.map((product) => ( ... ))
// Add this button inside each product card:
// --------------------------------------------

{/* View Details Button - Add this at the bottom of your product card */ }
<button
  onClick={() => handleViewProductDetails(product)}
  className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
>
  <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
  View Product Details
  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
</button>

// STEP 6: Render the modal at the end of your return statement (before the closing tag)
// --------------------------------------------
<ProductDetailModal
  isOpen={isProductDetailModalOpen}
  onClose={closeProductDetailModal}
  product={selectedProductForView}
/>

// ============================================
// COMPLETE EXAMPLE OF PRODUCT CARD WITH BUTTON
// ============================================
/*
{products.map((product) => (
  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="space-y-3">
        {/* Product Name */}
<div className="flex items-start justify-between">
    <h3 className="text-lg font-semibold line-clamp-1 flex-1">{product.name}</h3>
    <Badge variant="outline" className="text-xs shrink-0 ml-2">
        {product.category}
    </Badge>
</div>

{/* Tagline */ }
<p className="text-sm text-gray-600 line-clamp-2">{product.tagline}</p>

{/* Technologies */ }
<div className="flex flex-wrap gap-1">
    {product.technologies?.slice(0, 3).map((tech, i) => (
        <Badge key={i} variant="secondary" className="text-xs">
            {tech}
        </Badge>
    ))}
</div>

{/* Stats */ }
{
    product.stats && product.stats.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 mt-2">
            <div className="grid grid-cols-2 gap-2">
                {product.stats.slice(0, 2).map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-sm font-bold text-primary">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

{/* ✨ VIEW DETAILS BUTTON */ }
<button
    onClick={() => handleViewProductDetails(product)}
    className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
>
    <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
    View Product Details
    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
</button>
      </div >
    </CardContent >
  </Card >
))}
*/
