import React, { useState, useRef } from 'react';
import { Upload, X, Camera, User } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import toast from 'react-hot-toast';

const PhotoUpload = ({ 
  currentPhoto, 
  onUpload, 
  isLoading = false, 
  size = 'md'
}) => {
  const [preview, setPreview] = useState(currentPhoto);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      toast.error('Apenas arquivos JPG, JPEG e PNG são permitidos');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('O arquivo deve ter no máximo 2MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    if (onUpload) {
      onUpload(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removePhoto = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        {/* Preview da foto */}
        <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300`}>
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!isLoading && (
                <button
                  onClick={removePhoto}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={size === 'sm' ? 24 : size === 'md' ? 32 : 40} />
            </div>
          )}
        </div>

        {/* Área de upload */}
        <Card
          className={`p-6 border-2 border-dashed transition-colors cursor-pointer ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isLoading ? 'Enviando...' : 'Clique para enviar ou arraste uma foto'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG até 2MB
              </p>
            </div>
          </div>
        </Card>

        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />

        {/* Botões de ação */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={isLoading}
          >
            <Camera className="w-4 h-4 mr-2" />
            Escolher Foto
          </Button>
          
          {preview && (
            <Button
              variant="outline"
              size="sm"
              onClick={removePhoto}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;

