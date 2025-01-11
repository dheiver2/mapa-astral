// components/AstralChart/AstralForm.tsx
import React from 'react';
import { Input } from '../ui/input';
import { BirthFormData } from './types';

interface Props {
  formData: BirthFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AstralForm: React.FC<Props> = ({ formData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        type="date"
        name="birthDate"
        value={formData.birthDate}
        onChange={onChange}
        placeholder="Data de Nascimento"
      />
      <Input
        type="time"
        name="birthTime"
        value={formData.birthTime}
        onChange={onChange}
        placeholder="Hora de Nascimento"
      />
      <Input
        type="text"
        name="birthPlace"
        value={formData.birthPlace}
        onChange={onChange}
        placeholder="Local de Nascimento"
        className="md:col-span-2"
      />
      <Input
        type="number"
        name="latitude"
        value={formData.latitude}
        onChange={onChange}
        placeholder="Latitude"
        step="0.000001"
      />
      <Input
        type="number"
        name="longitude"
        value={formData.longitude}
        onChange={onChange}
        placeholder="Longitude"
        step="0.000001"
      />
    </div>
  );
};
