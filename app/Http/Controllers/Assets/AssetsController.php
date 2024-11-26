<?php

namespace App\Http\Controllers\Assets;

use App\Http\Controllers\BaseController;
use App\Models\Asset;
use App\Models\AssetGroup;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AssetsController extends BaseController
{


    public function getAssets(Request $request)
    {
        $request->validate([
            'groupId' => 'required|exists:asset_groups,id'
        ]);

        $projects = Asset::query()
            ->where('asset_group_id', $request->input('groupId'))
            ->with(['author'])
            ->paginate(50);
        return $this->returnResponse("Asset Groups", $projects);
    }


    public function addAsset(Request $request)
    {
        Log::info(json_encode($request->all()));
        $request->validate([
            'asset_group_id' => 'required',
            'name' => 'required|string',
            'unit_price' => 'required|numeric',

            'usage_status' => 'required',
            'next_payment_date' => 'required'
        ]);

        $assetGroup = AssetGroup::query()->find($request->input('asset_group_id'));
        if (!$assetGroup) {
            return $this->clientError("Asset group not found");
        }

        $group = Asset::query()->create([
            'project_id' => $assetGroup->project_id,
            'asset_group_id' => $assetGroup->id,
            'author_id' => Auth::id(),
            'name' => $request->input('name'),
            'unit_price' => $request->input('unit_price'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'category' => $request->input('category'),

            'remarks' => $request->input('remarks'),
            'ownership' => $request->input('ownership'),
            'usage_status' => $request->input('usage_status'),
            'subscription_months_count' => $request->input('subscription_months_count',1),
            'next_payment_date' => Carbon::parse($request->input('next_payment_date'))
        ]);

        return $this->returnResponse("Asset Group Added", $group);
    }

    public function updateAsset(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:assets,id',
            'name' => 'required|string',
            'description' => 'required',
            'usage_status' => 'required',
            'subscription_months_count' => 'required',
            'next_payment_date' => 'required'
        ]);

        $group = Asset::query()->where([
            'id' => $request->input('id'),
        ])
            ->update([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'type' => $request->input('type'),
                'category' => $request->input('category'),

                'remarks' => $request->input('remarks'),
                'usage_status' => $request->input('usage_status'),
                'subscription_months_count' => $request->input('subscription_months_count'),
                'next_payment_date' => Carbon::parse($request->input('next_payment_date'))
            ]);

        return $this->returnResponse("Asset Updated", $group);
    }

    public function getAssetDetails(Request $request)
    {
        Log::info("feature update: " . json_encode($request->all()));
        $request->validate([
            'id' => 'required'
        ]);

        $assetGroup = Asset::query()->where(['id' => $request->input('id')])
            ->first();
        $responseData['asset'] = $assetGroup;
        return $this->returnResponse("Asset Details", $responseData);
    }


}
