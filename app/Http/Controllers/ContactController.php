<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function index() {
        
        //THIS IA
        
        if


        if(request()->has('search')) { 
            $contacts = Contact::where("deleted", 0)->where('last_name', 'LIKE', '%' . request()->search . '%')->paginate(10);
            return response()->json([
                "contacts"          =>      $contacts,
                "status_code"       =>      200
            ], 200);
            
        } else {
            $contacts = Contact::where("deleted", 0)->paginate(10);
            return response()->json([
                "contacts"          =>      $contacts,
                "status_code"       =>      200
            ], 200);
        }
        
    }


    public function store(Request $request) {
        $this->validate($request, [
            "first_name"           =>      "required|min:3|max:100",
            "last_name"            =>      "required|min:3|max:100",
            'phone_number'         =>      'required|numeric|digits:12|starts_with:233|unique:contacts',
        ]);

        $contact = new Contact;
        $contact->first_name        =  $request->first_name;
        $contact->last_name         =  $request->last_name;
        $contact->phone_number      =  $request->phone_number;

        if($contact->save()) {

            $contact = Contact::where("id", $contact->id)->first();

            return response()->json([
                "contact"       =>      $contact,
                "message"       =>      "Contact Has been added successfully",
                "status_code"   =>      201
            ], 201);
        }
    }

    public function update(Request $request, $id) {
        $this->validate($request, [
            "first_name"           =>      "required|min:3|max:100",
            "last_name"            =>      "required|min:3|max:100",
            'phone_number'         => 'required|numeric|digits:12|starts_with:233',
        ]);

        $contact = Contact::where("id", $id)->first();

        if ($request->phone_number != $contact->phone_number) {
            $request->validate([
             'phone_number'         =>      'unique:contacts'
            ]);
         }

        $contact->first_name        =  $request->first_name;
        $contact->last_name         =  $request->last_name;
        $contact->phone_number      =  $request->phone_number;

        if($contact->save()) {

            $contact = Contact::where("id", $contact->id)->first();

            return response()->json([
                "contact"       =>      $contact,
                "message"       =>      "Contact Has been updated successfully",
                "status_code"   =>      201
            ], 201);
        }
    }

    public function destroy($id) {
        $contact    =   Contact::where("id", $id)->first();

        if($contact) {

            $contact->delete();

            return response()->json([
                "message"       =>      "Contact Has been deleted successfully",
                "status_code"   =>      201
            ], 201);


        } else {
            return response()->json([
                "message"           =>      "Contact Not Found",
                "status_code"       =>      400
            ], 404);
        }
    }
}
