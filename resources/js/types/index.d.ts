export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'superadmin' | 'bidan' | 'ibu_hamil';
    no_telepon?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
