import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Loader2, X } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddListing() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    property_type: 'house',
    listing_type: 'sale',
    bedrooms: '0',
    bathrooms: '0',
    area: '0',
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Create the property listing with the image URLs
      const { error } = await supabase
        .from('properties')
        .insert([
          {
            ...formData,
            price: parseFloat(formData.price),
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            area: parseFloat(formData.area),
            agent_id: user.id,
            image_urls: imageUrls,
            status: 'pending'
          },
        ]);

      if (error) throw error;
      
      toast.success('Property listed successfully!');
      navigate('/my-listings');
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast.error(`Failed to add property: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Add New Property Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="property_type" className="block text-sm font-medium mb-2">
              Property Type
            </label>
            <Select 
              value={formData.property_type} 
              onValueChange={(value) => handleSelectChange('property_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="listing_type" className="block text-sm font-medium mb-2">
              Listing Type
            </label>
            <Select 
              value={formData.listing_type} 
              onValueChange={(value) => handleSelectChange('listing_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select listing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium mb-2">
              Bedrooms
            </label>
            <Input
              id="bedrooms"
              name="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium mb-2">
              Bathrooms
            </label>
            <Input
              id="bathrooms"
              name="bathrooms"
              type="number"
              min="0"
              step="0.5"
              value={formData.bathrooms}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="area" className="block text-sm font-medium mb-2">
              Area (sq ft)
            </label>
            <Input
              id="area"
              name="area"
              type="number"
              min="0"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
            Image URL
          </label>
          <div className="flex gap-2">
            <Input
              id="imageUrl"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleAddImageUrl}
              variant="outline"
            >
              Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Add image URLs one at a time. At least one image is required.
          </p>
          
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading || imageUrls.length === 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Property...
              </>
            ) : (
              'Add Property'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/agent-dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
} 