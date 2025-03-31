<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class LoginController extends BaseController
{


    /**
     * Update the user's password.
     */
    public function login(Request $request): JsonResponse
    {

        $request->validate([
            'identifier' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::query()->where(['email' => $request->input('identifier')])->first();
        if (!$user) {
            return $this->clientError('User does not exist', ["User does not exist"], 400);
        }

        if (!(Hash::check($request->input('password'), $user->password))) {
            return $this->clientError('Invalid credentials', [], 403);
        }

        $personalAccessTokenResult = $user->createToken('api');


        $responseData['accessToken'] = $personalAccessTokenResult->accessToken;
        $responseData['user'] = $user;
        return $this->returnResponse('Logged In Successfully', $responseData);

    }

}
