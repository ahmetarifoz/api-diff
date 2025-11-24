import React, { useMemo } from 'react';
import { FileCode, ArrowLeftRight } from 'lucide-react';

export function FullDiffView({ rawFiles }) {
    if (!rawFiles || !rawFiles.old || !rawFiles.new) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-white">
                <div className="text-center">
                    <FileCode className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Raw file contents not available</p>
                </div>
            </div>
        );
    }

    const oldLines = rawFiles.old.split('\n');
    const newLines = rawFiles.new.split('\n');
    const maxLines = Math.max(oldLines.length, newLines.length);

    // Simple line-by-line diff
    const diffLines = useMemo(() => {
        const result = [];
        for (let i = 0; i < maxLines; i++) {
            const oldLine = oldLines[i] ?? '';
            const newLine = newLines[i] ?? '';

            let status = 'unchanged';
            if (oldLine !== newLine) {
                if (!oldLine) status = 'added';
                else if (!newLine) status = 'deleted';
                else status = 'modified';
            }

            result.push({
                lineNum: i + 1,
                oldLine,
                newLine,
                status
            });
        }
        return result;
    }, [rawFiles]);

    return (
        <div className="flex-1 h-full overflow-hidden bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <FileCode className="w-6 h-6 text-blue-400" />
                        <h2 className="text-xl font-bold text-white">Full File Diff</h2>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded"></div>
                            <span className="text-gray-300">Old Spec</span>
                        </div>
                        <ArrowLeftRight className="w-4 h-4 text-gray-500" />
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded"></div>
                            <span className="text-gray-300">New Spec</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Diff Content */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 divide-x divide-gray-700">
                    {/* Old File */}
                    <div className="bg-gray-900">
                        <div className="sticky top-0 bg-red-900 bg-opacity-30 border-b border-red-800 px-4 py-2 z-10">
                            <span className="text-sm font-bold text-red-300 uppercase tracking-wide">
                                Old Specification
                            </span>
                        </div>
                        <div className="font-mono text-sm">
                            {diffLines.map((line, idx) => (
                                <div
                                    key={`old-${idx}`}
                                    className={getLineClassName(line.status, 'old')}
                                >
                                    <span className="inline-block w-12 text-right pr-4 text-gray-600 select-none">
                                        {line.oldLine ? line.lineNum : ''}
                                    </span>
                                    <span className="inline-block">
                                        {line.status === 'deleted' && (
                                            <span className="text-red-400 mr-1">-</span>
                                        )}
                                        {line.oldLine || '\u00A0'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New File */}
                    <div className="bg-gray-900">
                        <div className="sticky top-0 bg-green-900 bg-opacity-30 border-b border-green-800 px-4 py-2 z-10">
                            <span className="text-sm font-bold text-green-300 uppercase tracking-wide">
                                New Specification
                            </span>
                        </div>
                        <div className="font-mono text-sm">
                            {diffLines.map((line, idx) => (
                                <div
                                    key={`new-${idx}`}
                                    className={getLineClassName(line.status, 'new')}
                                >
                                    <span className="inline-block w-12 text-right pr-4 text-gray-600 select-none">
                                        {line.newLine ? line.lineNum : ''}
                                    </span>
                                    <span className="inline-block">
                                        {line.status === 'added' && (
                                            <span className="text-green-400 mr-1">+</span>
                                        )}
                                        {line.newLine || '\u00A0'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>
                        Total Lines: <strong className="text-white">{maxLines}</strong>
                    </span>
                    <div className="flex items-center space-x-4">
                        <span>
                            <span className="text-green-400">+{diffLines.filter(l => l.status === 'added').length}</span> additions
                        </span>
                        <span>
                            <span className="text-red-400">-{diffLines.filter(l => l.status === 'deleted').length}</span> deletions
                        </span>
                        <span>
                            <span className="text-yellow-400">~{diffLines.filter(l => l.status === 'modified').length}</span> modifications
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getLineClassName(status, side) {
    const base = "px-4 py-0.5 hover:bg-gray-800 transition-colors";

    if (status === 'unchanged') {
        return `${base} text-gray-300`;
    }

    if (status === 'deleted') {
        return side === 'old'
            ? `${base} bg-red-900 bg-opacity-20 text-red-200`
            : `${base} bg-gray-800 bg-opacity-50 text-gray-600`;
    }

    if (status === 'added') {
        return side === 'new'
            ? `${base} bg-green-900 bg-opacity-20 text-green-200`
            : `${base} bg-gray-800 bg-opacity-50 text-gray-600`;
    }

    if (status === 'modified') {
        return side === 'old'
            ? `${base} bg-red-900 bg-opacity-10 text-red-100`
            : `${base} bg-green-900 bg-opacity-10 text-green-100`;
    }

    return base;
}
