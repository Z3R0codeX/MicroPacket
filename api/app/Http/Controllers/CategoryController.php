<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function show($id)
    {
        $category = Category::find($id);
        if (! $category) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($category);
    }

    public function store(Request $request)
    {

       if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'No tienes permiso'], 403);
    }

        $data = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'icon' => 'nullable|string'
        ]);

        $category = Category::create($data);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id) {
    $category = Category::findOrFail($id);
    $data = $request->validate([
        'name' => 'required|string|unique:categories,name,' . $id . ',id_category',
        'icon' => 'required|string',
    ]);

    $category->update($data);
    return response()->json($category);
}

    public function destroy($id)
    {
        $category = Category::find($id);
        if (! $category) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $category->delete();
        return response()->json(null, 204);
    }
}
