<?php

namespace App\Http\Controllers\Auth\Auth;

use App\Http\Controllers\BaseController;
use App\Models\User;
use App\Models\WorkSpace;
use Carbon\Carbon;
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

        /** @var $user User */
        $user = User::query()->where(['email' => $request->input('identifier')])->first();
        if (!$user) {
            return $this->clientError('User does not exist', ["User does not exist"], 400);
        }

        if (!(Hash::check($request->input('password'), $user->password))) {
            return $this->clientError('Invalid credentials', [], 403);
        }

        $user->last_login_at = Carbon::now();
        $user->logins_count = ($user->logins_count)+1;
        $user->save();

        $personalAccessTokenResult = $user->createToken('api');
        $workspace = WorkSpace::query()->find($user->default_workspace_id);

        $responseData['accessToken'] = $personalAccessTokenResult->accessToken;
        $responseData['user'] = $user;
        $responseData['workspace'] = $workspace;


        return $this->returnResponse('Logged In Successfully', $responseData);

    }

}
