
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { signUp as signUpAction } from "./actions";

export default function SignUp() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      <form className="space-y-4" action={signUpAction}>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input type="email" placeholder="Email" name="email" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <Input type="password" placeholder="Password" name="password" />
        </div>
        <Button className="w-full mt-4" variant="default" type="submit">Sign Up</Button>
      </form>
      <div className="mt-4 text-center">
        <a href="/sign-in" className="text-sm text-gray-600 hover:underline">Returning Customer? Sign In</a>
      </div>
    </div>
  );
}
