'use client';

import Link from 'next/link';

export default function AuthCodeError() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-600 mb-8">
                There was a problem signing you in. The authorization code may have expired or is invalid.
            </p>
            <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Return to Login
            </Link>
        </div>
    );
}
