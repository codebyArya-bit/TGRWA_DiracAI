# Integration Guide: Adding Detail Modals to Admin Dashboard

## Step 1: Add Required Imports

Add these imports at the top of your `temp_page.tsx` file (if not already present):

```typescript
import { Star, FileText } from "lucide-react";
```

## Step 2: Add State Variables

Find where your component state is defined (look for `useState` declarations) and add these two new state variables:

```typescript
const [selectedProjectForView, setSelectedProjectForView] = useState<Project | null>(null);
const [selectedProductForView, setSelectedProductForView] = useState<Product | null>(null);
const [isProjectDetailModalOpen, setIsProjectDetailModalOpen] = useState(false);
const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
```

## Step 3: Add Modal Components

Copy the entire content from these two files and paste them into your `temp_page.tsx` file:
1. `project_detail_modal_component.tsx` - Place it after your existing modal components (like TeamModal)
2. `product_detail_modal_component.tsx` - Place it right after the ProjectDetailModal

## Step 4: Add Handler Functions

Add these handler functions in your component (before the return statement):

```typescript
const handleViewProjectDetails = (project: Project) => {
  setSelectedProjectForView(project);
  setIsProjectDetailModalOpen(true);
};

const handleViewProductDetails = (product: Product) => {
  setSelectedProductForView(product);
  setIsProductDetailModalOpen(true);
};

const closeProjectDetailModal = () => {
  setIsProjectDetailModalOpen(false);
  setSelectedProjectForView(null);
};

const closeProductDetailModal = () => {
  setIsProductDetailModalOpen(false);
  setSelectedProductForView(null);
};
```

## Step 5: Update "View Details" Button for Projects

Find the "View Details" button in the Projects section (around line 4236-4241) and replace:

```typescript
// OLD CODE:
<Button
  onClick={() => handleEditProject(project)}
  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-xs font-semibold px-5 rounded-full group/btn"
>
  View Details <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
</Button>

// NEW CODE:
<Button
  onClick={() => handleViewProjectDetails(project)}
  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-xs font-semibold px-5 rounded-full group/btn"
>
  View Details <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
</Button>
```

## Step 6: Update "View Details" Button for Products

Find the "View Details" button in the Products section and make the same change:

```typescript
// Replace handleEditProduct with handleViewProductDetails
<Button
  onClick={() => handleViewProductDetails(product)}
  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-sm font-semibold px-5 py-2 rounded-full inline-flex items-center gap-2 group/btn"
>
  View Details 
  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
</Button>
```

## Step 7: Render the Modals

Find the main return statement of your component and add these modals at the top (after the opening div):

```typescript
return (
  <div className="min-h-screen bg-gray-50">
    {/* Add these two modals */}
    <ProjectDetailModal
      isOpen={isProjectDetailModalOpen}
      onClose={closeProjectDetailModal}
      project={selectedProjectForView}
    />
    
    <ProductDetailModal
      isOpen={isProductDetailModalOpen}
      onClose={closeProductDetailModal}
      product={selectedProductForView}
    />

    {/* Rest of your existing code... */}
```

## Step 8: Add Missing Icon Imports (if needed)

Make sure you have all these icons imported from lucide-react:

```typescript
import {
  Package,
  ArrowRight,
  Sparkles,
  Layers,
  Tag,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Globe,
  Cpu,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  X,
  Calendar,
  Briefcase,
  ExternalLink,
  Play,
  Star,
  FileText,
} from "lucide-react";
```

## Testing

After making these changes:

1. Save the file
2. The React dev server should hot-reload
3. Navigate to `http://localhost:3000/admin1/dashboard`
4. Click on any "View Details" button in the Projects or Products section
5. You should see the new detailed modal with tabs for Overview, Gallery, Testimonial/Features, and Video

## Troubleshooting

If you encounter errors:

1. **"Cannot find module 'lucide-react'"**: Run `npm install lucide-react`
2. **TypeScript errors**: Make sure the Project and Product interfaces match the ones in your file
3. **Modal not showing**: Check browser console for errors and ensure all state variables are properly defined
4. **Tabs not working**: Ensure you have the Tabs components from your UI library properly imported

## Notes

- The Edit and Delete buttons on hover still use the original `handleEditProject` and `deleteProject` functions
- The "View Details" button now opens a read-only detailed view
- Admins can still edit by clicking the "Edit" button on hover or by clicking the Edit button in the modal's action buttons
