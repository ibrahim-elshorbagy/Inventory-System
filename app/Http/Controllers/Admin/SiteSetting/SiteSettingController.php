<?php

namespace App\Http\Controllers\Admin\SiteSetting;

use App\Http\Controllers\Controller;
use App\Models\Admin\SiteSetting\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all();

        return inertia("Setting/Index", [
            'success' => session('success'),
            'settings' => $settings,

        ]);
    }




    public function update(Request $request)
    {
        // Validate the image fields (both logo and cover are optional)
        $validated = $request->validate([
            'site_name' => 'required|string',
            'support_email' => 'required|email',
            'support_phone' => 'required|string',
            'image' => 'nullable|image',
        ]);

        // Handling logo (company_logo)
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Fetch the current logo from the database
            $currentLogo = SiteSetting::where('name', 'company_logo')->value('value');

            // If there is an existing logo, delete it from storage
            if ($currentLogo) {
                $currentLogoPath = str_replace('/storage/', '', $currentLogo);
                if (Storage::disk('public')->exists($currentLogoPath)) {
                    Storage::disk('public')->delete($currentLogoPath);
                }
            }

            // Store the new logo
            $logo = $request->file('image');
            $path = 'settings/logo';
            $logoName = $logo->getClientOriginalName();
            $logoPath = $logo->storeAs($path, $logoName, 'public');
            $logoUrl = Storage::url($logoPath);

            // Update the logo setting in the database
            SiteSetting::where('name', 'company_logo')->update(['value' => $logoUrl]);
        }


        // Update other settings
        SiteSetting::where('name', 'site_name')->update(['value' => $validated['site_name']]);
        SiteSetting::where('name', 'support_email')->update(['value' => $validated['support_email']]);
        SiteSetting::where('name', 'support_phone')->update(['value' => $validated['support_phone']]);

        return back()->with('success', 'تم التعديل بنجاح!');
    }

}
