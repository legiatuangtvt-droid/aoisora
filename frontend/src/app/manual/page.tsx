'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { browseManualFolder, searchManual, updateManualDocument, deleteManualDocument, moveManualDocument } from '@/lib/api';
import type { FolderBrowseResponse, ManualFolderWithStats, ManualDocument } from '@/types/api';
import CreateManualDialog from '@/components/manual/CreateManualDialog';
import MoveDocumentDialog from '@/components/manual/MoveDocumentDialog';

// Sidebar menu items like Teachme Biz
const SIDEBAR_MENU = [
  {
    id: 'quy-trinh',
    label: 'Quy trinh',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    children: [
      { id: 'tat-ca', label: 'Tat ca' },
      { id: 'thu-muc', label: 'Thu muc', active: true },
      { id: 'muc-moi', label: 'Muc moi' },
      { id: 'da-xem-gan-day', label: 'Da xem gan day' },
      { id: 'danh-dau', label: 'Danh dau' },
      { id: 'sao-luu', label: 'Sao luu' },
    ],
  },
  {
    id: 'trang-tong',
    label: 'Trang tong',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'dao-tao',
    label: 'Dao tao',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'tien-trinh-phe-duyet',
    label: 'Tien trinh phe duyet',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'nhiem-vu',
    label: 'Nhiem vu',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'bao-cao',
    label: 'Bao cao',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

function ManualPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folderId = searchParams.get('folder_id');

  const [browseData, setBrowseData] = useState<FolderBrowseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['quy-trinh']);
  const [activeMenuItem, setActiveMenuItem] = useState('thu-muc');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Document action states
  const [activeMenuDocId, setActiveMenuDocId] = useState<number | null>(null);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<ManualDocument | null>(null);

  // Load folder data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await browseManualFolder({
          folder_id: folderId ? parseInt(folderId) : undefined,
        });
        setBrowseData(data);
      } catch (err) {
        console.error('Failed to load folder data:', err);
        setError('Khong the tai du lieu. Vui long thu lai.');
        // Set demo data for testing
        setBrowseData({
          current_folder: null,
          breadcrumb: [],
          folders: [
            {
              folder_id: 1,
              folder_name: 'MANUAL STORE',
              parent_folder_id: null,
              store_id: null,
              description: 'Store operation manuals',
              icon: 'folder',
              color: '#3B82F6',
              sort_order: 1,
              is_active: true,
              created_by: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              document_count: 312,
              child_folder_count: 24,
              total_views: 60,
            },
            {
              folder_id: 2,
              folder_name: 'Manual Draft',
              parent_folder_id: null,
              store_id: null,
              description: 'Draft manuals in progress',
              icon: 'folder',
              color: '#6B7280',
              sort_order: 2,
              is_active: true,
              created_by: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              document_count: 96,
              child_folder_count: 20,
              total_views: 1,
            },
          ],
          documents: [],
          total_folders: 2,
          total_documents: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [folderId]);

  // Navigate to folder
  const navigateToFolder = (folder: ManualFolderWithStats) => {
    router.push(`/manual?folder_id=${folder.folder_id}`);
  };

  // Navigate to document - view mode for published, edit for draft
  const openDocument = (doc: ManualDocument) => {
    if (doc.external_url) {
      window.open(doc.external_url, '_blank');
    } else if (doc.status === 'published') {
      // Published documents open in view mode
      router.push(`/manual/view?id=${doc.document_id}`);
    } else {
      // Draft documents open in edit mode
      router.push(`/manual/editor?id=${doc.document_id}`);
    }
  };

  // Create new document - show dialog
  const createNewDocument = () => {
    setShowCreateDialog(true);
  };

  // Handle create dialog confirm
  const handleCreateConfirm = (data: {
    folder_id: number | null;
    is_draft: boolean;
    document_name: string;
  }) => {
    setShowCreateDialog(false);

    // Build URL with parameters
    const params = new URLSearchParams();
    params.set('name', data.document_name);
    if (data.folder_id) {
      params.set('folder_id', data.folder_id.toString());
    }
    if (data.is_draft) {
      params.set('draft', 'true');
    }

    router.push(`/manual/editor?${params.toString()}`);
  };

  // Toggle sidebar menu
  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  // Document actions
  const toggleDocumentMenu = (docId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    console.log('Toggle menu for doc:', docId, 'current:', activeMenuDocId);
    setActiveMenuDocId(activeMenuDocId === docId ? null : docId);
  };

  const handleTogglePublish = async (doc: ManualDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuDocId(null);

    const newStatus = doc.status === 'published' ? 'draft' : 'published';
    try {
      await updateManualDocument(doc.document_id, { status: newStatus });
      // Reload data
      const data = await browseManualFolder({
        folder_id: folderId ? parseInt(folderId) : undefined,
      });
      setBrowseData(data);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Khong the cap nhat trang thai. Vui long thu lai.');
    }
  };

  const handleMoveDocument = (doc: ManualDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuDocId(null);
    setSelectedDocument(doc);
    setShowMoveDialog(true);
  };

  const handleMoveConfirm = async (newFolderId: number) => {
    if (!selectedDocument) return;

    try {
      await moveManualDocument(selectedDocument.document_id, newFolderId);
      setShowMoveDialog(false);
      setSelectedDocument(null);
      // Reload data
      const data = await browseManualFolder({
        folder_id: folderId ? parseInt(folderId) : undefined,
      });
      setBrowseData(data);
    } catch (error) {
      console.error('Failed to move document:', error);
      alert('Khong the di chuyen quy trinh. Vui long thu lai.');
    }
  };

  const handleDeleteDocument = async (doc: ManualDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuDocId(null);

    if (!confirm(`Ban co chac chan muon xoa quy trinh "${doc.document_name}"?`)) {
      return;
    }

    try {
      await deleteManualDocument(doc.document_id);
      // Reload data
      const data = await browseManualFolder({
        folder_id: folderId ? parseInt(folderId) : undefined,
      });
      setBrowseData(data);
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Khong the xoa quy trinh. Vui long thu lai.');
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (activeMenuDocId === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside the menu
      const target = e.target as HTMLElement;
      if (!target.closest('.document-action-menu')) {
        setActiveMenuDocId(null);
      }
    };

    // Delay adding event listener to avoid immediate trigger from the same click
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenuDocId]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-green-600">Aoi</span>
            <span className="text-sm text-gray-500">Manual</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-2">
          {SIDEBAR_MENU.map((menu) => (
            <div key={menu.id}>
              <button
                onClick={() => toggleMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  expandedMenus.includes(menu.id)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-gray-500">{menu.icon}</span>
                <span className="flex-1 text-left">{menu.label}</span>
                {menu.children && (
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedMenus.includes(menu.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* Submenu */}
              {menu.children && expandedMenus.includes(menu.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {menu.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveMenuItem(child.id)}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                        activeMenuItem === child.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/manual" className="text-gray-600 hover:text-blue-600">
              Quy trinh
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-900 font-medium">Thu muc</span>
            {browseData?.breadcrumb.map((folder) => (
              <span key={folder.folder_id} className="flex items-center gap-2">
                <span className="text-gray-400">&gt;</span>
                <Link
                  href={`/manual?folder_id=${folder.folder_id}`}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {folder.folder_name}
                </Link>
              </span>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhap tu khoa tim kiem"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={createNewDocument}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tao quy trinh
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button className="px-1 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Tat ca thu muc
            </button>
            <button className="px-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Noi bo
            </button>
            <button className="px-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              Tien trinh phe duyet
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Folder count */}
              <div className="mb-4 text-sm text-gray-500">
                Thu muc: {browseData?.total_folders || 0}
              </div>

              {/* Search box for folders */}
              <div className="mb-4 flex justify-end">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tim kiem thu muc"
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Table Header */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                          Ten
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-40">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                          Cong khai quy trinh
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-32">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                          Trinh chinh sua
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-600 w-32">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                          nguoi xem
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </div>
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {browseData?.folders.map((folder, index) => (
                      <tr
                        key={folder.folder_id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                          index !== 0 ? 'border-t border-gray-100' : ''
                        }`}
                        onClick={() => navigateToFolder(folder)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: folder.color || '#3B82F6' }}
                            >
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {index + 1}. {folder.folder_name}
                              </div>
                              {folder.description && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                                    Tien trinh phe duyet
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{folder.document_count}</td>
                        <td className="px-4 py-3 text-gray-600">{folder.child_folder_count}</td>
                        <td className="px-4 py-3 text-gray-600">{folder.total_views}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Show menu
                            }}
                            className="p-1 rounded hover:bg-gray-200"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Documents */}
                    {browseData?.documents.map((doc) => (
                      <tr
                        key={doc.document_id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors border-t border-gray-100"
                        onClick={() => openDocument(doc)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{doc.document_name}</div>
                              {doc.document_code && (
                                <div className="text-xs text-gray-500">{doc.document_code}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            doc.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {doc.status === 'published' ? 'Cong khai' : 'Nhap'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">v{doc.version}</td>
                        <td className="px-4 py-3 text-gray-600">{doc.view_count}</td>
                        <td className="px-4 py-3 relative">
                          <button
                            onClick={(e) => toggleDocumentMenu(doc.document_id, e)}
                            className="document-action-menu p-1 rounded hover:bg-gray-200"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>

                          {/* Action Menu Dropdown */}
                          {activeMenuDocId === doc.document_id && (
                            <div className="document-action-menu absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                              {/* Toggle Publish */}
                              <button
                                onClick={(e) => handleTogglePublish(doc, e)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                {doc.status === 'published' ? (
                                  <>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                    Chuyen sang Nhap
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Cong khai
                                  </>
                                )}
                              </button>

                              {/* Move to folder */}
                              <button
                                onClick={(e) => handleMoveDocument(doc, e)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                                Di chuyen thu muc
                              </button>

                              <hr className="my-1 border-gray-100" />

                              {/* Delete */}
                              <button
                                onClick={(e) => handleDeleteDocument(doc, e)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xoa
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                    {/* Empty state */}
                    {(!browseData?.folders.length && !browseData?.documents.length) && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <p>Thu muc trong</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Create Manual Dialog */}
      <CreateManualDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onConfirm={handleCreateConfirm}
        currentFolderId={folderId ? parseInt(folderId) : null}
      />

      {/* Move Document Dialog */}
      <MoveDocumentDialog
        isOpen={showMoveDialog}
        onClose={() => {
          setShowMoveDialog(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleMoveConfirm}
        documentName={selectedDocument?.document_name || ''}
        currentFolderId={selectedDocument?.folder_id || null}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}

export default function ManualPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ManualPageContent />
    </Suspense>
  );
}
