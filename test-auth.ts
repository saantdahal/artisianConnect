import "dotenv/config";
import { auth } from "./app/lib/auth";

async function test() {
    try {
        const res = await auth.api.signUpEmail({
            body: {
                email: "test_seed@example.com",
                password: "Password123!",
                name: "Test Seed User",
                role: "VENDOR"
            }
        });
        console.log("Success:", res);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
