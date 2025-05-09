
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Download, FileText, Video, Image, File, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_type: string;
  file_url: string;
  created_at: string;
  subject: {
    name: string;
  };
}

const StudyMaterialsList = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, [user]);

  const fetchMaterials = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .select(`
          id,
          title,
          description,
          file_type,
          file_url,
          created_at,
          subject:subject_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setMaterials(data as Material[]);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('video')) {
      return <Video className="h-6 w-6 text-blue-500" />;
    } else if (fileType.includes('image')) {
      return <Image className="h-6 w-6 text-green-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your file download has started.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was a problem downloading your file. Please try again.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Study Materials
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-6">Loading materials...</p>
        ) : materials.length > 0 ? (
          <div className="space-y-4">
            {materials.map((material) => (
              <div 
                key={material.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {getFileIcon(material.file_type)}
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{material.title}</h3>
                    <p className="text-sm text-muted-foreground">{material.subject.name}</p>
                    {material.description && (
                      <p className="text-sm mt-1">{material.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Added on {format(new Date(material.created_at), 'PPP')}
                    </p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleDownload(
                      material.file_url, 
                      `${material.title}.${material.file_type.split('/')[1]}`
                    )}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No study materials available yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyMaterialsList;
