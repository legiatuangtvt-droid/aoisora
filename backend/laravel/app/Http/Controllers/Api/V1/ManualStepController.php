<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ManualStep;
use Illuminate\Http\Request;

class ManualStepController extends Controller
{
    /**
     * Get all steps for a document
     */
    public function index(Request $request)
    {
        $documentId = $request->get('document_id');

        if (!$documentId) {
            return response()->json(['error' => 'document_id is required'], 422);
        }

        $steps = ManualStep::with('media')
            ->where('document_id', $documentId)
            ->orderBy('step_order')
            ->get();

        return response()->json($steps);
    }

    /**
     * Get single step
     */
    public function show($id)
    {
        $step = ManualStep::with(['document', 'media'])->findOrFail($id);

        return response()->json($step);
    }

    /**
     * Create new step
     */
    public function store(Request $request)
    {
        $request->validate([
            'document_id' => 'required|exists:manual_documents,document_id',
            'step_order' => 'nullable|integer',
            'step_title' => 'required|string|max:200',
            'content' => 'nullable|string',
            'notes' => 'nullable|string',
            'warning_text' => 'nullable|string',
            'is_critical' => 'nullable|boolean',
        ]);

        // Auto-calculate step_order if not provided
        if (!$request->has('step_order')) {
            $maxOrder = ManualStep::where('document_id', $request->document_id)->max('step_order');
            $request->merge(['step_order' => ($maxOrder ?? 0) + 1]);
        }

        $step = ManualStep::create($request->all());

        return response()->json($step, 201);
    }

    /**
     * Update step
     */
    public function update(Request $request, $id)
    {
        $step = ManualStep::findOrFail($id);

        $request->validate([
            'step_order' => 'nullable|integer',
            'step_title' => 'nullable|string|max:200',
            'content' => 'nullable|string',
            'notes' => 'nullable|string',
            'warning_text' => 'nullable|string',
            'is_critical' => 'nullable|boolean',
        ]);

        $step->update($request->all());

        return response()->json($step);
    }

    /**
     * Delete step
     */
    public function destroy($id)
    {
        $step = ManualStep::findOrFail($id);

        // Delete related media
        $step->media()->delete();
        $step->delete();

        // Reorder remaining steps
        ManualStep::where('document_id', $step->document_id)
            ->where('step_order', '>', $step->step_order)
            ->decrement('step_order');

        return response()->json(null, 204);
    }

    /**
     * Reorder steps
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'steps' => 'required|array',
            'steps.*.step_id' => 'required|exists:manual_steps,step_id',
            'steps.*.step_order' => 'required|integer',
        ]);

        foreach ($request->steps as $stepData) {
            ManualStep::where('step_id', $stepData['step_id'])
                ->update(['step_order' => $stepData['step_order']]);
        }

        return response()->json(['message' => 'Steps reordered']);
    }
}
