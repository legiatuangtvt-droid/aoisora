<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ManualMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ManualMediaController extends Controller
{
    /**
     * Get all media for a document
     */
    public function index(Request $request)
    {
        $documentId = $request->get('document_id');
        $stepId = $request->get('step_id');

        $query = ManualMedia::query();

        if ($documentId) {
            $query->where('document_id', $documentId);
        }

        if ($stepId) {
            $query->where('step_id', $stepId);
        }

        $media = $query->orderBy('display_order')->get();

        return response()->json($media);
    }

    /**
     * Get single media
     */
    public function show($id)
    {
        $media = ManualMedia::with(['document', 'step'])->findOrFail($id);

        return response()->json($media);
    }

    /**
     * Upload media file
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:50000', // 50MB max
            'document_id' => 'required|exists:manual_documents,document_id',
            'step_id' => 'nullable|exists:manual_steps,step_id',
            'caption' => 'nullable|string|max:500',
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $fileSize = $file->getSize();

        // Determine media type
        $mediaType = 'file';
        if (Str::startsWith($mimeType, 'image/')) {
            $mediaType = 'image';
        } elseif (Str::startsWith($mimeType, 'video/')) {
            $mediaType = 'video';
        } elseif ($mimeType === 'application/pdf') {
            $mediaType = 'pdf';
        }

        // Generate unique filename
        $storedPath = $file->store('manual-media/' . $request->document_id, 'public');

        // Get max display order
        $maxOrder = ManualMedia::where('document_id', $request->document_id)->max('display_order');

        $media = ManualMedia::create([
            'document_id' => $request->document_id,
            'step_id' => $request->step_id,
            'media_type' => $mediaType,
            'file_name' => $fileName,
            'file_path' => $storedPath,
            'file_size' => $fileSize,
            'mime_type' => $mimeType,
            'caption' => $request->caption,
            'display_order' => ($maxOrder ?? 0) + 1,
        ]);

        return response()->json($media, 201);
    }

    /**
     * Update media
     */
    public function update(Request $request, $id)
    {
        $media = ManualMedia::findOrFail($id);

        $request->validate([
            'caption' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'step_id' => 'nullable|exists:manual_steps,step_id',
        ]);

        $media->update($request->all());

        return response()->json($media);
    }

    /**
     * Delete media
     */
    public function destroy($id)
    {
        $media = ManualMedia::findOrFail($id);

        // Delete file from storage
        if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }

        if ($media->thumbnail_path && Storage::disk('public')->exists($media->thumbnail_path)) {
            Storage::disk('public')->delete($media->thumbnail_path);
        }

        $media->delete();

        return response()->json(null, 204);
    }
}
