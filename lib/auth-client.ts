import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server
} as const)

export const {
    signIn,
    signUp,
    signOut,
    changePassword,
    updateUser 
} = authClient;

export type CustomUser = typeof authClient.$Infer.Session.user & {
    phoneNumber?: string | null
    birthday?: Date | string | null
    gender?: string | null
    role?: "USER" | "VENDOR" | "ADMIN" | null
}

export type CustomSession = typeof authClient.$Infer.Session & {
    user: CustomUser
}

export const useSession = authClient.useSession as () => { 
    data: CustomSession | null, 
    isPending: boolean, 
    error: any,
    refetch: () => Promise<void>
};
