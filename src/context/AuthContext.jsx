
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { supabase } from "../config/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        let active = true;

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (active) {
                    setUser(session?.user ?? null);
                }
            }
        );

        supabase.auth.getSession().then(({ data }) => {
            if (active) {
                setUser(data.session?.user ?? null);
                setLoading(false);
            }
        });

        return () => {
            active = false;
            subscription.unsubscribe();
        };

    }, []);

    useEffect(() => {

        let active = true;

        async function loadProfile() {

            setProfile(null);

            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (!active) return;

            if (error || data?.account_status !== "active") {
                await supabase.auth.signOut();
                return;
            }

            setProfile(data);
        }

        loadProfile();

        return () => {
            active = false;
        };

    }, [user]);

    async function login(email, password) {

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            throw error;
        }

        const {
            data: userProfile,
            error: profileError
        } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

        if (
            profileError ||
            userProfile?.account_status !== "active"
        ) {
            await supabase.auth.signOut();

            throw new Error(
                "Your account is not approved or active."
            );
        }

        setUser(data.user);
        setProfile(userProfile);

        return userProfile;
    }

    async function logout() {

        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        setUser(null);
        setProfile(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
