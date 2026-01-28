'use client';

import { useState, useEffect } from 'react';
import { Tool, ToolInput, FileData } from '@/types/tool';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface DynamicFormProps {
  tool: Tool;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
}

export function DynamicForm({ tool, onSubmit, isLoading }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, file: File) => {
    if (!file) return;

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFilePreviews((prev) => ({ ...prev, [name]: previewUrl }));

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const fileData: FileData = {
        base64,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
      };
      setFormData((prev) => ({ ...prev, [name]: fileData }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Cleanup file previews on unmount
  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const renderInput = (input: ToolInput) => {
    const commonProps = {
      id: input.name,
      name: input.name,
      required: input.required,
      placeholder: input.placeholder,
      value: formData[input.name] || '',
      onChange: (e: any) => handleChange(input.name, e.target.value),
    };

    switch (input.type) {
      case 'textarea':
        return <Textarea {...commonProps} />;

      case 'select':
        return (
          <Select {...commonProps}>
            <option value="">Select an option...</option>
            {input.options?.map((option) => {
              const value = typeof option === 'string' ? option : option.value;
              const label = typeof option === 'string' ? option : option.label;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </Select>
        );

      case 'number':
        return <Input {...commonProps} type="number" />;

      case 'email':
        return <Input {...commonProps} type="email" />;

      case 'file':
        return (
          <div className="space-y-2">
            <Input
              id={input.name}
              name={input.name}
              type="file"
              accept="image/*"
              required={input.required}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(input.name, file);
              }}
              className="cursor-pointer"
            />
            {filePreviews[input.name] && (
              <div className="mt-2">
                <img
                  src={filePreviews[input.name]}
                  alt="Preview"
                  className="max-w-xs rounded border border-gray-300 shadow-sm"
                />
              </div>
            )}
            {formData[input.name] && (
              <p className="text-sm text-gray-600">
                {(formData[input.name] as FileData).filename} (
                {Math.round((formData[input.name] as FileData).size / 1024)}KB)
              </p>
            )}
          </div>
        );

      case 'text':
      default:
        return <Input {...commonProps} type="text" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {tool.inputs.map((input) => (
        <div key={input.name} className="space-y-2">
          <Label htmlFor={input.name}>
            {input.label}
            {input.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderInput(input)}
        </div>
      ))}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Running...
          </>
        ) : (
          `Run ${tool.name}`
        )}
      </Button>
    </form>
  );
}
