
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Spinner } from './Spinner';

interface ImageUploadProps {
    onImageUpload: (source: string) => void;
    initialImage?: string;
    label?: string;
    sizeSuggestion?: string;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const CloseIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, initialImage = '', label = 'Upload Image', sizeSuggestion }) => {
    const [imageUrl, setImageUrl] = useState<string>(initialImage);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useSettings();

    useEffect(() => {
        setImageUrl(initialImage);
    }, [initialImage]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadError('');
            try {
                const base64Image = await fileToBase64(file);
                const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Image }),
                });

                const result = await response.json();

                if (result.success) {
                    const permanentUrl = result.url;
                    setImageUrl(permanentUrl);
                    onImageUpload(permanentUrl);
                } else {
                    throw new Error(result.message || 'Failed to upload image.');
                }
            } catch (error: any) {
                console.error("Image upload failed:", error);
                setUploadError(error.message || 'An unknown error occurred during upload.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = event.target.value;
        setImageUrl(newUrl);
        onImageUpload(newUrl);
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageUrl('');
        onImageUpload('');
        setUploadError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onUploadButtonClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);
    
    const isUrlStored = imageUrl && !imageUrl.startsWith('data:');

    return (
        <div>
            {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>}
            
            <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Image Preview */}
                <div className="w-full md:w-48 h-48 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 relative">
                    {isUploading ? (
                        <Spinner />
                    ) : imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain rounded-md" />
                             <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                aria-label="Remove image"
                            >
                               <CloseIcon />
                            </button>
                        </>
                    ) : (
                        <div className="text-gray-400 text-center">
                            <UploadIcon/>
                            <p className="text-xs mt-1">Image Preview</p>
                        </div>
                    )}
                </div>

                {/* Upload Options */}
                <div className="w-full space-y-2">
                     <button
                        type="button"
                        onClick={onUploadButtonClick}
                        disabled={isUploading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {t('uploadFromDevice')}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">{t('orEnterImageUrl')}</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <input
                        type="url"
                        placeholder={t('imageUrl')}
                        value={isUrlStored ? imageUrl : ''}
                        onChange={handleUrlChange}
                        disabled={isUploading}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
                    />
                </div>
            </div>
            {uploadError && <p className="text-red-500 text-xs mt-2">{uploadError}</p>}
            {sizeSuggestion && <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">{sizeSuggestion}</p>}
        </div>
    );
};