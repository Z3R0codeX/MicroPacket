<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|max:50|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user', // Siempre usuario normal al registrarse
            'profile_icon' => 'person-circle', // Valor inicial
            'profile_color' => '#2C3E50', // Color inicial (Azul oscuro)
        ]);

        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();
        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }

    /**
     * MÉTODO ACTUALIZADO PARA Z3R0_codeX
     */
    public function updateProfile(Request $request) 
    {
        $user = $request->user();

        $data = $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $user->id_user . ',id_user',
            'bio' => 'nullable|string|max:500',
            'profile_icon' => 'nullable|string|max:50', // Nuevo campo
            'profile_color' => 'nullable|string|max:20', // Nuevo campo
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user->fresh() // Retornamos los datos frescos de la DB
        ]);
    }
}