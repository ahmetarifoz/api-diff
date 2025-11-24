import React from 'react';
import { clsx } from 'clsx';

const METHOD_COLORS = {
    GET: 'bg-blue-100 text-blue-800',
    POST: 'bg-green-100 text-green-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800',
};

export function Badge({ method }) {
    const colorClass = METHOD_COLORS[method] || 'bg-gray-100 text-gray-800';
    return (
        <span className={clsx("px-2 py-0.5 rounded text-xs font-bold", colorClass)}>
            {method}
        </span>
    );
}
