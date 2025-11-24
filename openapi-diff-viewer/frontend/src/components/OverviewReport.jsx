import React, { useState } from 'react';
import { Badge } from './Badge';
import { AlertTriangle, TrendingUp, TrendingDown, Edit, CheckCircle, Info, FileText, Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';

export function OverviewReport({ data }) {
    const { summary, changes } = data;
    const [showReleaseNotes, setShowReleaseNotes] = useState(false);
    const [copied, setCopied] = useState(false);

    // Group changes
    const addedChanges = changes.filter(c => c.status === 'added');
    const updatedChanges = changes.filter(c => c.status === 'updated');
    const deletedChanges = changes.filter(c => c.status === 'deleted');
    const breakingChanges = changes.filter(c => c.is_breaking);

    const generateReleaseNotes = () => {
        const date = new Date().toISOString().split('T')[0];
        let notes = `# Release Notes - ${date}\n\n`;

        notes += `## 📊 Summary\n`;
        notes += `- Total Changes: ${changes.length}\n`;
        notes += `- 🚀 Added: ${summary.added_count}\n`;
        notes += `- 🛠 Updated: ${summary.updated_count}\n`;
        notes += `- 🗑 Deleted: ${summary.deleted_count}\n`;
        notes += `- ⚠️ Breaking: ${summary.breaking_count}\n\n`;

        if (breakingChanges.length > 0) {
            notes += `## ⚠️ Breaking Changes\n`;
            breakingChanges.forEach(c => {
                notes += `- **${c.method} ${c.path}**: ${c.summary_text}\n`;
            });
            notes += `\n`;
        }

        if (addedChanges.length > 0) {
            notes += `## 🚀 New Features\n`;
            addedChanges.forEach(c => {
                notes += `- **${c.method} ${c.path}**: New endpoint added\n`;
            });
            notes += `\n`;
        }

        if (updatedChanges.length > 0) {
            notes += `## 🛠 Improvements\n`;
            updatedChanges.forEach(c => {
                if (!c.is_breaking) {
                    notes += `- **${c.method} ${c.path}**: ${c.summary_text}\n`;
                }
            });
            notes += `\n`;
        }

        if (deletedChanges.length > 0) {
            notes += `## 🗑 Deprecations\n`;
            deletedChanges.forEach(c => {
                notes += `- **${c.method} ${c.path}**: Endpoint removed\n`;
            });
        }

        return notes;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateReleaseNotes());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const StatCard = ({ title, value, icon: Icon, color, bgColor, borderColor }) => (
        <div className={clsx("rounded-xl border-2 p-6 shadow-lg", borderColor, bgColor)}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</h3>
                <Icon className={clsx("w-6 h-6", color)} />
            </div>
            <p className={clsx("text-4xl font-bold", color)}>{value}</p>
        </div>
    );

    const ChangesList = ({ title, changes, icon: Icon, color, emptyMessage }) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className={clsx("px-6 py-4 border-b border-gray-200 flex items-center space-x-3", color)}>
                <Icon className="w-5 h-5" />
                <h3 className="text-lg font-bold">{title}</h3>
                <span className="text-sm font-semibold bg-white px-2 py-1 rounded-full">
                    {changes.length}
                </span>
            </div>
            <div className="divide-y divide-gray-100">
                {changes.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500 text-sm">
                        {emptyMessage}
                    </div>
                ) : (
                    changes.map((change, idx) => (
                        <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <Badge method={change.method} />
                                    <span className="font-mono text-sm font-semibold text-gray-900">
                                        {change.path}
                                    </span>
                                </div>
                                {change.is_breaking && (
                                    <span className="flex items-center space-x-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>BREAKING</span>
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 pl-1">{change.summary_text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 h-full overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        API Comparison Overview
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Comprehensive analysis of changes between API specifications
                    </p>
                    <button
                        onClick={() => setShowReleaseNotes(!showReleaseNotes)}
                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                    >
                        <FileText className="w-5 h-5 mr-2" />
                        {showReleaseNotes ? 'Hide Release Notes' : 'Generate Release Notes'}
                    </button>
                </div>

                {/* Release Notes Generator */}
                {showReleaseNotes && (
                    <div className="bg-white rounded-xl shadow-xl border border-indigo-200 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-bold text-indigo-900">Auto-Generated Release Notes</h3>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                            </button>
                        </div>
                        <div className="p-6 bg-gray-50">
                            <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 shadow-inner h-96 overflow-y-auto">
                                {generateReleaseNotes()}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Added Endpoints"
                        value={summary.added_count}
                        icon={TrendingUp}
                        color="text-green-600"
                        bgColor="bg-green-50"
                        borderColor="border-green-200"
                    />
                    <StatCard
                        title="Updated Endpoints"
                        value={summary.updated_count}
                        icon={Edit}
                        color="text-blue-600"
                        bgColor="bg-blue-50"
                        borderColor="border-blue-200"
                    />
                    <StatCard
                        title="Deleted Endpoints"
                        value={summary.deleted_count}
                        icon={TrendingDown}
                        color="text-red-600"
                        bgColor="bg-red-50"
                        borderColor="border-red-200"
                    />
                    <StatCard
                        title="Breaking Changes"
                        value={summary.breaking_count}
                        icon={AlertTriangle}
                        color="text-orange-600"
                        bgColor="bg-orange-50"
                        borderColor="border-orange-200"
                    />
                </div>

                {/* Breaking Changes Alert */}
                {breakingChanges.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-900 mb-2">
                                    ⚠️ Breaking Changes Detected
                                </h3>
                                <p className="text-sm text-red-800 mb-3">
                                    {breakingChanges.length} breaking change{breakingChanges.length !== 1 ? 's' : ''} found.
                                    These changes may require updates to client applications.
                                </p>
                                <div className="space-y-2">
                                    {breakingChanges.map((change, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 text-sm">
                                            <Badge method={change.method} />
                                            <span className="font-mono font-semibold text-red-900">{change.path}</span>
                                            <span className="text-red-700">- {change.summary_text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {breakingChanges.length === 0 && changes.length > 0 && (
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 shadow-md">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-lg font-bold text-green-900 mb-1">
                                    ✓ No Breaking Changes
                                </h3>
                                <p className="text-sm text-green-800">
                                    All changes are backward compatible. Existing clients should continue to work without modifications.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Changes */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <Info className="w-6 h-6 text-blue-600" />
                        <span>Detailed Changes</span>
                    </h2>

                    <ChangesList
                        title="Added Endpoints"
                        changes={addedChanges}
                        icon={TrendingUp}
                        color="bg-green-50 text-green-700"
                        emptyMessage="No endpoints were added"
                    />

                    <ChangesList
                        title="Updated Endpoints"
                        changes={updatedChanges}
                        icon={Edit}
                        color="bg-blue-50 text-blue-700"
                        emptyMessage="No endpoints were updated"
                    />

                    <ChangesList
                        title="Deleted Endpoints"
                        changes={deletedChanges}
                        icon={TrendingDown}
                        color="bg-red-50 text-red-700"
                        emptyMessage="No endpoints were deleted"
                    />
                </div>

                {/* Footer Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-sm text-blue-800">
                        <strong>Total Changes:</strong> {changes.length} endpoint{changes.length !== 1 ? 's' : ''} modified
                    </p>
                </div>
            </div>
        </div>
    );
}
