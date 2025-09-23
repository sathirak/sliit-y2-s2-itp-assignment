export interface UserDto {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
    roleName: "customer" | "owner" | "sales_rep" | "supplier";
	createdAt: Date;
	isDeleted: boolean;
}
