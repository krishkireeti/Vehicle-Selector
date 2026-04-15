"use client";

import React from "react";

type Props = {
    onSelect: (make: string, model: string, badge: string) => void;
}

const QuickSelect: React.FC<Props> = ({ onSelect }) => {
    return (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={() => onSelect("tesla", "Model 3", "Performance")}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Tesla Model 3 Performance
            </button>

            <button
                type="button"
                onClick={() => onSelect("ford", "Ranger", "Raptor")}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition" >
                Ford Ranger Raptor
            </button>
        </div>
    )
};

export default QuickSelect;