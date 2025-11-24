import React, { useState } from 'react';
import { Badge } from './Badge';
import { AlertTriangle, CheckCircle, XCircle, Edit, Code, Table, Info, ArrowRight, Lightbulb } from 'lucide-react';
import { clsx } from 'clsx';

export function DiffViewer({ change }) {
    const [viewMode, setViewMode] = useState('friendly'); // 'friendly', 'split', or 'table'

    if (!change) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center">
                    <Info className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Select an endpoint from the sidebar to view changes</p>
                    <p className="text-sm text-gray-400 mt-2">Choose from Overview, Full Diff, or specific endpoints</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full overflow-y-auto p-8 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <Badge method={change.method} />
                            <h1 className="text-3xl font-bold text-gray-900">{change.path}</h1>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('friendly')}
                                className={clsx(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2",
                                    viewMode === 'friendly'
                                        ? "bg-white text-green-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span>Friendly</span>
                            </button>
                            <button
                                onClick={() => setViewMode('split')}
                                className={clsx(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2",
                                    viewMode === 'split'
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <Code className="w-4 h-4" />
                                <span>Diff</span>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={clsx(
                                    "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2",
                                    viewMode === 'table'
                                        ? "bg-white text-purple-600 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <Table className="w-4 h-4" />
                                <span>Table</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <StatusBadge status={change.status} />
                        {change.is_breaking && (
                            <span className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Breaking Change - Requires Client Updates
                            </span>
                        )}
                    </div>

                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <p className="text-gray-700 font-medium">{change.summary_text}</p>
                    </div>
                </div>

                {/* Content based on view mode */}
                {viewMode === 'friendly' ? (
                    <FriendlyView details={change.details} status={change.status} />
                ) : viewMode === 'split' ? (
                    <SplitDiffView details={change.details} />
                ) : (
                    <TableView details={change.details} />
                )}
            </div>
        </div>
    );
}

function FriendlyView({ details, status }) {
    if (details.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {status === 'added' ? 'New Endpoint Added' : status === 'deleted' ? 'Endpoint Removed' : 'Status Change Only'}
                </h3>
                <p className="text-gray-600">
                    {status === 'added'
                        ? 'This is a new endpoint with no previous version to compare.'
                        : status === 'deleted'
                            ? 'This endpoint has been removed from the API.'
                            : 'Only the endpoint status changed, no field-level modifications detected.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {details.map((detail, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg mb-1">
                                    {getChangeTitle(detail.change_type)}
                                </h3>
                                <p className="text-blue-100 text-sm font-mono break-all">
                                    📍 {formatLocation(detail.location)}
                                </p>
                            </div>
                            <ChangeTypeBadge type={detail.change_type} />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Before */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Before</span>
                                </div>
                                <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                                    <pre className="font-mono text-sm text-red-900 whitespace-pre-wrap break-all">
                                        {detail.old_value === 'not present' || detail.old_value === 'N/A' ? (
                                            <span className="text-red-400 italic">(not present)</span>
                                        ) : (
                                            formatValue(detail.old_value)
                                        )}
                                    </pre>
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="hidden md:flex items-center justify-center">
                                <ArrowRight className="w-8 h-8 text-gray-400" />
                            </div>

                            {/* After */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">After</span>
                                </div>
                                <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4">
                                    <pre className="font-mono text-sm text-green-900 whitespace-pre-wrap break-all">
                                        {detail.new_value === 'not present' || detail.new_value === 'N/A' ? (
                                            <span className="text-green-400 italic">(not present)</span>
                                        ) : (
                                            formatValue(detail.new_value)
                                        )}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Impact explanation */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">What does this mean?</h4>
                                    <p className="text-sm text-blue-800">{getImpactExplanation(detail)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function SplitDiffView({ details }) {
    if (details.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                No detailed field changes.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {details.map((detail, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="font-mono text-sm font-semibold text-gray-700">
                            📍 {detail.location}
                        </span>
                        <span className="ml-3 text-xs text-gray-500 uppercase font-medium">
                            {detail.change_type?.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="bg-red-50">
                            <div className="bg-red-100 px-4 py-2 border-b border-red-200">
                                <span className="text-xs font-bold text-red-800 uppercase tracking-wide">- Old</span>
                            </div>
                            <div className="p-4">
                                <pre className="font-mono text-sm text-red-900 whitespace-pre-wrap break-all">
                                    {detail.old_value === 'not present' ? (
                                        <span className="text-red-400 italic">(not present)</span>
                                    ) : (
                                        formatValue(detail.old_value)
                                    )}
                                </pre>
                            </div>
                        </div>

                        <div className="bg-green-50">
                            <div className="bg-green-100 px-4 py-2 border-b border-green-200">
                                <span className="text-xs font-bold text-green-800 uppercase tracking-wide">+ New</span>
                            </div>
                            <div className="p-4">
                                <pre className="font-mono text-sm text-green-900 whitespace-pre-wrap break-all">
                                    {detail.new_value === 'not present' ? (
                                        <span className="text-green-400 italic">(not present)</span>
                                    ) : (
                                        formatValue(detail.new_value)
                                    )}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TableView({ details }) {
    if (details.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                No detailed field changes.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Before</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">After</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Type</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {details.map((detail, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-mono text-gray-900 break-all">{detail.location}</td>
                            <td className="px-6 py-4 text-sm font-mono bg-red-50 text-red-900 break-all">
                                {detail.old_value}
                            </td>
                            <td className="px-6 py-4 text-sm font-mono bg-green-50 text-green-900 break-all">
                                {detail.new_value}
                            </td>
                            <td className="px-6 py-4">
                                <ChangeTypeBadge type={detail.change_type} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        added: "bg-green-100 text-green-800 border-green-300",
        deleted: "bg-red-100 text-red-800 border-red-300",
        updated: "bg-blue-100 text-blue-800 border-blue-300"
    };
    const icons = {
        added: <CheckCircle className="w-4 h-4 mr-1" />,
        deleted: <XCircle className="w-4 h-4 mr-1" />,
        updated: <Edit className="w-4 h-4 mr-1" />
    };

    return (
        <span className={clsx("flex items-center px-3 py-1 rounded-full text-sm font-bold uppercase border-2", styles[status])}>
            {icons[status]} {status}
        </span>
    );
}

function ChangeTypeBadge({ type }) {
    const styles = {
        value_changed: "bg-blue-100 text-blue-800",
        type_mismatch: "bg-orange-100 text-orange-800",
        item_added: "bg-green-100 text-green-800",
        item_removed: "bg-red-100 text-red-800",
        required_added: "bg-red-100 text-red-800"
    };

    const labels = {
        value_changed: "Value Changed",
        type_mismatch: "Type Changed",
        item_added: "Field Added",
        item_removed: "Field Removed",
        required_added: "Required Field Added"
    };

    return (
        <span className={clsx("inline-flex px-2 py-1 rounded text-xs font-bold uppercase", styles[type] || "bg-gray-100 text-gray-800")}>
            {labels[type] || type}
        </span>
    );
}

// Helper functions
function formatValue(value) {
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }
    return String(value);
}

function formatLocation(location) {
    return location
        .replace(/\./g, ' → ')
        .replace(/requestBody/g, 'Request Body')
        .replace(/responses/g, 'Responses')
        .replace(/parameters/g, 'Parameters')
        .replace(/properties/g, 'Properties')
        .replace(/schema/g, 'Schema');
}

function getChangeTitle(changeType) {
    const titles = {
        value_changed: "📝 Value Modified",
        type_mismatch: "⚠️ Data Type Changed",
        item_added: "➕ New Field Added",
        item_removed: "➖ Field Removed",
        required_added: "🚨 Required Field Added"
    };
    return titles[changeType] || "🔄 Change Detected";
}

function getImpactExplanation(detail) {
    const { change_type, location } = detail;

    if (change_type === 'type_mismatch') {
        return `The data type has changed from "${detail.old_value}" to "${detail.new_value}". Clients expecting the old type may encounter errors.`;
    }

    if (change_type === 'required_added') {
        return `A new required field has been added. All API clients must now include this field in their requests, which may break existing integrations.`;
    }

    if (change_type === 'item_added') {
        if (location.includes('response')) {
            return `A new field has been added to the response. This is generally safe and won't break existing clients.`;
        }
        return `A new optional field has been added. Existing clients can continue working without changes.`;
    }

    if (change_type === 'item_removed') {
        if (location.includes('response')) {
            return `A field has been removed from the response. Clients relying on this field may break.`;
        }
        return `A field has been removed. This may affect clients that were using this field.`;
    }

    if (change_type === 'value_changed') {
        return `The value has changed from "${detail.old_value}" to "${detail.new_value}". Review if this affects your integration.`;
    }

    return `This field has been modified. Please review the changes to ensure compatibility with your application.`;
}
