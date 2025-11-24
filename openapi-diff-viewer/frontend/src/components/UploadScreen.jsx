import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';

export function UploadScreen({ onAnalyze, loading, error }) {
    const [oldFile, setOldFile] = useState(null);
    const [newFile, setNewFile] = useState(null);

    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (oldFile && newFile) {
            onAnalyze(oldFile, newFile);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-8 md:p-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">OpenAPI Diff Viewer</h1>
                    <p className="text-gray-600 mb-10">Upload your old and new OpenAPI (Swagger) specifications to generate a detailed comparison report.</p>

                    <div className="grid md:grid-cols-3 gap-8 items-center mb-10">
                        {/* Old File Input */}
                        <div className="flex flex-col items-center">
                            <label className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden">
                                <input type="file" className="hidden" accept=".json,.yaml,.yml" onChange={(e) => handleFileChange(e, setOldFile)} />
                                {oldFile ? (
                                    <div className="flex flex-col items-center p-4">
                                        <FileText className="w-12 h-12 text-blue-600 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-full px-2">{oldFile.name}</span>
                                        <span className="text-xs text-gray-500 mt-1">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center p-4">
                                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600">Upload Old Spec</span>
                                        <span className="text-xs text-gray-400 mt-1">JSON or YAML</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight className="w-8 h-8 text-gray-300 hidden md:block" />
                            <ArrowRight className="w-8 h-8 text-gray-300 md:hidden transform rotate-90" />
                        </div>

                        {/* New File Input */}
                        <div className="flex flex-col items-center">
                            <label className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden">
                                <input type="file" className="hidden" accept=".json,.yaml,.yml" onChange={(e) => handleFileChange(e, setNewFile)} />
                                {newFile ? (
                                    <div className="flex flex-col items-center p-4">
                                        <FileText className="w-12 h-12 text-green-600 mb-2" />
                                        <span className="text-sm font-medium text-gray-700 truncate max-w-full px-2">{newFile.name}</span>
                                        <span className="text-xs text-gray-500 mt-1">Click to change</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center p-4">
                                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-green-500 mb-2 transition-colors" />
                                        <span className="text-sm font-medium text-gray-600 group-hover:text-green-600">Upload New Spec</span>
                                        <span className="text-xs text-gray-400 mt-1">JSON or YAML</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!oldFile || !newFile || loading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center mx-auto min-w-[200px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            "Compare Specifications"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
