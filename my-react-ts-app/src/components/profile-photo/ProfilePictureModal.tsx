import React, { useState, useCallback } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Trash2, Save, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string;
  onImageUpdate: (newImage: string) => void;
  handleDelete: () => void;
}

const ProfilePictureModal = ({ 
  isOpen, 
  onClose, 
  currentImage, 
  onImageUpdate, 
  handleDelete 
}: ProfilePictureModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentImage);
  const [previewImage, setPreviewImage] = useState<string>(currentImage);
  const [zoom, setZoom] = useState<number>(1);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [isEditing, setIsEditing] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage);
      setPreviewImage(currentImage);
      setIsEditing(false);
      setZoom(1);
      setCrop({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
      });
    }
  }, [isOpen, currentImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
          setPreviewImage(e.target.result as string);
          setIsEditing(true);
          setZoom(1);
          // Reset crop to center when new image is loaded
          setCrop({
            unit: '%',
            x: 25,
            y: 25,
            width: 50,
            height: 50
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = useCallback((crop: Crop, percentageCrop: Crop) => {
    if (!isEditing) return;

    const image = new Image();
    image.src = selectedImage;
    
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set final dimensions
      canvas.width = 400;
      canvas.height = 400;

      // Calculate crop dimensions
      const scaleX = image.naturalWidth / 100;
      const scaleY = image.naturalHeight / 100;
      
      const pixelCrop = {
        x: percentageCrop.x * scaleX,
        y: percentageCrop.y * scaleY,
        width: percentageCrop.width * scaleX,
        height: percentageCrop.height * scaleY,
      };

      // Apply zoom factor to the source dimensions
      const sourceWidth = pixelCrop.width / zoom;
      const sourceHeight = pixelCrop.height / zoom;
      const sourceX = pixelCrop.x - (sourceWidth - pixelCrop.width) / 2;
      const sourceY = pixelCrop.y - (sourceHeight - pixelCrop.height) / 2;

      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      setPreviewImage(canvas.toDataURL('image/jpeg'));
    };
  }, [selectedImage, isEditing, zoom]);

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleSave = () => {
    onImageUpdate(previewImage);
    onClose();
  };

  const handleResetCrop = () => {
    setCrop({
      unit: '%',
      x: 25,
      y: 25,
      width: 50,
      height: 50
    });
    setZoom(1);
    setPreviewImage(selectedImage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
     <DialogContent className="sm:max-w-[600px] h-auto max-h-[90vh] p-0 gap-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
    
        
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-full flex justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              {isEditing ? (
                <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={onCropComplete}
                    aspect={1}
                    circularCrop
                  >
                    <img 
                      src={selectedImage} 
                      alt="Edit Profile" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center'
                      }}
                    />
                  </ReactCrop>
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                  <img 
                    src={previewImage} 
                    alt="Current Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="w-full flex items-center gap-4 px-4">
                <ZoomOut className="w-4 h-4 text-gray-500" />
                <Slider
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-grow"
                />
                <ZoomIn className="w-4 h-4 text-gray-500" />
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('profileImageInput')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Change Picture
              </Button>
              
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetCrop}
                >
                  Reset
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>

            <div className="p-6 border-t bg-gray-50 dark:bg-gray-950">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
          </div>
        </div>

       

        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureModal;