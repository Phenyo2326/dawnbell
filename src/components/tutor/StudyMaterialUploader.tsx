
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, File, X } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
}

interface StudyMaterialUploaderProps {
  subjects: Subject[];
}

const StudyMaterialUploader = ({ subjects }: StudyMaterialUploaderProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !selectedSubject) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const userId = userData.user.id;
      const filePath = `${userId}/${Date.now()}_${file.name}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('study_materials')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('study_materials')
        .getPublicUrl(filePath);

      // Save material metadata to the database
      const { error: insertError } = await supabase
        .from('study_materials')
        .insert({
          tutor_id: userId,
          subject_id: selectedSubject,
          title,
          description,
          file_type: file.type,
          file_url: urlData.publicUrl,
          file_size: file.size
        });

      if (insertError) throw insertError;

      toast({
        title: "Upload Successful",
        description: "Your study material has been uploaded successfully.",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedSubject('');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was a problem uploading your file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Study Materials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Algebra Fundamentals" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Briefly describe this material" 
              rows={3} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            {!file ? (
              <div className="border-2 border-dashed border-gray-200 rounded-md p-6 cursor-pointer text-center hover:bg-gray-50 transition-colors">
                <Input 
                  id="file" 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden"
                />
                <Label htmlFor="file" className="cursor-pointer flex flex-col items-center gap-2">
                  <FileText className="h-10 w-10 text-gray-400" />
                  <span className="text-sm font-medium text-primary">Click to browse files</span>
                  <span className="text-xs text-gray-500">Supports PDF, videos, images, and documents</span>
                </Label>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                <File className="h-6 w-6 text-primary" />
                <div className="flex-1 truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setFile(null)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload Material"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudyMaterialUploader;
