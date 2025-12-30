'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit3,
  Share2,
  Download,
  QrCode,
  Link2,
  Eye,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Globe,
  Lock,
  MoreVertical,
  Copy,
  FileText,
} from 'lucide-react';
import { getManualDocumentWithSteps, updateManualDocument } from '@/lib/api';
import type { ManualDocumentWithSteps, ManualStep, Annotation } from '@/types/api';
import QRCode from 'qrcode';

export default function ManualViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const documentId = searchParams.get('id');

  const [document, setDocument] = useState<ManualDocumentWithSteps | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function loadDocument() {
      if (!documentId) {
        router.push('/manual');
        return;
      }

      try {
        setLoading(true);
        const doc = await getManualDocumentWithSteps(parseInt(documentId));
        setDocument(doc);
      } catch (error) {
        console.error('Failed to load document:', error);
        router.push('/manual');
      } finally {
        setLoading(false);
      }
    }
    loadDocument();
  }, [documentId, router]);

  const getPublicUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/manual/view?id=${documentId}`;
    }
    return '';
  };

  const generateQRCode = async () => {
    try {
      const url = getPublicUrl();
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qrDataUrl);
      setShowQRModal(true);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      // Fallback: show URL without QR
      setShowQRModal(true);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const togglePublicStatus = async () => {
    if (!document) return;

    try {
      const newStatus = document.status === 'published' ? 'draft' : 'published';
      await updateManualDocument(document.document_id, { status: newStatus });
      setDocument({ ...document, status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const exportToPDF = async () => {
    // TODO: Implement PDF export
    alert('Chuc nang xuat PDF dang duoc phat trien');
  };

  const currentStep = document?.steps[currentStepIndex];

  const renderAnnotations = (annotations: Annotation[], mediaType: string) => {
    if (!annotations || annotations.length === 0) return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {annotations.map((ann, index) => {
          const x = (ann.x || 0);
          const y = (ann.y || 0);
          const width = (ann.width || 0);
          const height = (ann.height || 0);

          switch (ann.type) {
            case 'rectangle':
              return (
                <rect
                  key={index}
                  x={`${x}%`}
                  y={`${y}%`}
                  width={`${width}%`}
                  height={`${height}%`}
                  fill="none"
                  stroke={ann.color || '#FF0000'}
                  strokeWidth={ann.stroke_width || 3}
                />
              );
            case 'circle':
              return (
                <ellipse
                  key={index}
                  cx={`${x + width / 2}%`}
                  cy={`${y + height / 2}%`}
                  rx={`${width / 2}%`}
                  ry={`${height / 2}%`}
                  fill="none"
                  stroke={ann.color || '#FF0000'}
                  strokeWidth={ann.stroke_width || 3}
                />
              );
            case 'arrow':
              return (
                <line
                  key={index}
                  x1={`${x}%`}
                  y1={`${y}%`}
                  x2={`${width}%`}
                  y2={`${height}%`}
                  stroke={ann.color || '#FF0000'}
                  strokeWidth={ann.stroke_width || 3}
                  markerEnd="url(#arrowhead)"
                />
              );
            case 'highlight':
              return (
                <rect
                  key={index}
                  x={`${x}%`}
                  y={`${y}%`}
                  width={`${width}%`}
                  height={`${height}%`}
                  fill={ann.color || '#FFFF00'}
                  fillOpacity={0.3}
                />
              );
            default:
              return null;
          }
        })}
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF0000" />
          </marker>
        </defs>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Khong tim thay quy trinh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/manual')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{document.document_name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {document.view_count} luot xem
                </span>
                <span className="flex items-center gap-1">
                  {document.status === 'published' ? (
                    <>
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Cong khai</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span>Ban nhap</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Public/Draft */}
            <button
              onClick={togglePublicStatus}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${
                document.status === 'published'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {document.status === 'published' ? (
                <>
                  <Globe className="w-4 h-4" />
                  Cong khai
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Ban nhap
                </>
              )}
            </button>

            {/* Share Menu */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-200"
              >
                <Share2 className="w-4 h-4" />
                Chia se
              </button>

              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      copyToClipboard(getPublicUrl());
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Link2 className="w-4 h-4" />
                    Sao chep lien ket
                  </button>
                  <button
                    onClick={() => {
                      generateQRCode();
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Tao ma QR
                  </button>
                  <button
                    onClick={() => {
                      exportToPDF();
                      setShowShareMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Xuat PDF
                  </button>
                </div>
              )}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => router.push(`/manual/editor?id=${documentId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700"
            >
              <Edit3 className="w-4 h-4" />
              Chinh sua
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Step Content */}
          {currentStep && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Step Header */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="text-sm text-gray-500 mb-1">
                  {currentStep.step_type === 'cover' ? 'Trang bia' : `Buoc ${currentStep.step_number}`}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentStep.title || document.document_name}
                </h2>
              </div>

              {/* Media */}
              {currentStep.media_url && (
                <div className="relative">
                  {currentStep.media_type === 'image' ? (
                    <div className="relative">
                      <img
                        src={currentStep.media_url}
                        alt={currentStep.title || ''}
                        className="w-full"
                      />
                      {renderAnnotations(currentStep.annotations || [], 'image')}
                    </div>
                  ) : (
                    <video
                      src={currentStep.media_url}
                      controls
                      className="w-full"
                      muted={currentStep.video_muted}
                    />
                  )}
                </div>
              )}

              {/* Description */}
              {currentStep.description && (
                <div className="px-6 py-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{currentStep.description}</p>
                </div>
              )}

              {/* Navigation */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                  disabled={currentStepIndex === 0}
                  className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Truoc
                </button>

                <div className="flex items-center gap-2">
                  {document.steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStepIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStepIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStepIndex(Math.min(document.steps.length - 1, currentStepIndex + 1))}
                  disabled={currentStepIndex === document.steps.length - 1}
                  className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tiep
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step List */}
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">TAT CA CAC BUOC</h3>
            <div className="space-y-2">
              {document.steps.map((step, index) => (
                <button
                  key={step.step_id}
                  onClick={() => setCurrentStepIndex(index)}
                  className={`w-full p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${
                    index === currentStepIndex
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === currentStepIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.step_type === 'cover' ? '📄' : index}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {step.title || (step.step_type === 'cover' ? 'Trang bia' : `Buoc ${step.step_number}`)}
                    </div>
                    {step.description && (
                      <div className="text-sm text-gray-500 truncate">{step.description}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Ma QR quy trinh</h3>

            {qrCodeUrl ? (
              <div className="flex justify-center mb-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Khong the tao ma QR
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lien ket</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={getPublicUrl()}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(getPublicUrl())}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copySuccess && (
                <div className="text-sm text-green-600 mt-1">Da sao chep!</div>
              )}
            </div>

            <div className="flex gap-2">
              {qrCodeUrl && (
                <a
                  href={qrCodeUrl}
                  download={`qr-${document.document_name}.png`}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-center hover:bg-gray-200"
                >
                  Tai QR
                </a>
              )}
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Dong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Success Toast */}
      {copySuccess && !showQRModal && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Da sao chep lien ket!
        </div>
      )}
    </div>
  );
}
