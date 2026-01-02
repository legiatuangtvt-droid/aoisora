<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ManualFolder;
use Illuminate\Http\Request;

class ManualFolderController extends Controller
{
    /**
     * Get all folders
     */
    public function index(Request $request)
    {
        $query = ManualFolder::query();

        // Filter by parent_folder_id (null for root folders)
        if ($request->has('parent_folder_id')) {
            $parentId = $request->get('parent_folder_id');
            if ($parentId === 'null' || $parentId === '') {
                $query->whereNull('parent_folder_id');
            } else {
                $query->where('parent_folder_id', $parentId);
            }
        } else {
            // Default to root folders
            $query->whereNull('parent_folder_id');
        }

        $folders = $query->where('is_active', true)
            ->orderBy('sort_order')
            ->withCount(['children', 'documents'])
            ->get();

        // Add child_folder_count for frontend compatibility
        $folders = $folders->map(function ($folder) {
            $folder->child_folder_count = $folder->children_count;
            $folder->document_count = $folder->documents_count;
            return $folder;
        });

        return response()->json($folders);
    }

    /**
     * Get single folder with children
     */
    public function show($id)
    {
        $folder = ManualFolder::with(['children', 'documents', 'parent'])
            ->withCount(['children', 'documents'])
            ->findOrFail($id);

        return response()->json($folder);
    }

    /**
     * Get documents in a folder
     */
    public function documents($id)
    {
        $folder = ManualFolder::findOrFail($id);
        $documents = $folder->documents()->orderBy('document_title')->get();

        return response()->json($documents);
    }

    /**
     * Create new folder
     */
    public function store(Request $request)
    {
        $request->validate([
            'folder_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_folder_id' => 'nullable|exists:manual_folders,folder_id',
            'sort_order' => 'nullable|integer',
        ]);

        $data = $request->only(['folder_name', 'description', 'parent_folder_id', 'sort_order']);
        $data['created_by'] = $request->user()->staff_id;

        $folder = ManualFolder::create($data);

        return response()->json($folder, 201);
    }

    /**
     * Update folder
     */
    public function update(Request $request, $id)
    {
        $folder = ManualFolder::findOrFail($id);

        $request->validate([
            'folder_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'parent_folder_id' => 'nullable|exists:manual_folders,folder_id',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Prevent setting parent to self or descendants
        if ($request->has('parent_folder_id') && $request->parent_folder_id) {
            if ($request->parent_folder_id == $id) {
                return response()->json(['error' => 'Cannot set folder as its own parent'], 422);
            }
        }

        $folder->update($request->only(['folder_name', 'description', 'parent_folder_id', 'sort_order', 'is_active']));

        return response()->json($folder);
    }

    /**
     * Delete folder
     */
    public function destroy($id)
    {
        $folder = ManualFolder::findOrFail($id);

        // Check if folder has children or documents
        if ($folder->children()->count() > 0) {
            return response()->json(['error' => 'Cannot delete folder with subfolders'], 422);
        }

        if ($folder->documents()->count() > 0) {
            return response()->json(['error' => 'Cannot delete folder with documents'], 422);
        }

        $folder->delete();

        return response()->json(null, 204);
    }
}
