"use client";

import React, { useState } from "react";
import Dropdown from "./Dropdown";
import QuickSelect from "./QuickSelect";
import { Make, MODELS } from "@/lib/vehicleData";

const VehicleForm: React.FC = () => {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [badge, setBadge] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleMakeChange = (value: string) => {
        setMake(value);
        setModel("");
        setBadge("");
    };

    const handleModelChange = (value: string) => {
        setModel(value);
        setBadge("");
    };

    const handleQuickSelect = (make: string, model: string, badge: string) => {
        setMake(make);
        setModel(model);
        setBadge(badge);
    };

    const models = make ? Object.keys(MODELS[make as keyof typeof MODELS]) : [];

    const badges = make && model ? MODELS[make as Make][model as keyof typeof MODELS[Make]] : [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("make", make);
        formData.append("model", model);
        formData.append("badge", badge);

        if (file) {
            formData.append("file", file);
        }

        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                body: formData,
            })

            const data = await res.json();
            setResponse(data);
        }
        catch (err) {
            console.error("Error submitting form: ", err);
        }
        finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Vehicle Selector
                </h2>

                <QuickSelect onSelect={handleQuickSelect} />

                <Dropdown
                    label="Make"
                    value={make}
                    onChange={handleMakeChange}
                    options={Object.keys(MODELS)}
                />

                <Dropdown
                    label="Model"
                    value={model}
                    onChange={handleModelChange}
                    options={models}
                />

                <Dropdown
                    label="Badge"
                    value={badge}
                    onChange={(value) => setBadge(value)}
                    options={badges || []}
                />

                <div>
                    <label className="block mb-2 font-medium text-gray-700">
                        Upload Logbook (.txt)
                    </label>
                    <input
                        type="file"
                        accept=".txt"
                        className="w-full border rounded-lg p-2"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />

                    {file && (
                        <p className="text-sm text-gray-600 mt-1">
                            Selected: {file.name}
                        </p>
                    )}

                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!make || !model || !badge || !file || loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>

                {response && (
                    <div className="bg-gray-100 p-4 rounded-lg mt-4">
                        <h3 className="font-bold mb-2">Submitted Data</h3>
                        <p>
                            <strong>Make:</strong> {response.make}
                        </p>
                        <p>
                            <strong>Model:</strong> {response.model}
                        </p>
                        <p>
                            <strong>Badge:</strong> {response.badge}
                        </p>

                        <div className="mt-3">
                            <strong>Logbook:</strong>
                            <pre className="whitespace-pre-wrap bg-white p-3 rounded mt-2 max-h-40 overflow-auto">
                                {response.logbook}
                            </pre>
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
};

export default VehicleForm;