import { supabaseConfig } from "@/config/supabase-config";


// edge function name = stripe-backend

export const callSupabaseStripeBackend = async(amount:number)=>{
  try {
	const response = await supabaseConfig.functions.invoke('stripe-backend', {
	  body: JSON.stringify({ amount }),
	});
	  
	if (response.error) {
	  throw new Error(response.error.message);
	}

	return response.data;
  } catch (error) {
	console.log(error);
	
	 throw error;
  }
}