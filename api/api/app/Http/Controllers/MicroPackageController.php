<?php

namespace App\Http\Controllers;

use App\Models\MicroPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importante para las fotos

class MicroPackageController extends Controller
{
    public function index()
    {
        return response()->json(MicroPackage::with(['user', 'category'])->get());
    }

    // NUEVO: Ver solo los servicios del usuario logueado
    public function myPackages()
    {
        $id = auth()->id(); // Obtenemos el ID del token de Sanctum
        return response()->json(
            MicroPackage::where('id_user', $id)->with('category')->get()
        );
    }

    public function show($id)
    {
        $mp = MicroPackage::with(['user', 'category'])->find($id);
        if (!$mp) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($mp);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            // Ya no requerimos id_user en el body, lo tomamos del Token por seguridad
            'id_category' => 'required|integer|exists:categories,id_category',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'delivery_days' => 'required|integer',
            'status' => 'nullable|string|max:50',
            'img' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Cambiado a 'image'
        ]);

        // Asignamos el ID del experto logueado automáticamente
        $data['id_user'] = auth()->id(); 

        if ($request->hasFile('img')) {
            // Guardamos la imagen en storage/app/public/packages
            $path = $request->file('img')->store('packages', 'public');
            $data['img'] = $path;
        }

        $mp = MicroPackage::create($data);
        return response()->json($mp, 201);
    }

    public function update(Request $request, $id)
    {
        $mp = MicroPackage::find($id);
        if (!$mp || $mp->id_user !== auth()->id()) {
            return response()->json(['message' => 'No autorizado o no encontrado'], 403);
        }

        $data = $request->validate([
            'id_category' => 'sometimes|required|integer|exists:categories,id_category',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric',
            'delivery_days' => 'sometimes|required|integer',
            'status' => 'nullable|string|max:50',
            'img' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('img')) {
            // Borramos la imagen anterior si existe
            if ($mp->img) {
                Storage::disk('public')->delete($mp->img);
            }
            $path = $request->file('img')->store('packages', 'public');
            $data['img'] = $path;
        }

        $mp->update($data);
        return response()->json($mp);
    }

    public function destroy($id)
    {
        $mp = MicroPackage::find($id);
        if (!$mp || $mp->id_user !== auth()->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }
        
        if ($mp->img) {
            Storage::disk('public')->delete($mp->img);
        }

        $mp->delete();
        return response()->json(null, 204);
    }
}