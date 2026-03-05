<?php

namespace App\Http\Controllers;

use App\Models\MicroPackage;
use Illuminate\Http\Request;

class MicroPackageController extends Controller
{
    public function index()
    {
        return response()->json(MicroPackage::with(['user', 'category'])->get());
    }

    public function show($id)
    {
        $mp = MicroPackage::with(['user', 'category'])->find($id);
        if (! $mp) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($mp);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_user' => 'required|integer|exists:users,id_user',
            'id_category' => 'required|integer|exists:categories,id_category',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'delivery_days' => 'required|integer',
            'status' => 'nullable|string|max:50',
            'img' => 'nullable|string|max:255',
        ]);

        $mp = MicroPackage::create($data);
        return response()->json($mp, 201);
    }

    public function update(Request $request, $id)
    {
        $mp = MicroPackage::find($id);
        if (! $mp) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'id_user' => 'sometimes|required|integer|exists:users,id_user',
            'id_category' => 'sometimes|required|integer|exists:categories,id_category',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'delivery_days' => 'sometimes|required|integer',
            'status' => 'nullable|string|max:50',
            'img' => 'nullable|string|max:255',
        ]);

        $mp->update($data);
        return response()->json($mp);
    }

    public function destroy($id)
    {
        $mp = MicroPackage::find($id);
        if (! $mp) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $mp->delete();
        return response()->json(null, 204);
    }
}
