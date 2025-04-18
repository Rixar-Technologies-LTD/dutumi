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

        $assetsQueryBuilder = Asset::query();
        $query = $request->input('searchQuery');

        if (is_numeric($request->input('groupId'))) {
            $assetsQueryBuilder = $assetsQueryBuilder->where('asset_group_id', $request->input('groupId'));
        }

        if (filled($request->input('searchQuery'))) {
            $assetsQueryBuilder = $assetsQueryBuilder->where('name', 'like', '%' . $query . '%')
                ->orWhere('description', 'like', '%' . $query . '%')
                ->orWhere('location', 'like', '%' . $query . '%')
                ->orWhere('category', 'like', '%' . $query . '%')
                ->orWhere('type', 'like', '%' . $query . '%');
        }

        $assets = $assetsQueryBuilder->with(['author'])
            ->orderBy('name', 'ASC')
            ->paginate(50);

        return $this->returnResponse("Asset Groups", $assets);
    }

    public function addAsset(Request $request)
    {
        Log::info(json_encode($request->all()));
        $request->validate([
            'asset_group_id' => 'required',
            'name' => 'required|string',
            'unit_price' => 'required|numeric',
            'usage_status' => 'required',
            'type' => 'required',
            'category' => 'required'
        ]);

        $assetGroup = AssetGroup::query()->find($request->input('asset_group_id'));
        if (!$assetGroup) {
            return $this->clientError("Asset group not found");
        }

        $nextDate = $request->input('next_payment_date', null);
        $group = Asset::query()->create([
            'project_id' => $assetGroup->project_id,
            'asset_group_id' => $assetGroup->id,
            'author_id' => Auth::id(),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'location' => $request->input('location'),

            'unit_price' => $request->input('unit_price'),
            'price_currency' => $request->input('price_currency'),
            'unit_price_in_default_currency' => $request->input('unit_price_in_default_currency'),

            'type' => $request->input('type'),
            'category' => $request->input('category'),

            'vendor' => $request->input('vendor'),
            'url' => $request->input('url'),

            'remarks' => $request->input('remarks'),
            'ownership' => $request->input('ownership'),
            'usage_status' => $request->input('usage_status'),
            'subscription_months_count' => $request->input('subscription_months_count', 1),
            'next_payment_date' => $nextDate ? Carbon::parse($nextDate) : null,

            'ip_address' => $request->input('ip_address'),
            'mac_address' => $request->input('mac_address'),
            'host_name' => $request->input('host_name'),

            'processor_cores_count' => $request->input('processor_cores_count'),
            'processor_type' => $request->input('processor_type'),

            'storage_size' => $request->input('storage_size'),
            'storage_type' => $request->input('storage_type'),
            'memory_size' => $request->input('memory_size'),
            'memory_type' => $request->input('memory_type'),

            'operating_system' => $request->input('operating_system'),


        ]);

        return $this->returnResponse("Asset Group Added", $group);
    }

    public function updateAsset(Request $request)
    {

        $request->validate([
            'id' => 'required|exists:assets,id',
            'name' => 'required|string',
            'usage_status' => 'required',
            'type' => 'required',
            'category' => 'required'
        ]);

        $nextDate = $request->input('next_payment_date', null);
        $group = Asset::query()->where([
            'id' => $request->input('id'),
        ])
            ->update([
                'name' => $request->input('name'),
                'unit_price' => $request->input('unit_price'),
                'description' => $request->input('description'),
                'location' => $request->input('location'),

                'type' => $request->input('type'),
                'category' => $request->input('category'),
                'vendor' => $request->input('vendor'),
                'url' => $request->input('url'),
                'remarks' => $request->input('remarks'),
                'ownership' => $request->input('ownership'),
                'usage_status' => $request->input('usage_status'),
                'subscription_months_count' => $request->input('subscription_months_count', 1),
                'next_payment_date' => $nextDate ? Carbon::parse($nextDate) : null,

                'ip_address' => $request->input('ip_address'),
                'mac_address' => $request->input('mac_address'),
                'host_name' => $request->input('host_name'),

                'processor_cores_count' => $request->input('processor_cores_count'),
                'processor_type' => $request->input('processor_type'),

                'storage_size' => $request->input('storage_size'),
                'storage_type' => $request->input('storage_type'),
                'memory_size' => $request->input('memory_size'),
                'memory_type' => $request->input('memory_type'),

                'operating_system' => $request->input('operating_system'),
                'price_currency' => $request->input('price_currency'),
                'unit_price_in_default_currency' => $request->input('unit_price_in_default_currency')
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

    public function getAssetsSchedule(Request $request)
    {
        $projects = Asset::query()
            ->with(['author'])
            ->orderBy('next_payment_date', 'ASC')
            ->with(['project'])
            ->paginate(50);
        return $this->returnResponse("Asset Groups", $projects);
    }


}
