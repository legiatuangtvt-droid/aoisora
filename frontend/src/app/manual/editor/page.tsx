'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Video,
  Trash2,
  GripVertical,
  Eye,
  Save,
  Play,
  ChevronLeft,
  ChevronRight,
  Square,
  Edit3,
} from 'lucide-react';
import {
  getManualDocumentWithSteps,
  createManualDocument,
  updateManualDocument,
  createManualStep,
  updateManualStep,
  deleteManualStep,
  uploadManualMedia,
} from '@/lib/api';
import { ManualStep, ManualStepCreate, ManualStepUpdate, Annotation } from '@/types/api';
import ImageEditor from '@/components/manual/ImageEditor';
import VideoEditor from '@/components/manual/VideoEditor';

interface LocalStep {
  id: string; // Local ID for new steps
  step_id?: number; // DB ID if exists
  step_number: number;
  step_type: 'cover' | 'step';
  title: string;
  description: string;
  media_type: 'image' | 'video' | null;
  media_url: string | null;
  media_thumbnail: string | null;
  annotations: Annotation[];
  video_trim_start: number | null;
  video_trim_end: number | null;
  video_muted: boolean;
  isNew?: boolean;
  isModified?: boolean;
}

export default function ManualEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const documentId = searchParams.get('id');
  const folderId = searchParams.get('folder_id');
  const initialName = searchParams.get('name');
  const isDraft = searchParams.get('draft') === 'true';

  const [documentName, setDocumentName] = useState(initialName || '');
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentStatus, setDocumentStatus] = useState<'draft' | 'published'>(isDraft ? 'draft' : 'draft');
  const [steps, setSteps] = useState<LocalStep[]>([]);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editor modals
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);

  // Load document if editing
  useEffect(() => {
    async function loadDocument() {
      if (documentId) {
        try {
          const doc = await getManualDocumentWithSteps(parseInt(documentId));
          setDocumentName(doc.document_name);
          setDocumentDescription(doc.description || '');
          setDocumentStatus(doc.status as 'draft' | 'published');

          if (doc.steps.length > 0) {
            setSteps(doc.steps.map(s => ({
              id: `step-${s.step_id}`,
              step_id: s.step_id,
              step_number: s.step_number,
              step_type: s.step_type,
              title: s.title || '',
              description: s.description || '',
              media_type: s.media_type,
              media_url: s.media_url,
              media_thumbnail: s.media_thumbnail,
              annotations: s.annotations || [],
              video_trim_start: s.video_trim_start,
              video_trim_end: s.video_trim_end,
              video_muted: s.video_muted,
            })));
          } else {
            // Create default cover step
            setSteps([createDefaultCover()]);
          }
        } catch (error) {
          console.error('Failed to load document:', error);
          setSteps([createDefaultCover()]);
        }
      } else {
        // New document - set name from URL param if available
        if (initialName) {
          setDocumentName(initialName);
        }
        setSteps([createDefaultCover()]);
      }
      setLoading(false);
    }
    loadDocument();
  }, [documentId, initialName]);

  const createDefaultCover = (): LocalStep => ({
    id: `new-${Date.now()}`,
    step_number: 0,
    step_type: 'cover',
    title: '',
    description: '',
    media_type: null,
    media_url: null,
    media_thumbnail: null,
    annotations: [],
    video_trim_start: null,
    video_trim_end: null,
    video_muted: false,
    isNew: true,
  });

  const addNewStep = () => {
    const newStep: LocalStep = {
      id: `new-${Date.now()}`,
      step_number: steps.length,
      step_type: 'step',
      title: '',
      description: '',
      media_type: null,
      media_url: null,
      media_thumbnail: null,
      annotations: [],
      video_trim_start: null,
      video_trim_end: null,
      video_muted: false,
      isNew: true,
    };
    setSteps([...steps, newStep]);
    setSelectedStepIndex(steps.length);
  };

  const deleteStep = (index: number) => {
    if (index === 0) return; // Can't delete cover
    const newSteps = steps.filter((_, i) => i !== index);
    // Re-number steps
    newSteps.forEach((s, i) => {
      s.step_number = i;
    });
    setSteps(newSteps);
    if (selectedStepIndex >= newSteps.length) {
      setSelectedStepIndex(newSteps.length - 1);
    }
  };

  const updateStep = (index: number, updates: Partial<LocalStep>) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], ...updates, isModified: true };
    setSteps(newSteps);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const mediaType = isVideo ? 'video' : 'image';

    // For demo, use local URL
    const localUrl = URL.createObjectURL(file);

    updateStep(selectedStepIndex, {
      media_type: mediaType,
      media_url: localUrl,
      media_thumbnail: isVideo ? null : localUrl,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!documentName.trim()) {
      alert('Vui long nhap ten quy trinh');
      return;
    }

    setSaving(true);
    try {
      let docId = documentId ? parseInt(documentId) : null;

      // Create or update document
      if (!docId) {
        const newDoc = await createManualDocument({
          document_name: documentName,
          description: documentDescription,
          folder_id: folderId ? parseInt(folderId) : undefined,
          content_type: 'steps',
          status: documentStatus,
        });
        docId = newDoc.document_id;
      } else {
        await updateManualDocument(docId, {
          document_name: documentName,
          description: documentDescription,
          status: documentStatus,
        });
      }

      // Save each step
      for (const step of steps) {
        const stepData: ManualStepCreate | ManualStepUpdate = {
          step_number: step.step_number,
          step_type: step.step_type,
          title: step.title || undefined,
          description: step.description || undefined,
          media_type: step.media_type || undefined,
          media_url: step.media_url || undefined,
          media_thumbnail: step.media_thumbnail || undefined,
          annotations: step.annotations,
          video_trim_start: step.video_trim_start || undefined,
          video_trim_end: step.video_trim_end || undefined,
          video_muted: step.video_muted,
        };

        if (step.step_id) {
          await updateManualStep(step.step_id, stepData);
        } else {
          await createManualStep({
            ...stepData,
            document_id: docId,
          } as ManualStepCreate);
        }
      }

      alert('Da luu thanh cong!');
      router.push('/manual');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Luu that bai. Vui long thu lai.');
    } finally {
      setSaving(false);
    }
  };

  const selectedStep = steps[selectedStepIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/manual')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Ten quy trinh..."
            className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Status Toggle */}
          <button
            onClick={() => setDocumentStatus(documentStatus === 'draft' ? 'published' : 'draft')}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
              documentStatus === 'published'
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {documentStatus === 'published' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cong khai
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Nhap
              </>
            )}
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              previewMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Xem truoc
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Dang luu...' : 'Luu'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Step List */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">CAC BUOC</h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepIndex(index)}
                  className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedStepIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500">
                        {step.step_type === 'cover' ? 'Bia' : `Buoc ${step.step_number}`}
                      </div>
                      <div className="text-sm font-medium truncate">
                        {step.title || '(Chua co tieu de)'}
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteStep(index);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {/* Thumbnail */}
                  {step.media_url && step.media_type === 'image' && (
                    <div className="mt-2 aspect-video bg-gray-200 rounded overflow-hidden">
                      <img
                        src={step.media_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {step.media_type === 'video' && (
                    <div className="mt-2 aspect-video bg-gray-800 rounded flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addNewStep}
              className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Them buoc moi
            </button>
          </div>
        </aside>

        {/* Main Content - Step Editor */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedStep && (
            <div className="max-w-4xl mx-auto">
              {/* Step Header */}
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">
                  {selectedStep.step_type === 'cover' ? 'BIA QUY TRINH' : `BUOC ${selectedStep.step_number}`}
                </div>
                <input
                  type="text"
                  value={selectedStep.title}
                  onChange={(e) => updateStep(selectedStepIndex, { title: e.target.value })}
                  placeholder={selectedStep.step_type === 'cover' ? 'Ten quy trinh' : 'Tieu de buoc'}
                  className="w-full text-2xl font-bold border-none outline-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                />
              </div>

              {/* Media Area */}
              <div className="mb-6">
                {selectedStep.media_url ? (
                  <div className="relative rounded-xl overflow-hidden bg-gray-900">
                    {selectedStep.media_type === 'image' ? (
                      <div className="relative group">
                        <img
                          src={selectedStep.media_url}
                          alt=""
                          className="w-full max-h-[500px] object-contain cursor-pointer"
                          onClick={() => setShowImageEditor(true)}
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => setShowImageEditor(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
                          >
                            Chinh sua hinh anh
                          </button>
                        </div>
                        {/* Annotation count badge */}
                        {selectedStep.annotations.length > 0 && (
                          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                            {selectedStep.annotations.length} annotations
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative group">
                        <video
                          src={selectedStep.media_url}
                          className="w-full max-h-[500px] cursor-pointer"
                          onClick={() => setShowVideoEditor(true)}
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => setShowVideoEditor(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium"
                          >
                            Chinh sua video
                          </button>
                        </div>
                        {/* Play icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Media toolbar */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 rounded-full px-4 py-2 flex items-center gap-2">
                      {selectedStep.media_type === 'image' ? (
                        <button
                          onClick={() => setShowImageEditor(true)}
                          className="p-2 rounded-full hover:bg-white/20"
                          title="Chinh sua hinh anh"
                        >
                          <Square className="w-5 h-5 text-white" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowVideoEditor(true)}
                          className="p-2 rounded-full hover:bg-white/20"
                          title="Chinh sua video"
                        >
                          <Play className="w-5 h-5 text-white" />
                        </button>
                      )}
                      <div className="w-px h-6 bg-white/30 mx-2"></div>
                      <button
                        onClick={() => updateStep(selectedStepIndex, { media_url: null, media_type: null, annotations: [] })}
                        className="p-2 rounded-full hover:bg-white/20"
                        title="Xoa media"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <div className="flex justify-center gap-4 mb-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-blue-600" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                      >
                        <Video className="w-8 h-8 text-purple-600" />
                      </button>
                    </div>
                    <p className="text-gray-500">Keo tha hoac click de them hinh anh/video</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mo ta
                </label>
                <textarea
                  value={selectedStep.description}
                  onChange={(e) => updateStep(selectedStepIndex, { description: e.target.value })}
                  placeholder="Nhap mo ta cho buoc nay..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedStepIndex(Math.max(0, selectedStepIndex - 1))}
                  disabled={selectedStepIndex === 0}
                  className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Buoc truoc
                </button>
                <span className="text-sm text-gray-500">
                  {selectedStepIndex + 1} / {steps.length}
                </span>
                <button
                  onClick={() => {
                    if (selectedStepIndex === steps.length - 1) {
                      addNewStep();
                    } else {
                      setSelectedStepIndex(selectedStepIndex + 1);
                    }
                  }}
                  className="px-4 py-2 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  {selectedStepIndex === steps.length - 1 ? 'Them buoc moi' : 'Buoc tiep theo'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Properties (optional) */}
        <aside className="w-64 bg-white border-l border-gray-200 p-4 hidden lg:block">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">THONG TIN QUY TRINH</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mo ta quy trinh</label>
              <textarea
                value={documentDescription}
                onChange={(e) => setDocumentDescription(e.target.value)}
                placeholder="Mo ta ngan gon..."
                rows={3}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Trang thai</label>
              <select className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="draft">Nhap</option>
                <option value="published">Da xuat ban</option>
                <option value="archived">Luu tru</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">So buoc</label>
              <div className="text-2xl font-bold text-blue-600">{steps.length}</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Image Editor Modal */}
      {showImageEditor && selectedStep?.media_url && selectedStep.media_type === 'image' && (
        <ImageEditor
          imageUrl={selectedStep.media_url}
          annotations={selectedStep.annotations}
          onSave={(newAnnotations) => {
            updateStep(selectedStepIndex, { annotations: newAnnotations });
          }}
          onClose={() => setShowImageEditor(false)}
        />
      )}

      {/* Video Editor Modal */}
      {showVideoEditor && selectedStep?.media_url && selectedStep.media_type === 'video' && (
        <VideoEditor
          videoUrl={selectedStep.media_url}
          annotations={selectedStep.annotations}
          trimStart={selectedStep.video_trim_start || undefined}
          trimEnd={selectedStep.video_trim_end || undefined}
          muted={selectedStep.video_muted}
          onSave={(data) => {
            updateStep(selectedStepIndex, {
              annotations: data.annotations,
              video_trim_start: data.trimStart,
              video_trim_end: data.trimEnd,
              video_muted: data.muted,
            });
          }}
          onClose={() => setShowVideoEditor(false)}
        />
      )}
    </div>
  );
}
