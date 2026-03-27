

export interface IUser {
	id: string;
	email: string;
	name : string;
	role : 'admin' | 'user';
	password: string;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface IEvent {
	id : string;
	name : string;
	description : string;
	date : string;
	time : string;
	location : string;
    organizer : string;
	ticket_price : number;
	total_tickets_count : number;
	booked_tickets_count : number;
	image_url : string;
	status : 'upcoming' | 'completed';
	created_at : string;
	updated_at : string;
}

export interface IBooking {
	id : string;
	event_id : string;
	user_id : string;
	tickets_count : number;
	total_price : number;
	payment_id : string;
	status : 'confirmed' | 'cancelled';
	created_at : string;
	updated_at : string;
}