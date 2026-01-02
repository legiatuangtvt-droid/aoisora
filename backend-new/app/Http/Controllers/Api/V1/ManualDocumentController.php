<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ManualDocument;
use App\Models\ManualFolder;
use App\Models\ManualViewLog;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ManualDocumentController extends Controller
{
    /**
     * Get all documents
     */
    public function index(Request $request)
    {
        $documents = QueryBuilder::for(ManualDocument::class)
            ->allowedFilters([
                AllowedFilter::exact('folder_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('is_draft'),
                AllowedFilter::exact('is_public'),
                AllowedFilter::partial('document_name'),
            ])
            ->allowedSorts(['document_id', 'document_name', 'created_at', 'view_count'])
            ->allowedIncludes(['folder', 'author', 'steps'])
            ->paginate($request->get('per_page', 20));

        return response()->json($documents);
    }

    /**
     * Get single document
     */
    public function show($id)
    {
        $document = ManualDocument::with(['folder', 'author', 'reviewer'])->findOrFail($id);

        return response()->json($document);
    }

    /**
     * Get full document with steps and media
     */
    public function full($id)
    {
        $document = ManualDocument::with([
            'folder',
            'author',
            'reviewer',
            'steps.media',
            'media',
        ])->findOrFail($id);

        return response()->json($document);
    }

    /**
     * Create new document
     */
    public function store(Request $request)
    {
        $request->validate([
            'folder_id' => 'nullable|exists:manual_folders,folder_id',
            'document_name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'is_draft' => 'nullable|boolean',
            'tags' => 'nullable|array',
        ]);

        $document = ManualDocument::create(array_merge(
            $request->all(),
            [
                'author_id' => $request->user()->staff_id,
                'status' => 'draft',
                'version' => '1.0',
            ]
        ));

        return response()->json($document, 201);
    }

    /**
     * Update document
     */
    public function update(Request $request, $id)
    {
        $document = ManualDocument::findOrFail($id);

        $request->validate([
            'folder_id' => 'nullable|exists:manual_folders,folder_id',
            'document_name' => 'nullable|string|max:200',
            'description' => 'nullable|string',
            'is_draft' => 'nullable|boolean',
            'is_public' => 'nullable|boolean',
            'status' => 'nullable|in:draft,review,approved,published,archived',
            'tags' => 'nullable|array',
        ]);

        // Handle publish action
        if ($request->has('is_public') && $request->is_public && !$document->published_at) {
            $request->merge(['published_at' => now()]);
        }

        $document->update($request->all());

        return response()->json($document);
    }

    /**
     * Delete document
     */
    public function destroy($id)
    {
        $document = ManualDocument::findOrFail($id);

        // Delete related steps and media
        $document->steps()->delete();
        $document->media()->delete();
        $document->delete();

        return response()->json(null, 204);
    }

    /**
     * Move document to another folder
     */
    public function move(Request $request, $id)
    {
        $document = ManualDocument::findOrFail($id);

        $request->validate([
            'folder_id' => 'required|exists:manual_folders,folder_id',
        ]);

        $document->update(['folder_id' => $request->folder_id]);

        return response()->json($document->load('folder'));
    }

    /**
     * Log view
     */
    public function logView(Request $request, $id)
    {
        $document = ManualDocument::findOrFail($id);

        // Increment view count
        $document->incrementViewCount();

        // Log view
        ManualViewLog::create([
            'document_id' => $id,
            'staff_id' => $request->user()->staff_id,
            'viewed_at' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'View logged']);
    }

    /**
     * Browse documents with folder structure
     */
    public function browse(Request $request)
    {
        $folderId = $request->get('folder_id');

        // Get current folder info
        $currentFolder = null;
        if ($folderId) {
            $currentFolder = ManualFolder::with('parent')->find($folderId);
        }

        // Get subfolders
        $query = ManualFolder::where('is_active', true);
        if ($folderId) {
            $query->where('parent_id', $folderId);
        } else {
            $query->whereNull('parent_id');
        }
        $folders = $query->orderBy('display_order')
            ->withCount(['children', 'documents'])
            ->get();

        // Get documents in current folder
        $documentsQuery = ManualDocument::query();
        if ($folderId) {
            $documentsQuery->where('folder_id', $folderId);
        } else {
            $documentsQuery->whereNull('folder_id')->where('is_draft', true);
        }

        // Filter by draft/public status
        if ($request->has('is_draft')) {
            $documentsQuery->where('is_draft', $request->boolean('is_draft'));
        }

        $documents = $documentsQuery->orderBy('document_name')->get();

        // Build breadcrumb
        $breadcrumb = [];
        if ($currentFolder) {
            $folder = $currentFolder;
            while ($folder) {
                array_unshift($breadcrumb, [
                    'folder_id' => $folder->folder_id,
                    'folder_name' => $folder->folder_name,
                ]);
                $folder = $folder->parent;
            }
        }

        return response()->json([
            'current_folder' => $currentFolder,
            'breadcrumb' => $breadcrumb,
            'folders' => $folders,
            'documents' => $documents,
        ]);
    }

    /**
     * Search documents
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $documents = ManualDocument::where('document_name', 'ilike', "%{$query}%")
            ->orWhere('description', 'ilike', "%{$query}%")
            ->with('folder')
            ->limit(20)
            ->get();

        return response()->json($documents);
    }
}
