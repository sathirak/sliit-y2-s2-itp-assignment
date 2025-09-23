"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/modules/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/ui/form";
import { Loader2 } from "lucide-react";
import { editUserSchema, type EditUserFormData } from "../schemas/user.schema";
import type { UserDto } from "@/lib/dtos/user";

interface EditUserFormProps {
    user: UserDto;
    onSubmit: (data: EditUserFormData) => Promise<void>;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

export function EditUserForm({ user, onSubmit, isSubmitting = false, onCancel }: EditUserFormProps) {
    const form = useForm<EditUserFormData>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleName: user.roleName,
        },
    });

    // Update form when user prop changes
    useEffect(() => {
        form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleName: user.roleName,
        });
    }, [user, form]);

    async function handleSubmit(data: EditUserFormData) {
        try {
            await onSubmit(data);
        } catch (error) {
            // Error handling is done in the parent component
            console.error("Form submission error:", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter first name"
                                        {...field}
                                        disabled={isSubmitting}
                                        required={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter last name"
                                        {...field}
                                        disabled={isSubmitting}
                                        required={false}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter email"
                                        required={false}
                                        {...field}
                                        disabled={isSubmitting}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="roleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isSubmitting}
                                    required={false}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="owner">Owner</SelectItem>
                                        <SelectItem value="sales_rep">Sales Rep</SelectItem>
                                        <SelectItem value="supplier">Supplier</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update User
                    </Button>
                </div>
            </form>
        </Form>
    );
}
