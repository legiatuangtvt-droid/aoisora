<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ManualFolder;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ManualFolderController extends Controller
{
    /**
     * Get all folders
     */
    public function index(Request $request)
    {
        $query = ManualFolder::query();

        // Filter by parent_id (null for root folders)
        if ($request->has('parent_id')) {
            $parentId = $request->get('parent_id');
            if ($parentId === 'null' || $parentId === '') {
                $query->whereNull('parent_id');
            } else {
                $query->where('parent_id', $parentId);
            }
        } else {
            // Default to root folders
            $query->whereNull('parent_id');
        }

        $folders = $query->where('is_active', true)
            ->orderBy('display_order')
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
     * Create new folder
     */
    public function store(Request $request)
    {
        $request->validate([
            'folder_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:manual_folders,folder_id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'display_order' => 'nullable|integer',
        ]);

        $folder = ManualFolder::create($request->all());

        return response()->json($folder, 201);
    }

    /**
     * Update folder
     */
    public function update(Request $request, $id)
    {
        $folder = ManualFolder::findOrFail($id);

        $request->validate([
            'folder_name' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:manual_folders,folder_id',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
            'display_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Prevent setting parent to self or descendants
        if ($request->has('parent_id') && $request->parent_id) {
            if ($request->parent_id == $id) {
                return response()->json(['error' => 'Cannot set folder as its own parent'], 422);
            }
        }

        $folder->update($request->all());

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
