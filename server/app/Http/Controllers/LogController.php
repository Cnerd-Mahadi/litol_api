<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Services\AuthServices;
use App\Http\Services\LogServices;
use App\Http\Services\SignUpServices;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LogController extends Controller
{
    private $logService;
    private $authService;
    public function __construct(LogServices $logService, AuthServices $authService)
    {
        $this->logService = $logService;
        $this->authService = $authService;
    }

    public function loginSubmit(Request $request, SignUpServices $service)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return ResponseHelper::error($validator->errors());
        }

        try {
            $user = $this->logService->checkUser($request->username, $request->password);
        } catch (\Throwable $th) {
            return ResponseHelper::error([
                'message' => 'User could not be checked',
                'error' => $th->getMessage()
            ]);
        }

        if (!$user) {
            return ResponseHelper::success([
                'message' => 'Invalid username or password',
            ]);
        }

        try {
            return ResponseHelper::success([
                'token' => $this->authService->generateAuthToken($user->id, $user->data->role),
                'userInfo' => [
                    'id' => $user->id,
                    'name' => $user->data->username,
                    'email' => $user->data->email,
                    'role' => $user->data->role,
                    'details' => $user->data->basic
                ],
            ]);

        } catch (\Throwable $th) {
            return ResponseHelper::error([
                'message' => 'User could not be logged in',
                'error' => $th->getMessage()
            ]);
        }
    }
}