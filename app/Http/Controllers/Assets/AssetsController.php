<?php

namespace App\Http\Controllers\Assets;

use App\Http\Controllers\BaseController;
use App\Models\Asset;
use App\Models\AssetGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AssetsController extends BaseController
{

    public function getAssets(Request $request)
    {
        $projects = Asset::query()
            ->with(['author'])
            ->paginate(50);
        return $this->returnResponse("Asset Groups", $projects);
    }

    public function addAsset(Request $request)
    {
        $request->validate([
            'project_id' => 'required',
            'name' => 'required|string',
        ]);

        $group = AssetGroup::query()->create([
            'project_id'=>$request->input('project_id'),
            'name' => $request->input('name'),
            'author_id'=> Auth::id()
        ]);

        return $this->returnResponse("Asset Group Added", $group);
    }

    public function updateAsset(Request $request)
    {

        Log::info("feature update: " . json_encode($request->all()));
        $request->validate([
            'project_id' => 'required',
            'id' => 'required',
            'name' => 'required'
        ]);

        $assetGroup = AssetGroup::query()->where(['id' => $request->input('id')])
            ->update([
                'project_id' => $request->input('project_id'),
                'name' => $request->input('name')
            ]);
        return $this->returnResponse("Group Updated", $assetGroup);
    }

    public function getAssetDetails(Request $request)
    {
        Log::info("feature update: " . json_encode($request->all()));
        $request->validate([
            'id' => 'required'
        ]);

        $assetGroup = AssetGroup::query()->where(['id' => $request->input('id')])
            ->first();
        return $this->returnResponse("Group Details", $assetGroup);
    }

}
