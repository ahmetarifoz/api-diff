import React, { useState } from 'react';
import { Badge } from './Badge';
import { Book, ChevronDown, ChevronRight, Code, FileText, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function ApiDocumentation({ apiSpec }) {
    const [expandedPaths, setExpandedPaths] = useState({});

    if (!apiSpec || !apiSpec.paths) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-purple-50">
                <div className="text-center">
                    <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">API specification not available</p>
                </div>
            </div>
        );
    }

    const togglePath = (path) => {
        setExpandedPaths(prev => ({
            ...prev,
            [path]: !prev[path]
        }));
    };

    const paths = Object.entries(apiSpec.paths || {});
    const info = apiSpec.info || {};
    const servers = apiSpec.servers || [];

    return (
        <div className="flex-1 h-full overflow-y-auto p-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-200">
                    <div className="flex items-start space-x-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Book className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                {info.title || 'API Documentation'}
                            </h1>
                            <p className="text-gray-600 text-lg mb-4">
                                {info.description || 'API specification documentation'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                                    Version {info.version || '1.0.0'}
                                </span>
                                {info.contact?.email && (
                                    <span className="text-gray-600">
                                        📧 {info.contact.email}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Servers */}
                    {servers.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                                Base URLs
                            </h3>
                            <div className="space-y-2">
                                {servers.map((server, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                                        <Code className="w-4 h-4 text-gray-500" />
                                        <code className="text-sm font-mono text-gray-900">{server.url}</code>
                                        {server.description && (
                                            <span className="text-sm text-gray-600">- {server.description}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Endpoints */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <FileText className="w-6 h-6 text-purple-600" />
                        <span>Endpoints</span>
                        <span className="text-sm font-normal text-gray-500">({paths.length} total)</span>
                    </h2>

                    {paths.map(([path, pathItem]) => (
                        <PathItem
                            key={path}
                            path={path}
                            pathItem={pathItem}
                            isExpanded={expandedPaths[path]}
                            onToggle={() => togglePath(path)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function PathItem({ path, pathItem, isExpanded, onToggle }) {
    const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
    const operations = methods
        .filter(method => pathItem[method])
        .map(method => ({ method, operation: pathItem[method] }));

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Path Header */}
            <div
                onClick={onToggle}
                className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 cursor-pointer hover:from-purple-100 hover:to-blue-100 transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <code className="text-lg font-bold font-mono text-gray-900">{path}</code>
                    </div>
                    <div className="flex items-center space-x-2">
                        {operations.map(({ method }) => (
                            <Badge key={method} method={method.toUpperCase()} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Operations */}
            {isExpanded && (
                <div className="divide-y divide-gray-200">
                    {operations.map(({ method, operation }) => (
                        <OperationItem key={method} method={method} operation={operation} />
                    ))}
                </div>
            )}
        </div>
    );
}

function OperationItem({ method, operation }) {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                        <Badge method={method.toUpperCase()} />
                        <h3 className="text-xl font-bold text-gray-900">
                            {operation.summary || `${method.toUpperCase()} operation`}
                        </h3>
                    </div>
                    {operation.description && (
                        <p className="text-gray-600 mt-2">{operation.description}</p>
                    )}
                    {operation.deprecated && (
                        <div className="mt-2 flex items-center space-x-2 text-orange-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-semibold">Deprecated</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="ml-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
            </div>

            {showDetails && (
                <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
                    {/* Parameters */}
                    {operation.parameters && operation.parameters.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                                Parameters
                            </h4>
                            <div className="space-y-2">
                                {operation.parameters.map((param, idx) => (
                                    <ParameterItem key={idx} parameter={param} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Request Body */}
                    {operation.requestBody && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                                Request Body
                            </h4>
                            <RequestBodyItem requestBody={operation.requestBody} />
                        </div>
                    )}

                    {/* Responses */}
                    {operation.responses && (
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                                Responses
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(operation.responses).map(([code, response]) => (
                                    <ResponseItem key={code} code={code} response={response} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ParameterItem({ parameter }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                        <code className="font-mono font-semibold text-gray-900">{parameter.name}</code>
                        {parameter.required && (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">
                                REQUIRED
                            </span>
                        )}
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                            {parameter.in}
                        </span>
                    </div>
                    {parameter.description && (
                        <p className="text-sm text-gray-600 mt-1">{parameter.description}</p>
                    )}
                    {parameter.schema && (
                        <div className="mt-2">
                            <span className="text-xs text-gray-500">Type: </span>
                            <code className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                                {parameter.schema.type || 'any'}
                            </code>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function RequestBodyItem({ requestBody }) {
    const content = requestBody.content || {};
    const contentTypes = Object.keys(content);

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {requestBody.description && (
                <p className="text-sm text-gray-700 mb-3">{requestBody.description}</p>
            )}
            {requestBody.required && (
                <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Required</span>
                </div>
            )}
            {contentTypes.map(contentType => (
                <div key={contentType} className="mt-2">
                    <div className="text-xs font-semibold text-gray-600 mb-2">Content-Type: {contentType}</div>
                    {content[contentType].schema && (
                        <SchemaView schema={content[contentType].schema} />
                    )}
                </div>
            ))}
        </div>
    );
}

function ResponseItem({ code, response }) {
    const isSuccess = code.startsWith('2');
    const bgColor = isSuccess ? 'bg-green-50' : code.startsWith('4') || code.startsWith('5') ? 'bg-red-50' : 'bg-gray-50';
    const borderColor = isSuccess ? 'border-green-200' : code.startsWith('4') || code.startsWith('5') ? 'border-red-200' : 'border-gray-200';

    return (
        <div className={clsx("border rounded-lg p-4", bgColor, borderColor)}>
            <div className="flex items-center space-x-2 mb-2">
                <span className={clsx(
                    "font-bold text-lg",
                    isSuccess ? 'text-green-700' : code.startsWith('4') || code.startsWith('5') ? 'text-red-700' : 'text-gray-700'
                )}>
                    {code}
                </span>
                <span className="text-gray-700">{response.description || 'No description'}</span>
            </div>
            {response.content && Object.keys(response.content).length > 0 && (
                <div className="mt-3">
                    {Object.entries(response.content).map(([contentType, mediaType]) => (
                        <div key={contentType}>
                            <div className="text-xs font-semibold text-gray-600 mb-2">Content-Type: {contentType}</div>
                            {mediaType.schema && <SchemaView schema={mediaType.schema} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function SchemaView({ schema }) {
    if (!schema) return null;

    return (
        <div className="bg-white border border-gray-300 rounded p-3 font-mono text-sm">
            <pre className="whitespace-pre-wrap break-all text-gray-800">
                {JSON.stringify(schema, null, 2)}
            </pre>
        </div>
    );
}
