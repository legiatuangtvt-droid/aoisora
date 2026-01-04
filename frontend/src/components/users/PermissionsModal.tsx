'use client';

import React, { useState, useEffect } from 'react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface UserRole {
  id: number;
  name: string;
  type: 'user' | 'role';
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (targetId: number, targetType: 'user' | 'role', permissions: string[]) => Promise<void>;
  users: UserRole[];
  roles: UserRole[];
}

const PERMISSION_CATEGORIES = [
  {
    name: 'User Management',
    permissions: [
      { id: 'user_view', name: 'View Users', description: 'Can view user list and details' },
      { id: 'user_create', name: 'Create Users', description: 'Can create new users' },
      { id: 'user_edit', name: 'Edit Users', description: 'Can edit user information' },
      { id: 'user_delete', name: 'Delete Users', description: 'Can delete users' },
    ],
  },
  {
    name: 'Team Management',
    permissions: [
      { id: 'team_view', name: 'View Teams', description: 'Can view team list and details' },
      { id: 'team_create', name: 'Create Teams', description: 'Can create new teams' },
      { id: 'team_edit', name: 'Edit Teams', description: 'Can edit team information' },
      { id: 'team_delete', name: 'Delete Teams', description: 'Can delete teams' },
    ],
  },
  {
    name: 'Department Management',
    permissions: [
      { id: 'dept_view', name: 'View Departments', description: 'Can view department hierarchy' },
      { id: 'dept_create', name: 'Create Departments', description: 'Can create new departments' },
      { id: 'dept_edit', name: 'Edit Departments', description: 'Can edit department information' },
      { id: 'dept_delete', name: 'Delete Departments', description: 'Can delete departments' },
    ],
  },
  {
    name: 'Data Access',
    permissions: [
      { id: 'data_export', name: 'Export Data', description: 'Can export data to Excel/CSV' },
      { id: 'data_import', name: 'Import Data', description: 'Can import data from Excel/CSV' },
      { id: 'data_reports', name: 'View Reports', description: 'Can view analytics and reports' },
    ],
  },
];

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  users,
  roles,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<UserRole | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTarget(null);
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
    if (!selectedTarget) return;

    setSaving(true);
    try {
      await onSave(selectedTarget.id, selectedTarget.type, selectedPermissions);
      onClose();
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredOptions = [...users, ...roles].filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-[20px] font-bold text-[#333333]">Permissions</h2>
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
          {/* User/Role Selection */}
          <div className="mb-6">
            <label className="block text-[14px] font-medium text-[#333333] mb-2">
              Select User or Role
            </label>
            <div className="relative">
              <div
                className="w-full px-4 py-3 border border-[#E8E8E8] rounded-lg cursor-pointer flex items-center justify-between"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedTarget ? (
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[11px] rounded-full ${
                      selectedTarget.type === 'role'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedTarget.type === 'role' ? 'Role' : 'User'}
                    </span>
                    <span className="text-[14px] text-[#333333]">{selectedTarget.name}</span>
                  </div>
                ) : (
                  <span className="text-[14px] text-[#9B9B9B]">Select a user or role...</span>
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
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E8E8E8] rounded-lg text-[14px] focus:outline-none focus:border-[#C5055B]"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Roles Section */}
                  {roles.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-[12px] font-semibold text-[#6B6B6B] bg-gray-50">
                        Roles
                      </div>
                      {roles
                        .filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(role => (
                          <div
                            key={`role-${role.id}`}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                            onClick={() => {
                              setSelectedTarget({ ...role, type: 'role' });
                              setIsDropdownOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <span className="px-2 py-0.5 text-[11px] rounded-full bg-purple-100 text-purple-700">
                              Role
                            </span>
                            <span className="text-[14px] text-[#333333]">{role.name}</span>
                          </div>
                        ))}
                    </>
                  )}

                  {/* Users Section */}
                  {users.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-[12px] font-semibold text-[#6B6B6B] bg-gray-50">
                        Users
                      </div>
                      {users
                        .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(user => (
                          <div
                            key={`user-${user.id}`}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                            onClick={() => {
                              setSelectedTarget({ ...user, type: 'user' });
                              setIsDropdownOpen(false);
                              setSearchTerm('');
                            }}
                          >
                            <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-100 text-blue-700">
                              User
                            </span>
                            <span className="text-[14px] text-[#333333]">{user.name}</span>
                          </div>
                        ))}
                    </>
                  )}

                  {filteredOptions.length === 0 && (
                    <div className="px-3 py-4 text-center text-[14px] text-[#9B9B9B]">
                      No results found
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

            {PERMISSION_CATEGORIES.map((category) => {
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
                        ? 'bg-[#C5055B] border-[#C5055B]'
                        : someSelected
                          ? 'bg-white border-[#C5055B]'
                          : 'bg-white border-[#9B9B9B]'
                    }`}>
                      {allSelected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {someSelected && !allSelected && (
                        <div className="w-2 h-0.5 bg-[#C5055B]" />
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
                            ? 'bg-[#C5055B] border-[#C5055B]'
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
            disabled={!selectedTarget || saving}
            className="px-6 py-2 text-[14px] text-white bg-[#C5055B] rounded-lg hover:bg-[#A50449] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;
