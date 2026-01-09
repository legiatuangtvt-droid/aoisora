<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyTemplate;
use Illuminate\Http\Request;

class DailyTemplateController extends Controller
{
    /**
     * Get all daily templates
     */
    public function index()
    {
        $templates = DailyTemplate::with(['shiftTemplates.shiftCode'])
            ->where('is_active', true)
            ->get();

        return response()->json($templates);
    }

    /**
     * Get single template
     */
    public function show($id)
    {
        $template = DailyTemplate::with(['shiftTemplates.shiftCode'])->findOrFail($id);

        return response()->json($template);
    }

    /**
     * Create new template
     */
    public function store(Request $request)
    {
        $request->validate([
            'template_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'day_of_week' => 'nullable|integer|min:0|max:6',
        ]);

        $template = DailyTemplate::create($request->all());

        return response()->json($template, 201);
    }

    /**
     * Update template
     */
    public function update(Request $request, $id)
    {
        $template = DailyTemplate::findOrFail($id);

        $request->validate([
            'template_name' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'day_of_week' => 'nullable|integer|min:0|max:6',
            'is_active' => 'nullable|boolean',
        ]);

        $template->update($request->all());

        return response()->json($template);
    }

    /**
     * Delete template
     */
    public function destroy($id)
    {
        $template = DailyTemplate::findOrFail($id);
        $template->delete();

        return response()->json(null, 204);
    }
}
