import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SignIn() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
  <form className="space-y-4" action="/api/sign-in" method="POST">
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <Input type="email" placeholder="Email" name="email" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <Input type="password" placeholder="Password" name="password" />
        </div>
        <Button className="w-full mt-4" variant="default" type="submit">Sign In</Button>
      </form>
      <div className="mt-4 text-center">
        <a href="/sign-up" className="text-sm text-gray-600 hover:underline">Don't have an account? Sign Up</a>
      </div>
    </div>
  );
}
