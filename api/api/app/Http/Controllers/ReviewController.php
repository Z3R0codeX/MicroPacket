<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        return response()->json(Review::all());
    }

    public function show($id)
    {
        $rev = Review::find($id);
        if (! $rev) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($rev);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            // adjust according to migration when available
        ]);

        $rev = Review::create($data);
        return response()->json($rev, 201);
    }

    public function update(Request $request, $id)
    {
        $rev = Review::find($id);
        if (! $rev) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            // adjust when fields known
        ]);

        $rev->update($data);
        return response()->json($rev);
    }

    public function destroy($id)
    {
        $rev = Review::find($id);
        if (! $rev) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $rev->delete();
        return response()->json(null, 204);
    }
}
