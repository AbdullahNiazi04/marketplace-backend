
import { auth } from '../src/lib/auth';
import { APIError } from 'better-auth';

async function testGmailRestriction() {
    console.log("Running Gmail Restriction Test...");
    
    // Mock user object similar to what Better Auth passes to the hook
    const validUser = {
        email: 'test@gmail.com',
        user_id: '123',
        password_hash: '...',
        created_at: new Date(),
        updated_at: new Date()
    };

    const invalidUser = {
        email: 'test@yahoo.com',
        user_id: '456',
        password_hash: '...',
        created_at: new Date(),
        updated_at: new Date()
    };

    try {
        // We have to simulate the hook call directly because we can't easily spin up the whole server
        // access the hook directly from the auth instance config
        const hook = auth.options.databaseHooks?.user?.create?.before;
        
        if (!hook) {
            console.error("❌ Hook not found!");
            return;
        }

        console.log("Testing Invalid Email (yahoo.com)...");
        try {
            // @ts-ignore
            await hook(invalidUser);
            console.error("❌ Failed: Invalid email was accepted.");
        } catch (e) {
            if (e instanceof APIError && e.message === "Only Gmail accounts are allowed") {
                 console.log("✅ Success: Invalid email rejected with correct message.");
            } else {
                 console.log("❌ Failed: Wrong error thrown:", e);
            }
        }

        console.log("Testing Valid Email (gmail.com)...");
        try {
            // @ts-ignore
            await hook(validUser);
            console.log("✅ Success: Valid email accepted.");
        } catch (e) {
            console.error("❌ Failed: Valid email rejected:", e);
        }

    } catch (error) {
        console.error("Test Error:", error);
    }
}

testGmailRestriction();
