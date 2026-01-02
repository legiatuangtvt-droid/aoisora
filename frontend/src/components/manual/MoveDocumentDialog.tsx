'use client';

import { useState, useEffect } from 'react';
import { X, FolderOpen, ChevronRight, Check } from 'lucide-react';
import { getManualFolders } from '@/lib/api';
import type { ManualFolderWithStats } from '@/types/api';

interface MoveDocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderId: number) => void;
  documentName: string;
  currentFolderId: number | null;
}

export default function MoveDocumentDialog({
  isOpen,
  onClose,
  onConfirm,
  documentName,
  currentFolderId,
}: MoveDocumentDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>('');
  const [folders, setFolders] = useState<ManualFolderWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [folderPath, setFolderPath] = useState<ManualFolderWithStats[]>([]);

  // Load root folders when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFolderId(null);
      setSelectedFolderName('');
      setFolderPath([]);
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

    // Don't allow selecting current folder
    if (folder.folder_id === currentFolderId) {
      return;
    }

    // Build full path name
    const pathNames = [...folderPath.map(f => f.folder_name), folder.folder_name];
    setSelectedFolderName(pathNames.join(' > '));
    setSelectedFolderId(folder.folder_id);
  };

  // Check if current level has any leaf folders
  const hasLeafFolders = folders.some(f => f.child_folder_count === 0);

  // Select current folder from breadcrumb (when no subfolders available)
  const selectCurrentFolder = () => {
    if (folderPath.length === 0) return;

    const currentFolder = folderPath[folderPath.length - 1];

    // Don't allow selecting current folder
    if (currentFolder.folder_id === currentFolderId) {
      return;
    }

    const pathNames = folderPath.map(f => f.folder_name);
    setSelectedFolderName(pathNames.join(' > '));
    setSelectedFolderId(currentFolder.folder_id);
  };

  const handleConfirm = () => {
    if (!selectedFolderId) {
      alert('Vui long chon thu muc dich');
      return;
    }
    onConfirm(selectedFolderId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Di chuyen quy trinh</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Document Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500">Quy trinh:</div>
            <div className="font-medium text-gray-900">{documentName}</div>
          </div>

          {/* Folder Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chon thu muc dich
            </label>

            {/* Selected Folder Display */}
            {selectedFolderId && (
              <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">{selectedFolderName}</span>
              </div>
            )}

            {/* Folder Browser */}
            <div className="border border-gray-200 rounded-lg bg-white max-h-72 overflow-y-auto">
              {/* Breadcrumb */}
              <div className="p-2 border-b border-gray-100 flex items-center gap-1 text-sm sticky top-0 bg-white">
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
                    {folderPath.length > 0 && folderPath[folderPath.length - 1].folder_id !== currentFolderId && (
                      <button
                        onClick={selectCurrentFolder}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Chon thu muc &quot;{folderPath[folderPath.length - 1].folder_name}&quot;
                      </button>
                    )}
                    {folderPath.length > 0 && folderPath[folderPath.length - 1].folder_id === currentFolderId && (
                      <div className="text-xs text-amber-600">Day la thu muc hien tai cua quy trinh</div>
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
                      const isCurrent = folder.folder_id === currentFolderId;

                      return (
                        <div
                          key={folder.folder_id}
                          onClick={() => selectFolder(folder)}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                            isCurrent
                              ? 'bg-gray-100 cursor-not-allowed opacity-60'
                              : isLeaf
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
                            {isCurrent ? (
                              <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                                Thu muc hien tai
                              </span>
                            ) : isLeaf ? (
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
          </div>
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
            disabled={!selectedFolderId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Di chuyen
          </button>
        </div>
      </div>
    </div>
  );
}
