export interface UserDto {
	id: string;
	name: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
    roleName: "customer" | "owner" | "sales_rep" | "supplier";
	createdAt: Date;
	isDeleted: boolean;
}
