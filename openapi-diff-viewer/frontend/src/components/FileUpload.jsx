import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function FileUpload({ onAnalysisComplete }) {
    const [oldFile, setOldFile] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dragOver, setDragOver] = useState(null);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'old') setOldFile(file);
            else setNewFile(file);
            setError(null);
        }
    };

    const handleDrop = (e, type) => {
        e.preventDefault();
        setDragOver(null);
        const file = e.dataTransfer.files[0];
        if (file) {
            if (type === 'old') setOldFile(file);
            else setNewFile(file);
            setError(null);
        }
    };

    const handleDragOver = (e, type) => {
        e.preventDefault();
        setDragOver(type);
    };

    const handleDragLeave = () => {
        setDragOver(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldFile || !newFile) {
            setError('Please select both old and new specification files');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('old_file', oldFile);
        formData.append('new_file', newFile);

        try {
            const response = await fetch('http://localhost:8000/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Analysis failed');
            }

            const data = await response.json();
            onAnalysisComplete(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to analyze specifications. Make sure the backend is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    const FileDropZone = ({ type, file, label }) => (
        <div
            className={clsx(
                "relative border-2 border-dashed rounded-lg p-8 text-center transition-all",
                dragOver === type ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
                file && "bg-green-50 border-green-400"
            )}
            onDrop={(e) => handleDrop(e, type)}
            onDragOver={(e) => handleDragOver(e, type)}
            onDragLeave={handleDragLeave}
        >
            <input
                type="file"
                accept=".json,.yaml,.yml"
                onChange={(e) => handleFileChange(e, type)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id={`${type}-file`}
            />
            <label htmlFor={`${type}-file`} className="cursor-pointer">
                <div className="flex flex-col items-center space-y-3">
                    {file ? (
                        <>
                            <FileText className="w-12 h-12 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                            <p className="text-xs text-green-600 font-medium">Click or drag to replace</p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-700">{label}</p>
                                <p className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</p>
                                <p className="text-xs text-gray-400 mt-1">Supports JSON, YAML</p>
                            </div>
                        </>
                    )}
                </div>
            </label>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        OpenAPI Diff Viewer
                    </h1>
                    <p className="text-gray-600">
                        Compare two OpenAPI specifications and visualize the differences
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileDropZone
                                type="old"
                                file={oldFile}
                                label="Old Specification"
                            />
                            <FileDropZone
                                type="new"
                                file={newFile}
                                label="New Specification"
                            />
                        </div>

                        {error && (
                            <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-red-800">Error</p>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !oldFile || !newFile}
                            className={clsx(
                                "w-full py-4 px-6 rounded-lg font-semibold text-white transition-all transform",
                                "focus:outline-none focus:ring-4 focus:ring-blue-300",
                                loading || !oldFile || !newFile
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            )}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Analyzing...</span>
                                </span>
                            ) : (
                                'Compare Specifications'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            💡 Tip: Make sure the backend server is running on <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">http://localhost:8000</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
