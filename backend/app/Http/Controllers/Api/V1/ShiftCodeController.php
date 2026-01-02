<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ShiftCode;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;

class ShiftCodeController extends Controller
{
    /**
     * Get all shift codes
     */
    public function index(Request $request)
    {
        $shiftCodes = QueryBuilder::for(ShiftCode::class)
            ->allowedFilters([
                AllowedFilter::exact('is_active'),
                AllowedFilter::exact('is_off_day'),
                AllowedFilter::partial('code'),
                AllowedFilter::partial('name'),
            ])
            ->allowedSorts(['shift_code_id', 'code', 'name', 'start_time'])
            ->get();

        return response()->json($shiftCodes);
    }

    /**
     * Get single shift code
     */
    public function show($id)
    {
        $shiftCode = ShiftCode::findOrFail($id);

        return response()->json($shiftCode);
    }

    /**
     * Create new shift code
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:10|unique:shift_codes,code',
            'name' => 'required|string|max:50',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'break_minutes' => 'nullable|integer|min:0',
            'color' => 'nullable|string|max:7',
            'is_off_day' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        $shiftCode = ShiftCode::create($request->all());

        return response()->json($shiftCode, 201);
    }

    /**
     * Update shift code
     */
    public function update(Request $request, $id)
    {
        $shiftCode = ShiftCode::findOrFail($id);

        $request->validate([
            'code' => 'nullable|string|max:10|unique:shift_codes,code,' . $id . ',shift_code_id',
            'name' => 'nullable|string|max:50',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'break_minutes' => 'nullable|integer|min:0',
            'color' => 'nullable|string|max:7',
            'is_off_day' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        $shiftCode->update($request->all());

        return response()->json($shiftCode);
    }

    /**
     * Delete shift code
     */
    public function destroy($id)
    {
        $shiftCode = ShiftCode::findOrFail($id);
        $shiftCode->delete();

        return response()->json(null, 204);
    }

    /**
     * Generate shift codes from template
     */
    public function generate(Request $request)
    {
        $request->validate([
            'shifts' => 'required|array',
            'shifts.*.code' => 'required|string|max:10',
            'shifts.*.name' => 'required|string|max:50',
            'shifts.*.start_time' => 'required|date_format:H:i',
            'shifts.*.end_time' => 'required|date_format:H:i',
        ]);

        $created = [];
        foreach ($request->shifts as $shift) {
            $existing = ShiftCode::where('code', $shift['code'])->first();
            if (!$existing) {
                $created[] = ShiftCode::create($shift);
            }
        }

        return response()->json([
            'message' => count($created) . ' shift codes created',
            'created' => $created,
        ], 201);
    }
}
