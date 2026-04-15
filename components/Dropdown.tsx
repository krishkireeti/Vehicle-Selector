"use client";

import React from "react";

type Props = {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

const Dropdown: React.FC<Props> = ({ label, value, options, onChange }) => {
    return (
        <div>
            <label className="block mb-2 font-medium text-gray-700">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default Dropdown;