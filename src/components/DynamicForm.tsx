'use client';

import { useState } from 'react';
import { Tool, ToolInput } from '@/types/tool';
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

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

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
