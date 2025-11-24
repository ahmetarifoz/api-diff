import React, { useState } from 'react';
import { Badge } from './Badge';
import { AlertTriangle, RefreshCw, TrendingUp, TrendingDown, Edit, FileText, ChevronDown, ChevronRight, FileCode, Book } from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ changes, selectedId, onSelect, onReset, summary }) {
    const [showBreakingOnly, setShowBreakingOnly] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({
        added: true,
        updated: true,
        deleted: true
    });

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    // Group changes by status
    const groupedChanges = {
        added: changes.filter(c => c.status === 'added'),
        updated: changes.filter(c => c.status === 'updated'),
        deleted: changes.filter(c => c.status === 'deleted')
    };

    // Apply breaking filter
    const filterByBreaking = (items) =>
        showBreakingOnly ? items.filter(c => c.is_breaking) : items;

    const GroupHeader = ({ type, count, icon: Icon, color, isExpanded, onClick }) => (
        <div
            onClick={onClick}
            className={clsx(
                "flex items-center justify-between px-3 py-2 cursor-pointer transition-colors",
                "hover:bg-gray-100 border-b border-gray-200 bg-gray-50"
            )}
        >
            <div className="flex items-center space-x-2">
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                <Icon className={clsx("w-4 h-4", color)} />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {type}
                </span>
                <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full",
                    type === 'Added' ? 'bg-green-100 text-green-700' :
                        type === 'Updated' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                )}>
                    {count}
                </span>
            </div>
        </div>
    );

    const ChangeItem = ({ change }) => (
        <div
            onClick={() => onSelect(change.id)}
            className={clsx(
                "px-3 py-2.5 cursor-pointer hover:bg-gray-100 border-b border-gray-100 flex items-center justify-between transition-colors",
                selectedId === change.id && "bg-blue-50 border-l-4 border-l-blue-500"
            )}
        >
            <div className="flex items-center space-x-2 overflow-hidden">
                <Badge method={change.method} />
                <span className="text-sm font-medium text-gray-700 truncate" title={change.path}>
                    {change.path}
                </span>
            </div>
            {change.is_breaking && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
        </div>
    );

    return (
        <div className="w-80 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-lg font-bold mb-3 text-gray-800">API Changes</h2>

                {summary && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <div className="flex items-center space-x-1 text-green-700">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-xs font-medium">Added</span>
                            </div>
                            <p className="text-lg font-bold text-green-800">{summary.added_count}</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <div className="flex items-center space-x-1 text-red-700">
                                <TrendingDown className="w-3 h-3" />
                                <span className="text-xs font-medium">Deleted</span>
                            </div>
                            <p className="text-lg font-bold text-red-800">{summary.deleted_count}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                            <div className="flex items-center space-x-1 text-blue-700">
                                <Edit className="w-3 h-3" />
                                <span className="text-xs font-medium">Updated</span>
                            </div>
                            <p className="text-lg font-bold text-blue-800">{summary.updated_count}</p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                            <div className="flex items-center space-x-1 text-orange-700">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-xs font-medium">Breaking</span>
                            </div>
                            <p className="text-lg font-bold text-orange-800">{summary.breaking_count}</p>
                        </div>
                    </div>
                )}

                <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer select-none mb-3">
                    <input
                        type="checkbox"
                        checked={showBreakingOnly}
                        onChange={e => setShowBreakingOnly(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Show Breaking Only</span>
                </label>

                <button
                    onClick={onReset}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>New Analysis</span>
                </button>
            </div>

            {/* Overview Option */}
            <div
                onClick={() => onSelect('overview')}
                className={clsx(
                    "px-4 py-3 cursor-pointer hover:bg-blue-50 border-b-2 border-gray-200 flex items-center space-x-3 transition-colors",
                    selectedId === 'overview' && "bg-blue-100 border-l-4 border-l-blue-600"
                )}
            >
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-gray-800">Overview Report</span>
            </div>

            {/* Full Diff Option */}
            <div
                onClick={() => onSelect('full-diff')}
                className={clsx(
                    "px-4 py-3 cursor-pointer hover:bg-purple-50 border-b-2 border-gray-200 flex items-center space-x-3 transition-colors",
                    selectedId === 'full-diff' && "bg-purple-100 border-l-4 border-l-purple-600"
                )}
            >
                <FileCode className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-bold text-gray-800">Full Diff View</span>
            </div>

            {/* API Documentation Option */}
            <div
                onClick={() => onSelect('api-docs')}
                className={clsx(
                    "px-4 py-3 cursor-pointer hover:bg-green-50 border-b-2 border-gray-200 flex items-center space-x-3 transition-colors",
                    selectedId === 'api-docs' && "bg-green-100 border-l-4 border-l-green-600"
                )}
            >
                <Book className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-gray-800">API Documentation</span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Added Group */}
                {groupedChanges.added.length > 0 && (
                    <>
                        <GroupHeader
                            type="Added"
                            count={filterByBreaking(groupedChanges.added).length}
                            icon={TrendingUp}
                            color="text-green-600"
                            isExpanded={expandedGroups.added}
                            onClick={() => toggleGroup('added')}
                        />
                        {expandedGroups.added && filterByBreaking(groupedChanges.added).map(change => (
                            <ChangeItem key={change.id} change={change} />
                        ))}
                    </>
                )}

                {/* Updated Group */}
                {groupedChanges.updated.length > 0 && (
                    <>
                        <GroupHeader
                            type="Updated"
                            count={filterByBreaking(groupedChanges.updated).length}
                            icon={Edit}
                            color="text-blue-600"
                            isExpanded={expandedGroups.updated}
                            onClick={() => toggleGroup('updated')}
                        />
                        {expandedGroups.updated && filterByBreaking(groupedChanges.updated).map(change => (
                            <ChangeItem key={change.id} change={change} />
                        ))}
                    </>
                )}

                {/* Deleted Group */}
                {groupedChanges.deleted.length > 0 && (
                    <>
                        <GroupHeader
                            type="Deleted"
                            count={filterByBreaking(groupedChanges.deleted).length}
                            icon={TrendingDown}
                            color="text-red-600"
                            isExpanded={expandedGroups.deleted}
                            onClick={() => toggleGroup('deleted')}
                        />
                        {expandedGroups.deleted && filterByBreaking(groupedChanges.deleted).map(change => (
                            <ChangeItem key={change.id} change={change} />
                        ))}
                    </>
                )}

                {changes.length === 0 && (
                    <div className="p-4 text-gray-500 text-sm text-center">No changes found.</div>
                )}
            </div>
        </div>
    );
}
