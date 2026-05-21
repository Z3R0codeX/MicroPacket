<?php

namespace App\Http\Controllers;

use App\Models\Request as UserRequest;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index()
    {
        return response()->json(UserRequest::with(['user', 'proposals'])->get());
    }

    public function show($id)
    {
        $req = UserRequest::with(['user', 'proposals'])->find($id);
        if (! $req) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($req);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_user' => 'required|integer|exists:users,id_user',
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'budget' => 'required|numeric',
            'expiration_date' => 'required|date',
            'status' => 'nullable|string|max:20',
        ]);

        $req = UserRequest::create($data);
        return response()->json($req, 201);
    }

    public function update(Request $request, $id)
    {
        $req = UserRequest::find($id);
        if (! $req) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'id_user' => 'sometimes|required|integer|exists:users,id_user',
            'title' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
            'budget' => 'sometimes|required|numeric',
            'expiration_date' => 'nullable|date',
            'status' => 'nullable|string|max:20',
        ]);

        $req->update($data);
        return response()->json($req);
    }

    public function destroy($id)
    {
        $req = UserRequest::find($id);
        if (! $req) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $req->delete();
        return response()->json(null, 204);
    }
}
