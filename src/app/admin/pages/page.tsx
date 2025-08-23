'use client';

import { ProtectedAdminPage } from '@/components/ProtectedAdminPage';

export default function AdminPages() {
  return (
    <ProtectedAdminPage>
      <div className="max-w-4xl mx-auto">
        <div className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-6">
          {'>'} Pages Management
        </div>
        <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-8">
          <div className="text-center text-neutral-600 dark:text-neutral-400">
            Pages Management Coming Soon...
          </div>
        </div>
      </div>
    </ProtectedAdminPage>
  );
}