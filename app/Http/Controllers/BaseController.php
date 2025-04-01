<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;


class BaseController extends Controller
{


    /**
     * success response method.
     * @param $message
     * @param $data
     * @return JsonResponse
     */
    public function returnResponse($message,$data): JsonResponse
    {
    	$response = [
             'respCode' => 2000,
             'message' => $message,
             'respBody' => $data ];
        return response()->json($response, 200);
    }

    /**
     * success response method.
     * @param $message
     * @param $data
     * @return JsonResponse
     */
    public function returnListResponse($message,LengthAwarePaginator $page): JsonResponse
    {
    	$response = [
             'respCode' => 2000,
             'message' => $message,
             'currentPageNo' => $page->currentPage(),
             'totalElements' => $page->total(),
             'pageSize' => $page->perPage(),
             'items' => $page->items() ];

        return response()->json($response, 200);
    }

    /**
     * return error response.
     * @param $message
     * @param array $errorsArray
     * @param int $code
     * @return JsonResponse
     */
    public function serverError($message, array $errorsArray = [], int $code = 200): JsonResponse
    {
    	$response = [
            'respCode' => 5000,
            'message' => $message,
            'respBody' => $errorsArray,
        ];

        return response()->json($response, $code);
    }

    /**
     * return error response.
     * @param $message
     * @param array $errorsArray
     * @param int $code
     * @return JsonResponse
     */
    public function clientError($message, array $errorsArray = [], int $code = 200): JsonResponse
    {
    	$response = [
            'respCode' => 4000,
            'message' => $message,
            'respBody' => $errorsArray,
        ];

        return response()->json($response, $code);
    }

}


