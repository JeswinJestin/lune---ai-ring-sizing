
import React, { useState } from 'react';
import { Button } from './Button';
import { DEVICE_DATABASE } from '../lib/deviceData';

interface PhoneScreenSizerProps {
  onSubmit: (device: string) => void;
  onCancel: () => void;
}

export const PhoneScreenSizer = ({ onSubmit, onCancel }: PhoneScreenSizerProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string>(DEVICE_DATABASE[0].name);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col items-center text-center animate-[fadeInUp_0.5s_ease-out]">
      <h2 className="font-display text-display-md md:text-display-lg text-silver-100 mb-4">Phone Screen Sizer</h2>
      <p className="text-lg text-silver-400 mb-8">Select your phone model from the list. We use its known screen size to help estimate your ring size.</p>

      <div className="w-full mb-8">
        <label htmlFor="device-select" className="block text-sm font-medium text-silver-300 mb-2">Select your device:</label>
        <select
          id="device-select"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="w-full bg-midnight-500 border border-platinum-300/30 text-silver-100 rounded-lg p-3 focus:ring-2 focus:ring-bronze-400 focus:border-bronze-400"
        >
          {DEVICE_DATABASE.map(device => (
            <option key={device.name} value={device.name}>{device.name}</option>
          ))}
        </select>
      </div>

      <div className="w-full bg-midnight-500/50 p-6 rounded-2xl border border-platinum-300/10 mb-8">
        <p className="text-silver-300">
            Once you confirm your device, we'll begin the measurement process.
            <br />
            <span className="text-sm text-silver-400">(This is a simplified flow for the current version.)</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onCancel} variant="secondary">Cancel</Button>
        <Button onClick={() => onSubmit(selectedDevice)}>Start Measurement</Button>
      </div>
    </div>
  );
};
