import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "../../ui/select";

export const Cats = () => {
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">UI Components Example</h2>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Input</label>
                <Input placeholder="Type something..." />
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Select</label>
                <Select defaultValue="option1">
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="mb-4">
                <Button className="w-full" variant="default">Default Button</Button>
            </div>
            <div className="mb-4">
                <Button className="w-full" variant="outline">Outline Button</Button>
            </div>
            <div className="mb-4">
                <Button className="w-full" variant="destructive">Destructive Button</Button>
            </div>
            <p className="text-xs text-gray-500 mt-6">This page demonstrates usage of the Button, Input, and Select components from the UI module. Refer to this as a quick example for implementation and props.</p>
        </div>
    );
};
