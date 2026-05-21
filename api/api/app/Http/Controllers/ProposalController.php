<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    public function index()
    {
        return response()->json(Proposal::with(['user', 'request', 'orders'])->get());
    }

    public function show($id)
    {
        $proposal = Proposal::with(['user', 'request', 'orders'])->find($id);
        if (! $proposal) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($proposal);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_request' => 'required|integer|exists:requests,id_request',
            'id_user' => 'required|integer|exists:users,id_user',
            'proposed_price' => 'required|numeric',
            'offer' => 'nullable|string',
            'delivery_days' => 'required|integer',
            'status' => 'nullable|string|max:20',
        ]);

        $proposal = Proposal::create($data);
        return response()->json($proposal, 201);
    }

    public function update(Request $request, $id)
    {
        $proposal = Proposal::find($id);
        if (! $proposal) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'id_request' => 'sometimes|required|integer|exists:requests,id_request',
            'id_user' => 'sometimes|required|integer|exists:users,id_user',
            'proposed_price' => 'sometimes|required|numeric',
            'offer' => 'nullable|string',
            'delivery_days' => 'sometimes|required|integer',
            'status' => 'nullable|string|max:20',
        ]);

        $proposal->update($data);
        return response()->json($proposal);
    }

    public function destroy($id)
    {
        $proposal = Proposal::find($id);
        if (! $proposal) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $proposal->delete();
        return response()->json(null, 204);
    }
}
