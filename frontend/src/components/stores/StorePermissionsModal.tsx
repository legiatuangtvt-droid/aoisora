'use client';

import React, { useState, useEffect } from 'react';

interface Store {
  id: string;
  name: string;
  code: string;
}

interface StorePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (storeId: string, permissions: string[]) => Promise<void>;
  stores: Store[];
}

const STORE_PERMISSION_CATEGORIES = [
  {
    name: 'Store Management',
    permissions: [
      { id: 'store_view', name: 'View Store', description: 'Can view store information and details' },
      { id: 'store_edit', name: 'Edit Store', description: 'Can edit store information' },
      { id: 'store_delete', name: 'Delete Store', description: 'Can delete store' },
    ],
  },
  {
    name: 'Staff Management',
    permissions: [
      { id: 'staff_view', name: 'View Staff', description: 'Can view staff list in store' },
      { id: 'staff_add', name: 'Add Staff', description: 'Can add staff to store' },
      { id: 'staff_edit', name: 'Edit Staff', description: 'Can edit staff information' },
      { id: 'staff_remove', name: 'Remove Staff', description: 'Can remove staff from store' },
    ],
  },
  {
    name: 'Task Management',
    permissions: [
      { id: 'task_view', name: 'View Tasks', description: 'Can view tasks assigned to store' },
      { id: 'task_create', name: 'Create Tasks', description: 'Can create tasks for store' },
      { id: 'task_assign', name: 'Assign Tasks', description: 'Can assign tasks to staff' },
      { id: 'task_complete', name: 'Complete Tasks', description: 'Can mark tasks as complete' },
    ],
  },
  {
    name: 'Data Access',
    permissions: [
      { id: 'data_export', name: 'Export Data', description: 'Can export store data to Excel/CSV' },
      { id: 'data_reports', name: 'View Reports', description: 'Can view store reports and analytics' },
      { id: 'data_schedule', name: 'View Schedule', description: 'Can view staff schedule' },
    ],
  },
];

const StorePermissionsModal: React.FC<StorePermissionsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  stores,
}) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedStore(null);
      setSelectedPermissions([]);
      setSearchTerm('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleCategoryToggle = (categoryPermissions: { id: string }[]) => {
    const categoryIds = categoryPermissions.map(p => p.id);
    const allSelected = categoryIds.every(id => selectedPermissions.includes(id));

    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !categoryIds.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...categoryIds])]);
    }
  };

  const handleSave = async () => {
    if (!selectedStore) return;

    setSaving(true);
    try {
      await onSave(selectedStore.id, selectedPermissions);
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[10px] w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
          <h2 className="text-[20px] font-bold text-[#333333]">Store Permissions</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-[#6B6B6B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Store Selection */}
          <div className="mb-6">
            <label className="block text-[14px] font-medium text-[#333333] mb-2">
              Select Store
            </label>
            <div className="relative">
              <div
                className="w-full px-4 py-3 border border-[#E8E8E8] rounded-lg cursor-pointer flex items-center justify-between"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedStore ? (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-100 text-blue-700">
                      {selectedStore.code}
                    </span>
                    <span className="text-[14px] text-[#333333]">{selectedStore.name}</span>
                  </div>
                ) : (
                  <span className="text-[14px] text-[#9B9B9B]">Select a store...</span>
                )}
                <svg
                  className={`w-5 h-5 text-[#6B6B6B] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-lg z-10 max-h-[200px] overflow-y-auto">
                  {/* Search */}
                  <div className="p-2 border-b border-[#E8E8E8]">
                    <input
                      type="text"
                      placeholder="Search by name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-[14px] focus:outline-none focus:border-[#0664E9]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Store List */}
                  {filteredStores.map(store => (
                    <div
                      key={store.id}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                      onClick={() => {
                        setSelectedStore(store);
                        setIsDropdownOpen(false);
                        setSearchTerm('');
                      }}
                    >
                      <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-100 text-blue-700">
                        {store.code}
                      </span>
                      <span className="text-[14px] text-[#333333]">{store.name}</span>
                    </div>
                  ))}

                  {filteredStores.length === 0 && (
                    <div className="px-3 py-4 text-center text-[14px] text-[#9B9B9B]">
                      No stores found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Permissions List */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mb-3">
              Permissions
            </label>

            {STORE_PERMISSION_CATEGORIES.map((category) => {
              const categoryIds = category.permissions.map(p => p.id);
              const selectedCount = categoryIds.filter(id => selectedPermissions.includes(id)).length;
              const allSelected = selectedCount === categoryIds.length;
              const someSelected = selectedCount > 0 && selectedCount < categoryIds.length;

              return (
                <div key={category.name} className="mb-4 border border-[#E8E8E8] rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 cursor-pointer"
                    onClick={() => handleCategoryToggle(category.permissions)}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      allSelected
                        ? 'bg-[#0664E9] border-[#0664E9]'
                        : someSelected
                          ? 'bg-white border-[#0664E9]'
                          : 'bg-white border-[#9B9B9B]'
                    }`}>
                      {allSelected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {someSelected && !allSelected && (
                        <div className="w-2 h-0.5 bg-[#0664E9]" />
                      )}
                    </div>
                    <span className="text-[14px] font-semibold text-[#333333]">{category.name}</span>
                    <span className="text-[12px] text-[#6B6B6B]">
                      ({selectedCount}/{categoryIds.length})
                    </span>
                  </div>

                  {/* Permissions */}
                  <div className="divide-y divide-[#E8E8E8]">
                    {category.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePermissionToggle(permission.id)}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedPermissions.includes(permission.id)
                            ? 'bg-[#0664E9] border-[#0664E9]'
                            : 'bg-white border-[#9B9B9B]'
                        }`}>
                          {selectedPermissions.includes(permission.id) && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-[14px] text-[#333333]">{permission.name}</div>
                          <div className="text-[12px] text-[#6B6B6B]">{permission.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E8E8E8]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[14px] text-[#6B6B6B] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedStore || saving}
            className="px-6 py-2 text-[14px] text-white bg-[#0664E9] rounded-lg hover:bg-[#0553c7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorePermissionsModal;
