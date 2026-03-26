import { supabaseConfig } from "@/config/supabase-config";
import { IUser } from "@/interfaces";

export const registerUser = async(payload : Partial<IUser>)=>{
   try {
	// create user in supabase auth

	const authResponse = await supabaseConfig.auth.signUp({
		email: payload.email!,
		password: payload.password!,
	});

	if (authResponse.error) {
		throw authResponse.error;
	}

	// store user details in supabase database (user_profiles table)
	const dbResponse = await supabaseConfig.from("user_profiles").insert([{
		name : payload.name!,
		email : payload.email!,
		role : 'user',
		is_active : true,
	}])

	if (dbResponse.error) {
		throw dbResponse.error;
	}

	return {
		success : true,
	}
   } catch (error) {
	 throw error;
   }
}

export const loginUser = async(payload : Partial<IUser>)=>{
	try {
		const authResponse = await supabaseConfig.auth.signInWithPassword({
			email: payload.email!,
			password: payload.password!,
		});

		if (authResponse.error) {
			throw authResponse.error;
		}

		const dbResponse = await supabaseConfig.from("user_profiles").select("*").eq("email", payload.email).single();
	 
		if (dbResponse.error) {
			throw dbResponse.error;
		}

		if(payload.role != dbResponse.data.role){
			throw new Error("User role mismatch.");
		}

		return {
			success : true,
			user : dbResponse.data,
		}
	
	} catch (error) {
		throw error;
	}
}

export const getCurrentUser = async()=>{
	try {
		const authResponse = await supabaseConfig.auth.getUser();
		
		if (authResponse.error) {
			throw authResponse.error;
		}

		if(!authResponse.data.user){
			throw new Error("No user session found.");
		}

		const email = authResponse.data.user.email;

		const dbResponse = await supabaseConfig.from("user_profiles").select("*").eq("email", email).single();
	 
		if (dbResponse.error) {
			throw dbResponse.error;
		}

		return {
			success : true,
			user : dbResponse.data,
		}
	} catch (error) {
		throw error;
	}
}

export const logoutUser = async()=>{
	try {
		const response = await supabaseConfig.auth.signOut();
		if(response.error){
			throw response.error;
		}
		return {
			success : true,
		}
	} catch (error) {
		throw error;
	}
}