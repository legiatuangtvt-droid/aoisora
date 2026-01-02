'use client';

import { useState, useEffect } from 'react';
import { X, FolderOpen, ChevronRight, FileText, Check } from 'lucide-react';
import { getManualFolders } from '@/lib/api';
import type { ManualFolderWithStats } from '@/types/api';

interface CreateManualDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    folder_id: number | null;
    is_draft: boolean;
    document_name: string;
  }) => void;
  currentFolderId?: number | null;
}

export default function CreateManualDialog({
  isOpen,
  onClose,
  onConfirm,
  currentFolderId,
}: CreateManualDialogProps) {
  const [documentName, setDocumentName] = useState('');
  const [isDraft, setIsDraft] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(currentFolderId || null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');
  const [folders, setFolders] = useState<ManualFolderWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [folderPath, setFolderPath] = useState<ManualFolderWithStats[]>([]);

  // Load root folders
  useEffect(() => {
    if (isOpen) {
      loadFolders(null);
    }
  }, [isOpen]);

  const loadFolders = async (parentId: number | null) => {
    try {
      setLoading(true);
      const data = await getManualFolders(parentId !== null ? { parent_id: parentId } : undefined);
      setFolders(data);
    } catch (error) {
      console.error('Failed to load folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToFolder = (folder: ManualFolderWithStats) => {
    setFolderPath([...folderPath, folder]);
    loadFolders(folder.folder_id);
  };

  const navigateBack = (index: number) => {
    const newPath = folderPath.slice(0, index);
    setFolderPath(newPath);
    const parentId = newPath.length > 0 ? newPath[newPath.length - 1].folder_id : null;
    loadFolders(parentId);
  };

  // Select a leaf folder (no children)
  const selectFolder = (folder: ManualFolderWithStats) => {
    // Only allow selecting folders with no children
    if (folder.child_folder_count > 0) {
      // Navigate into the folder instead
      navigateToFolder(folder);
      return;
    }

    // Build full path name
    const pathNames = [...folderPath.map(f => f.folder_name), folder.folder_name];
    setSelectedFolderName(pathNames.join(' > '));
    setSelectedFolderId(folder.folder_id);
    setShowFolderPicker(false);
  };

  const getSelectedFolderName = () => {
    if (!selectedFolderId) return 'Chua chon thu muc';
    return selectedFolderName || 'Thu muc da chon';
  };

  // Check if current level has any leaf folders
  const hasLeafFolders = folders.some(f => f.child_folder_count === 0);

  // Select current folder from breadcrumb (when no subfolders available)
  const selectCurrentFolder = () => {
    if (folderPath.length === 0) return;

    const currentFolder = folderPath[folderPath.length - 1];
    const pathNames = folderPath.map(f => f.folder_name);
    setSelectedFolderName(pathNames.join(' > '));
    setSelectedFolderId(currentFolder.folder_id);
    setShowFolderPicker(false);
  };

  const handleConfirm = () => {
    if (!documentName.trim()) {
      alert('Vui long nhap ten quy trinh');
      return;
    }
    if (!isDraft && !selectedFolderId) {
      alert('Vui long chon thu muc de luu quy trinh');
      return;
    }
    onConfirm({
      folder_id: isDraft ? null : selectedFolderId,
      is_draft: isDraft,
      document_name: documentName.trim(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tao quy trinh moi</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ten quy trinh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Nhap ten quy trinh..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Save Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Luu vao
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="saveType"
                  checked={isDraft}
                  onChange={() => setIsDraft(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">Ban nhap (Draft)</div>
                    <div className="text-xs text-gray-500">Luu tam, chua cong khai</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="saveType"
                  checked={!isDraft}
                  onChange={() => setIsDraft(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex items-center gap-2 flex-1">
                  <FolderOpen className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Luu vao thu muc</div>
                    <div className="text-xs text-gray-500">Chon thu muc de luu quy trinh</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Folder Picker (when not draft) */}
          {!isDraft && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thu muc
              </label>
              <button
                onClick={() => setShowFolderPicker(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:bg-gray-50"
              >
                <span className={selectedFolderId ? 'text-gray-900' : 'text-gray-500'}>
                  {getSelectedFolderName()}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {/* Folder Picker Dropdown */}
              {showFolderPicker && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-64 overflow-y-auto">
                  {/* Breadcrumb */}
                  <div className="p-2 border-b border-gray-100 flex items-center gap-1 text-sm">
                    <button
                      onClick={() => navigateBack(0)}
                      className="text-blue-600 hover:underline"
                    >
                      Thu muc goc
                    </button>
                    {folderPath.map((folder, index) => (
                      <span key={folder.folder_id} className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <button
                          onClick={() => navigateBack(index + 1)}
                          className="text-blue-600 hover:underline"
                        >
                          {folder.folder_name}
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Folder List */}
                  <div className="p-2">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : folders.length === 0 ? (
                      <div className="text-center py-4">
                        <div className="text-gray-500 text-sm mb-3">Khong co thu muc con</div>
                        {folderPath.length > 0 && (
                          <button
                            onClick={selectCurrentFolder}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                          >
                            Chon thu muc &quot;{folderPath[folderPath.length - 1].folder_name}&quot;
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {/* Info message */}
                        {!hasLeafFolders && (
                          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded mb-2">
                            Chua co thu muc co the chon. Vui long di chuyen vao thu muc con.
                          </div>
                        )}
                        {folders.map((folder) => {
                          const isLeaf = folder.child_folder_count === 0;
                          const isSelected = selectedFolderId === folder.folder_id;

                          return (
                            <div
                              key={folder.folder_id}
                              onClick={() => selectFolder(folder)}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                isLeaf
                                  ? isSelected
                                    ? 'bg-blue-100 border-2 border-blue-500'
                                    : 'hover:bg-green-50 border-2 border-transparent'
                                  : 'hover:bg-gray-50 border-2 border-transparent'
                              }`}
                            >
                              <div
                                className="w-8 h-8 rounded flex items-center justify-center"
                                style={{ backgroundColor: folder.color || '#3B82F6' }}
                              >
                                <FolderOpen className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm text-gray-900">{folder.folder_name}</span>
                                {isLeaf ? (
                                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                                    Co the chon
                                  </span>
                                ) : (
                                  <span className="ml-2 text-xs text-gray-500">
                                    {folder.child_folder_count} thu muc con
                                  </span>
                                )}
                              </div>
                              {isLeaf ? (
                                isSelected ? (
                                  <Check className="w-5 h-5 text-blue-600" />
                                ) : null
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Huy
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tao quy trinh
          </button>
        </div>
      </div>
    </div>
  );
}
