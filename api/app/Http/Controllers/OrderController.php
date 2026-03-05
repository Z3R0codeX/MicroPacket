<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with(['user', 'microPackage', 'proposal'])->get());
    }

    public function show($id)
    {
        $order = Order::with(['user', 'microPackage', 'proposal'])->find($id);
        if (! $order) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'id_user' => 'required|integer|exists:users,id_user',
            'id_micro_package' => 'required|integer|exists:micro_packages,id_micro_package',
            'id_proposal' => 'nullable|integer|exists:proposals,id_proposal',
            'price' => 'required|numeric',
            'status' => 'required|string|max:50',
            'start_day' => 'nullable|date',
            'end_day' => 'nullable|date',
        ]);

        $order = Order::create($data);
        return response()->json($order, 201);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (! $order) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $data = $request->validate([
            'id_user' => 'sometimes|required|integer|exists:users,id_user',
            'id_micro_package' => 'sometimes|required|integer|exists:micro_packages,id_micro_package',
            'id_proposal' => 'nullable|integer|exists:proposals,id_proposal',
            'price' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|string|max:50',
            'start_day' => 'nullable|date',
            'end_day' => 'nullable|date',
        ]);

        $order->update($data);
        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if (! $order) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $order->delete();
        return response()->json(null, 204);
    }
}
